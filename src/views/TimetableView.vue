<template>
  <div>
    <Navbar page-title="Timetable Management" />

    <div class="p-6">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-4 border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
            class="px-4 py-2 font-semibold"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Master Timetable View -->
      <div v-if="activeTab === 'master'" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Master Timetable - Whole School</h2>
          <button @click="exportTimetable" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            📥 Export
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="cls in timetableStore.classes" :key="cls.id" class="border rounded-lg p-4">
            <h3 class="text-lg font-bold mb-3 text-indigo-600">Class {{ cls.name }}-{{ cls.section }}</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="border p-2 text-left w-24">Day</th>
                    <th v-for="n in 8" :key="n" class="border p-2 text-center">P{{ n }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="day in days" :key="day">
                    <td class="border p-2 font-semibold text-xs">{{ day.substring(0, 3) }}</td>
                    <td v-for="period in getMasterPeriods(cls.name, cls.section, day)" :key="period?.periodNumber || Math.random()"
                        class="border p-1 text-center">
                      <div v-if="period" class="bg-blue-50 rounded p-1">
                        <div class="font-bold text-xs">{{ getSubjectName(period.subject) }}</div>
                        <div class="text-xs text-gray-500">{{ getTeacherName(period.teacher)?.substring(0, 10) }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Class-wise Timetable -->
      <div v-if="activeTab === 'class'" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Class-wise Timetable</h2>
          <div class="flex gap-2">
            <select v-model="selectedClass" class="p-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="`${cls.name}-${cls.section}`">
                {{ cls.name }}-{{ cls.section }}
              </option>
            </select>
            <button
              v-if="selectedClass"
              @click="showAddPeriod = true"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add Period
            </button>
          </div>
        </div>

        <div v-if="selectedClass" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-3 text-left">Day</th>
                <th v-for="n in 8" :key="n" class="border p-3 text-center">
                  <div>Period {{ n }}</div>
                  <div class="text-xs text-gray-500">{{ getPeriodTime(n) }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day" class="border-t">
                <td class="border p-3 font-bold">{{ day }}</td>
                <td v-for="period in getPeriods(day)" :key="period?.periodNumber || Math.random()"
                    class="border p-3 text-center relative group">
                  <div v-if="period" class="p-2 bg-blue-50 rounded hover:bg-blue-100 transition">
                    <div class="font-bold text-sm">{{ getSubjectName(period.subject) }}</div>
                    <div class="text-xs text-gray-600">{{ period.startTime }}-{{ period.endTime }}</div>
                    <div class="text-xs text-gray-500">{{ getTeacherName(period.teacher) }}</div>
                    <div class="text-xs text-gray-400">Room: {{ period.room }}</div>
                    <button
                      @click="deletePeriod(day, period.periodNumber)"
                      class="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                  <div v-else class="text-gray-400 text-sm">Free</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          Please select a class to view timetable
        </div>
      </div>

      <!-- Subject Allocation Management -->
      <div v-if="activeTab === 'subjects'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Subject Allocation Management</h2>
            <button @click="showAddSubject = true" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              + Add Subject
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border p-3 text-left">Subject Code</th>
                  <th class="border p-3 text-left">Subject Name</th>
                  <th class="border p-3 text-left">Class</th>
                  <th class="border p-3 text-left">Teacher</th>
                  <th class="border p-3 text-left">Credits</th>
                  <th class="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in timetableStore.subjects" :key="subject.id" class="border-t hover:bg-gray-50">
                  <td class="border p-3">{{ subject.code }}</td>
                  <td class="border p-3 font-semibold">{{ subject.name }}</td>
                  <td class="border p-3">{{ subject.class }}</td>
                  <td class="border p-3">{{ getTeacherName(subject.teacher) }}</td>
                  <td class="border p-3">{{ subject.credits }}</td>
                  <td class="border p-3">
                    <button @click="editSubject(subject)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button @click="deleteSubject(subject.id)" class="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Teacher Workload -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Teacher Workload Analysis</h3>
          <div class="space-y-3">
            <div v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <span class="font-bold">{{ teacher.name }}</span>
                  <span class="text-sm text-gray-600 ml-2">{{ teacher.employeeId }}</span>
                </div>
                <span class="text-sm font-semibold" :class="getWorkloadColor(getTeacherWorkload(teacher.id))">
                  {{ getTeacherWorkload(teacher.id) }} periods/week
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="subject in teacher.subjects" :key="subject" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {{ subject }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Classes Management -->
      <div v-if="activeTab === 'classes'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Classes Management</h2>
          <button @click="showAddClass = true" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            + Add Class
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cls in timetableStore.classes" :key="cls.id" class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ cls.name }}-{{ cls.section }}</h3>
                <p class="text-sm text-gray-600">Class Teacher: {{ getTeacherName(cls.classTeacher) }}</p>
              </div>
              <button @click="deleteClass(cls.id)" class="text-red-600 hover:text-red-800">×</button>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Capacity:</span>
                <span class="font-semibold">{{ cls.students.length }}/{{ cls.capacity }}</span>
              </div>
              <div class="flex justify-between">
                <span>Subjects:</span>
                <span class="font-semibold">{{ cls.subjects.length }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="`width: ${(cls.students.length / cls.capacity) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clash Detection -->
      <div v-if="activeTab === 'clash'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Clash Detection & Validation</h2>

        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-bold mb-2">🔍 Automatic Clash Detection</h3>
          <p class="text-sm text-gray-700">System automatically checks for scheduling conflicts when adding periods</p>
        </div>

        <button @click="runClashDetection" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mb-4">
          Run Full Clash Detection
        </button>

        <div v-if="clashResults.length > 0" class="space-y-3">
          <div v-for="(clash, index) in clashResults" :key="index" class="p-4 border-l-4 border-red-500 bg-red-50 rounded">
            <div class="flex items-start gap-3">
              <span class="text-2xl">⚠️</span>
              <div class="flex-1">
                <h4 class="font-bold text-red-800">{{ clash.type }}</h4>
                <p class="text-sm text-red-700">{{ clash.message }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ clash.details }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <span class="text-6xl">✅</span>
          <p class="text-lg font-semibold text-green-600 mt-2">No Clashes Detected!</p>
          <p class="text-sm text-gray-600">All timetables are conflict-free</p>
        </div>
      </div>
    </div>

    <!-- Add Period Modal -->
    <div v-if="showAddPeriod" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add Period</h3>
        <form @submit.prevent="addPeriod">
          <select v-model="newPeriod.day" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Day</option>
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
          <input v-model.number="newPeriod.periodNumber" type="number" min="1" max="8" placeholder="Period Number (1-8)" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newPeriod.startTime" type="time" placeholder="Start Time" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newPeriod.endTime" type="time" placeholder="End Time" class="w-full mb-3 p-2 border rounded" required />
          <select v-model.number="newPeriod.subject" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Subject</option>
            <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
              {{ subject.name }} ({{ subject.code }})
            </option>
          </select>
          <select v-model.number="newPeriod.teacher" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Teacher</option>
            <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
          <input v-model="newPeriod.room" placeholder="Room Number" class="w-full mb-3 p-2 border rounded" required />

          <div v-if="clashWarning" class="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ⚠️ {{ clashWarning }}
          </div>

          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Add Period</button>
            <button type="button" @click="closeAddPeriod" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddSubject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">{{ editingSubject ? 'Edit Subject' : 'Add New Subject' }}</h3>
        <form @submit.prevent="saveSubject">
          <input v-model="subjectForm.name" placeholder="Subject Name" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="subjectForm.code" placeholder="Subject Code" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="subjectForm.class" placeholder="Class (e.g., 10-A)" class="w-full mb-3 p-2 border rounded" required />
          <select v-model.number="subjectForm.teacher" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Teacher</option>
            <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
          <input v-model.number="subjectForm.credits" type="number" placeholder="Credits" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              {{ editingSubject ? 'Update' : 'Add' }}
            </button>
            <button type="button" @click="closeSubjectForm" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Class</h3>
        <form @submit.prevent="addClass">
          <input v-model="newClass.name" placeholder="Class Name (e.g., 10)" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newClass.section" placeholder="Section (e.g., A)" class="w-full mb-3 p-2 border rounded" required />
          <select v-model.number="newClass.classTeacher" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Class Teacher</option>
            <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
          <input v-model.number="newClass.capacity" type="number" placeholder="Student Capacity" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Add Class</button>
            <button type="button" @click="showAddClass = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useTimetableStore } from '@/stores/timetable'
import { useTeachersStore } from '@/stores/teachers'

const timetableStore = useTimetableStore()
const teachersStore = useTeachersStore()

const activeTab = ref('master')
const selectedClass = ref('')
const showAddSubject = ref(false)
const showAddClass = ref(false)
const showAddPeriod = ref(false)
const editingSubject = ref<any>(null)
const clashWarning = ref('')
const clashResults = ref<any[]>([])

const tabs = [
  { id: 'master', label: '📋 Master Timetable' },
  { id: 'class', label: '🏫 Class-wise' },
  { id: 'subjects', label: '📚 Subject Allocation' },
  { id: 'classes', label: '🎓 Classes' },
  { id: 'clash', label: '⚠️ Clash Detection' }
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const periodTimes = [
  '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
  '11:15-12:00', '12:00-12:45', '13:30-14:15', '14:15-15:00'
]

const classes = computed(() => timetableStore.classes)

const availableSubjects = computed(() => {
  if (!selectedClass.value) return []
  const [className] = selectedClass.value.split('-')
  return timetableStore.subjects.filter(s => s.class.startsWith(className))
})

const subjectForm = ref({
  name: '',
  code: '',
  class: '',
  teacher: 0,
  credits: 0
})

const newClass = ref({
  name: '',
  section: '',
  classTeacher: 0,
  subjects: [],
  students: [],
  capacity: 0
})

const newPeriod = ref({
  day: '',
  periodNumber: 1,
  startTime: '',
  endTime: '',
  subject: 0,
  teacher: 0,
  room: ''
})

// Watch for teacher/time changes to detect clashes
watch([() => newPeriod.value.teacher, () => newPeriod.value.day, () => newPeriod.value.startTime, () => newPeriod.value.endTime], () => {
  checkForClash()
})

function getPeriods(day: string) {
  if (!selectedClass.value) return []
  const [className, section] = selectedClass.value.split('-')
  const timetables = timetableStore.getTimetableByClass(className, section)
  const dayTimetable = timetables.find(t => t.day === day)

  const periods = []
  for (let i = 1; i <= 8; i++) {
    periods.push(dayTimetable?.periods.find(p => p.periodNumber === i) || null)
  }
  return periods
}

function getMasterPeriods(className: string, section: string, day: string) {
  const timetables = timetableStore.getTimetableByClass(className, section)
  const dayTimetable = timetables.find(t => t.day === day)

  const periods = []
  for (let i = 1; i <= 8; i++) {
    periods.push(dayTimetable?.periods.find(p => p.periodNumber === i) || null)
  }
  return periods
}

function getPeriodTime(periodNumber: number) {
  return periodTimes[periodNumber - 1] || ''
}

function getSubjectName(subjectId: number) {
  const subject = timetableStore.subjects.find(s => s.id === subjectId)
  return subject ? subject.name : 'Unknown'
}

function getTeacherName(teacherId: number) {
  const teacher = teachersStore.getTeacherById(teacherId)
  return teacher ? teacher.name : 'Unknown'
}

function checkForClash() {
  if (!newPeriod.value.teacher || !newPeriod.value.day || !newPeriod.value.startTime || !newPeriod.value.endTime) {
    clashWarning.value = ''
    return
  }

  const hasClash = timetableStore.checkClash(
    newPeriod.value.teacher,
    newPeriod.value.day,
    newPeriod.value.startTime,
    newPeriod.value.endTime
  )

  if (hasClash) {
    const teacherName = getTeacherName(newPeriod.value.teacher)
    clashWarning.value = `Clash detected! ${teacherName} is already scheduled at this time.`
  } else {
    clashWarning.value = ''
  }
}

function addPeriod() {
  if (clashWarning.value) {
    if (!confirm('There is a scheduling clash. Do you want to proceed anyway?')) {
      return
    }
  }

  if (!selectedClass.value) return

  const [className, section] = selectedClass.value.split('-')

  const existingTimetable = timetableStore.timetables.find(
    t => t.class === className && t.section === section && t.day === newPeriod.value.day
  )

  if (existingTimetable) {
    const periodIndex = existingTimetable.periods.findIndex(p => p.periodNumber === newPeriod.value.periodNumber)
    if (periodIndex !== -1) {
      existingTimetable.periods[periodIndex] = { ...newPeriod.value }
    } else {
      existingTimetable.periods.push({ ...newPeriod.value })
    }
    timetableStore.addTimetable({
      class: className,
      section: section,
      day: newPeriod.value.day,
      periods: existingTimetable.periods
    })
  } else {
    timetableStore.addTimetable({
      class: className,
      section: section,
      day: newPeriod.value.day,
      periods: [{ ...newPeriod.value }]
    })
  }

  closeAddPeriod()
}

function deletePeriod(day: string, periodNumber: number) {
  if (!confirm('Are you sure you want to delete this period?')) return

  const [className, section] = selectedClass.value.split('-')
  const timetable = timetableStore.timetables.find(
    t => t.class === className && t.section === section && t.day === day
  )

  if (timetable) {
    timetable.periods = timetable.periods.filter(p => p.periodNumber !== periodNumber)
    timetableStore.addTimetable({
      class: className,
      section: section,
      day: day,
      periods: timetable.periods
    })
  }
}

function closeAddPeriod() {
  showAddPeriod.value = false
  newPeriod.value = {
    day: '',
    periodNumber: 1,
    startTime: '',
    endTime: '',
    subject: 0,
    teacher: 0,
    room: ''
  }
  clashWarning.value = ''
}

function saveSubject() {
  if (editingSubject.value) {
    timetableStore.updateSubject(editingSubject.value.id, subjectForm.value)
  } else {
    timetableStore.addSubject(subjectForm.value)
  }
  closeSubjectForm()
}

function editSubject(subject: any) {
  editingSubject.value = subject
  subjectForm.value = { ...subject }
  showAddSubject.value = true
}

function deleteSubject(id: number) {
  if (confirm('Are you sure you want to delete this subject?')) {
    timetableStore.deleteSubject(id)
  }
}

function closeSubjectForm() {
  showAddSubject.value = false
  editingSubject.value = null
  subjectForm.value = {
    name: '',
    code: '',
    class: '',
    teacher: 0,
    credits: 0
  }
}

function addClass() {
  timetableStore.addClass(newClass.value)
  newClass.value = {
    name: '',
    section: '',
    classTeacher: 0,
    subjects: [],
    students: [],
    capacity: 0
  }
  showAddClass.value = false
}

function deleteClass(id: number) {
  if (confirm('Are you sure you want to delete this class?')) {
    const cls = timetableStore.classes.find(c => c.id === id)
    if (cls) {
      timetableStore.classes = timetableStore.classes.filter(c => c.id !== id)
    }
  }
}

function getTeacherWorkload(teacherId: number) {
  let count = 0
  timetableStore.timetables.forEach(timetable => {
    timetable.periods.forEach(period => {
      if (period.teacher === teacherId) count++
    })
  })
  return count
}

function getWorkloadColor(periods: number) {
  if (periods > 30) return 'text-red-600'
  if (periods > 20) return 'text-yellow-600'
  return 'text-green-600'
}

function runClashDetection() {
  clashResults.value = []

  // Check for teacher clashes
  const teacherSchedule: any = {}

  timetableStore.timetables.forEach(timetable => {
    timetable.periods.forEach(period => {
      const key = `${period.teacher}-${timetable.day}-${period.startTime}-${period.endTime}`

      if (!teacherSchedule[key]) {
        teacherSchedule[key] = []
      }
      teacherSchedule[key].push({
        class: `${timetable.class}-${timetable.section}`,
        subject: getSubjectName(period.subject),
        teacher: getTeacherName(period.teacher),
        day: timetable.day,
        time: `${period.startTime}-${period.endTime}`
      })
    })
  })

  // Find clashes
  Object.values(teacherSchedule).forEach((schedules: any) => {
    if (schedules.length > 1) {
      clashResults.value.push({
        type: 'Teacher Clash',
        message: `${schedules[0].teacher} is scheduled for multiple classes at the same time`,
        details: `${schedules[0].day} ${schedules[0].time}: ${schedules.map((s: any) => s.class).join(', ')}`
      })
    }
  })

  if (clashResults.value.length === 0) {
    setTimeout(() => {
      clashResults.value = []
    }, 3000)
  }
}

function exportTimetable() {
  alert('Export functionality - This would generate a PDF or Excel file of the master timetable')
}
</script>
