<template>
  <div>
    <Navbar page-title="Teacher & Staff Management" />

    <div class="p-6">
      <!-- Search and Filter -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-4 items-center">
          <input
            v-model="searchQuery"
            placeholder="Search by name, employee ID..."
            class="flex-1 px-4 py-2 border rounded-lg"
          />
          <select v-model="filterStatus" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
          <button @click="showAddForm = true" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + Add Teacher
          </button>
        </div>
      </div>

      <!-- Teachers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="teacher in filteredTeachers" :key="teacher.id"
             class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
             @click="viewTeacher(teacher)">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
              {{ teacher.name?.charAt(0) || 'T' }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg">{{ teacher.name }}</h3>
              <p class="text-gray-600 text-sm">ID: {{ teacher.employeeId }}</p>
              <p class="text-gray-600 text-sm">{{ teacher.qualification }}</p>
            </div>
            <span :class="getStatusBadge(teacher.status)" class="px-2 py-1 rounded-full text-xs">
              {{ teacher.status }}
            </span>
          </div>

          <div class="space-y-2 text-sm mb-4">
            <div class="flex items-center gap-2 text-gray-600">
              <span>📧</span>
              <span>{{ teacher.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <span>📞</span>
              <span>{{ teacher.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <span>💼</span>
              <span>{{ teacher.experience }} years exp</span>
            </div>
          </div>

          <div class="border-t pt-3">
            <p class="text-xs text-gray-600 mb-2">Subjects:</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="subject in teacher.subjects" :key="subject" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {{ subject }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Teacher Modal -->
    <div v-if="showAddForm || editingTeacher" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6">{{ editingTeacher ? 'Edit Teacher' : 'Add New Teacher' }}</h3>

        <form @submit.prevent="handleSubmit">
          <!-- Basic Information -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-purple-600">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.name" placeholder="Full Name *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.employeeId" placeholder="Employee ID *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.email" type="email" placeholder="Email *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.phone" placeholder="Phone *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.dateOfBirth" type="date" placeholder="Date of Birth *" class="px-4 py-2 border rounded-lg" required />
              <select v-model="form.gender" class="px-4 py-2 border rounded-lg" required>
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input v-model="form.joiningDate" type="date" placeholder="Joining Date *" class="px-4 py-2 border rounded-lg" required />
              <select v-model="form.status" class="px-4 py-2 border rounded-lg" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          <!-- Address -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-purple-600">Address</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.address.street" placeholder="Street Address" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.city" placeholder="City" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.state" placeholder="State" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.pincode" placeholder="Pincode" class="px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <!-- Qualification & Experience -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-purple-600">Qualification & Experience</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.qualification" placeholder="Highest Qualification *" class="px-4 py-2 border rounded-lg" required />
              <input v-model.number="form.experience" type="number" placeholder="Years of Experience *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="skillsInput" @keyup.enter="addSkill" placeholder="Skills (press Enter to add)" class="px-4 py-2 border rounded-lg" />
            </div>
            <div v-if="form.subjects.length" class="mt-3">
              <p class="text-sm font-semibold mb-2">Skills:</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="(skill, i) in form.subjects" :key="i" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {{ skill }}
                  <button type="button" @click="removeSkill(i)" class="text-green-600">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- Subject & Class Assignments -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-purple-600">Subject & Class Assignments</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Subjects Teaching</label>
                <input v-model="subjectInput" @keyup.enter="addSubject" placeholder="Add subject (press Enter)" class="w-full px-4 py-2 border rounded-lg" />
                <div v-if="form.subjects.length" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="(subject, i) in form.subjects" :key="i" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {{ subject }}
                    <button type="button" @click="removeSubject(i)" class="text-blue-600">×</button>
                  </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Classes Assigned</label>
                <input v-model="classInput" @keyup.enter="addClass" placeholder="Add class (press Enter)" class="w-full px-4 py-2 border rounded-lg" />
                <div v-if="form.classes.length" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="(cls, i) in form.classes" :key="i" class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {{ cls }}
                    <button type="button" @click="removeClass(i)" class="text-purple-600">×</button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-purple-600">Documents</h4>
            <div class="space-y-2">
              <div v-for="(doc, index) in form.documents" :key="index" class="flex items-center gap-2 p-2 border rounded">
                <span class="flex-1">{{ doc.name }}</span>
                <span class="text-sm text-gray-600">{{ doc.type }}</span>
                <button type="button" @click="removeDocument(index)" class="text-red-600">Remove</button>
              </div>
              <button type="button" @click="addDocument" class="text-blue-600 text-sm">+ Add Document</button>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4">
            <button type="submit" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
              {{ editingTeacher ? 'Update Teacher' : 'Add Teacher' }}
            </button>
            <button type="button" @click="closeForm" class="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Teacher Details Modal -->
    <div v-if="viewingTeacher" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
              {{ viewingTeacher.name?.charAt(0) }}
            </div>
            <div>
              <h3 class="text-2xl font-bold">{{ viewingTeacher.name }}</h3>
              <p class="text-gray-600">Employee ID: {{ viewingTeacher.employeeId }}</p>
              <p class="text-gray-600">{{ viewingTeacher.qualification }}</p>
            </div>
          </div>
          <button @click="viewingTeacher = null" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Personal Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-purple-600">Personal Information</h4>
            <div class="space-y-2 text-sm">
              <p><span class="font-semibold">Date of Birth:</span> {{ formatDate(viewingTeacher.dateOfBirth) }}</p>
              <p><span class="font-semibold">Age:</span> {{ calculateAge(viewingTeacher.dateOfBirth) }} years</p>
              <p><span class="font-semibold">Gender:</span> {{ viewingTeacher.gender }}</p>
              <p><span class="font-semibold">Email:</span> {{ viewingTeacher.email }}</p>
              <p><span class="font-semibold">Phone:</span> {{ viewingTeacher.phone }}</p>
              <p><span class="font-semibold">Joining Date:</span> {{ formatDate(viewingTeacher.joiningDate) }}</p>
              <p><span class="font-semibold">Experience:</span> {{ viewingTeacher.experience }} years</p>
            </div>
          </div>

          <!-- Address -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-purple-600">Address</h4>
            <div class="text-sm">
              <p>{{ viewingTeacher.address?.street }}</p>
              <p>{{ viewingTeacher.address?.city }}, {{ viewingTeacher.address?.state }}</p>
              <p>{{ viewingTeacher.address?.pincode }}</p>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-purple-600">Documents</h4>
            <div class="space-y-2">
              <div v-for="doc in viewingTeacher.documents" :key="doc.id" class="flex items-center justify-between text-sm p-2 bg-white rounded">
                <span>📄 {{ doc.name }}</span>
                <span class="text-gray-600">{{ doc.type }}</span>
              </div>
              <p v-if="!viewingTeacher.documents?.length" class="text-sm text-gray-500">No documents uploaded</p>
            </div>
          </div>
        </div>

        <!-- Subjects & Classes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-purple-600">Subjects Teaching</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="subject in viewingTeacher.subjects" :key="subject" class="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                {{ subject }}
              </span>
              <p v-if="!viewingTeacher.subjects?.length" class="text-sm text-gray-500">No subjects assigned</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-purple-600">Classes Assigned</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="cls in viewingTeacher.classes" :key="cls" class="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm">
                {{ cls }}
              </span>
              <p v-if="!viewingTeacher.classes?.length" class="text-sm text-gray-500">No classes assigned</p>
            </div>
          </div>
        </div>

        <!-- Teacher Schedule/Timetable -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-bold mb-3 text-purple-600">Weekly Schedule</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-white">
                <tr>
                  <th class="border p-2">Day</th>
                  <th class="border p-2">Period 1</th>
                  <th class="border p-2">Period 2</th>
                  <th class="border p-2">Period 3</th>
                  <th class="border p-2">Period 4</th>
                  <th class="border p-2">Period 5</th>
                  <th class="border p-2">Period 6</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']" :key="day">
                  <td class="border p-2 font-semibold">{{ day }}</td>
                  <td v-for="n in 6" :key="n" class="border p-2 text-center">
                    <div class="text-xs">{{ getSchedule(viewingTeacher.id, day, n) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Performance Logs -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-bold mb-3 text-purple-600">Performance Logs</h4>
          <div class="space-y-3">
            <div v-for="log in performanceLogs" :key="log.id" class="bg-white p-3 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-semibold">{{ log.title }}</p>
                  <p class="text-sm text-gray-600">{{ log.description }}</p>
                </div>
                <span :class="getRatingClass(log.rating)" class="px-2 py-1 rounded text-xs">
                  {{ log.rating }}/5
                </span>
              </div>
              <p class="text-xs text-gray-500">{{ formatDate(log.date) }}</p>
            </div>
            <button @click="addPerformanceLog" class="text-blue-600 text-sm">+ Add Performance Log</button>
          </div>
        </div>

        <!-- Leave Records -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-bold mb-3 text-purple-600">Leave Records</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-white">
                <tr>
                  <th class="border p-2 text-left">From</th>
                  <th class="border p-2 text-left">To</th>
                  <th class="border p-2 text-left">Days</th>
                  <th class="border p-2 text-left">Reason</th>
                  <th class="border p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="leave in getTeacherLeaves(viewingTeacher.id)" :key="leave.id">
                  <td class="border p-2">{{ formatDate(leave.startDate) }}</td>
                  <td class="border p-2">{{ formatDate(leave.endDate) }}</td>
                  <td class="border p-2">{{ calculateLeaveDays(leave.startDate, leave.endDate) }}</td>
                  <td class="border p-2">{{ leave.reason }}</td>
                  <td class="border p-2">
                    <span :class="getLeaveStatusClass(leave.status)">{{ leave.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button @click="applyLeave" class="mt-3 text-blue-600 text-sm">+ Apply for Leave</button>
        </div>

        <div class="flex gap-4">
          <button @click="editTeacher(viewingTeacher)" class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Teacher
          </button>
          <button @click="deleteTeacherConfirm(viewingTeacher.id)" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useTeachersStore } from '@/stores/teachers'
import { useTimetableStore } from '@/stores/timetable'
import { useTransportStore } from '@/stores/transport'
import type { Teacher } from '@/types'

const teachersStore = useTeachersStore()
const timetableStore = useTimetableStore()
const transportStore = useTransportStore()

const showAddForm = ref(false)
const editingTeacher = ref<Teacher | null>(null)
const viewingTeacher = ref<Teacher | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
const subjectInput = ref('')
const classInput = ref('')
const skillsInput = ref('')

const form = ref({
  name: '',
  employeeId: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '' as any,
  joiningDate: new Date().toISOString().split('T')[0],
  qualification: '',
  experience: 0,
  subjects: [] as string[],
  classes: [] as string[],
  status: 'active' as any,
  address: {
    street: '',
    city: '',
    state: '',
    pincode: ''
  },
  documents: [] as any[]
})

const performanceLogs = ref([
  { id: 1, title: 'Excellent Teaching Performance', description: 'Outstanding student feedback and results', rating: 5, date: '2024-01-15' },
  { id: 2, title: 'Class Management', description: 'Good classroom discipline and engagement', rating: 4, date: '2024-02-20' },
  { id: 3, title: 'Professional Development', description: 'Completed advanced teaching certification', rating: 5, date: '2024-03-10' }
])

const filteredTeachers = computed(() => {
  let teachers = teachersStore.teachers

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    teachers = teachers.filter(t =>
      t.name?.toLowerCase().includes(query) ||
      t.employeeId?.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    teachers = teachers.filter(t => t.status === filterStatus.value)
  }

  return teachers
})

function handleSubmit() {
  if (editingTeacher.value) {
    teachersStore.updateTeacher(editingTeacher.value.id, form.value as any)
  } else {
    teachersStore.addTeacher(form.value as any)
  }
  closeForm()
}

function editTeacher(teacher: Teacher) {
  editingTeacher.value = teacher
  form.value = JSON.parse(JSON.stringify(teacher))
  viewingTeacher.value = null
  showAddForm.value = false
}

function viewTeacher(teacher: Teacher) {
  viewingTeacher.value = teacher
}

function closeForm() {
  showAddForm.value = false
  editingTeacher.value = null
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as any,
    joiningDate: new Date().toISOString().split('T')[0],
    qualification: '',
    experience: 0,
    subjects: [],
    classes: [],
    status: 'active' as any,
    address: { street: '', city: '', state: '', pincode: '' },
    documents: []
  }
}

function addSubject() {
  if (subjectInput.value.trim()) {
    form.value.subjects.push(subjectInput.value.trim())
    subjectInput.value = ''
  }
}

function removeSubject(index: number) {
  form.value.subjects.splice(index, 1)
}

function addClass() {
  if (classInput.value.trim()) {
    form.value.classes.push(classInput.value.trim())
    classInput.value = ''
  }
}

function removeClass(index: number) {
  form.value.classes.splice(index, 1)
}

function addSkill() {
  if (skillsInput.value.trim()) {
    form.value.subjects.push(skillsInput.value.trim())
    skillsInput.value = ''
  }
}

function removeSkill(index: number) {
  form.value.subjects.splice(index, 1)
}

function addDocument() {
  const name = prompt('Document Name:')
  const type = prompt('Document Type (Certificate, ID, etc.):')
  if (name && type) {
    form.value.documents.push({
      id: Date.now(),
      name,
      type,
      url: '',
      uploadDate: new Date().toISOString().split('T')[0]
    })
  }
}

function removeDocument(index: number) {
  form.value.documents.splice(index, 1)
}

function deleteTeacherConfirm(id: number) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    teachersStore.deleteTeacher(id)
    viewingTeacher.value = null
  }
}

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function formatDate(date: string) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    case 'on-leave': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getSchedule(teacherId: number, day: string, period: number) {
  const timetables = timetableStore.getTimetableByTeacher(teacherId)
  const daySchedule = timetables.find(t => t.day === day)
  const periodData = daySchedule?.periods.find(p => p.periodNumber === period && p.teacher === teacherId)

  if (periodData) {
    const subject = timetableStore.subjects.find(s => s.id === periodData.subject)
    return subject ? subject.name : '-'
  }
  return '-'
}

function getTeacherLeaves(teacherId: number) {
  return transportStore.getLeavesByUser(teacherId, 'teacher')
}

function calculateLeaveDays(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

function getLeaveStatusClass(status: string) {
  switch (status) {
    case 'approved': return 'text-green-600 font-semibold'
    case 'rejected': return 'text-red-600 font-semibold'
    case 'pending': return 'text-yellow-600 font-semibold'
    default: return ''
  }
}

function getRatingClass(rating: number) {
  if (rating >= 4.5) return 'bg-green-100 text-green-800'
  if (rating >= 3.5) return 'bg-blue-100 text-blue-800'
  if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function addPerformanceLog() {
  const title = prompt('Performance Log Title:')
  const description = prompt('Description:')
  const rating = prompt('Rating (1-5):')

  if (title && description && rating) {
    performanceLogs.value.push({
      id: Date.now(),
      title,
      description,
      rating: parseInt(rating),
      date: new Date().toISOString().split('T')[0]
    })
  }
}

function applyLeave() {
  const startDate = prompt('Start Date (YYYY-MM-DD):')
  const endDate = prompt('End Date (YYYY-MM-DD):')
  const reason = prompt('Reason for Leave:')

  if (startDate && endDate && reason && viewingTeacher.value) {
    transportStore.addLeave({
      userId: viewingTeacher.value.id,
      userType: 'teacher',
      startDate,
      endDate,
      reason
    })
  }
}
</script>
