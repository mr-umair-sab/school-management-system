<template>
  <aside class="bg-indigo-900 text-white w-64 min-h-screen p-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Umair king</h1>
      <p class="text-indigo-300 text-sm">Management System</p>
    </div>
    
    <nav class="space-y-2">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-800 transition-colors"
        active-class="bg-indigo-800"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
  { path: '/subjects', label: 'Subjects', icon: '📚' },
  { path: '/attendance', label: 'Attendance', icon: '✅' },
  { path: '/fees', label: 'Fee Management', icon: '💰' },
  { path: '/exams', label: 'Exams & Results', icon: '📝' },
  { path: '/notices', label: 'Notices', icon: '📢' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]
</script>
