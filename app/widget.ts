import { createApp } from 'vue'
import type { App } from 'vue'
import WidgetApp from '~/components/WidgetApp.vue'
import type { WidgetConfig, WidgetAPI, WidgetInstance } from '~/types/widget'

// Import styles for bundling
import './assets/css/main.css'

// Default configuration
const defaultConfig: Partial<WidgetConfig> = {
  apiUrl: 'https://api.fluent.ai',
  position: 'bottom-right',
  theme: 'light',
  primaryColor: '#3B82F6',
  greeting: 'Hi! How can we help you today?',
  placeholder: 'Type your message...',
  companyName: 'Our Team',
  autoOpen: false,
  showOnMobile: true,
  enableFileUpload: true,
  enableEmojis: true,
  enableScreenshot: true,
  enableSatisfactionSurvey: true,
  enableOfflineMessage: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  language: 'en'
}

// Widget instance class
class FluentWidgetInstance implements WidgetInstance {
  private app: App | null = null
  private container: HTMLElement | null = null
  private config: WidgetConfig
  private visitorId: string
  private conversationId: string | null = null
  private isInitialized = false
  private componentInstance: any = null

  constructor(config: Partial<WidgetConfig>) {
    if (!config.apiKey) {
      throw new Error('Fluent Widget: API key is required')
    }

    this.config = { ...defaultConfig, ...config } as WidgetConfig
    this.visitorId = this.generateOrGetVisitorId()

    // Validate configuration
    this.validateConfig()
  }

  // Initialize the widget
  init(): void {
    if (this.isInitialized) {
      console.warn('Fluent Widget: Already initialized')
      return
    }

    try {
      this.createContainer()
      this.injectStyles()
      this.mountVueApp()
      this.setupEventListeners()
      this.isInitialized = true

      // Trigger ready callback
      if (this.config.onReady) {
        this.config.onReady()
      }

      console.log('Fluent Widget: Initialized successfully')
    } catch (error) {
      console.error('Fluent Widget: Initialization failed', error)
      throw error
    }
  }

  // Validate configuration
  private validateConfig(): void {
    if (!this.config.apiKey || this.config.apiKey.length < 10) {
      throw new Error('Fluent Widget: Invalid API key')
    }

    // Validate position
    const validPositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left']
    if (!validPositions.includes(this.config.position!)) {
      console.warn(`Invalid position "${this.config.position}", defaulting to "bottom-right"`)
      this.config.position = 'bottom-right'
    }

    // Validate theme
    const validThemes = ['light', 'dark', 'auto']
    if (!validThemes.includes(this.config.theme!)) {
      console.warn(`Invalid theme "${this.config.theme}", defaulting to "light"`)
      this.config.theme = 'light'
    }

    // Validate file size
    if (this.config.maxFileSize! > 50 * 1024 * 1024) {
      console.warn('Max file size cannot exceed 50MB, setting to 50MB')
      this.config.maxFileSize = 50 * 1024 * 1024
    }
  }

  // Create DOM container for the widget
  private createContainer(): void {
    // Remove existing container if present
    const existing = document.getElementById('fluent-widget-root')
    if (existing) {
      existing.remove()
    }

    this.container = document.createElement('div')
    this.container.id = 'fluent-widget-root'
    this.container.className = [
      'fluent-widget-container',
      `fluent-widget-${this.config.position}`,
      `fluent-widget-${this.config.theme}`,
      this.config.showOnMobile ? 'fluent-widget-mobile' : 'fluent-widget-no-mobile'
    ].join(' ')

    // Add container to DOM
    document.body.appendChild(this.container)
  }

  // Inject base styles
  private injectStyles(): void {
    // Check if styles already injected
    if (document.getElementById('fluent-widget-styles')) {
      return
    }

    const styleElement = document.createElement('style')
    styleElement.id = 'fluent-widget-styles'
    styleElement.textContent = this.getBaseStyles()
    document.head.appendChild(styleElement)
  }

  // Get base CSS styles
  private getBaseStyles(): string {
    return `
      .fluent-widget-container {
        position: fixed !important;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        color: initial !important;
        background: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      .fluent-widget-container * {
        box-sizing: border-box !important;
      }

      .fluent-widget-bottom-right { bottom: 20px !important; right: 20px !important; }
      .fluent-widget-bottom-left { bottom: 20px !important; left: 20px !important; }
      .fluent-widget-top-right { top: 20px !important; right: 20px !important; }
      .fluent-widget-top-left { top: 20px !important; left: 20px !important; }

      @media (max-width: 768px) {
        .fluent-widget-no-mobile { display: none !important; }
      }

      /* Prevent conflicts with host page styles */
      .fluent-widget-container {
        all: initial !important;
        position: fixed !important;
        z-index: 2147483647 !important;
      }
    `
  }

  // Mount Vue application
  private mountVueApp(): void {
    if (!this.container) {
      throw new Error('Container not created')
    }

    // Create Vue app with props
    this.app = createApp(WidgetApp, {
      config: this.config,
      visitorId: this.visitorId,
      conversationId: this.conversationId,
      onConversationCreated: (id: string) => {
        this.conversationId = id
      },
      onMessage: (message: string, isUser: boolean, metadata?: any) => {
        if (this.config.onMessage) {
          this.config.onMessage(message, isUser, metadata)
        }
      },
      onOpen: () => {
        if (this.config.onOpen) {
          this.config.onOpen()
        }
      },
      onClose: () => {
        if (this.config.onClose) {
          this.config.onClose()
        }
      },
      onFileUpload: (files: File[]) => {
        if (this.config.onFileUpload) {
          this.config.onFileUpload(files)
        }
      },
      onSurveySubmit: (feedback: any) => {
        if (this.config.onSurveySubmit) {
          this.config.onSurveySubmit(feedback)
        }
      }
    })

    // Provide global configuration to all child components
    this.app.provide('widgetConfig', this.config)
    this.app.provide('visitorId', this.visitorId)

    // Handle Vue errors gracefully
    this.app.config.errorHandler = (error, instance, info) => {
      console.error('Fluent Widget: Vue error', error, info)
    }

    // Mount and store component instance
    const instance = this.app.mount(this.container)
    this.componentInstance = instance
  }

  // Setup global event listeners
  private setupEventListeners(): void {
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup()
    })

    // Handle visibility change (for online/offline status)
    document.addEventListener('visibilitychange', () => {
      if (this.componentInstance?.handleVisibilityChange) {
        this.componentInstance.handleVisibilityChange(!document.hidden)
      }
    })

    // Handle window resize for responsive behavior
    window.addEventListener('resize', () => {
      if (this.componentInstance?.handleResize) {
        this.componentInstance.handleResize()
      }
    })
  }

  // Generate or retrieve visitor ID
  private generateOrGetVisitorId(): string {
    try {
      const stored = localStorage.getItem('fluent_visitor_id')
      if (stored && stored.length > 10) {
        return stored
      }
    } catch (error) {
      console.warn('Fluent Widget: localStorage not available')
    }

    // Generate new ID
    const id = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()

    try {
      localStorage.setItem('fluent_visitor_id', id)
    } catch (error) {
      console.warn('Fluent Widget: Could not save visitor ID to localStorage')
    }

    return id
  }

  // Public API methods
  open(): void {
    if (!this.isInitialized) {
      console.warn('Fluent Widget: Not initialized')
      return
    }
    this.componentInstance?.open?.()
  }

  close(): void {
    if (!this.isInitialized) return
    this.componentInstance?.close?.()
  }

  toggle(): void {
    if (!this.isInitialized) return
    this.componentInstance?.toggle?.()
  }

  minimize(): void {
    if (!this.isInitialized) return
    this.componentInstance?.minimize?.()
  }

  async sendMessage(message: string, files?: File[]): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Widget not initialized')
    }
    return this.componentInstance?.sendMessage?.(message, files)
  }

  showBadge(count: number = 1): void {
    if (!this.isInitialized) return
    this.componentInstance?.showBadge?.(count)
  }

  hideBadge(): void {
    if (!this.isInitialized) return
    this.componentInstance?.hideBadge?.()
  }

  showSurvey(): void {
    if (!this.isInitialized) return
    this.componentInstance?.showSurvey?.()
  }

  hideSurvey(): void {
    if (!this.isInitialized) return
    this.componentInstance?.hideSurvey?.()
  }

  updateConfig(newConfig: Partial<WidgetConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (this.componentInstance?.updateConfig) {
      this.componentInstance.updateConfig(this.config)
    }
  }

  // Getters
  isOpen(): boolean {
    return this.componentInstance?.isOpen?.() || false
  }

  isMinimized(): boolean {
    return this.componentInstance?.isMinimized?.() || false
  }

  getVisitorId(): string {
    return this.visitorId
  }

  getConversationId(): string | null {
    return this.conversationId
  }

  getConfig(): WidgetConfig {
    return { ...this.config }
  }

  // Cleanup
  private cleanup(): void {
    // Disconnect any connections
    if (this.componentInstance?.cleanup) {
      this.componentInstance.cleanup()
    }
  }

  // Destroy widget instance
  destroy(): void {
    try {
      this.cleanup()

      if (this.app) {
        this.app.unmount()
        this.app = null
      }

      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container)
        this.container = null
      }

      // Remove injected styles
      const styles = document.getElementById('fluent-widget-styles')
      if (styles) {
        styles.remove()
      }

      this.componentInstance = null
      this.isInitialized = false

      console.log('Fluent Widget: Destroyed successfully')
    } catch (error) {
      console.error('Fluent Widget: Error during destruction', error)
    }
  }
}

// Global widget API
const FluentWidget: WidgetAPI = {
  // Create and initialize widget
  init(config: Partial<WidgetConfig>): FluentWidgetInstance {
    try {
      // Destroy existing instance if present
      if ((window as any).__fluentWidgetInstance) {
        (window as any).__fluentWidgetInstance.destroy()
      }

      // Create new instance
      const widget = new FluentWidgetInstance(config)
      widget.init()

      // Store globally for API access
      ;(window as any).__fluentWidgetInstance = widget

      return widget
    } catch (error) {
      console.error('Fluent Widget: Failed to initialize', error)
      throw error
    }
  },

  // Convenience methods that work with global instance
  open(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) {
      instance.open()
    } else {
      console.warn('Fluent Widget: No instance found. Call FluentWidget.init() first.')
    }
  },

  close(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.close()
  },

  toggle(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.toggle()
  },

  minimize(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.minimize()
  },

  sendMessage(message: string, files?: File[]): Promise<any> {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) {
      return instance.sendMessage(message, files)
    }
    return Promise.reject(new Error('Widget not initialized'))
  },

  showBadge(count?: number): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.showBadge(count)
  },

  hideBadge(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.hideBadge()
  },

  showSurvey(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.showSurvey()
  },

  hideSurvey(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.hideSurvey()
  },

  updateConfig(config: Partial<WidgetConfig>): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) instance.updateConfig(config)
  },

  // Getters
  isOpen(): boolean {
    const instance = (window as any).__fluentWidgetInstance
    return instance ? instance.isOpen() : false
  },

  isMinimized(): boolean {
    const instance = (window as any).__fluentWidgetInstance
    return instance ? instance.isMinimized() : false
  },

  getVisitorId(): string | null {
    const instance = (window as any).__fluentWidgetInstance
    return instance ? instance.getVisitorId() : null
  },

  getConversationId(): string | null {
    const instance = (window as any).__fluentWidgetInstance
    return instance ? instance.getConversationId() : null
  },

  getInstance(): FluentWidgetInstance | null {
    return (window as any).__fluentWidgetInstance || null
  },

  destroy(): void {
    const instance = (window as any).__fluentWidgetInstance
    if (instance) {
      instance.destroy()
      ;(window as any).__fluentWidgetInstance = null
    }
  },

  // Version info
  version: '1.0.0' // This would be replaced during build
}

// Browser environment setup
if (typeof window !== 'undefined') {
  // Prevent multiple initializations
  if ((window as any).FluentWidget) {
    console.warn('Fluent Widget: Already loaded')
  } else {
    // Expose FluentWidget globally
    ;(window as any).FluentWidget = FluentWidget

    // Auto-initialize if configuration exists
    const autoInitDelay = 100 // Small delay to ensure DOM is ready
    setTimeout(() => {
      if ((window as any).FluentWidgetConfig && !(window as any).__fluentWidgetInstance) {
        try {
          FluentWidget.init((window as any).FluentWidgetConfig)
        } catch (error) {
          console.error('Fluent Widget: Auto-initialization failed', error)
        }
      }
    }, autoInitDelay)

    // Handle page load for auto-initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if ((window as any).FluentWidgetConfig && !(window as any).__fluentWidgetInstance) {
          try {
            FluentWidget.init((window as any).FluentWidgetConfig)
          } catch (error) {
            console.error('Fluent Widget: Auto-initialization failed', error)
          }
        }
      })
    }
  }
}

// Export for module systems
export default FluentWidget
export type { WidgetConfig, WidgetAPI, WidgetInstance }
