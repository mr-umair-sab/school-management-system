<template>
  <div>
    <Navbar page-title="Attendance Management" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Mark Attendance</h2>
        
        <div class="mb-6 flex gap-4">
          <select v-model="selectedClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
            <option value="9-A">Class 9-A</option>
          </select>
          <input v-model="selectedDate" type="date" class="px-4 py-2 border rounded-lg" />
        </div>

        <div v-if="selectedClass" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Roll No</th>
                <th class="px-4 py-3 text-left">Student Name</th>
                <th class="px-4 py-3 text-center">Present</th>
                <th class="px-4 py-3 text-center">Absent</th>
                <th class="px-4 py-3 text-center">Leave</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id" class="border-b">
                <td class="px-4 py-3">{{ student.rollNumber }}</td>
                <td class="px-4 py-3">{{ student.name }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">✅</button>
                </td>
                <td class="px-4 py-3 text-center">
                  <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">❌</button>
                </td>
                <td class="px-4 py-3 text-center">
                  <button class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">🟡</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <button class="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useStudentsStore } from '@/stores/students'

const studentsStore = useStudentsStore()
const selectedClass = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])

const filteredStudents = computed(() => {
  return studentsStore.students.filter(s => s.class === selectedClass.value)
})
</script>
