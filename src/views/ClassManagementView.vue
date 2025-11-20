<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Class & Section Management" />

    <div class="p-6">
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

      <!-- Class Creation & Management -->
      <div v-if="activeTab === 'classes'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Class Management</h2>
            <div class="flex gap-2">
              <button @click="showAutoGenerate = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                🤖 Auto Generate
              </button>
              <button @click="showAddClass = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                ➕ Add Class
              </button>
            </div>
          </div>

          <!-- Academic Year Selection -->
          <div class="mb-6 p-4 bg-indigo-50 rounded-lg">
            <label class="block text-sm font-semibold mb-2">Academic Year</label>
            <select v-model="academicYear" class="px-4 py-2 border rounded-lg">
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

          <!-- Classes Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="cls in classList" :key="cls.id"
                 class="p-4 border-2 rounded-lg hover:shadow-lg transition cursor-pointer"
                 :class="cls.isOverloaded ? 'border-red-300 bg-red-50' : 'border-gray-200'"
                 @click="viewClassDetails(cls)">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-bold">{{ cls.name }}</h3>
                  <p class="text-sm text-gray-600">{{ cls.sections.length }} Sections</p>
                </div>
                <span v-if="cls.isOverloaded" class="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  Overloaded
                </span>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Total Students:</span>
                  <span class="font-bold">{{ cls.totalStudents }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Capacity:</span>
                  <span class="font-bold">{{ cls.capacity }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Class Teacher:</span>
                  <span class="font-semibold text-indigo-600">{{ cls.classTeacher }}</span>
                </div>
              </div>

              <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div :class="getCapacityColor(cls.utilizationPercent)"
                     class="h-2 rounded-full"
                     :style="`width: ${cls.utilizationPercent}%`">
                </div>
              </div>
              <p class="text-xs text-gray-600 mt-1">{{ cls.utilizationPercent }}% Utilized</p>
            </div>
          </div>
        </div>

        <!-- Class Strength Report -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Class Strength Report</h3>
            <button @click="downloadReport" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📥 Download Excel
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border px-3 py-2 text-left">Class</th>
                  <th class="border px-3 py-2 text-center">Boys</th>
                  <th class="border px-3 py-2 text-center">Girls</th>
                  <th class="border px-3 py-2 text-center">Total</th>
                  <th class="border px-3 py-2 text-center">Capacity</th>
                  <th class="border px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cls in classList" :key="cls.id" class="hover:bg-gray-50">
                  <td class="border px-3 py-2 font-semibold">{{ cls.name }}</td>
                  <td class="border px-3 py-2 text-center text-blue-600">{{ cls.boys }}</td>
                  <td class="border px-3 py-2 text-center text-pink-600">{{ cls.girls }}</td>
                  <td class="border px-3 py-2 text-center font-bold">{{ cls.totalStudents }}</td>
                  <td class="border px-3 py-2 text-center">{{ cls.capacity }}</td>
                  <td class="border px-3 py-2 text-center">
                    <span :class="getStatusBadge(cls.utilizationPercent)" class="px-2 py-1 rounded-full text-xs">
                      {{ getStatusText(cls.utilizationPercent) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section Management -->
      <div v-if="activeTab === 'sections'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Section Management</h2>
          <button @click="showAddSection = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Add Section
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold mb-2">Select Class</label>
          <select v-model="selectedClassForSection" class="px-4 py-2 border rounded-lg">
            <option value="">All Classes</option>
            <option v-for="cls in classList" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
          </select>
        </div>

        <div class="space-y-4">
          <div v-for="section in filteredSections" :key="section.id"
               class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ section.className }} - Section {{ section.name }}</h3>
                <p class="text-sm text-gray-600">Class Teacher: {{ section.classTeacher }}</p>
                <p class="text-sm text-gray-600">Co-Teacher: {{ section.coTeacher || 'Not Assigned' }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="editSection(section)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  Edit
                </button>
                <button @click="mergeSection(section)" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                  Merge
                </button>
                <button @click="splitSection(section)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Split
                </button>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Students</p>
                <p class="text-xl font-bold">{{ section.students }}</p>
              </div>
              <div>
                <p class="text-gray-600">Capacity</p>
                <p class="text-xl font-bold">{{ section.capacity }}</p>
              </div>
              <div>
                <p class="text-gray-600">Boys</p>
                <p class="text-xl font-bold text-blue-600">{{ section.boys }}</p>
              </div>
              <div>
                <p class="text-gray-600">Girls</p>
                <p class="text-xl font-bold text-pink-600">{{ section.girls }}</p>
              </div>
            </div>

            <div class="mt-3">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="getCapacityColor((section.students / section.capacity) * 100)"
                     class="h-2 rounded-full"
                     :style="`width: ${(section.students / section.capacity) * 100}%`">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Promotion -->
      <div v-if="activeTab === 'promotion'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Student Class Promotion</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-semibold mb-2">From Class</label>
            <select v-model="promotionFrom" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="cls in classList" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">To Class</label>
            <select v-model="promotionTo" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="cls in classList" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
        </div>

        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-bold mb-2">Promotion Options</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="radio" v-model="promotionType" value="all" />
              <span>Promote All Students</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="promotionType" value="selective" />
              <span>Selective Promotion</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="generateNewRollNumbers" />
              <span>Generate New Roll Numbers</span>
            </label>
          </div>
        </div>

        <div v-if="promotionFrom && promotionTo" class="mb-6">
          <h3 class="font-bold mb-3">Students to Promote ({{ selectedStudentsForPromotion.length }})</h3>
          <div class="max-h-96 overflow-y-auto border rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="border px-3 py-2">
                    <input type="checkbox" @change="toggleAllStudents" />
                  </th>
                  <th class="border px-3 py-2 text-left">Roll No</th>
                  <th class="border px-3 py-2 text-left">Name</th>
                  <th class="border px-3 py-2 text-center">Gender</th>
                  <th class="border px-3 py-2 text-center">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in studentsForPromotion" :key="student.id" class="hover:bg-gray-50">
                  <td class="border px-3 py-2 text-center">
                    <input type="checkbox" v-model="selectedStudentsForPromotion" :value="student.id" />
                  </td>
                  <td class="border px-3 py-2">{{ student.rollNumber }}</td>
                  <td class="border px-3 py-2 font-semibold">{{ student.name }}</td>
                  <td class="border px-3 py-2 text-center">{{ student.gender }}</td>
                  <td class="border px-3 py-2 text-center">{{ student.attendance }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button @click="promoteStudents"
                :disabled="!promotionFrom || !promotionTo || selectedStudentsForPromotion.length === 0"
                class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400">
          🎓 Promote {{ selectedStudentsForPromotion.length }} Students
        </button>
      </div>

      <!-- Subject Allocation -->
      <div v-if="activeTab === 'subjects'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Subject Allocation</h2>
          <button @click="autoAllocateSubjects" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🤖 Auto Allocate
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold mb-2">Select Class</label>
          <select v-model="selectedClassForSubjects" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in classList" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
          </select>
        </div>

        <div v-if="selectedClassForSubjects" class="space-y-4">
          <div v-for="subject in classSubjects" :key="subject.id"
               class="p-4 border rounded-lg flex justify-between items-center">
            <div class="flex-1">
              <h3 class="font-bold">{{ subject.name }}</h3>
              <p class="text-sm text-gray-600">Code: {{ subject.code }}</p>
            </div>
            <div class="flex-1">
              <label class="block text-xs text-gray-600 mb-1">Teacher</label>
              <select v-model="subject.teacherId" class="w-full px-3 py-2 border rounded text-sm">
                <option value="">Assign Teacher</option>
                <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }}
                </option>
              </select>
            </div>
            <div class="flex-1 ml-4">
              <label class="block text-xs text-gray-600 mb-1">Periods/Week</label>
              <input type="number" v-model="subject.periodsPerWeek"
                     class="w-full px-3 py-2 border rounded text-sm" min="1" max="10" />
            </div>
            <button @click="removeSubject(subject.id)" class="ml-4 text-red-500 hover:text-red-700">
              🗑️
            </button>
          </div>

          <button @click="addNewSubject" class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50">
            ➕ Add Subject
          </button>

          <button @click="saveSubjectAllocation" class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            💾 Save Subject Allocation
          </button>
        </div>
      </div>

      <!-- Class Teacher Assignment -->
      <div v-if="activeTab === 'teachers'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Assign Class Teachers</h2>

        <div class="space-y-4">
          <div v-for="cls in classList" :key="cls.id" class="p-4 border rounded-lg">
            <h3 class="font-bold text-lg mb-4">{{ cls.name }}</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Main Class Teacher</label>
                <select v-model="cls.classTeacherId" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select Teacher</option>
                  <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} ({{ teacher.subjects.join(', ') }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Co-Class Teacher</label>
                <select v-model="cls.coTeacherId" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select Teacher</option>
                  <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} ({{ teacher.subjects.join(', ') }})
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-3 p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">
                <span class="font-semibold">Current Load:</span>
                {{ getTeacherLoad(cls.classTeacherId) }} classes
              </p>
            </div>
          </div>
        </div>

        <button @click="saveTeacherAssignments" class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
          💾 Save Teacher Assignments
        </button>
      </div>

      <!-- Fee Structure -->
      <div v-if="activeTab === 'fees'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Class Fee Structure</h2>

        <div class="space-y-6">
          <div v-for="cls in classList" :key="cls.id" class="p-4 border rounded-lg">
            <h3 class="font-bold text-lg mb-4">{{ cls.name }}</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Monthly Tuition Fee</label>
                <input type="number" v-model="cls.monthlyFee"
                       class="w-full px-4 py-2 border rounded-lg" placeholder="₹" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Annual Fee</label>
                <input type="number" v-model="cls.annualFee"
                       class="w-full px-4 py-2 border rounded-lg" placeholder="₹" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Admission Fee</label>
                <input type="number" v-model="cls.admissionFee"
                       class="w-full px-4 py-2 border rounded-lg" placeholder="₹" />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-semibold mb-2">Discounts & Scholarships</label>
              <div class="space-y-2">
                <div class="flex gap-2">
                  <input type="text" placeholder="Discount Name"
                         class="flex-1 px-3 py-2 border rounded text-sm" />
                  <input type="number" placeholder="%"
                         class="w-24 px-3 py-2 border rounded text-sm" />
                  <button class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="saveFeeStructure" class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
          💾 Save Fee Structure
        </button>
      </div>
    </div>

    <!-- Auto Generate Classes Modal -->
    <div v-if="showAutoGenerate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Auto Generate Classes</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">From Grade</label>
            <select v-model="autoGenFrom" class="w-full px-4 py-2 border rounded-lg">
              <option value="Play Group">Play Group</option>
              <option value="Nursery">Nursery</option>
              <option value="KG">KG</option>
              <option v-for="n in 12" :key="n" :value="n">Grade {{ n }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">To Grade</label>
            <select v-model="autoGenTo" class="w-full px-4 py-2 border rounded-lg">
              <option v-for="n in 12" :key="n" :value="n">Grade {{ n }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Sections per Class</label>
            <input type="number" v-model="sectionsPerClass" min="1" max="10"
                   class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Capacity per Section</label>
            <input type="number" v-model="capacityPerSection" min="20" max="60"
                   class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="generateClasses" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Generate
          </button>
          <button @click="showAutoGenerate = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Class</h3>
        <div class="space-y-4">
          <input v-model="newClass.name" placeholder="Class Name (e.g., Grade 10)"
                 class="w-full px-4 py-2 border rounded-lg" />
          <input v-model.number="newClass.capacity" type="number" placeholder="Total Capacity"
                 class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="addClass" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add
          </button>
          <button @click="showAddClass = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
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

const teachersStore = useTeachersStore()

const activeTab = ref('classes')
const academicYear = ref('2024-2025')
const showAutoGenerate = ref(false)
const showAddClass = ref(false)
const showAddSection = ref(false)

const tabs = [
  { id: 'classes', label: '🏫 Classes' },
  { id: 'sections', label: '📋 Sections' },
  { id: 'promotion', label: '🎓 Promotion' },
  { id: 'subjects', label: '📚 Subjects' },
  { id: 'teachers', label: '👨‍🏫 Teachers' },
  { id: 'fees', label: '💰 Fee Structure' }
]

// Mock data
const classList = ref([
  { id: 1, name: 'Play Group', sections: [{name: 'A'}, {name: 'B'}], totalStudents: 45, capacity: 60, boys: 25, girls: 20, classTeacher: 'Ms. Sarah', utilizationPercent: 75, isOverloaded: false, classTeacherId: 1, coTeacherId: 2, monthlyFee: 5000, annualFee: 10000, admissionFee: 15000 },
  { id: 2, name: 'Nursery', sections: [{name: 'A'}, {name: 'B'}], totalStudents: 50, capacity: 60, boys: 28, girls: 22, classTeacher: 'Ms. Emily', utilizationPercent: 83, isOverloaded: false, classTeacherId: 2, coTeacherId: 3, monthlyFee: 5500, annualFee: 11000, admissionFee: 15000 },
  { id: 3, name: 'Grade 1', sections: [{name: 'A'}, {name: 'B'}, {name: 'C'}], totalStudents: 85, capacity: 90, boys: 45, girls: 40, classTeacher: 'Mr. John', utilizationPercent: 94, isOverloaded: false, classTeacherId: 3, coTeacherId: 4, monthlyFee: 6000, annualFee: 12000, admissionFee: 20000 },
  { id: 4, name: 'Grade 2', sections: [{name: 'A'}, {name: 'B'}, {name: 'C'}], totalStudents: 92, capacity: 90, boys: 48, girls: 44, classTeacher: 'Ms. Lisa', utilizationPercent: 102, isOverloaded: true, classTeacherId: 4, coTeacherId: 5, monthlyFee: 6000, annualFee: 12000, admissionFee: 20000 }
])

const sections = ref([
  { id: 1, classId: 1, className: 'Play Group', name: 'A', students: 22, capacity: 30, boys: 12, girls: 10, classTeacher: 'Ms. Sarah', coTeacher: 'Ms. Anna' },
  { id: 2, classId: 1, className: 'Play Group', name: 'B', students: 23, capacity: 30, boys: 13, girls: 10, classTeacher: 'Ms. Emily', coTeacher: null },
  { id: 3, classId: 3, className: 'Grade 1', name: 'A', students: 28, capacity: 30, boys: 15, girls: 13, classTeacher: 'Mr. John', coTeacher: 'Ms. Kate' },
  { id: 4, classId: 3, className: 'Grade 1', name: 'B', students: 29, capacity: 30, boys: 16, girls: 13, classTeacher: 'Ms. Lisa', coTeacher: null },
  { id: 5, classId: 3, className: 'Grade 1', name: 'C', students: 28, capacity: 30, boys: 14, girls: 14, classTeacher: 'Mr. David', coTeacher: null }
])

const selectedClassForSection = ref('')
const selectedClassForSubjects = ref('')
const promotionFrom = ref('')
const promotionTo = ref('')
const promotionType = ref('all')
const generateNewRollNumbers = ref(true)
const selectedStudentsForPromotion = ref<number[]>([])

const autoGenFrom = ref('Play Group')
const autoGenTo = ref(12)
const sectionsPerClass = ref(2)
const capacityPerSection = ref(30)

const newClass = ref({
  name: '',
  capacity: 60
})

const classSubjects = ref([
  { id: 1, name: 'Mathematics', code: 'MATH101', teacherId: '', periodsPerWeek: 6 },
  { id: 2, name: 'English', code: 'ENG101', teacherId: '', periodsPerWeek: 5 },
  { id: 3, name: 'Science', code: 'SCI101', teacherId: '', periodsPerWeek: 5 },
  { id: 4, name: 'Social Studies', code: 'SS101', teacherId: '', periodsPerWeek: 4 }
])

const studentsForPromotion = ref([
  { id: 1, rollNumber: '001', name: 'John Doe', gender: 'Male', attendance: 95 },
  { id: 2, rollNumber: '002', name: 'Jane Smith', gender: 'Female', attendance: 92 },
  { id: 3, rollNumber: '003', name: 'Mike Johnson', gender: 'Male', attendance: 88 }
])

const availableTeachers = computed(() => teachersStore.activeTeachers)

const filteredSections = computed(() => {
  if (!selectedClassForSection.value) return sections.value
  return sections.value.filter(s => s.classId === parseInt(selectedClassForSection.value))
})

function getCapacityColor(percent: number) {
  if (percent >= 100) return 'bg-red-500'
  if (percent >= 90) return 'bg-yellow-500'
  if (percent >= 75) return 'bg-blue-500'
  return 'bg-green-500'
}

function getStatusBadge(percent: number) {
  if (percent >= 100) return 'bg-red-100 text-red-800'
  if (percent >= 90) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function getStatusText(percent: number) {
  if (percent >= 100) return 'Overloaded'
  if (percent >= 90) return 'Near Full'
  return 'Available'
}

function viewClassDetails(cls: any) {
  alert(`Viewing details for ${cls.name}`)
}

function generateClasses() {
  alert(`Generating classes from ${autoGenFrom.value} to Grade ${autoGenTo.value}`)
  showAutoGenerate.value = false
}

function addClass() {
  alert(`Adding class: ${newClass.value.name}`)
  showAddClass.value = false
}

function downloadReport() {
  alert('Downloading Excel report...')
}

function editSection(section: any) {
  alert(`Editing section ${section.className} - ${section.name}`)
}

function mergeSection(section: any) {
  alert(`Merging section ${section.className} - ${section.name}`)
}

function splitSection(section: any) {
  alert(`Splitting section ${section.className} - ${section.name}`)
}

function toggleAllStudents(event: any) {
  if (event.target.checked) {
    selectedStudentsForPromotion.value = studentsForPromotion.value.map(s => s.id)
  } else {
    selectedStudentsForPromotion.value = []
  }
}

function promoteStudents() {
  alert(`Promoting ${selectedStudentsForPromotion.value.length} students`)
}

function autoAllocateSubjects() {
  alert('Auto-allocating subjects...')
}

function addNewSubject() {
  const newId = classSubjects.value.length + 1
  classSubjects.value.push({
    id: newId,
    name: '',
    code: '',
    teacherId: '',
    periodsPerWeek: 5
  })
}

function removeSubject(id: number) {
  classSubjects.value = classSubjects.value.filter(s => s.id !== id)
}

function saveSubjectAllocation() {
  alert('Subject allocation saved!')
}

function getTeacherLoad(teacherId: string) {
  return classList.value.filter(c => c.classTeacherId === parseInt(teacherId)).length
}

function saveTeacherAssignments() {
  alert('Teacher assignments saved!')
}

function saveFeeStructure() {
  alert('Fee structure saved!')
}
</script>
