// Main widget configuration interface
export interface WidgetConfig {
  // Required configuration
  apiKey: string

  // API Configuration
  apiUrl?: string
  websocketUrl?: string

  // Appearance Configuration
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  backgroundColor?: string

  // Company/Brand Information
  companyName?: string
  greeting?: string
  placeholder?: string
  avatar?: string
  logoUrl?: string

  // Behavior Configuration
  autoOpen?: boolean
  autoOpenDelay?: number
  showOnMobile?: boolean
  showOnDesktop?: boolean
  minimizeOnClose?: boolean

  // Feature Toggles
  enableFileUpload?: boolean
  enableEmojis?: boolean
  enableScreenshot?: boolean
  enableSatisfactionSurvey?: boolean
  enableOfflineMessage?: boolean
  enableTypingIndicator?: boolean
  enableCannedResponses?: boolean
  enableConversationHistory?: boolean
  enableSoundNotifications?: boolean

  // File Upload Configuration
  maxFileSize?: number
  maxFilesPerMessage?: number
  allowedFileTypes?: string[]

  // UI Customization
  customCSS?: string
  showPoweredBy?: boolean
  borderRadius?: number
  shadowLevel?: 'none' | 'small' | 'medium' | 'large'

  // Localization
  language?: string
  translations?: Record<string, string>

  // Timing Configuration
  typingTimeout?: number
  messageDelay?: number
  reconnectInterval?: number

  // Privacy & Security
  enableEncryption?: boolean
  anonymizeVisitors?: boolean
  respectDoNotTrack?: boolean
  cookieConsent?: boolean

  // Analytics & Tracking
  enableAnalytics?: boolean
  trackPageViews?: boolean
  trackScrollDepth?: boolean
  customEvents?: string[]

  // Advanced Configuration
  debugMode?: boolean
  fallbackMode?: boolean
  offlineMode?: boolean

  // Event Callbacks
  onReady?: () => void
  onOpen?: () => void
  onClose?: () => void
  onMinimize?: () => void
  onMessage?: (message: string, isUser: boolean, metadata?: MessageMetadata) => void
  onTyping?: (isTyping: boolean) => void
  onFileUpload?: (files: File[]) => void
  onSurveySubmit?: (feedback: SurveyFeedback) => void
  onError?: (error: WidgetError) => void
  onConversationStart?: (conversationId: string) => void
  onConversationEnd?: (conversationId: string) => void
  onAgentAssigned?: (agentInfo: AgentInfo) => void
  onVisitorIdentified?: (visitorInfo: VisitorInfo) => void
}

// Message-related types
export interface Message {
  id: string
  content: string
  direction: MessageDirection
  senderType: SenderType
  senderId?: string
  senderName?: string
  senderAvatar?: string
  timestamp: string
  isRead: boolean
  isDelivered?: boolean
  isEdited?: boolean
  editedAt?: string
  replyTo?: string
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
  reactions?: MessageReaction[]
}

export type MessageDirection = 'INBOUND' | 'OUTBOUND'
export type SenderType = 'VISITOR' | 'USER' | 'AI' | 'SYSTEM'

export interface MessageMetadata {
  url?: string
  userAgent?: string
  timestamp?: string
  ipAddress?: string
  sessionId?: string
  pageTitle?: string
  referrer?: string
  utmParams?: Record<string, string>
  customData?: Record<string, any>
}

export interface MessageAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnailUrl?: string
  mimeType: string
  uploadedAt: string
}

export interface MessageReaction {
  emoji: string
  userId: string
  timestamp: string
}

// Conversation types
export interface Conversation {
  id: string
  status: ConversationStatus
  priority: ConversationPriority
  channel: string
  startedAt: string
  endedAt?: string
  lastMessageAt?: string
  messageCount: number
  visitor: VisitorInfo
  assignedAgent?: AgentInfo
  tags: string[]
  customFields?: Record<string, any>
  messages?: Message[]
  metadata?: ConversationMetadata
}

export type ConversationStatus = 'OPEN' | 'ASSIGNED' | 'PENDING' | 'RESOLVED' | 'CLOSED'
export type ConversationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export interface ConversationMetadata {
  startUrl?: string
  endUrl?: string
  pageViews?: number
  sessionDuration?: number
  deviceInfo?: DeviceInfo
  locationInfo?: LocationInfo
  customData?: Record<string, any>
}

// User/Agent types
export interface AgentInfo {
  id: string
  name: string
  email: string
  avatar?: string
  title?: string
  department?: string
  isOnline: boolean
  lastSeenAt?: string
  timezone?: string
}

export interface VisitorInfo {
  id: string
  name?: string
  email?: string
  phone?: string
  avatar?: string
  isOnline: boolean
  firstSeenAt: string
  lastSeenAt: string
  sessionCount: number
  pageViews: number
  location?: LocationInfo
  device?: DeviceInfo
  referrer?: string
  utmData?: Record<string, string>
  customFields?: Record<string, any>
  tags: string[]
}

// Device and location types
export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  screenResolution: string
  isMobile: boolean
  userAgent: string
}

export interface LocationInfo {
  country?: string
  countryCode?: string
  region?: string
  city?: string
  timezone?: string
  latitude?: number
  longitude?: number
  ipAddress?: string
}

// Survey and feedback types
export interface SurveyFeedback {
  rating?: number
  comment?: string
  categories?: string[]
  conversationId: string
  submittedAt: string
  visitorId: string
  customFields?: Record<string, any>
}

// API request/response types
export interface SendMessageRequest {
  content: string
  visitorId: string
  conversationId?: string
  files?: File[]
  replyTo?: string
  metadata?: MessageMetadata
}

export interface SendMessageResponse {
  success: boolean
  messageId: string
  conversationId: string
  reply?: string
  botMessageId?: string
  actions?: WidgetAction[]
  suggestions?: string[]
  error?: string
}

export interface WidgetAction {
  type: 'show_badge' | 'redirect' | 'show_survey' | 'play_sound' | 'custom'
  data?: any
}

// Error types
export interface WidgetError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Widget instance interface
export interface WidgetInstance {
  // Lifecycle methods
  init(): void
  destroy(): void

  // State management
  open(): void
  close(): void
  toggle(): void
  minimize(): void

  // Messaging
  sendMessage(message: string, files?: File[]): Promise<SendMessageResponse>

  // UI updates
  showBadge(count?: number): void
  hideBadge(): void
  showSurvey(): void
  hideSurvey(): void

  // Configuration
  updateConfig(config: Partial<WidgetConfig>): void

  // State getters
  isOpen(): boolean
  isMinimized(): boolean
  getVisitorId(): string
  getConversationId(): string | null
  getConfig(): WidgetConfig
}

// Global API interface
export interface WidgetAPI {
  // Main initialization
  init(config: Partial<WidgetConfig>): WidgetInstance

  // Convenience methods for global instance
  open(): void
  close(): void
  toggle(): void
  minimize(): void
  sendMessage(message: string, files?: File[]): Promise<SendMessageResponse>
  showBadge(count?: number): void
  hideBadge(): void
  showSurvey(): void
  hideSurvey(): void
  updateConfig(config: Partial<WidgetConfig>): void

  // Getters
  isOpen(): boolean
  isMinimized(): boolean
  getVisitorId(): string | null
  getConversationId(): string | null
  getInstance(): WidgetInstance | null

  // Cleanup
  destroy(): void

  // Version info
  version: string
}

// Event types for composables
export interface WidgetEvents {
  'message-received': Message
  'message-sent': Message
  'typing-start': { senderId: string, senderType: SenderType }
  'typing-stop': { senderId: string, senderType: SenderType }
  'conversation-started': Conversation
  'conversation-ended': Conversation
  'agent-assigned': AgentInfo
  'agent-unassigned': AgentInfo
  'visitor-online': VisitorInfo
  'visitor-offline': VisitorInfo
  'widget-opened': () => void
  'widget-closed': () => void
  'widget-minimized': () => void
  'survey-shown': () => void
  'survey-submitted': SurveyFeedback
  'error-occurred': WidgetError
}

// WebSocket message types
export interface WebSocketMessage {
  type: keyof WidgetEvents
  payload: any
  timestamp: string
  conversationId?: string
}

// Storage types
export interface StorageData {
  visitorId: string
  conversationId?: string
  preferences?: UserPreferences
  messageHistory?: Message[]
  lastInteraction?: string
}

export interface UserPreferences {
  theme?: 'light' | 'dark'
  language?: string
  soundEnabled?: boolean
  notificationsEnabled?: boolean
  minimizeOnClose?: boolean
}

// Component prop types
export interface WidgetAppProps {
  config: WidgetConfig
  visitorId: string
  conversationId?: string
  onConversationCreated?: (id: string) => void
  onMessage?: (message: string, isUser: boolean, metadata?: MessageMetadata) => void
  onOpen?: () => void
  onClose?: () => void
  onFileUpload?: (files: File[]) => void
  onSurveySubmit?: (feedback: SurveyFeedback) => void
}

// Utility types
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

// Theme configuration
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  fonts: {
    primary: string
    secondary?: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

// Animation configuration
export interface AnimationConfig {
  duration: number
  easing: string
  entrance: 'fade' | 'slide' | 'bounce' | 'zoom'
  exit: 'fade' | 'slide' | 'bounce' | 'zoom'
}

// Accessibility configuration
export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean
  enableScreenReader: boolean
  highContrastMode: boolean
  reducedMotion: boolean
  focusIndicator: boolean
}

// Performance configuration
export interface PerformanceConfig {
  lazyLoad: boolean
  prefetchMessages: boolean
  messagePageSize: number
  debounceDelay: number
  throttleDelay: number
}

// Global type declarations for window object
declare global {
  interface Window {
    FluentWidget: WidgetAPI
    FluentWidgetConfig?: Partial<WidgetConfig>
    __fluentWidgetInstance?: WidgetInstance
  }
}
