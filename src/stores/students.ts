import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student } from '@/types'
import * as studentsFirebase from '@/services/studentsFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  let unsubscribe: Unsubscribe | null = null

  // Computed properties
  const activeStudents = computed(() =>
    students.value.filter(s => s.status === 'active')
  )

  const inactiveStudents = computed(() =>
    students.value.filter(s => s.status === 'inactive')
  )

  const graduatedStudents = computed(() =>
    students.value.filter(s => s.status === 'graduated')
  )

  const studentsByClass = computed(() => {
    const grouped: Record<string, Student[]> = {}
    students.value.forEach(student => {
      const key = `${student.class}-${student.section}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(student)
    })
    return grouped
  })

  const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value

    const query = searchQuery.value.toLowerCase()
    return students.value.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      `${student.class}-${student.section}`.toLowerCase().includes(query)
    )
  })

  const totalStudents = computed(() => students.value.length)
  const totalActive = computed(() => activeStudents.value.length)
  const totalInactive = computed(() => inactiveStudents.value.length)

  // Initialize with real-time listener
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      // Set up real-time listener
      unsubscribe = studentsFirebase.subscribeToStudents((updatedStudents) => {
        students.value = updatedStudents
        loading.value = false
      })

      console.log('✅ Students store initialized with real-time updates')
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('❌ Failed to initialize students store:', err)
    }
  }

  // Load all students (one-time)
  async function loadStudents() {
    try {
      loading.value = true
      error.value = null
      students.value = await studentsFirebase.getAllStudents()
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add new student
  async function addStudent(studentData: Omit<Student, 'id'>) {
    try {
      loading.value = true
      error.value = null

      const id = await studentsFirebase.createStudent(studentData)

      // Real-time listener will update the list automatically
      loading.value = false
      return id
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update student
  async function updateStudent(id: string, data: Partial<Student>) {
    try {
      loading.value = true
      error.value = null

      await studentsFirebase.updateStudent(id, data)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete student
  async function deleteStudent(id: string) {
    try {
      loading.value = true
      error.value = null

      await studentsFirebase.deleteStudent(id)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get student by ID
  function getStudentById(id: string | number) {
    return students.value.find(s => s.id === id)
  }

  // Search students
  async function searchStudents(query: string) {
    try {
      loading.value = true
      error.value = null

      const results = await studentsFirebase.searchStudents(query)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get students by class
  async function getStudentsByClass(className: string, section: string) {
    try {
      loading.value = true
      error.value = null

      const results = await studentsFirebase.getStudentsByClass(className, section)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update student status
  async function updateStudentStatus(id: string, status: 'active' | 'inactive' | 'graduated') {
    try {
      loading.value = true
      error.value = null

      await studentsFirebase.updateStudentStatus(id, status)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Bulk create students
  async function bulkCreateStudents(studentsData: Omit<Student, 'id'>[]) {
    try {
      loading.value = true
      error.value = null

      const ids = await studentsFirebase.bulkCreateStudents(studentsData)

      loading.value = false
      return ids
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get students count by class
  async function getStudentsCountByClass() {
    try {
      return await studentsFirebase.getStudentsCountByClass()
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
    const saved = localStorage.getItem('students')
    if (saved) {
      students.value = JSON.parse(saved)
    }
  }

  return {
    // State
    students,
    loading,
    error,
    searchQuery,

    // Computed
    activeStudents,
    inactiveStudents,
    graduatedStudents,
    studentsByClass,
    filteredStudents,
    totalStudents,
    totalActive,
    totalInactive,

    // Actions
    initialize,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    searchStudents,
    getStudentsByClass,
    updateStudentStatus,
    bulkCreateStudents,
    getStudentsCountByClass,
    setSearchQuery,
    clearError,
    cleanup,
    loadFromLocalStorage
  }
})
