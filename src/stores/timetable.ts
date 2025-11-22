import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Timetable, Subject, Class } from '@/types'
import * as timetableFirebase from '@/services/timetableFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useTimetableStore = defineStore('timetable', () => {
  const timetables = ref<Timetable[]>([])
  const subjects = ref<Subject[]>([])
  const classes = ref<Class[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  // Computed properties
  const timetablesByClass = computed(() => {
    const grouped: Record<string, Timetable[]> = {}
    timetables.value.forEach(timetable => {
      const key = `${timetable.class}-${timetable.section}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(timetable)
    })
    return grouped
  })

  const timetablesByDay = computed(() => {
    const grouped: Record<string, Timetable[]> = {}
    timetables.value.forEach(timetable => {
      if (!grouped[timetable.day]) grouped[timetable.day] = []
      grouped[timetable.day].push(timetable)
    })
    return grouped
  })

  const allDays = computed(() => {
    const days = new Set<string>()
    timetables.value.forEach(t => days.add(t.day))
    return Array.from(days).sort()
  })

  const allClasses = computed(() => {
    const classSet = new Set<string>()
    timetables.value.forEach(t => classSet.add(`${t.class}-${t.section}`))
    return Array.from(classSet).sort()
  })

  const totalTimetables = computed(() => timetables.value.length)

  // Initialize with real-time listener
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      // Set up real-time listener
      unsubscribe = timetableFirebase.subscribeToTimetables((updatedTimetables) => {
        timetables.value = updatedTimetables
        loading.value = false
      })

      console.log('✅ Timetable store initialized with real-time updates')
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('❌ Failed to initialize timetable store:', err)
    }
  }

  // Load all timetables (one-time)
  async function loadTimetables() {
    try {
      loading.value = true
      error.value = null
      timetables.value = await timetableFirebase.getAllTimetables()
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add new timetable
  async function addTimetable(timetableData: Omit<Timetable, 'id'>) {
    try {
      loading.value = true
      error.value = null

      const id = await timetableFirebase.createTimetable(timetableData)

      // Real-time listener will update the list automatically
      loading.value = false
      return id
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update timetable
  async function updateTimetable(id: string, data: Partial<Timetable>) {
    try {
      loading.value = true
      error.value = null

      await timetableFirebase.updateTimetable(id, data)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete timetable
  async function deleteTimetable(id: string) {
    try {
      loading.value = true
      error.value = null

      await timetableFirebase.deleteTimetable(id)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get timetable by class
  async function getTimetableByClass(className: string, section: string) {
    try {
      loading.value = true
      error.value = null

      const results = await timetableFirebase.getTimetableByClass(className, section)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get timetable by teacher
  async function getTimetableByTeacher(teacherId: number) {
    try {
      loading.value = true
      error.value = null

      const results = await timetableFirebase.getTimetableByTeacher(teacherId)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get timetable by day
  async function getTimetableByDay(day: string) {
    try {
      loading.value = true
      error.value = null

      const results = await timetableFirebase.getTimetableByDay(day)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Check teacher clash
  async function checkTeacherClash(
    teacherId: number,
    day: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: string
  ) {
    try {
      return await timetableFirebase.checkTeacherClash(teacherId, day, startTime, endTime, excludeTimetableId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Check classroom clash
  async function checkClassroomClash(
    room: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: string
  ) {
    try {
      return await timetableFirebase.checkClassroomClash(room, day, startTime, endTime, excludeTimetableId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Bulk create timetables
  async function bulkCreateTimetables(timetablesData: Omit<Timetable, 'id'>[]) {
    try {
      loading.value = true
      error.value = null

      const ids = await timetableFirebase.bulkCreateTimetables(timetablesData)

      loading.value = false
      return ids
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete all timetables for a class
  async function deleteTimetablesByClass(className: string, section: string) {
    try {
      loading.value = true
      error.value = null

      await timetableFirebase.deleteTimetablesByClass(className, section)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get teacher's weekly schedule
  async function getTeacherWeeklySchedule(teacherId: number) {
    try {
      return await timetableFirebase.getTeacherWeeklySchedule(teacherId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Get classroom usage
  async function getClassroomUsage(room: string) {
    try {
      return await timetableFirebase.getClassroomUsage(room)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Get teacher's free periods
  async function getTeacherFreePeriods(teacherId: number, day: string) {
    try {
      return await timetableFirebase.getTeacherFreePeriods(teacherId, day)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Subject management (kept for backward compatibility)
  function addSubject(subject: Omit<Subject, 'id'>) {
    subjects.value.push({ ...subject, id: Date.now() })
    saveToLocalStorage()
  }

  function updateSubject(id: number, subject: Partial<Subject>) {
    const index = subjects.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subjects.value[index] = { ...subjects.value[index], ...subject } as Subject
      saveToLocalStorage()
    }
  }

  function deleteSubject(id: number) {
    subjects.value = subjects.value.filter(s => s.id !== id)
    saveToLocalStorage()
  }

  // Class management (kept for backward compatibility)
  function addClass(classData: Omit<Class, 'id'>) {
    classes.value.push({ ...classData, id: Date.now() })
    saveToLocalStorage()
  }

  function updateClass(id: number, classData: Partial<Class>) {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...classData } as Class
      saveToLocalStorage()
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  // Cleanup
  function cleanup() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Backward compatibility - load from localStorage (fallback)
  function loadFromLocalStorage() {
    const savedTimetables = localStorage.getItem('timetables')
    const savedSubjects = localStorage.getItem('subjects')
    const savedClasses = localStorage.getItem('classes')
    if (savedTimetables) timetables.value = JSON.parse(savedTimetables)
    if (savedSubjects) subjects.value = JSON.parse(savedSubjects)
    if (savedClasses) classes.value = JSON.parse(savedClasses)
  }

  function saveToLocalStorage() {
    localStorage.setItem('timetables', JSON.stringify(timetables.value))
    localStorage.setItem('subjects', JSON.stringify(subjects.value))
    localStorage.setItem('classes', JSON.stringify(classes.value))
  }

  return {
    // State
    timetables,
    subjects,
    classes,
    loading,
    error,

    // Computed
    timetablesByClass,
    timetablesByDay,
    allDays,
    allClasses,
    totalTimetables,

    // Actions
    initialize,
    loadTimetables,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    getTimetableByClass,
    getTimetableByTeacher,
    getTimetableByDay,
    checkTeacherClash,
    checkClassroomClash,
    bulkCreateTimetables,
    deleteTimetablesByClass,
    getTeacherWeeklySchedule,
    getClassroomUsage,
    getTeacherFreePeriods,

    // Subject management (backward compatibility)
    addSubject,
    updateSubject,
    deleteSubject,

    // Class management (backward compatibility)
    addClass,
    updateClass,

    // Utility
    clearError,
    cleanup,
    loadFromLocalStorage
  }
})
