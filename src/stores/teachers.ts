import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Teacher {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  qualification: string
}

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])

  function addTeacher(teacher: Omit<Teacher, 'id'>) {
    const newTeacher = { ...teacher, id: Date.now() }
    teachers.value.push(newTeacher)
  }

  function updateTeacher(id: number, teacher: Partial<Teacher>) {
    const index = teachers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      teachers.value[index] = { ...teachers.value[index], ...teacher } as Teacher
    }
  }

  function deleteTeacher(id: number) {
    teachers.value = teachers.value.filter(t => t.id !== id)
  }

  return { teachers, addTeacher, updateTeacher, deleteTeacher }
})
