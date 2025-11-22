import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Exam, Result } from '@/types'
import * as examsFirebase from '@/services/examsFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useExamsStore = defineStore('exams', () => {
  const exams = ref<Exam[]>([])
  const results = ref<Result[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let examsUnsubscribe: Unsubscribe | null = null
  let resultsUnsubscribe: Unsubscribe | null = null

  const upcomingExams = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return exams.value.filter(e => e.startDate >= today).sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    )
  })

  const completedExams = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return exams.value.filter(e => e.endDate < today)
  })

  async function initialize() {
    try {
      loading.value = true

      examsUnsubscribe = examsFirebase.subscribeToExams((data) => {
        exams.value = data
      })

      resultsUnsubscribe = examsFirebase.subscribeToResults((data) => {
        results.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize exams store:', err)
    }
  }

  async function addExam(exam: Omit<Exam, 'id'>) {
    try {
      loading.value = true
      await examsFirebase.createExam(exam)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateExam(id: string, exam: Partial<Exam>) {
    try {
      loading.value = true
      await examsFirebase.updateExam(id, exam)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteExam(id: string) {
    try {
      loading.value = true
      await examsFirebase.deleteExam(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function addResult(result: Omit<Result, 'id'>) {
    try {
      loading.value = true
      // Check if result exists for this student and exam
      const existing = results.value.find(
        r => r.examId == result.examId && r.studentId == result.studentId
      )

      if (existing) {
        await examsFirebase.updateResult(existing.id.toString(), result)
      } else {
        await examsFirebase.createResult(result)
      }
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getResultsByStudent(studentId: string | number) {
    return results.value.filter(r => r.studentId == studentId)
  }

  function getResultsByExam(examId: string | number) {
    return results.value.filter(r => r.examId == examId)
  }

  async function calculateRanks(examId: string | number) {
    // This logic might need to be moved to a Cloud Function for scalability,
    // but for now we can do it client-side and update results.
    try {
      loading.value = true
      const examResults = getResultsByExam(examId)
      const sorted = [...examResults].sort((a, b) => b.percentage - a.percentage)

      // Update ranks in Firebase
      // Note: This will trigger multiple writes. In a real app, use a batch write.
      for (let i = 0; i < sorted.length; i++) {
        const result = sorted[i]
        if (result && result.rank !== i + 1) {
          await examsFirebase.updateResult(result.id.toString(), { rank: i + 1 })
        }
      }
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Exams. Use initialize() instead.')
  }

  function cleanup() {
    if (examsUnsubscribe) examsUnsubscribe()
    if (resultsUnsubscribe) resultsUnsubscribe()
  }

  return {
    exams,
    results,
    upcomingExams,
    completedExams,
    loading,
    error,
    initialize,
    addExam,
    updateExam,
    deleteExam,
    addResult,
    getResultsByStudent,
    getResultsByExam,
    calculateRanks,
    loadFromLocalStorage,
    cleanup
  }
})

