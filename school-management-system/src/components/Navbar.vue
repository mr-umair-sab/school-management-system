<template>
  <nav class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
    </div>
    
    <div class="flex items-center space-x-4">
      <button class="p-2 hover:bg-gray-100 rounded-lg">
        🔔
      </button>
      <div class="flex items-center space-x-2">
        <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          {{ userInitial }}
        </div>
        <span class="text-gray-700">{{ userName }}</span>
      </div>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps<{
  pageTitle: string
}>()

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.user?.name || 'Admin')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
