import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Attendance } from '@/types'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendanceRecords = ref<Attendance[]>([])

  const todayAttendance = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return attendanceRecords.value.filter(a => a.date === today)
  })

  function markAttendance(attendance: Omit<Attendance, 'id'>) {
    const existing = attendanceRecords.value.findIndex(
      a => a.date === attendance.date &&
           a.class === attendance.class &&
           a.section === attendance.section
    )

    if (existing !== -1) {
      const existingRecord = attendanceRecords.value[existing]
      if (existingRecord) {
        attendanceRecords.value[existing] = { ...attendance, id: existingRecord.id }
      }
    } else {
      attendanceRecords.value.push({ ...attendance, id: Date.now() })
    }
    saveToLocalStorage()
  }

  function getAttendanceByStudent(studentId: number, startDate?: string, endDate?: string) {
    return attendanceRecords.value.filter(a => {
      const hasStudent = a.records.some(r => r.studentId === studentId)
      if (!startDate || !endDate) return hasStudent
      return hasStudent && a.date >= startDate && a.date <= endDate
    })
  }

  function getAttendanceByClass(className: string, section: string, date: string) {
    return attendanceRecords.value.find(
      a => a.class === className && a.section === section && a.date === date
    )
  }

  function calculateAttendancePercentage(studentId: number, days: number = 30) {
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
      const record = attendance.records.find(r => r.studentId === studentId)
      if (record) {
        total++
        if (record.status === 'present' || record.status === 'late') present++
        if (record.status === 'half-day') present += 0.5
      }
    })

    return total > 0 ? (present / total) * 100 : 0
  }

  function saveToLocalStorage() {
    localStorage.setItem('attendance', JSON.stringify(attendanceRecords.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('attendance')
    if (saved) attendanceRecords.value = JSON.parse(saved)
  }

  return {
    attendanceRecords,
    todayAttendance,
    markAttendance,
    getAttendanceByStudent,
    getAttendanceByClass,
    calculateAttendancePercentage,
    loadFromLocalStorage
  }
})
