import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Transport, Leave } from '@/types'

export const useTransportStore = defineStore('transport', () => {
  const routes = ref<Transport[]>([])
  const leaves = ref<Leave[]>([])

  function addRoute(route: Omit<Transport, 'id'>) {
    routes.value.push({ ...route, id: Date.now() })
    saveToLocalStorage()
  }

  function updateRoute(id: number, route: Partial<Transport>) {
    const index = routes.value.findIndex(r => r.id === id)
    if (index !== -1) {
      routes.value[index] = { ...routes.value[index], ...route } as Transport
      saveToLocalStorage()
    }
  }

  function deleteRoute(id: number) {
    routes.value = routes.value.filter(r => r.id !== id)
    saveToLocalStorage()
  }

  function assignStudentToRoute(routeId: number, studentId: number) {
    const route = routes.value.find(r => r.id === routeId)
    if (route && !route.students.includes(studentId)) {
      route.students.push(studentId)
      saveToLocalStorage()
    }
  }

  function removeStudentFromRoute(routeId: number, studentId: number) {
    const route = routes.value.find(r => r.id === routeId)
    if (route) {
      route.students = route.students.filter(s => s !== studentId)
      saveToLocalStorage()
    }
  }

  function addLeave(leave: Omit<Leave, 'id'>) {
    leaves.value.push({ ...leave, id: Date.now(), status: 'pending' })
    saveToLocalStorage()
  }

  function updateLeaveStatus(id: number, status: 'approved' | 'rejected', approvedBy: number) {
    const leave = leaves.value.find(l => l.id === id)
    if (leave) {
      leave.status = status
      leave.approvedBy = approvedBy
      saveToLocalStorage()
    }
  }

  function getLeavesByUser(userId: number, userType: 'teacher' | 'student') {
    return leaves.value.filter(l => l.userId === userId && l.userType === userType)
  }

  function getPendingLeaves() {
    return leaves.value.filter(l => l.status === 'pending')
  }

  function saveToLocalStorage() {
    localStorage.setItem('transportRoutes', JSON.stringify(routes.value))
    localStorage.setItem('leaves', JSON.stringify(leaves.value))
  }

  function loadFromLocalStorage() {
    const savedRoutes = localStorage.getItem('transportRoutes')
    const savedLeaves = localStorage.getItem('leaves')
    if (savedRoutes) routes.value = JSON.parse(savedRoutes)
    if (savedLeaves) leaves.value = JSON.parse(savedLeaves)
  }

  return {
    routes,
    leaves,
    addRoute,
    updateRoute,
    deleteRoute,
    assignStudentToRoute,
    removeStudentFromRoute,
    addLeave,
    updateLeaveStatus,
    getLeavesByUser,
    getPendingLeaves,
    loadFromLocalStorage
  }
})
