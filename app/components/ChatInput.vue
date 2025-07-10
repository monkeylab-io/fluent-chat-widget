<template>
  <div class="fixed bottom-0 left-1/2 w-full transform -translate-x-1/2 z-50 py-6 pointer-events-none">
    <div class="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/10 to-transparent" />
    <div class="relative bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 w-full sm:max-w-3/4 xl:max-w-2xl 2xl:max-w-4xl mx-2 sm:mx-auto pointer-events-auto animate-pulse-ring">
      <Input
        v-model="message"
        :placeholder="placeholder"
        class="border-none outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        @keydown.enter="sendMessage"
      />
      <Button
        :disabled="!message.trim()"
        size="sm"
        class="rounded-full size-10 p-0"
        @click="sendMessage"
      >
        <SendHorizontal class="size-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendHorizontal } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

interface Props {
  placeholder?: string
}

interface Emits {
  (e: 'send', message: string): void
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Type a message...'
})

const emit = defineEmits<Emits>()

const message = ref('')

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send', message.value.trim())
    message.value = ''
  }
}
</script>
