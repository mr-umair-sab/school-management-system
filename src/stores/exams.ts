import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Exam, Result } from '@/types'

export const useExamsStore = defineStore('exams', () => {
  const exams = ref<Exam[]>([])
  const results = ref<Result[]>([])

  const upcomingExams = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return exams.value.filter(e => e.startDate >= today).sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    )
  })

  const completedExams = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return exams.value.filter(e => e.endDate < today)
  })

  function addExam(exam: Omit<Exam, 'id'>) {
    exams.value.push({ ...exam, id: Date.now() })
    saveToLocalStorage()
  }

  function updateExam(id: number, exam: Partial<Exam>) {
    const index = exams.value.findIndex(e => e.id === id)
    if (index !== -1) {
      exams.value[index] = { ...exams.value[index], ...exam } as Exam
      saveToLocalStorage()
    }
  }

  function deleteExam(id: number) {
    exams.value = exams.value.filter(e => e.id !== id)
    results.value = results.value.filter(r => r.examId !== id)
    saveToLocalStorage()
  }

  function addResult(result: Omit<Result, 'id'>) {
    const existing = results.value.findIndex(
      r => r.examId === result.examId && r.studentId === result.studentId
    )

    if (existing !== -1) {
      results.value[existing] = { ...result, id: results.value[existing].id }
    } else {
      results.value.push({ ...result, id: Date.now() })
    }
    saveToLocalStorage()
  }

  function getResultsByStudent(studentId: number) {
    return results.value.filter(r => r.studentId === studentId)
  }

  function getResultsByExam(examId: number) {
    return results.value.filter(r => r.examId === examId)
  }

  function calculateRanks(examId: number) {
    const examResults = getResultsByExam(examId)
    const sorted = [...examResults].sort((a, b) => b.percentage - a.percentage)

    sorted.forEach((result, index) => {
      const resultIndex = results.value.findIndex(r => r.id === result.id)
      if (resultIndex !== -1) {
        results.value[resultIndex].rank = index + 1
      }
    })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('exams', JSON.stringify(exams.value))
    localStorage.setItem('results', JSON.stringify(results.value))
  }

  function loadFromLocalStorage() {
    const savedExams = localStorage.getItem('exams')
    const savedResults = localStorage.getItem('results')
    if (savedExams) exams.value = JSON.parse(savedExams)
    if (savedResults) results.value = JSON.parse(savedResults)
  }

  return {
    exams,
    results,
    upcomingExams,
    completedExams,
    addExam,
    updateExam,
    deleteExam,
    addResult,
    getResultsByStudent,
    getResultsByExam,
    calculateRanks,
    loadFromLocalStorage
  }
})
