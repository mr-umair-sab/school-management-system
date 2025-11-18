<template>
  <div class="flex min-h-screen">
    <Sidebar v-if="authStore.isAuthenticated" />
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
