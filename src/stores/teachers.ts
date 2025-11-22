import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher } from '@/types'
import * as teachersFirebase from '@/services/teachersFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  let unsubscribe: Unsubscribe | null = null

  // Computed properties
  const activeTeachers = computed(() =>
    teachers.value.filter(t => t.status === 'active')
  )

  const inactiveTeachers = computed(() =>
    teachers.value.filter(t => t.status === 'inactive')
  )

  const onLeaveTeachers = computed(() =>
    teachers.value.filter(t => t.status === 'on-leave')
  )

  const teachersBySubject = computed(() => {
    const grouped: Record<string, Teacher[]> = {}
    teachers.value.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        if (!grouped[subject]) grouped[subject] = []
        grouped[subject].push(teacher)
      })
    })
    return grouped
  })

  const teachersByClass = computed(() => {
    const grouped: Record<string, Teacher[]> = {}
    teachers.value.forEach(teacher => {
      teacher.classes.forEach(className => {
        if (!grouped[className]) grouped[className] = []
        grouped[className].push(teacher)
      })
    })
    return grouped
  })

  const filteredTeachers = computed(() => {
    if (!searchQuery.value) return teachers.value

    const query = searchQuery.value.toLowerCase()
    return teachers.value.filter(teacher =>
      teacher.name.toLowerCase().includes(query) ||
      teacher.employeeId.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.subjects.some(s => s.toLowerCase().includes(query)) ||
      teacher.qualification?.toLowerCase().includes(query)
    )
  })

  const totalTeachers = computed(() => teachers.value.length)
  const totalActive = computed(() => activeTeachers.value.length)
  const totalInactive = computed(() => inactiveTeachers.value.length)
  const totalOnLeave = computed(() => onLeaveTeachers.value.length)

  // Get all unique subjects taught
  const allSubjects = computed(() => {
    const subjects = new Set<string>()
    teachers.value.forEach(teacher => {
      teacher.subjects.forEach(subject => subjects.add(subject))
    })
    return Array.from(subjects).sort()
  })

  // Get all unique classes taught
  const allClasses = computed(() => {
    const classes = new Set<string>()
    teachers.value.forEach(teacher => {
      teacher.classes.forEach(className => classes.add(className))
    })
    return Array.from(classes).sort()
  })

  // Initialize with real-time listener
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      // Set up real-time listener
      unsubscribe = teachersFirebase.subscribeToTeachers((updatedTeachers) => {
        teachers.value = updatedTeachers
        loading.value = false
      })

      console.log('✅ Teachers store initialized with real-time updates')
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('❌ Failed to initialize teachers store:', err)
    }
  }

  // Load all teachers (one-time)
  async function loadTeachers() {
    try {
      loading.value = true
      error.value = null
      teachers.value = await teachersFirebase.getAllTeachers()
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add new teacher
  async function addTeacher(teacherData: Omit<Teacher, 'id'>) {
    try {
      loading.value = true
      error.value = null

      const id = await teachersFirebase.createTeacher(teacherData)

      // Real-time listener will update the list automatically
      loading.value = false
      return id
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update teacher
  async function updateTeacher(id: string, data: Partial<Teacher>) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.updateTeacher(id, data)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete teacher
  async function deleteTeacher(id: string) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.deleteTeacher(id)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get teacher by ID
  function getTeacherById(id: string | number) {
    return teachers.value.find(t => t.id === id)
  }

  // Search teachers
  async function searchTeachers(query: string) {
    try {
      loading.value = true
      error.value = null

      const results = await teachersFirebase.searchTeachers(query)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get teachers by subject
  async function getTeachersBySubject(subject: string) {
    try {
      loading.value = true
      error.value = null

      const results = await teachersFirebase.getTeachersBySubject(subject)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get teachers by class
  async function getTeachersByClass(className: string) {
    try {
      loading.value = true
      error.value = null

      const results = await teachersFirebase.getTeachersByClass(className)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update teacher status
  async function updateTeacherStatus(id: string, status: 'active' | 'inactive' | 'on-leave') {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.updateTeacherStatus(id, status)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Assign subject to teacher
  async function assignSubject(teacherId: string, subject: string) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.assignSubjectToTeacher(teacherId, subject)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove subject from teacher
  async function removeSubject(teacherId: string, subject: string) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.removeSubjectFromTeacher(teacherId, subject)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Assign class to teacher
  async function assignClass(teacherId: string, className: string) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.assignClassToTeacher(teacherId, className)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove class from teacher
  async function removeClass(teacherId: string, className: string) {
    try {
      loading.value = true
      error.value = null

      await teachersFirebase.removeClassFromTeacher(teacherId, className)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Bulk create teachers
  async function bulkCreateTeachers(teachersData: Omit<Teacher, 'id'>[]) {
    try {
      loading.value = true
      error.value = null

      const ids = await teachersFirebase.bulkCreateTeachers(teachersData)

      loading.value = false
      return ids
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get teachers count by subject
  async function getTeachersCountBySubject() {
    try {
      return await teachersFirebase.getTeachersCountBySubject()
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Get teacher workload
  async function getTeacherWorkload(teacherId: string) {
    try {
      return await teachersFirebase.getTeacherWorkload(teacherId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Set search query
  function setSearchQuery(query: string) {
    searchQuery.value = query
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
    const saved = localStorage.getItem('teachers')
    if (saved) {
      teachers.value = JSON.parse(saved)
    }
  }

  return {
    // State
    teachers,
    loading,
    error,
    searchQuery,

    // Computed
    activeTeachers,
    inactiveTeachers,
    onLeaveTeachers,
    teachersBySubject,
    teachersByClass,
    filteredTeachers,
    totalTeachers,
    totalActive,
    totalInactive,
    totalOnLeave,
    allSubjects,
    allClasses,

    // Actions
    initialize,
    loadTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    searchTeachers,
    getTeachersBySubject,
    getTeachersByClass,
    updateTeacherStatus,
    assignSubject,
    removeSubject,
    assignClass,
    removeClass,
    bulkCreateTeachers,
    getTeachersCountBySubject,
    getTeacherWorkload,
    setSearchQuery,
    clearError,
    cleanup,
    loadFromLocalStorage
  }
})
