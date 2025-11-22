import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Transport, Leave } from '@/types'
import * as transportFirebase from '@/services/transportFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useTransportStore = defineStore('transport', () => {
  const routes = ref<Transport[]>([])
  const leaves = ref<Leave[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let routesUnsubscribe: Unsubscribe | null = null
  let leavesUnsubscribe: Unsubscribe | null = null

  async function initialize() {
    try {
      loading.value = true

      routesUnsubscribe = transportFirebase.subscribeToRoutes((data) => {
        routes.value = data
      })

      leavesUnsubscribe = transportFirebase.subscribeToLeaves((data) => {
        leaves.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize transport store:', err)
    }
  }

  async function addRoute(route: Omit<Transport, 'id'>) {
    try {
      loading.value = true
      await transportFirebase.createRoute(route)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateRoute(id: string, route: Partial<Transport>) {
    try {
      loading.value = true
      await transportFirebase.updateRoute(id, route)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteRoute(id: string) {
    try {
      loading.value = true
      await transportFirebase.deleteRoute(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function assignStudentToRoute(routeId: string, studentId: number) {
    try {
      const route = routes.value.find(r => r.id == routeId) // Loose equality for string/number ID
      if (route && !route.students.includes(studentId)) {
        const updatedStudents = [...route.students, studentId]
        await transportFirebase.updateRoute(routeId, { students: updatedStudents })
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  async function removeStudentFromRoute(routeId: string, studentId: number) {
    try {
      const route = routes.value.find(r => r.id == routeId) // Loose equality
      if (route) {
        const updatedStudents = route.students.filter(s => s !== studentId)
        await transportFirebase.updateRoute(routeId, { students: updatedStudents })
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  async function addLeave(leave: Omit<Leave, 'id'>) {
    try {
      loading.value = true
      await transportFirebase.createLeave({ ...leave, status: 'pending' })
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateLeaveStatus(id: string, status: 'approved' | 'rejected', approvedBy: number) {
    try {
      loading.value = true
      await transportFirebase.updateLeave(id, { status, approvedBy })
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getLeavesByUser(userId: string | number, userType: 'teacher' | 'student') {
    return leaves.value.filter(l => l.userId == userId && l.userType === userType)
  }

  function getPendingLeaves() {
    return leaves.value.filter(l => l.status === 'pending')
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Transport. Use initialize() instead.')
  }

  function cleanup() {
    if (routesUnsubscribe) routesUnsubscribe()
    if (leavesUnsubscribe) leavesUnsubscribe()
  }

  return {
    routes,
    leaves,
    loading,
    error,
    initialize,
    addRoute,
    updateRoute,
    deleteRoute,
    assignStudentToRoute,
    removeStudentFromRoute,
    addLeave,
    updateLeaveStatus,
    getLeavesByUser,
    getPendingLeaves,
    loadFromLocalStorage,
    cleanup
  }
})

