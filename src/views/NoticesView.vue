<template>
  <div>
    <Navbar page-title="Notices & Events" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Notice Board</h2>
          <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + Add Notice
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="p-4 border-l-4 border-indigo-600 bg-indigo-50 rounded">
            <h3 class="font-bold">School Holiday Announcement</h3>
            <p class="text-sm text-gray-600 mt-2">School will remain closed on 20th November for festival.</p>
            <p class="text-xs text-gray-500 mt-2">Posted: 15 Nov 2025</p>
          </div>
          
          <div class="p-4 border-l-4 border-green-600 bg-green-50 rounded">
            <h3 class="font-bold">Parent-Teacher Meeting</h3>
            <p class="text-sm text-gray-600 mt-2">PTM scheduled for 22nd November at 10 AM.</p>
            <p class="text-xs text-gray-500 mt-2">Posted: 14 Nov 2025</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>
