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
        <DashboardCard title="Fee Collection" :value="`RS:${feesStore.totalCollected.toLocaleString()}`" color="purple">
          <template #icon><span class="text-3xl">💰</span></template>
        </DashboardCard>
        <DashboardCard title="Pending Fees" :value="`RS:${feesStore.totalPending.toLocaleString()}`" color="yellow">
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
                <span class="font-bold">RS:{{ feesStore.totalCollected.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-green-500 h-3 rounded-full" :style="`width: ${collectionPercentage}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>Pending</span>
                <span class="font-bold">RS:{{ feesStore.totalPending.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-yellow-500 h-3 rounded-full" :style="`width: ${pendingPercentage}%`"></div>
              </div>
            </div>
            <div class="pt-2 border-t">
              <div class="flex justify-between">
                <span class="font-bold">Total Expected</span>
                <span class="font-bold">RS:{{ totalExpected.toLocaleString() }}</span>
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

      <!-- Communication & Notification Analytics -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h3 class="text-xl font-bold mb-4">📊 Communication & Notification Analytics</h3>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">{{ communicationStats.smsSent }}</div>
            <div class="text-sm text-gray-600 mt-1">SMS Sent (Today)</div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">{{ communicationStats.emailsSent }}</div>
            <div class="text-sm text-gray-600 mt-1">Emails Sent</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-600">{{ communicationStats.pushNotifications }}</div>
            <div class="text-sm text-gray-600 mt-1">Push Notifications</div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-yellow-600">{{ communicationStats.announcements }}</div>
            <div class="text-sm text-gray-600 mt-1">Active Announcements</div>
          </div>
          <div class="p-4 bg-red-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-red-600">{{ communicationStats.unreadMessages }}</div>
            <div class="text-sm text-gray-600 mt-1">Unread Messages</div>
          </div>
          <div class="p-4 bg-indigo-50 rounded-lg text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ communicationStats.deliveryRate }}%</div>
            <div class="text-sm text-gray-600 mt-1">Delivery Rate</div>
          </div>
        </div>

        <!-- Channel Performance -->
        <div class="mb-6">
          <h4 class="font-bold mb-3">📱 Channel Performance Comparison</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2 text-left">Channel</th>
                  <th class="border p-2 text-center">Sent</th>
                  <th class="border p-2 text-center">Delivered</th>
                  <th class="border p-2 text-center">Opened/Read</th>
                  <th class="border p-2 text-center">Success Rate</th>
                  <th class="border p-2 text-center">Avg Response Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="channel in channelPerformance" :key="channel.name" class="hover:bg-gray-50">
                  <td class="border p-2 font-semibold">{{ channel.name }}</td>
                  <td class="border p-2 text-center">{{ channel.sent }}</td>
                  <td class="border p-2 text-center text-green-600 font-bold">{{ channel.delivered }}</td>
                  <td class="border p-2 text-center text-blue-600 font-bold">{{ channel.opened }}</td>
                  <td class="border p-2 text-center">
                    <span :class="channel.successRate >= 90 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                      {{ channel.successRate }}%
                    </span>
                  </td>
                  <td class="border p-2 text-center">{{ channel.avgResponseTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Parent Engagement Metrics -->
        <div class="mb-6">
          <h4 class="font-bold mb-3">👨‍👩‍👧 Parent Engagement Metrics</h4>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ parentEngagement.activeParents }}</div>
              <div class="text-xs text-gray-600">Active Parents ({{ parentEngagement.activePercent }}%)</div>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ parentEngagement.avgReadRate }}%</div>
              <div class="text-xs text-gray-600">Avg Read Rate</div>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ parentEngagement.responseRate }}%</div>
              <div class="text-xs text-gray-600">Response Rate</div>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">{{ parentEngagement.inactiveParents }}</div>
              <div class="text-xs text-gray-600">Inactive Parents</div>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ parentEngagement.avgRating }}/5</div>
              <div class="text-xs text-gray-600">Avg Feedback Rating</div>
            </div>
          </div>
        </div>

        <!-- Message Delivery Trends -->
        <div>
          <h4 class="font-bold mb-3">📈 Message Delivery Trends (Last 6 Months)</h4>
          <div class="space-y-2">
            <div v-for="trend in deliveryTrends" :key="trend.month" class="flex items-center gap-4">
              <span class="text-sm w-20 font-semibold">{{ trend.month }}</span>
              <div class="flex-1 flex gap-1">
                <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${trend.deliveredPercent}%`">
                  {{ trend.delivered }}
                </div>
                <div class="bg-red-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${trend.failedPercent}%`">
                  {{ trend.failed }}
                </div>
              </div>
              <span class="text-sm font-bold w-16">{{ trend.successRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Teacher Communication Activity -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h3 class="text-xl font-bold mb-4">👨‍🏫 Teacher Communication Activity</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2 text-left">Teacher</th>
                <th class="border p-2 text-center">Messages Sent</th>
                <th class="border p-2 text-center">Homework Assigned</th>
                <th class="border p-2 text-center">Study Notes Shared</th>
                <th class="border p-2 text-center">Parent Interactions</th>
                <th class="border p-2 text-center">Response Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in teacherCommunication" :key="teacher.name" class="hover:bg-gray-50">
                <td class="border p-2 font-semibold">{{ teacher.name }}</td>
                <td class="border p-2 text-center">{{ teacher.messagesSent }}</td>
                <td class="border p-2 text-center">{{ teacher.homeworkAssigned }}</td>
                <td class="border p-2 text-center">{{ teacher.notesShared }}</td>
                <td class="border p-2 text-center">{{ teacher.parentInteractions }}</td>
                <td class="border p-2 text-center">
                  <span :class="teacher.responseRate >= 80 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                    {{ teacher.responseRate }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PTM & Feedback Statistics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">👥 PTM Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span>Upcoming PTMs</span>
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full">{{ ptmStats.upcoming }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span>Booked Slots</span>
              <span class="bg-green-500 text-white px-3 py-1 rounded-full">{{ ptmStats.bookedSlots }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span>Available Slots</span>
              <span class="bg-yellow-500 text-white px-3 py-1 rounded-full">{{ ptmStats.availableSlots }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span>Completed This Month</span>
              <span class="bg-purple-500 text-white px-3 py-1 rounded-full">{{ ptmStats.completed }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span>Attendance Rate</span>
              <span class="bg-indigo-500 text-white px-3 py-1 rounded-full">{{ ptmStats.attendanceRate }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📝 Feedback & Complaints</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span>Total Feedback</span>
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full">{{ feedbackStats.total }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span>Pending Review</span>
              <span class="bg-yellow-500 text-white px-3 py-1 rounded-full">{{ feedbackStats.pending }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span>Resolved</span>
              <span class="bg-green-500 text-white px-3 py-1 rounded-full">{{ feedbackStats.resolved }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span>Complaints</span>
              <span class="bg-red-500 text-white px-3 py-1 rounded-full">{{ feedbackStats.complaints }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span>Average Rating</span>
              <span class="bg-purple-500 text-white px-3 py-1 rounded-full">{{ feedbackStats.avgRating }}/5 ⭐</span>
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

// Communication & Notification Statistics
const communicationStats = {
  smsSent: 345,
  emailsSent: 156,
  pushNotifications: 892,
  announcements: 18,
  unreadMessages: 47,
  deliveryRate: 98
}

// Channel Performance Data
const channelPerformance = [
  { name: 'SMS', sent: 2450, delivered: 2401, opened: 2156, successRate: 98, avgResponseTime: '2 mins' },
  { name: 'Email', sent: 1200, delivered: 1156, opened: 892, successRate: 96, avgResponseTime: '15 mins' },
  { name: 'Push Notification', sent: 3200, delivered: 3180, opened: 2890, successRate: 99, avgResponseTime: '1 min' },
  { name: 'WhatsApp', sent: 890, delivered: 885, opened: 820, successRate: 99, avgResponseTime: '3 mins' },
  { name: 'In-App Message', sent: 1560, delivered: 1545, opened: 1420, successRate: 99, avgResponseTime: '5 mins' }
]

// Parent Engagement Metrics
const parentEngagement = {
  activeParents: 387,
  activePercent: 86,
  avgReadRate: 94,
  responseRate: 78,
  inactiveParents: 63,
  avgRating: 4.2
}

// Message Delivery Trends
const deliveryTrends = [
  { month: 'Jun 2024', delivered: 1250, failed: 50, deliveredPercent: 96, failedPercent: 4, successRate: 96 },
  { month: 'Jul 2024', delivered: 1380, failed: 20, deliveredPercent: 98, failedPercent: 2, successRate: 98 },
  { month: 'Aug 2024', delivered: 1420, failed: 15, deliveredPercent: 99, failedPercent: 1, successRate: 99 },
  { month: 'Sep 2024', delivered: 1560, failed: 25, deliveredPercent: 98, failedPercent: 2, successRate: 98 },
  { month: 'Oct 2024', delivered: 1680, failed: 18, deliveredPercent: 99, failedPercent: 1, successRate: 99 },
  { month: 'Nov 2024', delivered: 1820, failed: 12, deliveredPercent: 99, failedPercent: 1, successRate: 99 }
]

// Teacher Communication Activity
const teacherCommunication = [
  { name: 'Ms. Sarah Ahmed', messagesSent: 145, homeworkAssigned: 34, notesShared: 28, parentInteractions: 67, responseRate: 92 },
  { name: 'Mr. Ali Khan', messagesSent: 132, homeworkAssigned: 29, notesShared: 25, parentInteractions: 54, responseRate: 88 },
  { name: 'Ms. Fatima Hassan', messagesSent: 156, homeworkAssigned: 38, notesShared: 31, parentInteractions: 72, responseRate: 95 },
  { name: 'Mr. Ahmed Raza', messagesSent: 128, homeworkAssigned: 27, notesShared: 22, parentInteractions: 49, responseRate: 85 },
  { name: 'Ms. Ayesha Malik', messagesSent: 167, homeworkAssigned: 42, notesShared: 35, parentInteractions: 78, responseRate: 96 },
  { name: 'Mr. Hassan Ali', messagesSent: 119, homeworkAssigned: 25, notesShared: 19, parentInteractions: 45, responseRate: 82 },
  { name: 'Ms. Zainab Noor', messagesSent: 142, homeworkAssigned: 31, notesShared: 27, parentInteractions: 61, responseRate: 90 },
  { name: 'Mr. Usman Tariq', messagesSent: 135, homeworkAssigned: 28, notesShared: 24, parentInteractions: 56, responseRate: 87 }
]

// PTM Statistics
const ptmStats = {
  upcoming: 3,
  bookedSlots: 67,
  availableSlots: 23,
  completed: 12,
  attendanceRate: 89
}

// Feedback Statistics
const feedbackStats = {
  total: 234,
  pending: 28,
  resolved: 198,
  complaints: 45,
  avgRating: 4.2
}
</script>
