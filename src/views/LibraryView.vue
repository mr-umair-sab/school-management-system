<template>
  <div>
    <Navbar page-title="Library Management" />

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Total Books" :value="libraryStore.books.length" color="blue">
          <template #icon><span class="text-3xl">📚</span></template>
        </DashboardCard>
        <DashboardCard title="Available Books" :value="libraryStore.availableBooks.length" color="green">
          <template #icon><span class="text-3xl">✅</span></template>
        </DashboardCard>
        <DashboardCard title="Overdue Books" :value="libraryStore.overdueIssues.length" color="red">
          <template #icon><span class="text-3xl">⚠️</span></template>
        </DashboardCard>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Books</h2>
          <button
            @click="showAddBook = true"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add Book
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">Title</th>
                <th class="px-4 py-3 text-left">Author</th>
                <th class="px-4 py-3 text-left">ISBN</th>
                <th class="px-4 py-3 text-left">Category</th>
                <th class="px-4 py-3 text-left">Total</th>
                <th class="px-4 py-3 text-left">Available</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in libraryStore.books" :key="book.id" class="border-t">
                <td class="px-4 py-3">{{ book.title }}</td>
                <td class="px-4 py-3">{{ book.author }}</td>
                <td class="px-4 py-3">{{ book.isbn }}</td>
                <td class="px-4 py-3">{{ book.category }}</td>
                <td class="px-4 py-3">{{ book.quantity }}</td>
                <td class="px-4 py-3">
                  <span :class="book.available > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ book.available }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="issueBookDialog(book)"
                    :disabled="book.available === 0"
                    class="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                  >
                    Issue
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Book Issues</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">Book</th>
                <th class="px-4 py-3 text-left">Student ID</th>
                <th class="px-4 py-3 text-left">Issue Date</th>
                <th class="px-4 py-3 text-left">Due Date</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Fine</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in libraryStore.bookIssues" :key="issue.id" class="border-t">
                <td class="px-4 py-3">{{ getBookTitle(issue.bookId) }}</td>
                <td class="px-4 py-3">{{ issue.studentId }}</td>
                <td class="px-4 py-3">{{ formatDate(issue.issueDate) }}</td>
                <td class="px-4 py-3">{{ formatDate(issue.dueDate) }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(issue.status)">
                    {{ issue.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  {{ issue.fine ? `₹${issue.fine}` : '-' }}
                </td>
                <td class="px-4 py-3">
                  <button
                    v-if="issue.status === 'issued'"
                    @click="returnBook(issue)"
                    class="text-green-500 hover:text-green-700"
                  >
                    Return
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Book</h3>
        <form @submit.prevent="addBook">
          <input v-model="newBook.title" placeholder="Title" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newBook.author" placeholder="Author" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newBook.isbn" placeholder="ISBN" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newBook.category" placeholder="Category" class="w-full mb-3 p-2 border rounded" required />
          <input v-model.number="newBook.quantity" type="number" placeholder="Quantity" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newBook.location" placeholder="Location" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Add</button>
            <button type="button" @click="showAddBook = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useLibraryStore } from '@/stores/library'

const libraryStore = useLibraryStore()
const showAddBook = ref(false)
const newBook = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  quantity: 0,
  location: ''
})

function addBook() {
  libraryStore.addBook({
    ...newBook.value,
    available: newBook.value.quantity
  })
  newBook.value = { title: '', author: '', isbn: '', category: '', quantity: 0, location: '' }
  showAddBook.value = false
}

function issueBookDialog(book: any) {
  const studentId = prompt('Enter Student ID:')
  if (studentId) {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    libraryStore.issueBook({
      bookId: book.id,
      studentId: parseInt(studentId),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0]
    })
  }
}

function returnBook(issue: any) {
  const fine = libraryStore.calculateFine(issue.id)
  libraryStore.returnBook(issue.id, fine)
}

function getBookTitle(bookId: number) {
  const book = libraryStore.books.find(b => b.id === bookId)
  return book ? book.title : 'Unknown'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getStatusClass(status: string) {
  switch (status) {
    case 'issued': return 'text-blue-600'
    case 'returned': return 'text-green-600'
    case 'overdue': return 'text-red-600'
    default: return ''
  }
}
</script>
