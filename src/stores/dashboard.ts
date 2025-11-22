import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface VisitorLog {
  id: number
  name: string
  purpose: string
  personToMeet: string
  inTime: string
  outTime?: string
  date: string
  idProof: string
}

export interface ClassroomOccupancy {
  roomNumber: string
  capacity: number
  currentOccupancy: number
  status: 'occupied' | 'vacant' | 'maintenance'
}

export const useDashboardStore = defineStore('dashboard', () => {
  const visitorLogs = ref<VisitorLog[]>([])
  const classroomOccupancy = ref<ClassroomOccupancy[]>([])

  function addVisitorLog(visitor: Omit<VisitorLog, 'id'>) {
    visitorLogs.value.push({ ...visitor, id: Date.now() })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('visitorLogs', JSON.stringify(visitorLogs.value))
    localStorage.setItem('classroomOccupancy', JSON.stringify(classroomOccupancy.value))
  }

  function loadFromLocalStorage() {
    const savedVisitors = localStorage.getItem('visitorLogs')
    const savedOccupancy = localStorage.getItem('classroomOccupancy')
    if (savedVisitors) visitorLogs.value = JSON.parse(savedVisitors)
    if (savedOccupancy) classroomOccupancy.value = JSON.parse(savedOccupancy)
  }

  return {
    visitorLogs,
    classroomOccupancy,
    addVisitorLog,
    loadFromLocalStorage
  }
})
