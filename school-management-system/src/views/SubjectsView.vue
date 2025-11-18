<template>
  <div>
    <Navbar page-title="Subject & Class Management" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Subjects</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="subject in subjects" :key="subject" class="p-4 border rounded-lg hover:shadow-md">
            <h3 class="font-bold text-lg">{{ subject }}</h3>
            <p class="text-sm text-gray-600 mt-2">Classes: 9-12</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'

const subjects = ref(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'])
</script>
