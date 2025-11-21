<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Student Portal" />
    <div class="p-6">
      <!-- Student Profile Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-bold">
              {{ studentName.charAt(0) }}
            </div>
            <div>
              <h2 class="text-3xl font-bold">{{ studentName }}</h2>
              <p class="text-gray-600">Class: {{ studentClass }} | Roll No: {{ rollNumber }}</p>
              <p class="text-gray-600">GR No: {{ grNumber }}</p>
            </div>
          </div>
          <button @click="downloadIDCard" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            🎫 Download ID Card
          </button>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">✅</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ attendancePercentage }}%</h3>
          <p class="text-sm opacity-80">Attendance</p>
        </div>

        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ lastExamPercentage }}%</h3>
          <p class="text-sm opacity-80">Last Exam</p>
        </div>

        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">💰</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">₹{{ pendingFees }}</h3>
          <p class="text-sm opacity-80">Pending Fees</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📚</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ pendingHomework }}</h3>
          <p class="text-sm opacity-80">Pending Homework</p>
        </div>

        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🏆</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ classRank }}</h3>
          <p class="text-sm opacity-80">Class Rank</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-2 border-b overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
            class="px-4 py-2 font-semibold whitespace-nowrap text-sm"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Today's Classes -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📅 Today's Classes</h3>
          <div class="space-y-3">
            <div v-for="period in todayClasses" :key="period.id"
                 class="p-4 border-2 rounded-lg flex justify-between items-center"
                 :class="period.isNow ? 'border-green-500 bg-green-50' : 'border-gray-200'">
              <div>
                <p class="font-bold">{{ period.subject }}</p>
                <p class="text-sm text-gray-600">{{ period.teacher }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ period.time }}</p>
                <p v-if="period.isNow" class="text-xs text-green-600 font-bold">● LIVE NOW</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="font-bold mb-4">📈 Performance Trend</h3>
            <div class="space-y-2">
              <div v-for="exam in performanceTrend" :key="exam.name" class="flex items-center gap-4">
                <span class="text-sm w-24">{{ exam.name }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8">
                  <div class="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${exam.percentage}%`">
                    {{ exam.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="font-bold mb-4">🔔 Recent Alerts</h3>
            <div class="space-y-2">
              <div v-for="alert in recentAlerts" :key="alert.id"
                   :class="getAlertClass(alert.type)"
                   class="p-3 rounded text-sm">
                {{ alert.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timetable Tab -->
      <div v-if="activeTab === 'timetable'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📅 My Timetable</h2>
          <div class="flex gap-2">
            <button @click="timetableView = 'weekly'"
                    :class="timetableView === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                    class="px-4 py-2 rounded-lg">Weekly</button>
            <button @click="timetableView = 'daily'"
                    :class="timetableView === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                    class="px-4 py-2 rounded-lg">Daily</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-indigo-600 text-white">
              <tr>
                <th class="border p-3">Time</th>
                <th v-for="day in weekDays" :key="day" class="border p-3">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="period in timetablePeriods" :key="period.time">
                <td class="border p-3 font-semibold bg-gray-100">{{ period.time }}</td>
                <td v-for="day in weekDays" :key="day" class="border p-3 text-center">
                  <div v-if="(period as Record<string, unknown>)[day.toLowerCase()]" class="p-2 bg-blue-100 rounded">
                    <p class="font-semibold text-sm">{{ ((period as Record<string, unknown>)[day.toLowerCase()] as Record<string, string>).subject }}</p>
                    <p class="text-xs text-gray-600">{{ ((period as Record<string, unknown>)[day.toLowerCase()] as Record<string, string>).teacher }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance Tab -->
      <div v-if="activeTab === 'attendance'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">✅ My Attendance</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Present Days</h3>
            <p class="text-3xl font-bold text-green-600">{{ presentDays }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Absent Days</h3>
            <p class="text-3xl font-bold text-red-600">{{ absentDays }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Leave Days</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ leaveDays }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Attendance %</h3>
            <p class="text-3xl font-bold text-blue-600">{{ attendancePercentage }}%</p>
          </div>
        </div>

        <!-- Monthly Calendar -->
        <div class="border-2 rounded-lg p-4 mb-6">
          <h3 class="font-bold mb-4">📅 Monthly Attendance Calendar</h3>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                 class="text-center font-bold text-sm p-2">
              {{ day }}
            </div>
            <div v-for="date in attendanceCalendar" :key="date.date"
                 :class="getAttendanceClass(date.status)"
                 class="text-center p-2 rounded">
              {{ date.day }}
            </div>
          </div>
        </div>

        <!-- Subject-wise Attendance -->
        <div>
          <h3 class="font-bold mb-4">📚 Subject-wise Attendance</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-3 text-left">Subject</th>
                  <th class="border p-3 text-center">Total Classes</th>
                  <th class="border p-3 text-center">Present</th>
                  <th class="border p-3 text-center">Absent</th>
                  <th class="border p-3 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in subjectAttendance" :key="subject.name" class="hover:bg-gray-50">
                  <td class="border p-3 font-semibold">{{ subject.name }}</td>
                  <td class="border p-3 text-center">{{ subject.total }}</td>
                  <td class="border p-3 text-center text-green-600 font-bold">{{ subject.present }}</td>
                  <td class="border p-3 text-center text-red-600 font-bold">{{ subject.absent }}</td>
                  <td class="border p-3 text-center">
                    <span :class="subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                      {{ subject.percentage }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Homework Tab -->
      <div v-if="activeTab === 'homework'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📚 Homework & Assignments</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Pending</h3>
            <p class="text-3xl font-bold text-red-600">{{ pendingHomework }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Completed</h3>
            <p class="text-3xl font-bold text-green-600">{{ completedHomework }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Overdue</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ overdueHomework }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="hw in homeworkList" :key="hw.id"
               class="p-4 border-2 rounded-lg"
               :class="hw.status === 'pending' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold">{{ hw.subject }}</h3>
                <p class="text-sm text-gray-600">{{ hw.title }}</p>
              </div>
              <span :class="getHomeworkStatusBadge(hw.status)" class="px-2 py-1 rounded-full text-xs">
                {{ hw.status }}
              </span>
            </div>
            <p class="text-sm mb-2">{{ hw.description }}</p>
            <div class="flex justify-between items-center text-sm">
              <span>Due: {{ hw.dueDate }}</span>
              <div class="flex gap-2">
                <button v-if="hw.hasFile" @click="downloadHomework(hw)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                  📥 Download
                </button>
                <button v-if="hw.status === 'pending'" @click="submitHomework(hw)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                  ✅ Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Tab -->
      <div v-if="activeTab === 'results'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📊 My Results</h2>
          <button @click="downloadReportCard" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📥 Download Report Card
          </button>
        </div>

        <div v-for="exam in examResults" :key="exam.id" class="mb-6 border-2 rounded-lg p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold">{{ exam.examName }}</h3>
              <p class="text-gray-600">{{ exam.term }} - {{ exam.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-blue-600">{{ exam.percentage }}%</p>
              <p class="text-sm text-gray-600">Grade: {{ exam.grade }}</p>
              <p class="text-sm text-gray-600">Rank: {{ exam.rank }}/{{ exam.totalStudents }}</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-3 text-left">Subject</th>
                  <th class="border p-3 text-center">Marks Obtained</th>
                  <th class="border p-3 text-center">Total Marks</th>
                  <th class="border p-3 text-center">Percentage</th>
                  <th class="border p-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in exam.subjects" :key="subject.name" class="hover:bg-gray-50">
                  <td class="border p-3 font-semibold">{{ subject.name }}</td>
                  <td class="border p-3 text-center">{{ subject.obtained }}</td>
                  <td class="border p-3 text-center">{{ subject.total }}</td>
                  <td class="border p-3 text-center">{{ subject.percentage }}%</td>
                  <td class="border p-3 text-center">
                    <span :class="getGradeClass(subject.grade)" class="px-2 py-1 rounded-full text-xs">
                      {{ subject.grade }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📖 Subject Notes & Materials</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="note in studyNotes" :key="note.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-2xl">
                {{ getContentIcon(note.type) }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ note.title }}</h3>
                <p class="text-sm text-gray-600">{{ note.subject }} - {{ note.chapter }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span>Type:</span>
                <span class="font-semibold">{{ note.type }}</span>
              </div>
              <div class="flex justify-between">
                <span>Size:</span>
                <span class="font-semibold">{{ note.size }}</span>
              </div>
              <div class="flex justify-between">
                <span>Uploaded:</span>
                <span class="font-semibold">{{ note.uploadDate }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewNote(note)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                👁️ View
              </button>
              <button @click="downloadNote(note)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fees Tab -->
      <div v-if="activeTab === 'fees'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">💰 Fee Status</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Total Paid</h3>
            <p class="text-2xl font-bold text-green-600">₹{{ totalPaidFees.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Pending Amount</h3>
            <p class="text-2xl font-bold text-red-600">₹{{ pendingFees.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Next Due Date</h3>
            <p class="text-2xl font-bold text-yellow-600">{{ nextDueDate }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Month</th>
                <th class="border p-3 text-left">Fee Type</th>
                <th class="border p-3 text-center">Amount</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in feeHistory" :key="fee.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ fee.month }}</td>
                <td class="border p-3">{{ fee.type }}</td>
                <td class="border p-3 text-center font-bold">₹{{ fee.amount }}</td>
                <td class="border p-3 text-center">
                  <span :class="getFeeStatusBadge(fee.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ fee.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    📥 Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Announcements Tab -->
      <div v-if="activeTab === 'announcements'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📢 School Announcements</h2>

        <div class="space-y-4">
          <div v-for="announcement in announcements" :key="announcement.id"
               class="p-4 border-l-4 rounded"
               :class="getAnnouncementClass(announcement.priority)">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold">{{ announcement.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ announcement.content }}</p>
              </div>
              <span class="text-sm text-gray-500">{{ announcement.date }}</span>
            </div>
            <div v-if="announcement.hasAttachment" class="mt-2">
              <button @click="downloadAnnouncement(announcement)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                📎 Download Attachment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'

// Active tab
const activeTab = ref('dashboard')

// Tabs
const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'timetable', label: '📅 Timetable' },
  { id: 'attendance', label: '✅ Attendance' },
  { id: 'homework', label: '📚 Homework' },
  { id: 'results', label: '📊 Results' },
  { id: 'notes', label: '📖 Notes' },
  { id: 'fees', label: '💰 Fees' },
  { id: 'announcements', label: '📢 Announcements' }
]

// Student Data
const studentName = ref('Ahmed Ali')
const studentClass = ref('Class 10-A')
const rollNumber = ref('STD001')
const grNumber = ref('GR-2024-001')

// Dashboard Stats
const attendancePercentage = ref(92)
const lastExamPercentage = ref(85)
const pendingFees = ref(5000)
const pendingHomework = ref(3)
const classRank = ref(5)

// Today's Classes
const todayClasses = ref([
  { id: 1, subject: 'Mathematics', teacher: 'Mr. Khan', time: '8:00-9:00 AM', isNow: false },
  { id: 2, subject: 'English', teacher: 'Ms. Sara', time: '9:00-10:00 AM', isNow: true },
  { id: 3, subject: 'Science', teacher: 'Mr. Ali', time: '10:00-11:00 AM', isNow: false }
])

// Performance Trend
const performanceTrend = ref([
  { name: 'Mid-Term', percentage: 78 },
  { name: 'Monthly', percentage: 82 },
  { name: 'Final', percentage: 85 }
])

// Recent Alerts
const recentAlerts = ref([
  { id: 1, type: 'warning', message: 'Fee payment due on 5th December' },
  { id: 2, type: 'info', message: 'Parent-Teacher meeting on 10th December' },
  { id: 3, type: 'success', message: 'Excellent performance in Math exam!' }
])

const getAlertClass = (type: string) => {
  const classes: Record<string, string> = {
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800'
  }
  return classes[type] || 'bg-gray-100'
}

// Timetable
const timetableView = ref('weekly')
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timetablePeriods = ref([
  {
    time: '8:00-9:00',
    monday: { subject: 'Math', teacher: 'Mr. Khan' },
    tuesday: { subject: 'English', teacher: 'Ms. Sara' },
    wednesday: { subject: 'Science', teacher: 'Mr. Ali' },
    thursday: { subject: 'Urdu', teacher: 'Ms. Fatima' },
    friday: { subject: 'Math', teacher: 'Mr. Khan' }
  }
])

// Attendance
const presentDays = ref(22)
const absentDays = ref(2)
const leaveDays = ref(1)
const attendanceCalendar = ref([
  { date: 1, day: 1, status: 'present' },
  { date: 2, day: 2, status: 'present' },
  { date: 3, day: 3, status: 'absent' }
])

const getAttendanceClass = (status: string) => {
  const classes: Record<string, string> = {
    present: 'bg-green-500 text-white',
    absent: 'bg-red-500 text-white',
    leave: 'bg-yellow-500 text-white',
    holiday: 'bg-gray-300'
  }
  return classes[status] || 'bg-gray-100'
}

const subjectAttendance = ref([
  { name: 'Mathematics', total: 25, present: 23, absent: 2, percentage: 92 },
  { name: 'English', total: 25, present: 24, absent: 1, percentage: 96 }
])

// Homework
const completedHomework = ref(15)
const overdueHomework = ref(1)
const homeworkList = ref([
  { id: 1, subject: 'Mathematics', title: 'Chapter 5 Exercise', description: 'Complete all questions', dueDate: '25 Nov 2024', status: 'pending', hasFile: true },
  { id: 2, subject: 'English', title: 'Essay Writing', description: 'Write essay on "My School"', dueDate: '22 Nov 2024', status: 'submitted', hasFile: false }
])

const getHomeworkStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    pending: 'bg-red-100 text-red-700',
    submitted: 'bg-green-100 text-green-700'
  }
  return badges[status] || 'bg-gray-100'
}

const downloadHomework = (hw: Record<string, unknown>) => {
  console.log('Downloading homework:', hw)
}

const submitHomework = (hw: Record<string, unknown>) => {
  console.log('Submitting homework:', hw)
}

// Results
const examResults = ref([
  {
    id: 1,
    examName: 'Final Term',
    term: 'Term 2',
    date: 'Nov 2024',
    percentage: 85,
    grade: 'A',
    rank: 5,
    totalStudents: 45,
    subjects: [
      { name: 'Math', obtained: 85, total: 100, percentage: 85, grade: 'A' },
      { name: 'English', obtained: 88, total: 100, percentage: 88, grade: 'A' }
    ]
  }
])

const getGradeClass = (grade: string) => {
  const classes: Record<string, string> = {
    'A+': 'bg-green-100 text-green-700',
    'A': 'bg-blue-100 text-blue-700',
    'B': 'bg-yellow-100 text-yellow-700'
  }
  return classes[grade] || 'bg-gray-100'
}

const downloadReportCard = () => {
  console.log('Downloading report card')
}

// Notes
const studyNotes = ref([
  { id: 1, title: 'Calculus Notes', subject: 'Mathematics', chapter: 'Chapter 5', type: 'PDF', size: '2.5 MB', uploadDate: '2024-11-01' }
])

const getContentIcon = (type: string) => {
  const icons: Record<string, string> = {
    PDF: '📄',
    Video: '🎥',
    PPT: '📊'
  }
  return icons[type] || '📁'
}

const viewNote = (note: Record<string, unknown>) => {
  console.log('Viewing note:', note)
}

const downloadNote = (note: Record<string, unknown>) => {
  console.log('Downloading note:', note)
}

// Fees
const totalPaidFees = ref(45000)
const nextDueDate = ref('5th Dec 2024')
const feeHistory = ref([
  { id: 1, month: 'November 2024', type: 'Monthly Fee', amount: 5000, status: 'paid' },
  { id: 2, month: 'December 2024', type: 'Monthly Fee', amount: 5000, status: 'pending' }
])

const getFeeStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700'
  }
  return badges[status] || 'bg-gray-100'
}

// Announcements
const announcements = ref([
  { id: 1, title: 'Holiday Notice', content: 'School will remain closed on 25th December', date: '20 Nov 2024', priority: 'high', hasAttachment: false },
  { id: 2, title: 'Exam Schedule', content: 'Final exams will start from 1st December', date: '18 Nov 2024', priority: 'urgent', hasAttachment: true }
])

const getAnnouncementClass = (priority: string) => {
  const classes: Record<string, string> = {
    urgent: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50'
  }
  return classes[priority] || 'border-blue-500 bg-blue-50'
}

const downloadAnnouncement = (announcement: Record<string, unknown>) => {
  console.log('Downloading announcement:', announcement)
}

const downloadIDCard = () => {
  console.log('Downloading ID card')
}
</script>
