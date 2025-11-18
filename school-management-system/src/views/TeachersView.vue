<template>
  <div>
    <Navbar page-title="Teacher Management" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Teachers List</h2>
          <button @click="showForm = !showForm" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {{ showForm ? 'Cancel' : '+ Add Teacher' }}
          </button>
        </div>

        <div v-if="showForm" class="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Add New Teacher</h3>
          <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
            <input v-model="form.name" placeholder="Full Name" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.email" type="email" placeholder="Email" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.phone" placeholder="Phone" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.subject" placeholder="Subject" class="px-4 py-2 border rounded-lg" required />
            <input v-model="form.qualification" placeholder="Qualification" class="px-4 py-2 border rounded-lg" required />
            <button type="submit" class="col-span-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Teacher
            </button>
          </form>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Name</th>
                <th class="px-4 py-3 text-left">Email</th>
                <th class="px-4 py-3 text-left">Phone</th>
                <th class="px-4 py-3 text-left">Subject</th>
                <th class="px-4 py-3 text-left">Qualification</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in teachersStore.teachers" :key="teacher.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ teacher.name }}</td>
                <td class="px-4 py-3">{{ teacher.email }}</td>
                <td class="px-4 py-3">{{ teacher.phone }}</td>
                <td class="px-4 py-3">{{ teacher.subject }}</td>
                <td class="px-4 py-3">{{ teacher.qualification }}</td>
                <td class="px-4 py-3">
                  <button @click="teachersStore.deleteTeacher(teacher.id)" class="text-red-600 hover:text-red-800">
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
import { useTeachersStore } from '@/stores/teachers'

const teachersStore = useTeachersStore()
const showForm = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  qualification: ''
})

function handleSubmit() {
  teachersStore.addTeacher(form.value)
  form.value = { name: '', email: '', phone: '', subject: '', qualification: '' }
  showForm.value = false
}
</script>
