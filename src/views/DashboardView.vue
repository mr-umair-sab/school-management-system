<template>
  <div>
    <Navbar page-title="Dashboard" />
    
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Students" :value="studentsStore.students.length" color="blue">
          <template #icon>
            <span class="text-3xl">👨‍🎓</span>
          </template>
        </DashboardCard>
        
        <DashboardCard title="Total Teachers" :value="teachersStore.teachers.length" color="green">
          <template #icon>
            <span class="text-3xl">👨‍🏫</span>
          </template>
        </DashboardCard>
        
        <DashboardCard title="Total Classes" :value="12" color="purple">
          <template #icon>
            <span class="text-3xl">📚</span>
          </template>
        </DashboardCard>
        
        <DashboardCard title="Attendance Today" :value="'95%'" color="yellow">
          <template #icon>
            <span class="text-3xl">✅</span>
          </template>
        </DashboardCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span>📝</span>
              <div>
                <p class="font-medium">New student enrolled</p>
                <p class="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span>✅</span>
              <div>
                <p class="font-medium">Attendance marked for Class 10-A</p>
                <p class="text-sm text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Fee Summary</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span>Collected</span>
                <span class="font-bold">RS:85,000</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 70%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>Pending</span>
                <span class="font-bold">RS:35,000</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 30%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import Navbar from '@/components/Navbar.vue'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'

const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
</script>
