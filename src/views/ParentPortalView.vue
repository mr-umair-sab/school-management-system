<template>
  <div>
    <Navbar page-title="Parent Portal" />

    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4">My Children</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="student in myChildren" :key="student.id"
               class="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
               @click="selectedStudent = student">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                {{ student.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ student.name }}</h3>
                <p class="text-gray-600">Class: {{ student.class }}-{{ student.section }}</p>
                <p class="text-gray-600">Roll No: {{ student.rollNumber }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedStudent" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Attendance" :value="`${getAttendancePercentage(selectedStudent.id)}%`" color="green">
            <template #icon><span class="text-3xl">✅</span></template>
          </DashboardCard>
          <DashboardCard title="Fee Status" :value="getFeeStatus(selectedStudent.id)" color="blue">
            <template #icon><span class="text-3xl">💰</span></template>
          </DashboardCard>
          <DashboardCard title="Pending Amount" :value="`RS:${getPendingFees(selectedStudent.id)}`" color="yellow">
            <template #icon><span class="text-3xl">⏳</span></template>
          </DashboardCard>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Recent Results</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left">Exam</th>
                  <th class="px-4 py-3 text-left">Total Marks</th>
                  <th class="px-4 py-3 text-left">Percentage</th>
                  <th class="px-4 py-3 text-left">Grade</th>
                  <th class="px-4 py-3 text-left">Rank</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in getStudentResults(selectedStudent.id)" :key="result.id" class="border-t">
                  <td class="px-4 py-3">{{ getExamName(result.examId) }}</td>
                  <td class="px-4 py-3">{{ result.totalMarks }}</td>
                  <td class="px-4 py-3">{{ result.percentage.toFixed(2) }}%</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded bg-blue-100 text-blue-800">{{ result.grade }}</span>
                  </td>
                  <td class="px-4 py-3">{{ result.rank || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Notices & Announcements</h3>
          <div class="space-y-3">
            <div v-for="notice in parentNotices" :key="notice.id"
                 class="p-4 border-l-4 rounded"
                 :class="getPriorityClass(notice.priority)">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold">{{ notice.title }}</h4>
                  <p class="text-gray-600 mt-1">{{ notice.content }}</p>
                </div>
                <span class="text-sm text-gray-500">{{ formatDate(notice.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Upcoming Events</h3>
          <div class="space-y-3">
            <div v-for="event in upcomingEvents" :key="event.id"
                 class="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <h4 class="font-bold">{{ event.title }}</h4>
                <p class="text-gray-600 text-sm">{{ event.description }}</p>
                <p class="text-gray-500 text-sm mt-1">{{ event.venue }} • {{ event.startTime }}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-blue-600">{{ formatDate(event.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useStudentsStore } from '@/stores/students'
import { useFeesStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamsStore } from '@/stores/exams'
import { useNoticesStore } from '@/stores/notices'
import { useAuthStore } from '@/stores/auth'

const studentsStore = useStudentsStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const noticesStore = useNoticesStore()
const authStore = useAuthStore()

const selectedStudent = ref<any>(null)

// Mock data - in real app, this would come from parent's linked students
const myChildren = computed(() => studentsStore.students.slice(0, 2))

const parentNotices = computed(() =>
  noticesStore.getNoticesByRole('parent').slice(0, 5)
)

const upcomingEvents = computed(() =>
  noticesStore.upcomingEvents.slice(0, 5)
)

function getAttendancePercentage(studentId: number) {
  return Math.round(attendanceStore.calculateAttendancePercentage(studentId, 30))
}

function getFeeStatus(studentId: number) {
  const records = feesStore.getFeeRecordByStudent(studentId)
  if (records.length === 0) return 'N/A'
  const latest = records[records.length - 1]
  return latest.status.toUpperCase()
}

function getPendingFees(studentId: number) {
  const records = feesStore.getFeeRecordByStudent(studentId)
  if (records.length === 0) return 0
  return records.reduce((sum, r) => sum + r.pendingAmount, 0)
}

function getStudentResults(studentId: number) {
  return examsStore.getResultsByStudent(studentId)
}

function getExamName(examId: number) {
  const exam = examsStore.exams.find(e => e.id === examId)
  return exam ? exam.name : 'Unknown'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50'
    case 'high': return 'border-orange-500 bg-orange-50'
    case 'medium': return 'border-yellow-500 bg-yellow-50'
    default: return 'border-blue-500 bg-blue-50'
  }
}
</script>
