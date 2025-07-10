<template>
  <div class="flex h-full flex-col bg-white">
    <PageHeader />
    <PageBody />
    <PageFooter />

    <!-- Chat Widget will be mounted here -->
    <WidgetApp :config="widgetConfig" />
  </div>
</template>

<script setup>
// Template from Tailwind UI: https://salient.tailwindui.com/

const widgetConfig = {
  companyName: 'TaxPal Support',
  greeting: 'Hi! 👋 Welcome to TaxPal! I\'m here to help you with your taxes. What can I assist you with today?',
  placeholder: 'Ask about taxes, accounting, bookkeeping...',
  primaryColor: '#3B82F6',
  theme: 'light'
}

useHead({
  title: 'TaxPal - Accounting made simple for small businesses',
  meta: [
    { name: 'description', content: 'Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited.' }
  ]
})
</script>
