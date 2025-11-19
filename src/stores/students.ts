import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student } from '@/types'

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([])

  const activeStudents = computed(() =>
    students.value.filter(s => s.status === 'active')
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

  function addStudent(student: Omit<Student, 'id'>) {
    const newStudent = { ...student, id: Date.now() }
    students.value.push(newStudent)
    saveToLocalStorage()
  }

  function updateStudent(id: number, student: Partial<Student>) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...student } as Student
      saveToLocalStorage()
    }
  }

  function deleteStudent(id: number) {
    students.value = students.value.filter(s => s.id !== id)
    saveToLocalStorage()
  }

  function getStudentById(id: number) {
    return students.value.find(s => s.id === id)
  }

  function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('students')
    if (saved) {
      students.value = JSON.parse(saved)
    }
  }

  return {
    students,
    activeStudents,
    studentsByClass,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    loadFromLocalStorage
  }
})
