<template>
  <div>
    <Navbar page-title="Student Management" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Students List</h2>
          <button @click="showForm = !showForm" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {{ showForm ? 'Cancel' : '+ Add Student' }}
          </button>
        </div>

        <div v-if="showForm" class="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Add New Student</h3>
          <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
            <input v-model="form.name" placeholder="Full Name" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.rollNumber" placeholder="Roll Number" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.class" placeholder="Class" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.section" placeholder="Section" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.email" type="email" placeholder="Email" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.phone" placeholder="Phone" class="px-4 py-2 border rounded-lg" required />
            <button type="submit" class="col-span-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Student
            </button>
          </form>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left">Roll No</th>
                <th class="px-4 py-3 text-left">Name</th>
                <th class="px-4 py-3 text-left">Class</th>
                <th class="px-4 py-3 text-left">Section</th>
                <th class="px-4 py-3 text-left">Email</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in studentsStore.students" :key="student.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ student.rollNumber }}</td>
                <td class="px-4 py-3">{{ student.name }}</td>
                <td class="px-4 py-3">{{ student.class }}</td>
                <td class="px-4 py-3">{{ student.section }}</td>
                <td class="px-4 py-3">{{ student.email }}</td>
                <td class="px-4 py-3">
                  <button @click="studentsStore.deleteStudent(student.id)" class="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useStudentsStore } from '@/stores/students'

const studentsStore = useStudentsStore()
const showForm = ref(false)
const form = ref({
  name: '',
  rollNumber: '',
  class: '',
  section: '',
  email: '',
  phone: ''
})

function handleSubmit() {
  studentsStore.addStudent(form.value)
  form.value = { name: '', rollNumber: '', class: '', section: '', email: '', phone: '' }
  showForm.value = false
}
</script>
