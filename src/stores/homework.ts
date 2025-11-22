import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Homework } from '@/types'
import * as homeworkFirebase from '@/services/homeworkFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useHomeworkStore = defineStore('homework', () => {
  const homeworks = ref<Homework[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  const pendingHomeworks = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return homeworks.value.filter(h => h.dueDate >= today)
  })

  async function initialize() {
    try {
      loading.value = true

      unsubscribe = homeworkFirebase.subscribeToHomework((data) => {
        homeworks.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize homework store:', err)
    }
  }

  async function addHomework(homework: Omit<Homework, 'id'>) {
    try {
      loading.value = true
      await homeworkFirebase.createHomework(homework)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateHomework(id: string, data: Partial<Homework>) {
    try {
      loading.value = true
      await homeworkFirebase.updateHomework(id, data)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteHomework(id: string) {
    try {
      loading.value = true
      await homeworkFirebase.deleteHomework(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Homework. Use initialize() instead.')
  }

  function cleanup() {
    if (unsubscribe) unsubscribe()
  }

  return {
    homeworks,
    pendingHomeworks,
    loading,
    error,
    initialize,
    addHomework,
    updateHomework,
    deleteHomework,
    loadFromLocalStorage,
    cleanup
  }
})

