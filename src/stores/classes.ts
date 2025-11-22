import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Class } from '@/types'
import * as classesFirebase from '@/services/classesFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref<Class[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  let unsubscribe: Unsubscribe | null = null

  // Computed properties
  const classesByName = computed(() => {
    const grouped: Record<string, Class[]> = {}
    classes.value.forEach(cls => {
      if (!grouped[cls.name]) grouped[cls.name] = []
      grouped[cls.name].push(cls)
    })
    return grouped
  })

  const classesBySection = computed(() => {
    const grouped: Record<string, Class[]> = {}
    classes.value.forEach(cls => {
      if (!grouped[cls.section]) grouped[cls.section] = []
      grouped[cls.section].push(cls)
    })
    return grouped
  })

  const classesWithAvailableSeats = computed(() =>
    classes.value.filter(cls => cls.students.length < cls.capacity)
  )

  const classesWithoutTeacher = computed(() =>
    classes.value.filter(cls => !cls.classTeacher || cls.classTeacher === 0)
  )

  const filteredClasses = computed(() => {
    if (!searchQuery.value) return classes.value

    const query = searchQuery.value.toLowerCase()
    return classes.value.filter(cls =>
      cls.name.toLowerCase().includes(query) ||
      cls.section.toLowerCase().includes(query) ||
      `${cls.name}-${cls.section}`.toLowerCase().includes(query)
    )
  })

  const totalClasses = computed(() => classes.value.length)
  const totalStudents = computed(() =>
    classes.value.reduce((sum, cls) => sum + cls.students.length, 0)
  )
  const totalCapacity = computed(() =>
    classes.value.reduce((sum, cls) => sum + cls.capacity, 0)
  )
  const averageOccupancy = computed(() => {
    if (totalCapacity.value === 0) return 0
    return (totalStudents.value / totalCapacity.value) * 100
  })

  // Get all unique class names
  const allClassNames = computed(() => {
    const names = new Set<string>()
    classes.value.forEach(cls => names.add(cls.name))
    return Array.from(names).sort()
  })

  // Get all unique sections
  const allSections = computed(() => {
    const sections = new Set<string>()
    classes.value.forEach(cls => sections.add(cls.section))
    return Array.from(sections).sort()
  })

  // Initialize with real-time listener
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      // Set up real-time listener
      unsubscribe = classesFirebase.subscribeToClasses((updatedClasses) => {
        classes.value = updatedClasses
        loading.value = false
      })

      console.log('✅ Classes store initialized with real-time updates')
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('❌ Failed to initialize classes store:', err)
    }
  }

  // Load all classes (one-time)
  async function loadClasses() {
    try {
      loading.value = true
      error.value = null
      classes.value = await classesFirebase.getAllClasses()
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add new class
  async function addClass(classData: Omit<Class, 'id'>) {
    try {
      loading.value = true
      error.value = null

      // Check if class already exists
      const exists = await classesFirebase.isClassExists(classData.name, classData.section)
      if (exists) {
        throw new Error(`Class ${classData.name}-${classData.section} already exists`)
      }

      const id = await classesFirebase.createClass(classData)

      // Real-time listener will update the list automatically
      loading.value = false
      return id
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Update class
  async function updateClass(id: string, data: Partial<Class>) {
    try {
      loading.value = true
      error.value = null

      // Check if name-section combination exists (if being updated)
      if (data.name || data.section) {
        const cls = classes.value.find(c => c.id === id)
        if (cls) {
          const name = data.name || cls.name
          const section = data.section || cls.section
          const exists = await classesFirebase.isClassExists(name, section, id)
          if (exists) {
            throw new Error(`Class ${name}-${section} already exists`)
          }
        }
      }

      await classesFirebase.updateClass(id, data)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Delete class
  async function deleteClass(id: string) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.deleteClass(id)

      // Real-time listener will update the list automatically
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get class by ID
  function getClassById(id: string | number) {
    return classes.value.find(c => c.id === id)
  }

  // Search classes
  async function searchClasses(query: string) {
    try {
      loading.value = true
      error.value = null

      const results = await classesFirebase.searchClasses(query)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get classes by name
  async function getClassesByName(name: string) {
    try {
      loading.value = true
      error.value = null

      const results = await classesFirebase.getClassesByName(name)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get classes by teacher
  async function getClassesByTeacher(teacherId: number) {
    try {
      loading.value = true
      error.value = null

      const results = await classesFirebase.getClassesByTeacher(teacherId)

      loading.value = false
      return results
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Assign class teacher
  async function assignClassTeacher(classId: string, teacherId: number) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.assignClassTeacher(classId, teacherId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove class teacher
  async function removeClassTeacher(classId: string) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.removeClassTeacher(classId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add student to class
  async function addStudent(classId: string, studentId: number) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.addStudentToClass(classId, studentId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove student from class
  async function removeStudent(classId: string, studentId: number) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.removeStudentFromClass(classId, studentId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Add subject to class
  async function addSubject(classId: string, subjectId: number) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.addSubjectToClass(classId, subjectId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Remove subject from class
  async function removeSubject(classId: string, subjectId: number) {
    try {
      loading.value = true
      error.value = null

      await classesFirebase.removeSubjectFromClass(classId, subjectId)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Bulk create classes
  async function bulkCreateClasses(classesData: Omit<Class, 'id'>[]) {
    try {
      loading.value = true
      error.value = null

      const ids = await classesFirebase.bulkCreateClasses(classesData)

      loading.value = false
      return ids
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Get class statistics
  async function getClassStatistics(classId: string) {
    try {
      return await classesFirebase.getClassStatistics(classId)
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
    const saved = localStorage.getItem('classes')
    if (saved) {
      classes.value = JSON.parse(saved)
    }
  }

  return {
    // State
    classes,
    loading,
    error,
    searchQuery,

    // Computed
    classesByName,
    classesBySection,
    classesWithAvailableSeats,
    classesWithoutTeacher,
    filteredClasses,
    totalClasses,
    totalStudents,
    totalCapacity,
    averageOccupancy,
    allClassNames,
    allSections,

    // Actions
    initialize,
    loadClasses,
    addClass,
    updateClass,
    deleteClass,
    getClassById,
    searchClasses,
    getClassesByName,
    getClassesByTeacher,
    assignClassTeacher,
    removeClassTeacher,
    addStudent,
    removeStudent,
    addSubject,
    removeSubject,
    bulkCreateClasses,
    getClassStatistics,
    setSearchQuery,
    clearError,
    cleanup,
    loadFromLocalStorage
  }
})
