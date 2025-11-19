<template>
  <div>
    <Navbar page-title="Student Portal" />

    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
            {{ studentInfo?.name?.charAt(0) || 'S' }}
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ studentInfo?.name || 'Student' }}</h2>
            <p class="text-gray-600">Class: {{ studentInfo?.class }}-{{ studentInfo?.section }}</p>
            <p class="text-gray-600">Roll No: {{ studentInfo?.rollNumber }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Attendance" :value="`${attendancePercentage}%`" color="green">
          <template #icon><span class="text-3xl">✅</span></template>
        </DashboardCard>
        <DashboardCard title="Pending Fees" :value="`₹${pendingFees}`" color="yellow">
          <template #icon><span class="text-3xl">💰</span></template>
        </DashboardCard>
        <DashboardCard title="Books Issued" :value="booksIssued" color="blue">
          <template #icon><span class="text-3xl">📚</span></template>
        </DashboardCard>
        <DashboardCard title="Upcoming Exams" :value="upcomingExamsCount" color="purple">
          <template #icon><span class="text-3xl">📝</span></template>
        </DashboardCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">My Timetable</h3>
          <div class="space-y-2">
            <div v-for="period in todayTimetable" :key="period.periodNumber"
                 class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div class="font-bold">Period {{ period.periodNumber }}</div>
                <div class="text-sm text-gray-600">{{ getSubjectName(period.subject) }}</div>
              </div>
              <div class="text-right text-sm text-gray-600">
                {{ period.startTime }} - {{ period.endTime }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Recent Results</h3>
          <div class="space-y-3">
            <div v-for="result in myResults" :key="result.id"
                 class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold">{{ getExamName(result.examId) }}</span>
                <span class="text-2xl font-bold" :class="getGradeColor(result.grade)">
                  {{ result.grade }}
                </span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Marks: {{ result.totalMarks }}</span>
                <span>Percentage: {{ result.percentage.toFixed(2) }}%</span>
                <span>Rank: {{ result.rank || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">Library Books</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">Book Title</th>
                <th class="px-4 py-3 text-left">Issue Date</th>
                <th class="px-4 py-3 text-left">Due Date</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Fine</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in myBookIssues" :key="issue.id" class="border-t">
                <td class="px-4 py-3">{{ getBookTitle(issue.bookId) }}</td>
                <td class="px-4 py-3">{{ formatDate(issue.issueDate) }}</td>
                <td class="px-4 py-3">{{ formatDate(issue.dueDate) }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(issue.status)">{{ issue.status }}</span>
                </td>
                <td class="px-4 py-3">{{ issue.fine ? `₹${issue.fine}` : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">Notices & Announcements</h3>
        <div class="space-y-3">
          <div v-for="notice in studentNotices" :key="notice.id"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useStudentsStore } from '@/stores/students'
import { useFeesStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamsStore } from '@/stores/exams'
import { useLibraryStore } from '@/stores/library'
import { useNoticesStore } from '@/stores/notices'
import { useTimetableStore } from '@/stores/timetable'
import { useAuthStore } from '@/stores/auth'

const studentsStore = useStudentsStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const libraryStore = useLibraryStore()
const noticesStore = useNoticesStore()
const timetableStore = useTimetableStore()
const authStore = useAuthStore()

// Mock student ID - in real app, this would come from auth
const studentId = computed(() => authStore.user?.id || 1)

const studentInfo = computed(() => studentsStore.getStudentById(studentId.value))

const attendancePercentage = computed(() =>
  Math.round(attendanceStore.calculateAttendancePercentage(studentId.value, 30))
)

const pendingFees = computed(() => {
  const records = feesStore.getFeeRecordByStudent(studentId.value)
  return records.reduce((sum, r) => sum + r.pendingAmount, 0)
})

const booksIssued = computed(() =>
  libraryStore.getIssuesByStudent(studentId.value).filter(i => i.status === 'issued').length
)

const upcomingExamsCount = computed(() => examsStore.upcomingExams.length)

const myResults = computed(() => examsStore.getResultsByStudent(studentId.value))

const myBookIssues = computed(() => libraryStore.getIssuesByStudent(studentId.value))

const studentNotices = computed(() => noticesStore.getNoticesByRole('student').slice(0, 5))

const todayTimetable = computed(() => {
  if (!studentInfo.value) return []
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const timetables = timetableStore.getTimetableByClass(studentInfo.value.class, studentInfo.value.section)
  const todaySchedule = timetables.find(t => t.day === today)
  return todaySchedule?.periods || []
})

function getExamName(examId: number) {
  const exam = examsStore.exams.find(e => e.id === examId)
  return exam ? exam.name : 'Unknown'
}

function getSubjectName(subjectId: number) {
  const subject = timetableStore.subjects.find(s => s.id === subjectId)
  return subject ? subject.name : 'Unknown'
}

function getBookTitle(bookId: number) {
  const book = libraryStore.books.find(b => b.id === bookId)
  return book ? book.title : 'Unknown'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getGradeColor(grade: string) {
  if (grade === 'A' || grade === 'A+') return 'text-green-600'
  if (grade === 'B' || grade === 'B+') return 'text-blue-600'
  if (grade === 'C') return 'text-yellow-600'
  return 'text-red-600'
}

function getStatusClass(status: string) {
  switch (status) {
    case 'issued': return 'text-blue-600'
    case 'returned': return 'text-green-600'
    case 'overdue': return 'text-red-600'
    default: return ''
  }
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
