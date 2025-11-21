<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Umair king</h1>
        <p class="text-gray-600 mt-2">Management System Login</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="admin@school.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select v-model="role" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="admin">👨‍💼 Admin</option>
            <option value="teacher">👨‍🏫 Teacher</option>
            <option value="parent">👨‍👩‍👧 Parent</option>
            <option value="student">👨‍🎓 Student</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Login
        </button>
      </form>

      <!-- <div class="text-center text-sm text-gray-600 mt-6 space-y-1">
        <p class="font-semibold">Demo Credentials:</p>
        <p>👨‍💼 Admin: admin@school.com / password</p>
        <p>👨‍🏫 Teacher: teacher@school.com / password</p>
        <p>👨‍👩‍👧 Parent: parent@school.com / password</p>
        <p>👨‍🎓 Student: student@school.com / password</p>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@school.com')
const password = ref('password')
const role = ref<'admin' | 'teacher' | 'parent' | 'student'>('admin')

function handleLogin() {
  authStore.login({ name: 'Admin User', email: email.value }, role.value)

  // Redirect based on role
  if (role.value === 'parent') {
    router.push('/parent-portal')
  } else if (role.value === 'student') {
    router.push('/student-portal')
  } else {
    router.push('/')
  }
}
</script>
