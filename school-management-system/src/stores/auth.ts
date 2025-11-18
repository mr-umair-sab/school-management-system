import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const userRole = ref<'admin' | 'teacher' | 'student' | null>(null)

  function login(userData: any, role: string) {
    user.value = userData
    isAuthenticated.value = true
    userRole.value = role as any
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', role)
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    userRole.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  }

  function checkAuth() {
    const savedUser = localStorage.getItem('user')
    const savedRole = localStorage.getItem('role')
    if (savedUser && savedRole) {
      user.value = JSON.parse(savedUser)
      userRole.value = savedRole as any
      isAuthenticated.value = true
    }
  }

  return { user, isAuthenticated, userRole, login, logout, checkAuth }
})
