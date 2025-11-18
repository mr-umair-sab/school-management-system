<template>
  <div>
    <Navbar page-title="Exams & Results" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Exam Management</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 border rounded-lg">
            <h3 class="text-xl font-bold mb-4">Upcoming Exams</h3>
            <div class="space-y-3">
              <div class="p-3 bg-blue-50 rounded">
                <p class="font-medium">Mid-Term Exam</p>
                <p class="text-sm text-gray-600">Date: 25 Nov 2025</p>
              </div>
              <div class="p-3 bg-blue-50 rounded">
                <p class="font-medium">Final Exam</p>
                <p class="text-sm text-gray-600">Date: 15 Dec 2025</p>
              </div>
            </div>
          </div>

          <div class="p-6 border rounded-lg">
            <h3 class="text-xl font-bold mb-4">Recent Results</h3>
            <div class="space-y-3">
              <div class="p-3 bg-green-50 rounded">
                <p class="font-medium">Unit Test 1</p>
                <p class="text-sm text-gray-600">Average: 78%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>
