<template>
  <div>
    <Navbar page-title="Settings" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">School Settings</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold mb-4">School Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <input placeholder="School Name" class="px-4 py-2 border rounded-lg" />
              <input placeholder="Email" class="px-4 py-2 border rounded-lg" />
              <input placeholder="Phone" class="px-4 py-2 border rounded-lg" />
              <input placeholder="Address" class="px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold mb-4">Change Password</h3>
            <div class="grid grid-cols-1 gap-4 max-w-md">
              <input type="password" placeholder="Current Password" class="px-4 py-2 border rounded-lg" />
              <input type="password" placeholder="New Password" class="px-4 py-2 border rounded-lg" />
              <input type="password" placeholder="Confirm Password" class="px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <button class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>
