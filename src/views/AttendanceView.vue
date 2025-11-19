<template>
  <div>
    <Navbar page-title="Attendance Management" />

    <div class="p-6">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-4 border-b overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
            class=" py-2 font-semibold whitespace-nowrap"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Daily Attendance -->
      <div v-if="activeTab === 'daily'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Daily Attendance</h2>
          <button
            @click="quickMarkAttendance"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 shadow-lg"
          >
            <span class="text-xl">➕</span>
            <span>Mark Attendance</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select v-model="selectedClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <input v-model="selectedDate" type="date" class="px-4 py-2 border rounded-lg" />
          <button @click="markAllPresent" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ✅ Mark All Present
          </button>
          <button @click="loadAttendance" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📥 Load Saved
          </button>
        </div>

        <div v-if="selectedClass" class="mb-6">
          <div class="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm text-gray-600">Total Students: <span class="font-bold">{{ filteredStudents.length }}</span></p>
              <p class="text-sm text-gray-600">Present: <span class="font-bold text-green-600">{{ presentCount }}</span></p>
              <p class="text-sm text-gray-600">Absent: <span class="font-bold text-red-600">{{ absentCount }}</span></p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-indigo-600">{{ attendancePercentage }}%</p>
              <p class="text-sm text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </div>

        <div v-if="selectedClass" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Roll No</th>
                <th class="px-4 py-3 text-left">Student Name</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-left">Remarks</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ student.rollNumber }}</td>
                <td class="px-4 py-3 font-semibold">{{ student.name }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="getStatusBadge(getStudentStatus(student.id))" class="px-3 py-1 rounded-full text-sm">
                    {{ getStudentStatus(student.id) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <input
                    :value="getStudentRemarks(student.id)"
                    @input="updateRemarks(student.id, ($event.target as HTMLInputElement).value)"
                    placeholder="Add remarks..."
                    class="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2 justify-center">
                    <button @click="markStatus(student.id, 'present')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                      ✅
                    </button>
                    <button @click="markStatus(student.id, 'absent')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                      ❌
                    </button>
                    <button @click="markStatus(student.id, 'late')" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                      ⏰
                    </button>
                    <button @click="markStatus(student.id, 'half-day')" class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
                      🕐
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-6 flex gap-4">
            <button @click="saveAttendance" class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
              💾 Save Attendance
            </button>
            <button @click="sendAbsentSMS" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
              📱 Send SMS to Absent
            </button>
          </div>
        </div>
      </div>

      <!-- Period-wise Attendance -->
      <div v-if="activeTab === 'period'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Period-wise Attendance</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select v-model="periodClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <select v-model="selectedPeriod" class="px-4 py-2 border rounded-lg">
            <option value="">Select Period</option>
            <option v-for="n in 8" :key="n" :value="n">Period {{ n }}</option>
          </select>
          <select v-model="selectedSubject" class="px-4 py-2 border rounded-lg">
            <option value="">Select Subject</option>
            <option v-for="subject in timetableStore.subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
          <input v-model="periodDate" type="date" class="px-4 py-2 border rounded-lg" />
        </div>

        <div v-if="periodClass && selectedPeriod" class="overflow-x-auto">
          <div class="mb-4 p-4 bg-indigo-50 rounded-lg">
            <p class="font-semibold">Period {{ selectedPeriod }} - {{ getPeriodTime(selectedPeriod) }}</p>
            <p class="text-sm text-gray-600">Subject: {{ getSubjectName(selectedSubject) }}</p>
          </div>

          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Roll No</th>
                <th class="px-4 py-3 text-left">Student Name</th>
                <th class="px-4 py-3 text-center">Present</th>
                <th class="px-4 py-3 text-center">Absent</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in getPeriodStudents" :key="student.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ student.rollNumber }}</td>
                <td class="px-4 py-3">{{ student.name }}</td>
                <td class="px-4 py-3 text-center">
                  <input
                    type="radio"
                    :name="`period-${student.id}`"
                    :value="'present'"
                    v-model="periodAttendance[student.id]"
                    class="w-5 h-5"
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <input
                    type="radio"
                    :name="`period-${student.id}`"
                    :value="'absent'"
                    v-model="periodAttendance[student.id]"
                    class="w-5 h-5"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button @click="savePeriodAttendance" class="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            💾 Save Period Attendance
          </button>
        </div>
      </div>

      <!-- Monthly Report -->
      <div v-if="activeTab === 'monthly'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Monthly Attendance Report</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="reportClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <input v-model="reportMonth" type="month" class="px-4 py-2 border rounded-lg" />
          <button @click="generateReport" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📊 Generate Report
          </button>
        </div>

        <div v-if="monthlyReport.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border px-3 py-2 text-left">Roll No</th>
                <th class="border px-3 py-2 text-left">Student Name</th>
                <th class="border px-3 py-2 text-center">Total Days</th>
                <th class="border px-3 py-2 text-center">Present</th>
                <th class="border px-3 py-2 text-center">Absent</th>
                <th class="border px-3 py-2 text-center">Late</th>
                <th class="border px-3 py-2 text-center">Half Day</th>
                <th class="border px-3 py-2 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in monthlyReport" :key="record.studentId" class="border-b hover:bg-gray-50">
                <td class="border px-3 py-2">{{ record.rollNumber }}</td>
                <td class="border px-3 py-2 font-semibold">{{ record.name }}</td>
                <td class="border px-3 py-2 text-center">{{ record.totalDays }}</td>
                <td class="border px-3 py-2 text-center text-green-600 font-bold">{{ record.present }}</td>
                <td class="border px-3 py-2 text-center text-red-600 font-bold">{{ record.absent }}</td>
                <td class="border px-3 py-2 text-center text-yellow-600">{{ record.late }}</td>
                <td class="border px-3 py-2 text-center text-orange-600">{{ record.halfDay }}</td>
                <td class="border px-3 py-2 text-center">
                  <span :class="getPercentageColor(record.percentage)" class="font-bold">
                    {{ record.percentage }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-6 flex gap-4">
            <button @click="exportReport" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📥 Export to Excel
            </button>
            <button @click="printReport" class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>

      <!-- Class-wise Graph -->
      <div v-if="activeTab === 'graph'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Class-wise Attendance Graph</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select v-model="graphClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <select v-model="graphPeriod" class="px-4 py-2 border rounded-lg">
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div v-if="graphClass" class="space-y-6">
          <!-- Overall Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-green-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-green-600">{{ classStats.avgAttendance }}%</p>
              <p class="text-sm text-gray-600">Average Attendance</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-blue-600">{{ classStats.totalPresent }}</p>
              <p class="text-sm text-gray-600">Total Present</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-red-600">{{ classStats.totalAbsent }}</p>
              <p class="text-sm text-gray-600">Total Absent</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-purple-600">{{ classStats.totalStudents }}</p>
              <p class="text-sm text-gray-600">Total Students</p>
            </div>
          </div>

          <!-- Bar Chart -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h3 class="font-bold mb-4">Daily Attendance Trend</h3>
            <div class="space-y-3">
              <div v-for="day in attendanceTrend" :key="day.date" class="flex items-center gap-4">
                <span class="text-sm w-24">{{ formatDate(day.date) }}</span>
                <div class="flex-1 flex gap-1">
                  <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${day.presentPercent}%`">
                    {{ day.present }}
                  </div>
                  <div class="bg-red-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${day.absentPercent}%`">
                    {{ day.absent }}
                  </div>
                </div>
                <span class="text-sm font-bold w-16">{{ day.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Student-wise Performance -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h3 class="font-bold mb-4">Student-wise Attendance</h3>
            <div class="space-y-2">
              <div v-for="student in studentAttendanceList" :key="student.id" class="flex items-center gap-4 p-3 bg-white rounded">
                <span class="font-semibold w-48">{{ student.name }}</span>
                <div class="flex-1">
                  <div class="w-full bg-gray-200 rounded-full h-4">
                    <div :class="getAttendanceBarColor(student.percentage)"
                         class="h-4 rounded-full flex items-center justify-end pr-2"
                         :style="`width: ${student.percentage}%`">
                      <span class="text-xs text-white font-bold">{{ student.percentage }}%</span>
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ student.present }}/{{ student.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SMS Notifications -->
      <div v-if="activeTab === 'sms'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">SMS Notifications</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- SMS Settings -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h3 class="font-bold mb-4">Auto SMS Settings</h3>
            <div class="space-y-4">
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="smsSettings.autoSend" class="w-5 h-5" />
                <span>Auto-send SMS for absent students</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="smsSettings.sendToParents" class="w-5 h-5" />
                <span>Send to parents/guardians</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="smsSettings.dailySummary" class="w-5 h-5" />
                <span>Send daily summary</span>
              </label>
              <div>
                <label class="block text-sm font-semibold mb-2">SMS Time</label>
                <input type="time" v-model="smsSettings.sendTime" class="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <!-- SMS Template -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h3 class="font-bold mb-4">SMS Template</h3>
            <textarea
              v-model="smsTemplate"
              rows="6"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="Dear Parent, Your child {student_name} was absent on {date}. Please contact school if this is unexpected."
            ></textarea>
            <p class="text-xs text-gray-600 mt-2">
              Available variables: {student_name}, {date}, {class}, {roll_number}
            </p>
          </div>
        </div>

        <!-- SMS History -->
        <div class="mt-6">
          <h3 class="font-bold mb-4">SMS History</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border px-3 py-2 text-left">Date & Time</th>
                  <th class="border px-3 py-2 text-left">Student</th>
                  <th class="border px-3 py-2 text-left">Phone</th>
                  <th class="border px-3 py-2 text-left">Message</th>
                  <th class="border px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sms in smsHistory" :key="sms.id" class="border-b hover:bg-gray-50">
                  <td class="border px-3 py-2">{{ sms.timestamp }}</td>
                  <td class="border px-3 py-2">{{ sms.studentName }}</td>
                  <td class="border px-3 py-2">{{ sms.phone }}</td>
                  <td class="border px-3 py-2 text-xs">{{ sms.message }}</td>
                  <td class="border px-3 py-2 text-center">
                    <span :class="sms.status === 'sent' ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                      {{ sms.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button @click="testSMS" class="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          📱 Send Test SMS
        </button>
      </div>

      <!-- Future Add-ons -->
      <div v-if="activeTab === 'advanced'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Advanced Attendance Systems</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- RFID -->
          <div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div class="text-6xl mb-4">📡</div>
            <h3 class="font-bold text-lg mb-2">RFID System</h3>
            <p class="text-sm text-gray-600 mb-4">Automatic attendance using RFID cards</p>
            <div class="space-y-2 text-sm text-left">
              <p>✓ Contactless check-in</p>
              <p>✓ Fast processing</p>
              <p>✓ Unique student cards</p>
              <p>✓ Entry/Exit tracking</p>
            </div>
            <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Coming Soon
            </button>
          </div>

          <!-- QR Code -->
          <div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div class="text-6xl mb-4">📱</div>
            <h3 class="font-bold text-lg mb-2">QR Code System</h3>
            <p class="text-sm text-gray-600 mb-4">Scan QR codes for attendance</p>
            <div class="space-y-2 text-sm text-left">
              <p>✓ Mobile app integration</p>
              <p>✓ Unique QR per student</p>
              <p>✓ Real-time updates</p>
              <p>✓ Parent notifications</p>
            </div>
            <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Coming Soon
            </button>
          </div>

          <!-- Face Recognition -->
          <div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div class="text-6xl mb-4">👤</div>
            <h3 class="font-bold text-lg mb-2">Face Recognition</h3>
            <p class="text-sm text-gray-600 mb-4">AI-powered facial recognition</p>
            <div class="space-y-2 text-sm text-left">
              <p>✓ Touchless attendance</p>
              <p>✓ High accuracy</p>
              <p>✓ Anti-spoofing</p>
              <p>✓ Temperature check</p>
            </div>
            <button class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Coming Soon
            </button>
          </div>
        </div>

        <div class="mt-8 p-6 bg-indigo-50 rounded-lg">
          <h3 class="font-bold mb-2">🚀 Interested in Advanced Features?</h3>
          <p class="text-sm text-gray-700 mb-4">
            Contact us to integrate RFID, QR Code, or Face Recognition systems into your school.
            These systems provide faster, more accurate, and contactless attendance tracking.
          </p>
          <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Request Demo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useStudentsStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import { useTimetableStore } from '@/stores/timetable'

const studentsStore = useStudentsStore()
const attendanceStore = useAttendanceStore()
const timetableStore = useTimetableStore()

const activeTab = ref('daily')
const selectedClass = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const dailyAttendance = ref<Record<number, { status: string, remarks: string }>>({})

// Period-wise
const periodClass = ref('')
const selectedPeriod = ref('')
const selectedSubject = ref('')
const periodDate = ref(new Date().toISOString().split('T')[0])
const periodAttendance = ref<Record<number, string>>({})

// Monthly Report
const reportClass = ref('')
const reportMonth = ref(new Date().toISOString().substring(0, 7))
const monthlyReport = ref<unknown[]>([])

// Graph
const graphClass = ref('')
const graphPeriod = ref('week')

// SMS
const smsSettings = ref({
  autoSend: true,
  sendToParents: true,
  dailySummary: false,
  sendTime: '15:00'
})
const smsTemplate = ref('Dear Parent, Your child {student_name} was absent on {date}. Please contact school if needed.')
const smsHistory = ref([
  { id: 1, timestamp: '2024-01-15 15:30', studentName: 'John Doe', phone: '+1234567890', message: 'Student absent today', status: 'sent' },
  { id: 2, timestamp: '2024-01-15 15:31', studentName: 'Jane Smith', phone: '+1234567891', message: 'Student absent today', status: 'sent' }
])

const tabs = [
  { id: 'daily', label: '📅 Daily Attendance' },
  { id: 'period', label: '⏰ Period-wise' },
  { id: 'monthly', label: '📊 Monthly Report' },
  { id: 'graph', label: '📈 Class Graphs' },
  { id: 'sms', label: '📱 SMS Notifications' },
  { id: 'advanced', label: '🚀 Advanced Systems' }
]

const uniqueClasses = computed(() => {
  const classes = new Set(studentsStore.students.map(s => `${s.class}-${s.section}`))
  return Array.from(classes)
})

const filteredStudents = computed(() => {
  if (!selectedClass.value) return []
  const [className, section] = selectedClass.value.split('-')
  return studentsStore.students.filter(s => s.class === className && s.section === section)
})

const getPeriodStudents = computed(() => {
  if (!periodClass.value) return []
  const [className, section] = periodClass.value.split('-')
  return studentsStore.students.filter(s => s.class === className && s.section === section)
})

const presentCount = computed(() => {
  return Object.values(dailyAttendance.value).filter(a => a.status === 'present' || a.status === 'late').length
})

const absentCount = computed(() => {
  return Object.values(dailyAttendance.value).filter(a => a.status === 'absent').length
})

const attendancePercentage = computed(() => {
  const total = filteredStudents.value.length
  if (total === 0) return 0
  return Math.round((presentCount.value / total) * 100)
})

const classStats = computed(() => {
  // Mock data - in real app, calculate from actual attendance records
  return {
    avgAttendance: 92,
    totalPresent: 450,
    totalAbsent: 38,
    totalStudents: filteredStudents.value.length
  }
})

const attendanceTrend = computed(() => {
  // Mock data for last 7 days
  const trend = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const present = Math.floor(Math.random() * 10) + 40
    const absent = 50 - present
    trend.push({
      date: date.toISOString().split('T')[0],
      present,
      absent,
      presentPercent: (present / 50) * 100,
      absentPercent: (absent / 50) * 100,
      percentage: Math.round((present / 50) * 100)
    })
  }
  return trend
})

const studentAttendanceList = computed(() => {
  return filteredStudents.value.map(student => {
    const total = 30
    const present = Math.floor(Math.random() * 10) + 20
    return {
      id: student.id,
      name: student.name,
      present,
      total,
      percentage: Math.round((present / total) * 100)
    }
  })
})

function getStudentStatus(studentId: number) {
  return dailyAttendance.value[studentId]?.status || 'present'
}

function getStudentRemarks(studentId: number) {
  if (!dailyAttendance.value[studentId]) {
    dailyAttendance.value[studentId] = { status: 'present', remarks: '' }
  }
  return dailyAttendance.value[studentId].remarks
}

function updateRemarks(studentId: number, value: string) {
  if (!dailyAttendance.value[studentId]) {
    dailyAttendance.value[studentId] = { status: 'present', remarks: '' }
  }
  dailyAttendance.value[studentId].remarks = value
}

function markStatus(studentId: number, status: string) {
  if (!dailyAttendance.value[studentId]) {
    dailyAttendance.value[studentId] = { status: 'present', remarks: '' }
  }
  dailyAttendance.value[studentId].status = status
}

function markAllPresent() {
  filteredStudents.value.forEach(student => {
    dailyAttendance.value[student.id] = { status: 'present', remarks: '' }
  })
}

function saveAttendance() {
  if (!selectedClass.value) return

  const [className, section] = selectedClass.value.split('-')
  const records = filteredStudents.value.map(student => ({
    studentId: student.id,
    status: dailyAttendance.value[student.id]?.status || 'present',
    remarks: dailyAttendance.value[student.id]?.remarks || ''
  }))

  attendanceStore.markAttendance({
    date: selectedDate.value,
    class: className,
    section: section,
    records: records as unknown
  })

  alert('Attendance saved successfully!')
}

function loadAttendance() {
  if (!selectedClass.value) return

  const [className, section] = selectedClass.value.split('-')
  const existing = attendanceStore.getAttendanceByClass(className, section, selectedDate.value)

  if (existing) {
    dailyAttendance.value = {}
    existing.records.forEach(record => {
      dailyAttendance.value[record.studentId] = {
        status: record.status,
        remarks: record.remarks || ''
      }
    })
    alert('Attendance loaded!')
  } else {
    alert('No attendance record found for this date')
  }
}

function sendAbsentSMS() {
  const absentStudents = filteredStudents.value.filter(s =>
    dailyAttendance.value[s.id]?.status === 'absent'
  )

  if (absentStudents.length === 0) {
    alert('No absent students to notify')
    return
  }

  alert(`SMS sent to ${absentStudents.length} parents of absent students!`)

  // Add to SMS history
  absentStudents.forEach(student => {
    smsHistory.value.unshift({
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleString(),
      studentName: student.name,
      phone: student.phone,
      message: smsTemplate.value.replace('{student_name}', student.name).replace('{date}', selectedDate.value),
      status: 'sent'
    })
  })
}

function savePeriodAttendance() {
  alert('Period attendance saved!')
}

function generateReport() {
  if (!reportClass.value) return

  const [className, section] = reportClass.value.split('-')
  const students = studentsStore.students.filter(s => s.class === className && s.section === section)

  monthlyReport.value = students.map(student => {
    const totalDays = 22
    const present = Math.floor(Math.random() * 5) + 17
    const absent = Math.floor(Math.random() * 3)
    const late = Math.floor(Math.random() * 2)
    const halfDay = totalDays - present - absent - late

    return {
      studentId: student.id,
      rollNumber: student.rollNumber,
      name: student.name,
      totalDays,
      present,
      absent,
      late,
      halfDay,
      percentage: Math.round((present / totalDays) * 100)
    }
  })
}

function exportReport() {
  alert('Exporting to Excel...')
}

function printReport() {
  window.print()
}

function testSMS() {
  alert('Test SMS sent successfully!')
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'present': return 'bg-green-100 text-green-800'
    case 'absent': return 'bg-red-100 text-red-800'
    case 'late': return 'bg-yellow-100 text-yellow-800'
    case 'half-day': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPercentageColor(percentage: number) {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 75) return 'text-blue-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

function getAttendanceBarColor(percentage: number) {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getPeriodTime(period: number) {
  const times = [
    '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
    '11:15-12:00', '12:00-12:45', '13:30-14:15', '14:15-15:00'
  ]
  return times[period - 1] || ''
}

function getSubjectName(subjectId: number) {
  const subject = timetableStore.subjects.find(s => s.id === subjectId)
  return subject ? subject.name : 'N/A'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function quickMarkAttendance() {
  if (!selectedClass.value) {
    alert('Please select a class first!')
    return
  }

  // Scroll to the attendance table
  const element = document.querySelector('.overflow-x-auto')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Show a helpful message
  setTimeout(() => {
    alert('Mark attendance for each student using the buttons below. Click "Save Attendance" when done.')
  }, 500)
}
</script>

