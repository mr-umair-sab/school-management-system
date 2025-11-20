<template>
  <aside class="bg-indigo-900 text-white w-64 min-h-screen p-4 overflow-y-auto sticky top-0 z-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Umair king</h1>
      <p class="text-indigo-300 text-sm">Management System</p>
    </div>

    <nav class="space-y-1">
      <template v-for="item in visibleMenuItems" :key="item.path">
        <RouterLink
          v-if="!item.roles || item.roles.includes(authStore.userRole)"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-indigo-800 transition-colors text-sm"
          active-class="bg-indigo-800"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const allMenuItems = [
  { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'teacher'] },
  { path: '/students', label: 'Students', icon: '👨‍🎓', roles: ['admin', 'teacher'] },
  { path: '/teachers', label: 'Teachers', icon: '👨‍🏫', roles: ['admin'] },
  { path: '/subjects', label: 'Subjects', icon: '📚', roles: ['admin', 'teacher'] },
  { path: '/subject-management', label: 'Subject Management', icon: '📖', roles: ['admin', 'teacher'] },
  { path: '/timetable', label: 'Timetable', icon: '📅', roles: ['admin', 'teacher'] },
  { path: '/class-management', label: 'Class Management', icon: '🏫', roles: ['admin'] },
  { path: '/attendance', label: 'Attendance', icon: '✅', roles: ['admin', 'teacher'] },
  { path: '/fees', label: 'Fee Management', icon: '💰', roles: ['admin'] },
  { path: '/exams', label: 'Exams & Results', icon: '📝', roles: ['admin', 'teacher'] },
  { path: '/library', label: 'Library', icon: '📚', roles: ['admin', 'teacher'] },
  { path: '/transport', label: 'Transport', icon: '🚌', roles: ['admin'] },
  { path: '/events', label: 'Events', icon: '🎉', roles: ['admin', 'teacher'] },
  { path: '/notices', label: 'Notices', icon: '📢', roles: ['admin', 'teacher'] },
  { path: '/reports', label: 'Reports', icon: '📊', roles: ['admin', 'teacher'] },
  { path: '/parent-portal', label: 'Parent Portal', icon: '👪', roles: ['parent'] },
  { path: '/student-portal', label: 'My Portal', icon: '🎓', roles: ['student'] },
  { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'teacher', 'student', 'parent'] },
]

const visibleMenuItems = computed(() => {
  return allMenuItems.filter(item =>
    !item.roles || item.roles.includes(authStore.userRole as unknown)
  )
})
</script>
