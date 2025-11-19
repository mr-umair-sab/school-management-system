<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Attendance Management System" />

    <div class="p-6">
      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">👨‍🎓</span>
              </div>
              <span class="text-sm text-gray-500">Today</span>
            </div>
            <h3 class="text-2xl font-bold text-blue-600">{{ studentStats.present }}/{{ studentStats.total }}</h3>
            <p class="text-sm text-gray-600">Students Present</p>
            <div class="mt-2 text-xs text-green-600">{{ studentStats.percentage }}% Attendance</div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">👨‍🏫</span>
              </div>
              <span class="text-sm text-gray-500">Today</span>
            </div>
            <h3 class="text-2xl font-bold text-green-600">{{ teacherStats.present }}/{{ teacherStats.total }}</h3>
            <p class="text-sm text-gray-600">Teachers Present</p>
            <div class="mt-2 text-xs text-green-600">{{ teacherStats.percentage }}% Attendance</div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">❌</span>
              </div>
              <span class="text-sm text-gray-500">Absent</span>
            </div>
            <h3 class="text-2xl font-bold text-red-600">{{ studentStats.absent + teacherStats.absent }}</h3>
            <p class="text-sm text-gray-600">Total Absent</p>
            <div class="mt-2 text-xs text-gray-600">{{ studentStats.absent }} Students, {{ teacherStats.absent }} Teachers</div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">⏰</span>
              </div>
              <span class="text-sm text-gray-500">Late</span>
            </div>
            <h3 class="text-2xl font-bold text-yellow-600">{{ lateArrivals }}</h3>
            <p class="text-sm text-gray-600">Late Arrivals</p>
            <div class="mt-2 text-xs text-yellow-600">Needs attention</div>
          </div>
        </div>

        <!-- Alerts Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🔔</span>
            <span>Alerts & Notifications</span>
          </h3>
          <div class="space-y-3">
            <div v-for="alert in alerts" :key="alert.id"
                 :class="getAlertClass(alert.type)"
                 class="p-4 rounded-lg border-l-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ alert.icon }}</span>
                <div class="flex-1">
                  <h4 class="font-bold">{{ alert.title }}</h4>
                  <p class="text-sm mt-1">{{ alert.message }}</p>
                  <p class="text-xs text-gray-500 mt-2">{{ alert.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Class-wise & Department-wise Graphs -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">Class-wise Attendance</h3>
            <div class="space-y-3">
              <div v-for="cls in classWiseData" :key="cls.name" class="flex items-center gap-4">
                <span class="text-sm font-semibold w-24">{{ cls.name }}</span>
                <div class="flex-1">
                  <div class="w-full bg-gray-200 rounded-full h-6">
                    <div :class="getAttendanceBarColor(cls.percentage)"
                         class="h-6 rounded-full flex items-center justify-end pr-2"
                         :style="`width: ${cls.percentage}%`">
                      <span class="text-xs text-white font-bold">{{ cls.percentage }}%</span>
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ cls.present }}/{{ cls.total }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">Department-wise (Teachers)</h3>
            <div class="space-y-3">
              <div v-for="dept in departmentData" :key="dept.name" class="flex items-center gap-4">
                <span class="text-sm font-semibold w-24">{{ dept.name }}</span>
                <div class="flex-1">
                  <div class="w-full bg-gray-200 rounded-full h-6">
                    <div :class="getAttendanceBarColor(dept.percentage)"
                         class="h-6 rounded-full flex items-center justify-end pr-2"
                         :style="`width: ${dept.percentage}%`">
                      <span class="text-xs text-white font-bold">{{ dept.percentage }}%</span>
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ dept.present }}/{{ dept.total }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trend Chart -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Monthly Attendance Trend</h3>
          <div class="space-y-2">
            <div v-for="day in monthlyTrend" :key="day.date" class="flex items-center gap-4">
              <span class="text-sm w-24">{{ formatDate(day.date) }}</span>
              <div class="flex-1 flex gap-1">
                <div class="bg-blue-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${day.studentPercent}%`">
                  S: {{ day.students }}
                </div>
                <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${day.teacherPercent}%`">
                  T: {{ day.teachers }}
                </div>
              </div>
              <span class="text-sm font-bold w-16">{{ day.overall }}%</span>
            </div>
          </div>
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

      <!-- Student Attendance -->
      <div v-if="activeTab === 'student-daily'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Student Daily Attendance</h2>
          <button
            @click="quickMarkAttendance"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"
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
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">Total Students</p>
                <p class="text-2xl font-bold">{{ filteredStudents.length }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Present</p>
                <p class="text-2xl font-bold text-green-600">{{ presentCount }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Absent</p>
                <p class="text-2xl font-bold text-red-600">{{ absentCount }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-indigo-600">{{ attendancePercentage }}%</p>
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
                    <button @click="markStatus(student.id, 'present')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">✅</button>
                    <button @click="markStatus(student.id, 'absent')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">❌</button>
                    <button @click="markStatus(student.id, 'late')" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">⏰</button>
                    <button @click="markStatus(student.id, 'half-day')" class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">🕐</button>
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

      <!-- Teacher Attendance -->
      <div v-if="activeTab === 'teacher-daily'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Teacher Daily Attendance</h2>
          <button
            @click="markAllTeachersPresent"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            ✅ Mark All Present
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input v-model="teacherDate" type="date" class="px-4 py-2 border rounded-lg" />
          <select v-model="filterDepartment" class="px-4 py-2 border rounded-lg">
            <option value="">All Departments</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Social Studies">Social Studies</option>
          </select>
          <button @click="loadTeacherAttendance" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📥 Load Saved
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left">Employee ID</th>
                <th class="px-4 py-3 text-left">Teacher Name</th>
                <th class="px-4 py-3 text-left">Department</th>
                <th class="px-4 py-3 text-center">Check-In</th>
                <th class="px-4 py-3 text-center">Check-Out</th>
                <th class="px-4 py-3 text-center">Working Hours</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ teacher.employeeId }}</td>
                <td class="px-4 py-3 font-semibold">{{ teacher.name }}</td>
                <td class="px-4 py-3">{{ teacher.subjects[0] || 'N/A' }}</td>
                <td class="px-4 py-3 text-center">
                  <input
                    type="time"
                    :value="getTeacherCheckIn(teacher.id)"
                    @input="updateCheckIn(teacher.id, ($event.target as HTMLInputElement).value)"
                    class="px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <input
                    type="time"
                    :value="getTeacherCheckOut(teacher.id)"
                    @input="updateCheckOut(teacher.id, ($event.target as HTMLInputElement).value)"
                    class="px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-3 text-center font-semibold">
                  {{ calculateWorkingHours(teacher.id) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="getStatusBadge(getTeacherStatus(teacher.id))" class="px-3 py-1 rounded-full text-sm">
                    {{ getTeacherStatus(teacher.id) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2 justify-center">
                    <button @click="markTeacherStatus(teacher.id, 'present')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">✅</button>
                    <button @click="markTeacherStatus(teacher.id, 'absent')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">❌</button>
                    <button @click="markTeacherStatus(teacher.id, 'leave')" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">🏖️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button @click="saveTeacherAttendance" class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            💾 Save Teacher Attendance
          </button>
        </div>
      </div>

      <!-- Combined Reports -->
      <div v-if="activeTab === 'reports'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Attendance Reports</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="reportType" class="px-4 py-2 border rounded-lg">
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="yearly">Yearly Report</option>
          </select>
          <input v-model="reportDate" type="date" class="px-4 py-2 border rounded-lg" />
          <button @click="generateCombinedReport" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📊 Generate Report
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="p-6 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4">Student Summary</h3>
            <div class="space-y-2">
              <div class="flex justify-between"><span>Total Students:</span><span class="font-bold">{{ reportData.students.total }}</span></div>
              <div class="flex justify-between"><span>Present:</span><span class="font-bold text-green-600">{{ reportData.students.present }}</span></div>
              <div class="flex justify-between"><span>Absent:</span><span class="font-bold text-red-600">{{ reportData.students.absent }}</span></div>
              <div class="flex justify-between"><span>Attendance %:</span><span class="font-bold text-blue-600">{{ reportData.students.percentage }}%</span></div>
            </div>
          </div>

          <div class="p-6 bg-green-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4">Teacher Summary</h3>
            <div class="space-y-2">
              <div class="flex justify-between"><span>Total Teachers:</span><span class="font-bold">{{ reportData.teachers.total }}</span></div>
              <div class="flex justify-between"><span>Present:</span><span class="font-bold text-green-600">{{ reportData.teachers.present }}</span></div>
              <div class="flex justify-between"><span>Absent:</span><span class="font-bold text-red-600">{{ reportData.teachers.absent }}</span></div>
              <div class="flex justify-between"><span>Attendance %:</span><span class="font-bold text-green-600">{{ reportData.teachers.percentage }}%</span></div>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="exportPDF" class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
            📄 Export PDF
          </button>
          <button @click="exportExcel" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📊 Export Excel
          </button>
          <button @click="printReport" class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            🖨️ Print
          </button>
        </div>
      </div>

      <!-- Attendance Methods -->
      <div v-if="activeTab === 'methods'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">Attendance Methods</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 border-2 border-blue-300 rounded-lg bg-blue-50">
              <div class="text-6xl mb-4 text-center">💻</div>
              <h3 class="font-bold text-lg mb-2 text-center">Manual Entry</h3>
              <p class="text-sm text-gray-600 mb-4 text-center">Web-based attendance marking</p>
              <div class="space-y-2 text-sm">
                <p>✓ Easy to use</p>
                <p>✓ No hardware required</p>
                <p>✓ Accessible anywhere</p>
              </div>
              <button class="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Active
              </button>
            </div>

            <div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <div class="text-6xl mb-4">📡</div>
              <h3 class="font-bold text-lg mb-2">RFID System</h3>
              <p class="text-sm text-gray-600 mb-4">Card-based attendance</p>
              <div class="space-y-2 text-sm text-left">
                <p>✓ Fast check-in</p>
                <p>✓ Contactless</p>
                <p>✓ Unique cards</p>
              </div>
              <button class="mt-4 w-full px-4 py-2 bg-gray-400 text-white rounded-lg">
                Coming Soon
              </button>
            </div>

            <div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <div class="text-6xl mb-4">👤</div>
              <h3 class="font-bold text-lg mb-2">Face Recognition</h3>
              <p class="text-sm text-gray-600 mb-4">AI-powered attendance</p>
              <div class="space-y-2 text-sm text-left">
                <p>✓ Touchless</p>
                <p>✓ High accuracy</p>
                <p>✓ Anti-spoofing</p>
              </div>
              <button class="mt-4 w-full px-4 py-2 bg-gray-400 text-white rounded-lg">
                Coming Soon
              </button>
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
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import { useAttendanceStore } from '@/stores/attendance'

const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const attendanceStore = useAttendanceStore()

const activeTab = ref('dashboard')
const selectedClass = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const dailyAttendance = ref<Record<number, { status: string, remarks: string }>>({})

// Teacher attendance
const teacherDate = ref(new Date().toISOString().split('T')[0])
const filterDepartment = ref('')
const teacherAttendance = ref<Record<number, { status: string, checkIn: string, checkOut: string }>>({})

// Reports
const reportType = ref('daily')
const reportDate = ref(new Date().toISOString().split('T')[0])

const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'student-daily', label: '👨‍🎓 Student Attendance' },
  { id: 'teacher-daily', label: '👨‍🏫 Teacher Attendance' },
  { id: 'reports', label: '📈 Reports' },
  { id: 'methods', label: '🔧 Methods' }
]

// Mock data for dashboard
const studentStats = computed(() => ({
  total: studentsStore.students.length,
  present: Math.floor(studentsStore.students.length * 0.92),
  absent: Math.floor(studentsStore.students.length * 0.08),
  percentage: 92
}))

const teacherStats = computed(() => ({
  total: teachersStore.teachers.length,
  present: Math.floor(teachersStore.teachers.length * 0.95),
  absent: Math.floor(teachersStore.teachers.length * 0.05),
  percentage: 95
}))

const lateArrivals = computed(() => 5)

const alerts = ref([
  { id: 1, type: 'warning', icon: '⚠️', title: 'Low Attendance Alert', message: 'Class 10-A has only 75% attendance today', time: '10 mins ago' },
  { id: 2, type: 'info', icon: '📱', title: 'SMS Sent', message: 'Absence notifications sent to 12 parents', time: '30 mins ago' },
  { id: 3, type: 'danger', icon: '🔴', title: 'Teacher Not Checked-In', message: 'Mr. John Smith has not checked in yet', time: '1 hour ago' }
])

const classWiseData = ref([
  { name: '10-A', present: 45, total: 50, percentage: 90 },
  { name: '10-B', present: 42, total: 48, percentage: 88 },
  { name: '9-A', present: 48, total: 50, percentage: 96 },
  { name: '9-B', present: 40, total: 45, percentage: 89 }
])

const departmentData = ref([
  { name: 'Science', present: 8, total: 10, percentage: 80 },
  { name: 'Math', present: 6, total: 6, percentage: 100 },
  { name: 'English', present: 7, total: 8, percentage: 88 },
  { name: 'Social', present: 5, total: 6, percentage: 83 }
])

const monthlyTrend = ref([
  { date: '2024-01-15', students: 450, teachers: 45, studentPercent: 90, teacherPercent: 95, overall: 92 },
  { date: '2024-01-16', students: 445, teachers: 46, studentPercent: 89, teacherPercent: 97, overall: 91 },
  { date: '2024-01-17', students: 460, teachers: 47, studentPercent: 92, teacherPercent: 99, overall: 94 },
  { date: '2024-01-18', students: 455, teachers: 45, studentPercent: 91, teacherPercent: 95, overall: 92 },
  { date: '2024-01-19', students: 448, teachers: 46, studentPercent: 90, teacherPercent: 97, overall: 92 }
])

const reportData = ref({
  students: { total: 500, present: 460, absent: 40, percentage: 92 },
  teachers: { total: 50, present: 48, absent: 2, percentage: 96 }
})

const uniqueClasses = computed(() => {
  const classes = new Set(studentsStore.students.map(s => `${s.class}-${s.section}`))
  return Array.from(classes)
})

const filteredStudents = computed(() => {
  if (!selectedClass.value) return []
  const [className, section] = selectedClass.value.split('-')
  return studentsStore.students.filter(s => s.class === className && s.section === section)
})

const filteredTeachers = computed(() => {
  let teachers = teachersStore.activeTeachers
  if (filterDepartment.value) {
    teachers = teachers.filter(t => t.subjects.includes(filterDepartment.value))
  }
  return teachers
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

  alert('✅ Student attendance saved successfully!')
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
    alert('📥 Attendance loaded!')
  } else {
    alert('❌ No attendance record found for this date')
  }
}

function sendAbsentSMS() {
  const absentStudents = filteredStudents.value.filter(s =>
    dailyAttendance.value[s.id]?.status === 'absent'
  )

  if (absentStudents.length === 0) {
    alert('ℹ️ No absent students to notify')
    return
  }

  alert(`📱 SMS sent to ${absentStudents.length} parents of absent students!`)
}

function quickMarkAttendance() {
  if (!selectedClass.value) {
    alert('⚠️ Please select a class first!')
    return
  }

  const element = document.querySelector('.overflow-x-auto')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Teacher attendance functions
function getTeacherStatus(teacherId: number) {
  return teacherAttendance.value[teacherId]?.status || 'present'
}

function getTeacherCheckIn(teacherId: number) {
  if (!teacherAttendance.value[teacherId]) {
    teacherAttendance.value[teacherId] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  }
  return teacherAttendance.value[teacherId].checkIn
}

function getTeacherCheckOut(teacherId: number) {
  if (!teacherAttendance.value[teacherId]) {
    teacherAttendance.value[teacherId] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  }
  return teacherAttendance.value[teacherId].checkOut
}

function updateCheckIn(teacherId: number, value: string) {
  if (!teacherAttendance.value[teacherId]) {
    teacherAttendance.value[teacherId] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  }
  teacherAttendance.value[teacherId].checkIn = value
}

function updateCheckOut(teacherId: number, value: string) {
  if (!teacherAttendance.value[teacherId]) {
    teacherAttendance.value[teacherId] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  }
  teacherAttendance.value[teacherId].checkOut = value
}

function calculateWorkingHours(teacherId: number) {
  const data = teacherAttendance.value[teacherId]
  if (!data || !data.checkIn || !data.checkOut) return '0h 0m'

  const [inH, inM] = data.checkIn.split(':').map(Number)
  const [outH, outM] = data.checkOut.split(':').map(Number)

  const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}

function markTeacherStatus(teacherId: number, status: string) {
  if (!teacherAttendance.value[teacherId]) {
    teacherAttendance.value[teacherId] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  }
  teacherAttendance.value[teacherId].status = status
}

function markAllTeachersPresent() {
  filteredTeachers.value.forEach(teacher => {
    teacherAttendance.value[teacher.id] = { status: 'present', checkIn: '09:00', checkOut: '17:00' }
  })
  alert('✅ All teachers marked present!')
}

function saveTeacherAttendance() {
  alert('✅ Teacher attendance saved successfully!')
}

function loadTeacherAttendance() {
  alert('📥 Teacher attendance loaded!')
}

function generateCombinedReport() {
  alert('📊 Report generated successfully!')
}

function exportPDF() {
  alert('📄 Exporting to PDF...')
}

function exportExcel() {
  alert('📊 Exporting to Excel...')
}

function printReport() {
  window.print()
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'present': return 'bg-green-100 text-green-800'
    case 'absent': return 'bg-red-100 text-red-800'
    case 'late': return 'bg-yellow-100 text-yellow-800'
    case 'half-day': return 'bg-orange-100 text-orange-800'
    case 'leave': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getAlertClass(type: string) {
  switch (type) {
    case 'warning': return 'bg-yellow-50 border-yellow-500'
    case 'danger': return 'bg-red-50 border-red-500'
    case 'info': return 'bg-blue-50 border-blue-500'
    default: return 'bg-gray-50 border-gray-500'
  }
}

function getAttendanceBarColor(percentage: number) {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
