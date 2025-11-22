import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Subject } from '@/types'
import * as subjectsFirebase from '@/services/subjectsFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref<Subject[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  let unsubscribe: Unsubscribe | null = null

  // Computed properties
  const coreSubjects = computed(() =>
    subjects.value.filter(s => s.type === 'core')
  )

  const electiveSubjects = computed(() =>
    subjects.value.filter(s => s.type === 'elective')
  )

  const subjectsByClass = computed(() => {
    const grouped: Record<string, Subject[]> = {}
    subjects.value.forEach(subject => {
      if (subject.class) {
        if (!grouped[subject.class]) grouped[subject.class] = []
        grouped[subject.class].push(subject)
      }
    })
    return grouped
  })

  const subjectsWithoutTeacher = computed(() =>
    subjects.value.filter(s => !s.teacher || s.teacher === 0)
  )

  const subjectsWithTeacher = computed(() =>
    subjects.value.filter(s => s.teacher && s.teacher !== 0)
  )

  const filteredSubjects = computed(() => {
    if (!searchQuery.value) return subjects.value

    const query = searchQuery.value.toLowerCase()
    return subjects.value.filter(subject =>
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query) ||
      subject.class?.toLowerCase().includes(query)
    )
  })

  const totalSubjects = computed(() => subjects.value.length)
  const totalCore = computed(() => coreSubjects.value.length)
  const totalElective = computed(() => electiveSubjects.value.length)
  const totalWithoutTeacher = computed(() => subjectsWithoutTeacher.value.length)

  // Get all unique classes
  const allClasses = computed(() => {
    const classes = new Set<string>()
    subjects.value.forEach(subject => {
      if (subject.class) classes.add(subject.class)
    })
    return Array.from(classes).sort()
  })

  // Initialize with real-time listener
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      // Set up real-time listener
      unsubscribe = subjectsFirebase.subscribeToSubjects((updatedSubjects) => {
        subjects.value = updatedSubjects
        loading.value = false
      })

      console.log('✅ Subjects store initialized with real-time updates')
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('❌ Failed to initialize subjects store:', err)
    }
  }

  // Load all subjects (one-time)
  async function loadSubjects() {
    try {
      loading.value = true
      error.value = null
      subjects.value = await subjectsFirebase.getAllSubjects()
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add new subject
  async function addSubject(subjectData: Omit<Subject, 'id'>) {
    try {
      loading.value = true
      error.value = null

      // Check if code already exists
      const codeExists = await subjectsFirebase.isSubjectCodeExists(subjectData.code)
      if (codeExists) {
        throw new Error(`Subject code "${subjectData.code}" already exists`)
      }

      const id = await subjectsFirebase.createSubject(subjectData)

      // Real-time listener will update the list automatically
      loading.value = false
      return id
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update subject
  async function updateSubject(id: string, data: Partial<Subject>) {
    try {
      loading.value = true
      error.value = null

      // Check if code already exists (if code is being updated)
      if (data.code) {
        const codeExists = await subjectsFirebase.isSubjectCodeExists(data.code, id)
        if (codeExists) {
          throw new Error(`Subject code "${data.code}" already exists`)
        }
      }

      await subjectsFirebase.updateSubject(id, data)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete subject
  async function deleteSubject(id: string) {
    try {
      loading.value = true
      error.value = null

      await subjectsFirebase.deleteSubject(id)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get subject by ID
  function getSubjectById(id: string | number) {
    return subjects.value.find(s => s.id === id)
  }

  // Search subjects
  async function searchSubjects(query: string) {
    try {
      loading.value = true
      error.value = null

      const results = await subjectsFirebase.searchSubjects(query)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get subjects by class
  async function getSubjectsByClass(className: string) {
    try {
      loading.value = true
      error.value = null

      const results = await subjectsFirebase.getSubjectsByClass(className)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get subjects by teacher
  async function getSubjectsByTeacher(teacherId: number) {
    try {
      loading.value = true
      error.value = null

      const results = await subjectsFirebase.getSubjectsByTeacher(teacherId)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get core subjects
  async function getCoreSubjects() {
    try {
      loading.value = true
      error.value = null

      const results = await subjectsFirebase.getCoreSubjects()

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get elective subjects
  async function getElectiveSubjects() {
    try {
      loading.value = true
      error.value = null

      const results = await subjectsFirebase.getElectiveSubjects()

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Assign teacher to subject
  async function assignTeacher(subjectId: string, teacherId: number) {
    try {
      loading.value = true
      error.value = null

      await subjectsFirebase.assignTeacherToSubject(subjectId, teacherId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove teacher from subject
  async function removeTeacher(subjectId: string) {
    try {
      loading.value = true
      error.value = null

      await subjectsFirebase.removeTeacherFromSubject(subjectId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Bulk create subjects
  async function bulkCreateSubjects(subjectsData: Omit<Subject, 'id'>[]) {
    try {
      loading.value = true
      error.value = null

      const ids = await subjectsFirebase.bulkCreateSubjects(subjectsData)

      loading.value = false
      return ids
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get subjects count by class
  async function getSubjectsCountByClass() {
    try {
      return await subjectsFirebase.getSubjectsCountByClass()
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Get subjects count by type
  async function getSubjectsCountByType() {
    try {
      return await subjectsFirebase.getSubjectsCountByType()
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Get subjects without teacher
  async function getSubjectsWithoutTeacher() {
    try {
      return await subjectsFirebase.getSubjectsWithoutTeacher()
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
    const saved = localStorage.getItem('subjects')
    if (saved) {
      subjects.value = JSON.parse(saved)
    }
  }

  return {
    // State
    subjects,
    loading,
    error,
    searchQuery,

    // Computed
    coreSubjects,
    electiveSubjects,
    subjectsByClass,
    subjectsWithoutTeacher,
    subjectsWithTeacher,
    filteredSubjects,
    totalSubjects,
    totalCore,
    totalElective,
    totalWithoutTeacher,
    allClasses,

    // Actions
    initialize,
    loadSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    searchSubjects,
    getSubjectsByClass,
    getSubjectsByTeacher,
    getCoreSubjects,
    getElectiveSubjects,
    assignTeacher,
    removeTeacher,
    bulkCreateSubjects,
    getSubjectsCountByClass,
    getSubjectsCountByType,
    getSubjectsWithoutTeacher,
    setSearchQuery,
    clearError,
    cleanup,
    loadFromLocalStorage
  }
})
