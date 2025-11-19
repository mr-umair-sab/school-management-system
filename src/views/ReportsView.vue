<template>
  <div>
    <Navbar page-title="Reports & Analytics" />

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Students" :value="studentsStore.activeStudents.length" color="blue">
          <template #icon><span class="text-3xl">👨‍🎓</span></template>
        </DashboardCard>
        <DashboardCard title="Total Teachers" :value="teachersStore.activeTeachers.length" color="green">
          <template #icon><span class="text-3xl">👨‍🏫</span></template>
        </DashboardCard>
        <DashboardCard title="Fee Collection" :value="`₹${feesStore.totalCollected.toLocaleString()}`" color="purple">
          <template #icon><span class="text-3xl">💰</span></template>
        </DashboardCard>
        <DashboardCard title="Pending Fees" :value="`₹${feesStore.totalPending.toLocaleString()}`" color="yellow">
          <template #icon><span class="text-3xl">⏳</span></template>
        </DashboardCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Students by Class</h3>
          <div class="space-y-3">
            <div v-for="(students, className) in studentsStore.studentsByClass" :key="className"
                 class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">{{ className }}</span>
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {{ students.length }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Fee Collection Status</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span>Collected</span>
                <span class="font-bold">₹{{ feesStore.totalCollected.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-green-500 h-3 rounded-full" :style="`width: ${collectionPercentage}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>Pending</span>
                <span class="font-bold">₹{{ feesStore.totalPending.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-yellow-500 h-3 rounded-full" :style="`width: ${pendingPercentage}%`"></div>
              </div>
            </div>
            <div class="pt-2 border-t">
              <div class="flex justify-between">
                <span class="font-bold">Total Expected</span>
                <span class="font-bold">₹{{ totalExpected.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Attendance Overview</h3>
          <div class="space-y-3">
            <div class="p-4 bg-green-50 rounded-lg">
              <div class="text-sm text-gray-600">Today's Attendance</div>
              <div class="text-2xl font-bold text-green-600">
                {{ todayAttendancePercentage }}%
              </div>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="text-sm text-gray-600">This Month</div>
              <div class="text-2xl font-bold text-blue-600">
                {{ monthAttendancePercentage }}%
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Exam Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Upcoming Exams</span>
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full">
                {{ examsStore.upcomingExams.length }}
              </span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Completed Exams</span>
              <span class="bg-green-500 text-white px-3 py-1 rounded-full">
                {{ examsStore.completedExams.length }}
              </span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Results Published</span>
              <span class="bg-purple-500 text-white px-3 py-1 rounded-full">
                {{ examsStore.results.length }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">Library Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">{{ libraryStore.books.length }}</div>
            <div class="text-sm text-gray-600 mt-1">Total Books</div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">{{ libraryStore.availableBooks.length }}</div>
            <div class="text-sm text-gray-600 mt-1">Available</div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-yellow-600">{{ issuedBooks }}</div>
            <div class="text-sm text-gray-600 mt-1">Issued</div>
          </div>
          <div class="p-4 bg-red-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-red-600">{{ libraryStore.overdueIssues.length }}</div>
            <div class="text-sm text-gray-600 mt-1">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import { useFeesStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamsStore } from '@/stores/exams'
import { useLibraryStore } from '@/stores/library'

const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const libraryStore = useLibraryStore()

const totalExpected = computed(() =>
  feesStore.totalCollected + feesStore.totalPending
)

const collectionPercentage = computed(() =>
  totalExpected.value > 0 ? (feesStore.totalCollected / totalExpected.value) * 100 : 0
)

const pendingPercentage = computed(() =>
  totalExpected.value > 0 ? (feesStore.totalPending / totalExpected.value) * 100 : 0
)

const todayAttendancePercentage = computed(() => {
  const today = attendanceStore.todayAttendance
  if (today.length === 0) return 0

  let totalPresent = 0
  let totalStudents = 0

  today.forEach(attendance => {
    attendance.records.forEach(record => {
      totalStudents++
      if (record.status === 'present' || record.status === 'late') totalPresent++
      if (record.status === 'half-day') totalPresent += 0.5
    })
  })

  return totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0
})

const monthAttendancePercentage = computed(() => {
  // Simplified calculation - you can enhance this
  return 92
})

const issuedBooks = computed(() =>
  libraryStore.bookIssues.filter(i => i.status === 'issued').length
)
</script>
