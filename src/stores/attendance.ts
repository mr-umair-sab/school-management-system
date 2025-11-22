import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Attendance } from '@/types'
import * as attendanceFirebase from '@/services/attendanceFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendanceRecords = ref<Attendance[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  const todayAttendance = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return attendanceRecords.value.filter(a => a.date === today)
  })

  async function initialize() {
    try {
      loading.value = true

      // Subscribe to all attendance records (or filter by current academic year/session if needed)
      // For now, subscribing to all to match previous behavior
      unsubscribe = attendanceFirebase.subscribeToAttendance((records) => {
        attendanceRecords.value = records
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize attendance store:', err)
    }
  }

  async function markAttendance(attendance: Omit<Attendance, 'id'>) {
    try {
      loading.value = true
      await attendanceFirebase.markAttendance(attendance)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getAttendanceByStudent(studentId: string | number, startDate?: string, endDate?: string) {
    return attendanceRecords.value.filter(a => {
      // Handle both string and number IDs
      const hasStudent = a.records.some(r => r.studentId == studentId)
      if (!startDate || !endDate) return hasStudent
      return hasStudent && a.date >= startDate && a.date <= endDate
    })
  }

  function getAttendanceByClass(className: string, section: string, date: string) {
    return attendanceRecords.value.find(
      a => a.class === className && a.section === section && a.date === date
    )
  }

  function calculateAttendancePercentage(studentId: string | number, days: number = 30) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const records = getAttendanceByStudent(
      studentId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    )

    let present = 0
    let total = 0

    records.forEach(attendance => {
      const record = attendance.records.find(r => r.studentId == studentId)
      if (record) {
        total++
        if (record.status === 'present' || record.status === 'late') present++
        if (record.status === 'half-day') present += 0.5
      }
    })

    return total > 0 ? (present / total) * 100 : 0
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Attendance. Use initialize() instead.')
  }

  function cleanup() {
    if (unsubscribe) unsubscribe()
  }

  return {
    attendanceRecords,
    todayAttendance,
    loading,
    error,
    initialize,
    markAttendance,
    getAttendanceByStudent,
    getAttendanceByClass,
    calculateAttendancePercentage,
    loadFromLocalStorage,
    cleanup
  }
})

