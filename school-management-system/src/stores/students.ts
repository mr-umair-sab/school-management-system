import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Student {
  id: number
  name: string
  rollNumber: string
  class: string
  section: string
  photo?: string
  email: string
  phone: string
}

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([])

  function addStudent(student: Omit<Student, 'id'>) {
    const newStudent = { ...student, id: Date.now() }
    students.value.push(newStudent)
  }

  function updateStudent(id: number, student: Partial<Student>) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...student } as Student
    }
  }

  function deleteStudent(id: number) {
    students.value = students.value.filter(s => s.id !== id)
  }

  return { students, addStudent, updateStudent, deleteStudent }
})
