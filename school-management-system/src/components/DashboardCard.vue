<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm">{{ title }}</p>
        <h3 class="text-3xl font-bold mt-2">{{ value }}</h3>
      </div>
      <div :class="iconBgClass">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  color?: string
}>()

const iconBgClass = computed(() => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    indigo: 'bg-indigo-100'
  }
  return `${colorMap[props.color || 'blue']} p-4 rounded-xl`
})
</script>
