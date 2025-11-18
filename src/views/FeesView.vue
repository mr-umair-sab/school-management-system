<template>
  <div>
    <Navbar page-title="Fee Management" />
    
    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Fee Collection</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-gray-600">Total Collected</p>
            <h3 class="text-2xl font-bold text-green-600">₹8,50,000</h3>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-gray-600">Pending</p>
            <h3 class="text-2xl font-bold text-yellow-600">₹3,50,000</h3>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-gray-600">Total Expected</p>
            <h3 class="text-2xl font-bold text-blue-600">₹12,00,000</h3>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Student</th>
                <th class="px-4 py-3 text-left">Class</th>
                <th class="px-4 py-3 text-left">Amount</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="px-4 py-3">Sample Student</td>
                <td class="px-4 py-3">10-A</td>
                <td class="px-4 py-3">₹25,000</td>
                <td class="px-4 py-3">
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Paid</span>
                </td>
                <td class="px-4 py-3">
                  <button class="text-indigo-600 hover:text-indigo-800">View Receipt</button>
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
import Navbar from '@/components/Navbar.vue'
</script>
