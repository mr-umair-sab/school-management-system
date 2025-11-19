import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const userRole = ref<UserRole | null>(null)

  const isAdmin = computed(() => userRole.value === 'admin')
  const isTeacher = computed(() => userRole.value === 'teacher')
  const isStudent = computed(() => userRole.value === 'student')
  const isParent = computed(() => userRole.value === 'parent')

  const permissions = computed(() => {
    switch (userRole.value) {
      case 'admin':
        return {
          canManageStudents: true,
          canManageTeachers: true,
          canManageFees: true,
          canManageExams: true,
          canManageLibrary: true,
          canManageTransport: true,
          canViewReports: true,
          canManageNotices: true,
          canApproveLeaves: true
        }
      case 'teacher':
        return {
          canManageStudents: false,
          canManageTeachers: false,
          canManageFees: false,
          canManageExams: true,
          canManageLibrary: true,
          canManageTransport: false,
          canViewReports: true,
          canManageNotices: true,
          canApproveLeaves: false
        }
      case 'student':
        return {
          canManageStudents: false,
          canManageTeachers: false,
          canManageFees: false,
          canManageExams: false,
          canManageLibrary: false,
          canManageTransport: false,
          canViewReports: false,
          canManageNotices: false,
          canApproveLeaves: false
        }
      case 'parent':
        return {
          canManageStudents: false,
          canManageTeachers: false,
          canManageFees: false,
          canManageExams: false,
          canManageLibrary: false,
          canManageTransport: false,
          canViewReports: false,
          canManageNotices: false,
          canApproveLeaves: false
        }
      default:
        return {}
    }
  })

  function login(userData: unknown, role: UserRole) {
    user.value = userData
    isAuthenticated.value = true
    userRole.value = role
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
      userRole.value = savedRole as UserRole
      isAuthenticated.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    permissions,
    login,
    logout,
    checkAuth
  }
})
