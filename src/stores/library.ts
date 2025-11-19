import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BookIssue } from '@/types'

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>([])
  const bookIssues = ref<BookIssue[]>([])

  const availableBooks = computed(() =>
    books.value.filter(b => b.available > 0)
  )

  const overdueIssues = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookIssues.value.filter(
      i => i.status === 'issued' && i.dueDate < today
    )
  })

  function addBook(book: Omit<Book, 'id'>) {
    books.value.push({ ...book, id: Date.now() })
    saveToLocalStorage()
  }

  function updateBook(id: number, book: Partial<Book>) {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...book } as Book
      saveToLocalStorage()
    }
  }

  function issueBook(issue: Omit<BookIssue, 'id'>) {
    const book = books.value.find(b => b.id === issue.bookId)
    if (book && book.available > 0) {
      book.available--
      bookIssues.value.push({ ...issue, id: Date.now(), status: 'issued' })
      saveToLocalStorage()
      return true
    }
    return false
  }

  function returnBook(issueId: number, fine: number = 0) {
    const issue = bookIssues.value.find(i => i.id === issueId)
    if (issue) {
      issue.returnDate = new Date().toISOString().split('T')[0]
      issue.status = 'returned'
      issue.fine = fine

      const book = books.value.find(b => b.id === issue.bookId)
      if (book) book.available++

      saveToLocalStorage()
      return true
    }
    return false
  }

  function getIssuesByStudent(studentId: number) {
    return bookIssues.value.filter(i => i.studentId === studentId)
  }

  function calculateFine(issueId: number, finePerDay: number = 5) {
    const issue = bookIssues.value.find(i => i.id === issueId)
    if (!issue || issue.status !== 'issued') return 0

    const today = new Date()
    const dueDate = new Date(issue.dueDate)

    if (today <= dueDate) return 0

    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysOverdue * finePerDay
  }

  function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books.value))
    localStorage.setItem('bookIssues', JSON.stringify(bookIssues.value))
  }

  function loadFromLocalStorage() {
    const savedBooks = localStorage.getItem('books')
    const savedIssues = localStorage.getItem('bookIssues')
    if (savedBooks) books.value = JSON.parse(savedBooks)
    if (savedIssues) bookIssues.value = JSON.parse(savedIssues)
  }

  return {
    books,
    bookIssues,
    availableBooks,
    overdueIssues,
    addBook,
    updateBook,
    issueBook,
    returnBook,
    getIssuesByStudent,
    calculateFine,
    loadFromLocalStorage
  }
})
