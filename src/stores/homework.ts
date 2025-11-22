import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Homework {
  id: number
  title: string
  description: string
  subject: string
  class: string
  section: string
  teacherId: number
  assignedDate: string
  dueDate: string
  totalMarks: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export const useHomeworkStore = defineStore('homework', () => {
  const homeworks = ref<Homework[]>([])

  const pendingHomeworks = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return homeworks.value.filter(h => h.dueDate >= today)
  })

  function addHomework(homework: Omit<Homework, 'id'>) {
    homeworks.value.push({ ...homework, id: Date.now() })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('homeworks', JSON.stringify(homeworks.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('homeworks')
    if (saved) homeworks.value = JSON.parse(saved)
  }

  return {
    homeworks,
    pendingHomeworks,
    addHomework,
    loadFromLocalStorage
  }
})
