import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BookIssue } from '@/types'
import * as libraryFirebase from '@/services/libraryFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>([])
  const bookIssues = ref<BookIssue[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let booksUnsubscribe: Unsubscribe | null = null
  let issuesUnsubscribe: Unsubscribe | null = null

  const availableBooks = computed(() =>
    books.value.filter(b => b.available > 0)
  )

  const overdueIssues = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return bookIssues.value.filter(
      i => i.status === 'issued' && i.dueDate < today
    )
  })

  async function initialize() {
    try {
      loading.value = true

      booksUnsubscribe = libraryFirebase.subscribeToBooks((data) => {
        books.value = data
      })

      issuesUnsubscribe = libraryFirebase.subscribeToBookIssues((data) => {
        bookIssues.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize library store:', err)
    }
  }

  async function addBook(book: Omit<Book, 'id'>) {
    try {
      loading.value = true
      await libraryFirebase.createBook(book)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateBook(id: string, book: Partial<Book>) {
    try {
      loading.value = true
      await libraryFirebase.updateBook(id, book)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteBook(id: string) {
    try {
      loading.value = true
      await libraryFirebase.deleteBook(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function issueBook(issue: Omit<BookIssue, 'id'>) {
    try {
      loading.value = true
      await libraryFirebase.issueBook(issue)
      loading.value = false
      return true
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function returnBook(issueId: string, fine: number = 0) {
    try {
      loading.value = true
      await libraryFirebase.returnBook(issueId, fine)
      loading.value = false
      return true
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getIssuesByStudent(studentId: string | number) {
    return bookIssues.value.filter(i => i.studentId == studentId)
  }

  function calculateFine(issueId: string | number, finePerDay: number = 5) {
    const issue = bookIssues.value.find(i => i.id == issueId)
    if (!issue || issue.status !== 'issued') return 0

    const today = new Date()
    const dueDate = new Date(issue.dueDate)

    if (today <= dueDate) return 0

    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysOverdue * finePerDay
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Library. Use initialize() instead.')
  }

  function cleanup() {
    if (booksUnsubscribe) booksUnsubscribe()
    if (issuesUnsubscribe) issuesUnsubscribe()
  }

  return {
    books,
    bookIssues,
    availableBooks,
    overdueIssues,
    loading,
    error,
    initialize,
    addBook,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
    getIssuesByStudent,
    calculateFine,
    loadFromLocalStorage,
    cleanup
  }
})

