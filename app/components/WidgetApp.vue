<template>
  <div class="fluent-chat-widget">
    <!-- Chat Input (always visible at bottom center) -->
    <ChatInput
      v-if="!isFullscreen"
      :placeholder="config.placeholder || 'Type a message...'"
      @send="sendMessage"
    />

    <!-- Fullscreen Chat -->
    <ChatFullscreen
      v-if="isFullscreen"
      :company-name="config.companyName"
      :greeting="config.greeting"
      :placeholder="config.placeholder || 'Type your message...'"
      :messages="messages"
      :is-typing="isTyping"
      @close="closeFullscreen"
      @send="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { useChat } from '~/composables/useChat'

interface WidgetConfig {
  companyName?: string
  greeting?: string
  placeholder?: string
  primaryColor?: string
  theme?: 'light' | 'dark' | 'auto'
}

interface Props {
  config?: WidgetConfig
}

withDefaults(defineProps<Props>(), {
  config: () => ({
    companyName: 'Chat Support',
    greeting: 'How can we help you today?',
    placeholder: 'Type a message...',
    primaryColor: '#3B82F6',
    theme: 'light'
  })
})

// Use chat composable for state management
const {
  isFullscreen,
  messages,
  isTyping,
  openFullscreen,
  closeFullscreen,
  sendMessage
} = useChat()

// Expose API methods for the widget instance
defineExpose({
  open: openFullscreen,
  close: closeFullscreen,
  toggle: () => {
    if (isFullscreen.value) {
      closeFullscreen()
    } else {
      openFullscreen()
    }
  },
  minimize: closeFullscreen,
  sendMessage,
  showBadge: (count: number) => {
    console.log('Badge shown with count:', count)
    // TODO: Implement badge functionality
  },
  hideBadge: () => {
    console.log('Badge hidden')
    // TODO: Implement badge functionality
  },
  showSurvey: () => {
    console.log('Survey shown')
    // TODO: Implement survey functionality
  },
  hideSurvey: () => {
    console.log('Survey hidden')
    // TODO: Implement survey functionality
  },
  updateConfig: (newConfig: WidgetConfig) => {
    console.log('Config updated:', newConfig)
    // TODO: Implement config update functionality
  },
  isOpen: () => isFullscreen.value,
  isMinimized: () => !isFullscreen.value,
  cleanup: () => {
    console.log('Widget cleanup')
    // TODO: Implement cleanup functionality
  },
  handleVisibilityChange: (isVisible: boolean) => {
    console.log('Visibility changed:', isVisible)
    // TODO: Implement visibility change handling
  },
  handleResize: () => {
    console.log('Window resized')
    // TODO: Implement resize handling
  }
})
</script>

<style scoped>
.fluent-chat-widget {
  /* Widget-specific styles */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Ensure high z-index for widget elements */
.fluent-chat-widget * {
  z-index: 2147483647;
}
</style>
