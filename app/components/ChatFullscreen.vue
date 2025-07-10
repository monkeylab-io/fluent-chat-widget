<template>
  <div class="fixed inset-0 bg-white/60 z-50 flex flex-col backdrop-blur-xl">
    <!-- Header -->
    <div class="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageCircleMore class="size-4 text-white" />
        </div>
        <div>
          <h2 class="font-semibold text-gray-900">
            {{ companyName || 'Chat Support' }}
          </h2>
          <p class="text-sm text-gray-500">
            We're here to help
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="w-8 h-8 p-0"
        @click="$emit('close')"
      >
        <X class="size-4" />
      </Button>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-4xl mx-auto">
      <!-- Welcome Message -->
      <div
        v-if="messages.length === 0"
        class="text-center py-8"
      >
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircleMore class="size-8 text-blue-500" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Welcome to {{ companyName || 'our chat' }}!
        </h3>
        <p class="text-gray-600">
          {{ greeting || 'How can we help you today?' }}
        </p>
      </div>

      <!-- Messages -->
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.isUser ? 'justify-end' : 'justify-start'"
      >
        <div
          class="flex items-start gap-2 max-w-[80%]"
          :class="message.isUser ? 'flex-row-reverse' : ''"
        >
          <div
            v-if="!message.isUser"
            class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <User class="size-4 text-white" />
          </div>
          <div
            class="px-4 py-2 rounded-lg"
            :class="message.isUser
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'"
          >
            {{ message.content }}
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div
        v-if="isTyping"
        class="flex justify-start"
      >
        <div class="flex items-start gap-2 max-w-[80%]">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User class="size-4 text-white" />
          </div>
          <div class="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 rounded-bl-sm">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.1s"
              />
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center gap-2">
        <Input
          v-model="newMessage"
          :placeholder="placeholder"
          class="flex-1"
          @keydown.enter="sendMessage"
        />
        <Button
          :disabled="!newMessage.trim()"
          @click="sendMessage"
        >
          <SendHorizontal class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircleMore, SendHorizontal, User, X } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface Props {
  companyName?: string
  greeting?: string
  placeholder?: string
  messages?: Message[]
  isTyping?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'send', message: string): void
}

withDefaults(defineProps<Props>(), {
  companyName: 'Chat Support',
  greeting: 'How can we help you today?',
  placeholder: 'Type your message...',
  messages: () => [],
  isTyping: false
})

const emit = defineEmits<Emits>()

const newMessage = ref('')

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    emit('send', newMessage.value.trim())
    newMessage.value = ''
    await nextTick()
    // Auto-scroll to bottom after sending
    const messagesContainer = document.querySelector('.overflow-y-auto')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }
}
</script>
