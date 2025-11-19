import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher } from '@/types'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])

  const activeTeachers = computed(() =>
    teachers.value.filter(t => t.status === 'active')
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

  function addTeacher(teacher: Omit<Teacher, 'id'>) {
    const newTeacher = { ...teacher, id: Date.now() }
    teachers.value.push(newTeacher)
    saveToLocalStorage()
  }

  function updateTeacher(id: number, teacher: Partial<Teacher>) {
    const index = teachers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      teachers.value[index] = { ...teachers.value[index], ...teacher } as Teacher
      saveToLocalStorage()
    }
  }

  function deleteTeacher(id: number) {
    teachers.value = teachers.value.filter(t => t.id !== id)
    saveToLocalStorage()
  }

  function getTeacherById(id: number) {
    return teachers.value.find(t => t.id === id)
  }

  function saveToLocalStorage() {
    localStorage.setItem('teachers', JSON.stringify(teachers.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('teachers')
    if (saved) {
      teachers.value = JSON.parse(saved)
    }
  }

  return {
    teachers,
    activeTeachers,
    teachersBySubject,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    loadFromLocalStorage
  }
})
