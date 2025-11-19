<template>
  <div>
    <Navbar page-title="Student Management" />

    <div class="p-6">
      <!-- Search and Filter -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-4 items-center">
          <input
            v-model="searchQuery"
            placeholder="Search by name, roll number..."
            class="flex-1 px-4 py-2 border rounded-lg"
          />
          <select v-model="filterClass" class="px-4 py-2 border rounded-lg">
            <option value="">All Classes</option>
            <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <button @click="showAddForm = true" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + Add Student
          </button>
        </div>
      </div>

      <!-- Students Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="student in filteredStudents" :key="student.id"
             class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
             @click="viewStudent(student)">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
              {{ student.name?.charAt(0) || 'S' }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg">{{ student.name }}</h3>
              <p class="text-gray-600 text-sm">Roll: {{ student.rollNumber }}</p>
              <p class="text-gray-600 text-sm">Class: {{ student.class }}-{{ student.section }}</p>
            </div>
            <span :class="getStatusBadge(student.status)" class="px-2 py-1 rounded-full text-xs">
              {{ student.status }}
            </span>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-600">
              <span>📧</span>
              <span>{{ student.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <span>📞</span>
              <span>{{ student.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <span>🎂</span>
              <span>{{ calculateAge(student.dateOfBirth) }} years</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t flex justify-between items-center">
            <span class="text-sm text-gray-600">Attendance: {{ getAttendance(student.id) }}%</span>
            <button @click.stop="editStudent(student)" class="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Student Modal -->
    <div v-if="showAddForm || editingStudent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6">{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h3>

        <form @submit.prevent="handleSubmit">
          <!-- Basic Information -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-indigo-600">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.name" placeholder="Full Name *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.rollNumber" placeholder="Roll Number *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.class" placeholder="Class *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.section" placeholder="Section *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.dateOfBirth" type="date" placeholder="Date of Birth *" class="px-4 py-2 border rounded-lg" required />
              <select v-model="form.gender" class="px-4 py-2 border rounded-lg" required>
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input v-model="form.email" type="email" placeholder="Email *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.phone" placeholder="Phone *" class="px-4 py-2 border rounded-lg" required />
              <input v-model="form.enrollmentDate" type="date" placeholder="Enrollment Date" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.previousSchool" placeholder="Previous School" class="px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <!-- Address -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-indigo-600">Address</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.address.street" placeholder="Street Address" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.city" placeholder="City" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.state" placeholder="State" class="px-4 py-2 border rounded-lg" />
              <input v-model="form.address.pincode" placeholder="Pincode" class="px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <!-- Parent/Guardian Details -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-indigo-600">Parent/Guardian Details</h4>
            <div v-for="(parent, index) in form.parentGuardian" :key="index" class="mb-4 p-4 border rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h5 class="font-semibold">Guardian {{ index + 1 }}</h5>
                <button v-if="form.parentGuardian.length > 1" type="button" @click="removeParent(index)" class="text-red-600 text-sm">Remove</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="parent.name" placeholder="Name" class="px-4 py-2 border rounded-lg" />
                <input v-model="parent.relation" placeholder="Relation (Father/Mother/Guardian)" class="px-4 py-2 border rounded-lg" />
                <input v-model="parent.phone" placeholder="Phone" class="px-4 py-2 border rounded-lg" />
                <input v-model="parent.email" placeholder="Email" class="px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <button type="button" @click="addParent" class="text-blue-600 text-sm">+ Add Another Guardian</button>
          </div>

          <!-- Medical Information -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-indigo-600">Medical Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select v-model="form.medicalInfo.bloodGroup" class="px-4 py-2 border rounded-lg">
                <option value="">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <input v-model="form.medicalInfo.emergencyContact" placeholder="Emergency Contact" class="px-4 py-2 border rounded-lg" />
              <input v-model="allergiesInput" @keyup.enter="addAllergy" placeholder="Allergies (press Enter to add)" class="px-4 py-2 border rounded-lg" />
              <input v-model="medicationsInput" @keyup.enter="addMedication" placeholder="Medications (press Enter to add)" class="px-4 py-2 border rounded-lg" />
            </div>
            <div v-if="form.medicalInfo.allergies.length" class="mt-2 flex flex-wrap gap-2">
              <span v-for="(allergy, i) in form.medicalInfo.allergies" :key="i" class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {{ allergy }}
                <button type="button" @click="removeAllergy(i)" class="text-red-600">×</button>
              </span>
            </div>
            <div v-if="form.medicalInfo.medications.length" class="mt-2 flex flex-wrap gap-2">
              <span v-for="(med, i) in form.medicalInfo.medications" :key="i" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {{ med }}
                <button type="button" @click="removeMedication(i)" class="text-blue-600">×</button>
              </span>
            </div>
          </div>

          <!-- Documents -->
          <div class="mb-6">
            <h4 class="text-lg font-bold mb-3 text-indigo-600">Documents</h4>
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
              {{ editingStudent ? 'Update Student' : 'Add Student' }}
            </button>
            <button type="button" @click="closeForm" class="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Student Details Modal -->
    <div v-if="viewingStudent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
              {{ viewingStudent.name?.charAt(0) }}
            </div>
            <div>
              <h3 class="text-2xl font-bold">{{ viewingStudent.name }}</h3>
              <p class="text-gray-600">Roll: {{ viewingStudent.rollNumber }} | Class: {{ viewingStudent.class }}-{{ viewingStudent.section }}</p>
            </div>
          </div>
          <button @click="viewingStudent = null" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Personal Information</h4>
            <div class="space-y-2 text-sm">
              <p><span class="font-semibold">Date of Birth:</span> {{ formatDate(viewingStudent.dateOfBirth) }}</p>
              <p><span class="font-semibold">Age:</span> {{ calculateAge(viewingStudent.dateOfBirth) }} years</p>
              <p><span class="font-semibold">Gender:</span> {{ viewingStudent.gender }}</p>
              <p><span class="font-semibold">Email:</span> {{ viewingStudent.email }}</p>
              <p><span class="font-semibold">Phone:</span> {{ viewingStudent.phone }}</p>
              <p><span class="font-semibold">Enrollment Date:</span> {{ formatDate(viewingStudent.enrollmentDate) }}</p>
              <p v-if="viewingStudent.previousSchool"><span class="font-semibold">Previous School:</span> {{ viewingStudent.previousSchool }}</p>
            </div>
          </div>

          <!-- Address -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Address</h4>
            <div class="text-sm">
              <p>{{ viewingStudent.address?.street }}</p>
              <p>{{ viewingStudent.address?.city }}, {{ viewingStudent.address?.state }}</p>
              <p>{{ viewingStudent.address?.pincode }}</p>
            </div>
          </div>

          <!-- Parent/Guardian -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Parent/Guardian Details</h4>
            <div v-for="(parent, i) in viewingStudent.parentGuardian" :key="i" class="mb-3 pb-3 border-b last:border-0">
              <p class="font-semibold">{{ parent.relation }}</p>
              <p class="text-sm">{{ parent.name }}</p>
              <p class="text-sm">📞 {{ parent.phone }}</p>
              <p class="text-sm">📧 {{ parent.email }}</p>
            </div>
          </div>

          <!-- Medical Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Medical Information</h4>
            <div class="space-y-2 text-sm">
              <p><span class="font-semibold">Blood Group:</span> {{ viewingStudent.medicalInfo?.bloodGroup || 'N/A' }}</p>
              <p><span class="font-semibold">Emergency Contact:</span> {{ viewingStudent.medicalInfo?.emergencyContact || 'N/A' }}</p>
              <div v-if="viewingStudent.medicalInfo?.allergies?.length">
                <p class="font-semibold">Allergies:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="allergy in viewingStudent.medicalInfo.allergies" :key="allergy" class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    {{ allergy }}
                  </span>
                </div>
              </div>
              <div v-if="viewingStudent.medicalInfo?.medications?.length">
                <p class="font-semibold">Medications:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="med in viewingStudent.medicalInfo.medications" :key="med" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {{ med }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Attendance Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Attendance Summary</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Last 30 Days:</span>
                <span class="font-bold text-green-600">{{ getAttendance(viewingStudent.id) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="`width: ${getAttendance(viewingStudent.id)}%`"></div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold mb-3 text-indigo-600">Documents</h4>
            <div class="space-y-2">
              <div v-for="doc in viewingStudent.documents" :key="doc.id" class="flex items-center justify-between text-sm p-2 bg-white rounded">
                <span>📄 {{ doc.name }}</span>
                <span class="text-gray-600">{{ doc.type }}</span>
              </div>
              <p v-if="!viewingStudent.documents?.length" class="text-sm text-gray-500">No documents uploaded</p>
            </div>
          </div>
        </div>

        <div class="mt-6 flex gap-4">
          <button @click="editStudent(viewingStudent)" class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Student
          </button>
          <button @click="deleteStudentConfirm(viewingStudent.id)" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
import { useStudentsStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import type { Student } from '@/types'

const studentsStore = useStudentsStore()
const attendanceStore = useAttendanceStore()

const showAddForm = ref(false)
const editingStudent = ref<Student | null>(null)
const viewingStudent = ref<Student | null>(null)
const searchQuery = ref('')
const filterClass = ref('')
const allergiesInput = ref('')
const medicationsInput = ref('')

const form = ref({
  name: '',
  rollNumber: '',
  class: '',
  section: '',
  dateOfBirth: '',
  gender: '' as any,
  email: '',
  phone: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  previousSchool: '',
  status: 'active' as any,
  address: {
    street: '',
    city: '',
    state: '',
    pincode: ''
  },
  parentGuardian: [{
    name: '',
    relation: '',
    phone: '',
    email: '',
    address: { street: '', city: '', state: '', pincode: '' }
  }],
  medicalInfo: {
    bloodGroup: '',
    allergies: [] as string[],
    medications: [] as string[],
    emergencyContact: ''
  },
  documents: [] as any[]
})

const uniqueClasses = computed(() => {
  const classes = new Set(studentsStore.students.map(s => `${s.class}-${s.section}`))
  return Array.from(classes)
})

const filteredStudents = computed(() => {
  let students = studentsStore.students

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    students = students.filter(s =>
      s.name?.toLowerCase().includes(query) ||
      s.rollNumber?.toLowerCase().includes(query)
    )
  }

  if (filterClass.value) {
    students = students.filter(s => `${s.class}-${s.section}` === filterClass.value)
  }

  return students
})

function handleSubmit() {
  if (editingStudent.value) {
    studentsStore.updateStudent(editingStudent.value.id, form.value as any)
  } else {
    studentsStore.addStudent(form.value as any)
  }
  closeForm()
}

function editStudent(student: Student) {
  editingStudent.value = student
  form.value = JSON.parse(JSON.stringify(student))
  viewingStudent.value = null
  showAddForm.value = false
}

function viewStudent(student: Student) {
  viewingStudent.value = student
}

function closeForm() {
  showAddForm.value = false
  editingStudent.value = null
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    dateOfBirth: '',
    gender: '' as any,
    email: '',
    phone: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    previousSchool: '',
    status: 'active' as unknown,
    address: { street: '', city: '', state: '', pincode: '' },
    parentGuardian: [{ name: '', relation: '', phone: '', email: '', address: { street: '', city: '', state: '', pincode: '' } }],
    medicalInfo: { bloodGroup: '', allergies: [], medications: [], emergencyContact: '' },
    documents: []
  }
}

function addParent() {
  form.value.parentGuardian.push({
    name: '',
    relation: '',
    phone: '',
    email: '',
    address: { street: '', city: '', state: '', pincode: '' }
  })
}

function removeParent(index: number) {
  form.value.parentGuardian.splice(index, 1)
}

function addAllergy() {
  if (allergiesInput.value.trim()) {
    form.value.medicalInfo.allergies.push(allergiesInput.value.trim())
    allergiesInput.value = ''
  }
}

function removeAllergy(index: number) {
  form.value.medicalInfo.allergies.splice(index, 1)
}

function addMedication() {
  if (medicationsInput.value.trim()) {
    form.value.medicalInfo.medications.push(medicationsInput.value.trim())
    medicationsInput.value = ''
  }
}

function removeMedication(index: number) {
  form.value.medicalInfo.medications.splice(index, 1)
}

function addDocument() {
  const name = prompt('Document Name:')
  const type = prompt('Document Type (ID Card, Certificate, etc.):')
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

function deleteStudentConfirm(id: number) {
  if (confirm('Are you sure you want to delete this student?')) {
    studentsStore.deleteStudent(id)
    viewingStudent.value = null
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

function getAttendance(studentId: number) {
  return Math.round(attendanceStore.calculateAttendancePercentage(studentId, 30))
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    case 'graduated': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
