import { ref, computed } from 'vue'

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface ChatState {
  isFullscreen: boolean
  messages: Message[]
  isTyping: boolean
  hasStartedChat: boolean
}

const chatState = ref<ChatState>({
  isFullscreen: false,
  messages: [],
  isTyping: false,
  hasStartedChat: false
})

export const useChat = () => {
  const isFullscreen = computed(() => chatState.value.isFullscreen)
  const messages = computed(() => chatState.value.messages)
  const isTyping = computed(() => chatState.value.isTyping)
  const hasStartedChat = computed(() => chatState.value.hasStartedChat)

  const openFullscreen = () => {
    chatState.value.isFullscreen = true
    // Lock body scroll when opening fullscreen
    document.body.style.overflow = 'hidden'
  }

  const closeFullscreen = () => {
    chatState.value.isFullscreen = false
    // Unlock body scroll when closing fullscreen
    document.body.style.overflow = ''
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    }

    chatState.value.messages.push(userMessage)

    // Mark that chat has started
    if (!chatState.value.hasStartedChat) {
      chatState.value.hasStartedChat = true
      // Auto-open fullscreen on first message
      openFullscreen()
    }

    // Show typing indicator
    chatState.value.isTyping = true

    // Simulate API response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        isUser: false,
        timestamp: new Date()
      }

      chatState.value.messages.push(botMessage)
      chatState.value.isTyping = false
    }, 1000 + Math.random() * 2000)
  }

  const clearMessages = () => {
    chatState.value.messages = []
    chatState.value.hasStartedChat = false
  }

  // Simple bot response logic (replace with actual API integration)
  const getBotResponse = (userMessage: string): string => {
    const responses = [
      'Thanks for your message! I\'m here to help you with any questions you have.',
      'I understand your concern. Let me help you find the right solution.',
      'That\'s a great question! I\'d be happy to assist you with that.',
      'I can definitely help you with that. What specific information are you looking for?',
      'Thanks for reaching out! I\'m here to provide you with the support you need.'
    ]

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to our chat support. How can I assist you today?'
    }

    if (lowerMessage.includes('help')) {
      return 'I\'m here to help! What can I assist you with today?'
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'I\'d be happy to help you with pricing information. What specific product or service are you interested in?'
    }

    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return 'You\'re very welcome! Is there anything else I can help you with?'
    }

    // Return random response if no keywords match
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return {
    // State
    isFullscreen,
    messages,
    isTyping,
    hasStartedChat,

    // Actions
    openFullscreen,
    closeFullscreen,
    sendMessage,
    clearMessages
  }
}
