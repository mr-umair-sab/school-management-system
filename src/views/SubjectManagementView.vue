<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Subject & Course Management" />

    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAddSubject = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Add Subject
          </button>
          <button @click="activeTab = 'syllabus'" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📚 Syllabus
          </button>
          <button @click="activeTab = 'lessons'" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📝 Lesson Plans
          </button>
          <button @click="activeTab = 'materials'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📁 Materials Library
          </button>
          <button @click="activeTab = 'assignments'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            📋 Assignments
          </button>
          <button @click="activeTab = 'dashboard'" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            📊 Dashboard
          </button>
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

      <!-- Subjects List -->
      <div v-if="activeTab === 'subjects'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📚 All Subjects</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="subject in subjects" :key="subject.id"
                 class="p-4 border-2 rounded-lg hover:shadow-lg transition cursor-pointer"
                 @click="viewSubjectDetails(subject)">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-bold">{{ subject.name }}</h3>
                  <p class="text-sm text-gray-600">{{ subject.code }}</p>
                </div>
                <span :class="getDifficultyBadge(subject.difficulty)" class="px-2 py-1 rounded-full text-xs">
                  {{ subject.difficulty }}
                </span>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Teacher:</span>
                  <span class="font-semibold">{{ subject.teacher }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Class:</span>
                  <span class="font-semibold">{{ subject.class }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Periods/Week:</span>
                  <span class="font-semibold">{{ subject.periodsPerWeek }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Completion:</span>
                  <span class="font-semibold text-green-600">{{ subject.completion }}%</span>
                </div>
              </div>

              <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="`width: ${subject.completion}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Syllabus & Course Outline -->
      <div v-if="activeTab === 'syllabus'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📚 Syllabus & Course Outline</h2>
          <button @click="uploadSyllabus" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📤 Upload Syllabus PDF
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold mb-2">Select Subject</label>
          <select v-model="selectedSubject" class="px-4 py-2 border rounded-lg">
            <option value="">Select Subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }} ({{ subject.class }})
            </option>
          </select>
        </div>

        <div v-if="selectedSubject" class="space-y-6">
          <!-- Units -->
          <div v-for="unit in courseUnits" :key="unit.id" class="border rounded-lg p-4">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold">{{ unit.name }}</h3>
                <p class="text-sm text-gray-600">{{ unit.duration }} weeks</p>
              </div>
              <button @click="toggleUnit(unit.id)" class="text-indigo-600 hover:text-indigo-800">
                {{ expandedUnits.includes(unit.id) ? '▼' : '▶' }}
              </button>
            </div>

            <div v-if="expandedUnits.includes(unit.id)" class="space-y-4">
              <!-- Chapters -->
              <div v-for="chapter in unit.chapters" :key="chapter.id" class="ml-4 p-3 bg-gray-50 rounded">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                    <h4 class="font-bold">{{ chapter.name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ chapter.description }}</p>
                  </div>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="chapter.completed" class="w-4 h-4" />
                    <span class="text-sm">Done</span>
                  </label>
                </div>

                <!-- Learning Outcomes -->
                <div class="mt-3">
                  <p class="text-xs font-semibold text-gray-700 mb-2">Learning Outcomes:</p>
                  <ul class="space-y-1">
                    <li v-for="(outcome, i) in chapter.learningOutcomes" :key="i"
                        class="text-xs text-gray-600 flex items-start gap-2">
                      <span class="text-green-500">✓</span>
                      <span>{{ outcome }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Topics -->
                <div class="mt-3">
                  <p class="text-xs font-semibold text-gray-700 mb-2">Topics:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="topic in chapter.topics" :key="topic"
                          class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {{ topic }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lesson Planning -->
      <div v-if="activeTab === 'lessons'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📝 Lesson Planning</h2>
          <button @click="showAddLesson = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Add Lesson Plan
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="lesson in lessonPlans" :key="lesson.id"
               class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg">{{ lesson.title }}</h3>
                <p class="text-sm text-gray-600">{{ lesson.subject }} - {{ lesson.class }}</p>
                <p class="text-sm text-gray-600">Date: {{ lesson.date }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="downloadLesson(lesson)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  📥 Download
                </button>
                <button @click="editLesson(lesson)" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                  ✏️ Edit
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p class="text-gray-600">Duration</p>
                <p class="font-semibold">{{ lesson.duration }} min</p>
              </div>
              <div>
                <p class="text-gray-600">Type</p>
                <p class="font-semibold">{{ lesson.type }}</p>
              </div>
              <div>
                <p class="text-gray-600">Materials</p>
                <p class="font-semibold">{{ lesson.materials.length }} files</p>
              </div>
              <div>
                <p class="text-gray-600">Status</p>
                <span :class="lesson.completed ? 'text-green-600' : 'text-yellow-600'" class="font-semibold">
                  {{ lesson.completed ? 'Completed' : 'Pending' }}
                </span>
              </div>
            </div>

            <div v-if="lesson.materials.length > 0" class="mt-3 flex flex-wrap gap-2">
              <span v-for="material in lesson.materials" :key="material"
                    class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                📎 {{ material }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Materials Library -->
      <div v-if="activeTab === 'materials'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📁 Subject Material Library</h2>
          <button @click="uploadMaterial" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📤 Upload Material
          </button>
        </div>

        <div class="mb-6">
          <div class="flex gap-4">
            <select v-model="materialFilter.subject" class="px-4 py-2 border rounded-lg">
              <option value="">All Subjects</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
            <select v-model="materialFilter.type" class="px-4 py-2 border rounded-lg">
              <option value="">All Types</option>
              <option value="PDF">PDF</option>
              <option value="PPT">PowerPoint</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="material in filteredMaterials" :key="material.id"
               class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="text-4xl">{{ getFileIcon(material.type) }}</div>
              <div class="flex-1">
                <h3 class="font-bold">{{ material.name }}</h3>
                <p class="text-sm text-gray-600">{{ material.subject }}</p>
                <p class="text-xs text-gray-500">{{ material.uploadDate }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <button @click="viewMaterial(material)" class="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                👁️ View
              </button>
              <button @click="downloadMaterial(material)" class="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                📥 Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignments & Homework -->
      <div v-if="activeTab === 'assignments'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📋 Assignments & Homework</h2>
          <button @click="showAddAssignment = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ➕ Create Assignment
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="assignment in assignments" :key="assignment.id"
               class="p-4 border-2 rounded-lg"
               :class="getAssignmentBorderColor(assignment.status)">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg">{{ assignment.title }}</h3>
                <p class="text-sm text-gray-600">{{ assignment.subject }} - {{ assignment.class }}</p>
              </div>
              <span :class="getAssignmentStatusBadge(assignment.status)" class="px-3 py-1 rounded-full text-xs">
                {{ assignment.status }}
              </span>
            </div>

            <p class="text-sm text-gray-700 mb-3">{{ assignment.description }}</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
              <div>
                <p class="text-gray-600">Assigned Date</p>
                <p class="font-semibold">{{ assignment.assignedDate }}</p>
              </div>
              <div>
                <p class="text-gray-600">Due Date</p>
                <p class="font-semibold text-red-600">{{ assignment.dueDate }}</p>
              </div>
              <div>
                <p class="text-gray-600">Submissions</p>
                <p class="font-semibold">{{ assignment.submissions }}/{{ assignment.totalStudents }}</p>
              </div>
              <div>
                <p class="text-gray-600">Max Marks</p>
                <p class="font-semibold">{{ assignment.maxMarks }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <button @click="viewSubmissions(assignment)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                📊 View Submissions
              </button>
              <button @click="gradeAssignment(assignment)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                ✏️ Grade
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Marks -->
      <div v-if="activeTab === 'tests'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📝 Subject-Wise Test Marks</h2>
          <button @click="showAddTest = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Add Test
          </button>
        </div>

        <div class="mb-6">
          <select v-model="testFilter.subject" class="px-4 py-2 border rounded-lg">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="space-y-4">
          <div v-for="test in filteredTests" :key="test.id"
               class="p-4 border rounded-lg">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg">{{ test.name }}</h3>
                <p class="text-sm text-gray-600">{{ test.subject }} - {{ test.class }}</p>
                <p class="text-sm text-gray-600">Type: {{ test.type }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Date: {{ test.date }}</p>
                <p class="text-sm text-gray-600">Max Marks: {{ test.maxMarks }}</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 text-center mb-3">
              <div class="p-3 bg-green-50 rounded">
                <p class="text-2xl font-bold text-green-600">{{ test.avgMarks }}</p>
                <p class="text-xs text-gray-600">Average</p>
              </div>
              <div class="p-3 bg-blue-50 rounded">
                <p class="text-2xl font-bold text-blue-600">{{ test.highestMarks }}</p>
                <p class="text-xs text-gray-600">Highest</p>
              </div>
              <div class="p-3 bg-red-50 rounded">
                <p class="text-2xl font-bold text-red-600">{{ test.lowestMarks }}</p>
                <p class="text-xs text-gray-600">Lowest</p>
              </div>
            </div>

            <button @click="viewTestDetails(test)" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              View Detailed Results
            </button>
          </div>
        </div>
      </div>

      <!-- Subject Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📊 Subject Overview Dashboard</h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-blue-600">{{ subjects.length }}</p>
              <p class="text-sm text-gray-600">Total Subjects</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-green-600">{{ completedTopics }}</p>
              <p class="text-sm text-gray-600">Topics Completed</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-purple-600">{{ totalMaterials }}</p>
              <p class="text-sm text-gray-600">Study Materials</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-yellow-600">{{ pendingAssignments }}</p>
              <p class="text-sm text-gray-600">Pending Assignments</p>
            </div>
          </div>

          <!-- Subject Progress -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">Subject-wise Progress</h3>
            <div class="space-y-3">
              <div v-for="subject in subjects" :key="subject.id" class="flex items-center gap-4">
                <span class="text-sm font-semibold w-32">{{ subject.name }}</span>
                <div class="flex-1">
                  <div class="w-full bg-gray-200 rounded-full h-6">
                    <div :class="getProgressColor(subject.completion)"
                         class="h-6 rounded-full flex items-center justify-end pr-2"
                         :style="`width: ${subject.completion}%`">
                      <span class="text-xs text-white font-bold">{{ subject.completion }}%</span>
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ subject.completedChapters }}/{{ subject.totalChapters }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div>
            <h3 class="font-bold text-lg mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id"
                   class="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                <span class="text-2xl">{{ activity.icon }}</span>
                <div class="flex-1">
                  <p class="font-semibold">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Parent View -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">👪 Parent View: Subject Progress</h2>

          <div class="space-y-4">
            <div v-for="subject in subjects.slice(0, 3)" :key="subject.id"
                 class="p-4 border rounded-lg">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-bold">{{ subject.name }}</h3>
                  <p class="text-sm text-gray-600">Teacher: {{ subject.teacher }}</p>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {{ subject.completion }}% Complete
                </span>
              </div>

              <div class="grid grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <p class="text-gray-600">Chapters</p>
                  <p class="font-bold">{{ subject.completedChapters }}/{{ subject.totalChapters }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Assignments</p>
                  <p class="font-bold">{{ subject.assignmentsCompleted }}/{{ subject.totalAssignments }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Avg Score</p>
                  <p class="font-bold text-green-600">{{ subject.avgScore }}%</p>
                </div>
              </div>

              <button @click="viewSubjectMaterials(subject)"
                      class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                📚 View Materials & Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddSubject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">➕ Add New Subject</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="newSubject.name" placeholder="Subject Name" class="px-4 py-2 border rounded-lg" />
            <input v-model="newSubject.code" placeholder="Subject Code" class="px-4 py-2 border rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <select v-model="newSubject.class" class="px-4 py-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="n in 12" :key="n" :value="`Grade ${n}`">Grade {{ n }}</option>
            </select>
            <select v-model="newSubject.teacher" class="px-4 py-2 border rounded-lg">
              <option value="">Assign Teacher</option>
              <option value="Mr. John">Mr. John</option>
              <option value="Ms. Sarah">Ms. Sarah</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input v-model.number="newSubject.periodsPerWeek" type="number" placeholder="Periods/Week" class="px-4 py-2 border rounded-lg" />
            <select v-model="newSubject.difficulty" class="px-4 py-2 border rounded-lg">
              <option value="">Difficulty Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Exam Mapping</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="newSubject.exams" value="Term 1" />
                <span>Term 1</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="newSubject.exams" value="Term 2" />
                <span>Term 2</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="newSubject.exams" value="Final" />
                <span>Final Exam</span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="addSubject" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add Subject
          </button>
          <button @click="showAddSubject = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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

const activeTab = ref('subjects')
const showAddSubject = ref(false)
const showAddLesson = ref(false)
const showAddAssignment = ref(false)
const showAddTest = ref(false)
const selectedSubject = ref('')
const expandedUnits = ref<number[]>([])

const tabs = [
  { id: 'subjects', label: '📚 Subjects' },
  { id: 'syllabus', label: '📖 Syllabus' },
  { id: 'lessons', label: '📝 Lessons' },
  { id: 'materials', label: '📁 Materials' },
  { id: 'assignments', label: '📋 Assignments' },
  { id: 'tests', label: '📝 Tests' },
  { id: 'dashboard', label: '📊 Dashboard' }
]

const subjects = ref([
  { id: 1, name: 'Mathematics', code: 'MATH101', class: 'Grade 10', teacher: 'Mr. John', periodsPerWeek: 6, difficulty: 'Advanced', completion: 75, completedChapters: 9, totalChapters: 12, assignmentsCompleted: 8, totalAssignments: 10, avgScore: 85 },
  { id: 2, name: 'Physics', code: 'PHY101', class: 'Grade 10', teacher: 'Ms. Sarah', periodsPerWeek: 5, difficulty: 'Advanced', completion: 60, completedChapters: 7, totalChapters: 12, assignmentsCompleted: 6, totalAssignments: 10, avgScore: 78 },
  { id: 3, name: 'English', code: 'ENG101', class: 'Grade 10', teacher: 'Ms. Emily', periodsPerWeek: 5, difficulty: 'Medium', completion: 80, completedChapters: 10, totalChapters: 12, assignmentsCompleted: 9, totalAssignments: 10, avgScore: 88 },
  { id: 4, name: 'Chemistry', code: 'CHEM101', class: 'Grade 10', teacher: 'Mr. David', periodsPerWeek: 5, difficulty: 'Advanced', completion: 55, completedChapters: 6, totalChapters: 11, assignmentsCompleted: 5, totalAssignments: 9, avgScore: 75 }
])

const courseUnits = ref([
  {
    id: 1,
    name: 'Unit 1: Algebra',
    duration: 4,
    chapters: [
      {
        id: 1,
        name: 'Chapter 1: Linear Equations',
        description: 'Introduction to linear equations and their applications',
        completed: true,
        learningOutcomes: [
          'Understand the concept of linear equations',
          'Solve linear equations in one variable',
          'Apply linear equations to real-world problems'
        ],
        topics: ['Variables', 'Constants', 'Solving Equations', 'Word Problems']
      },
      {
        id: 2,
        name: 'Chapter 2: Quadratic Equations',
        description: 'Study of quadratic equations and their solutions',
        completed: false,
        learningOutcomes: [
          'Identify quadratic equations',
          'Solve using factorization',
          'Use quadratic formula'
        ],
        topics: ['Standard Form', 'Factorization', 'Quadratic Formula', 'Roots']
      }
    ]
  },
  {
    id: 2,
    name: 'Unit 2: Geometry',
    duration: 5,
    chapters: [
      {
        id: 3,
        name: 'Chapter 3: Triangles',
        description: 'Properties and theorems of triangles',
        completed: false,
        learningOutcomes: [
          'Understand triangle properties',
          'Apply Pythagoras theorem',
          'Calculate area and perimeter'
        ],
        topics: ['Types of Triangles', 'Pythagoras Theorem', 'Area', 'Congruence']
      }
    ]
  }
])

const lessonPlans = ref([
  { id: 1, title: 'Introduction to Linear Equations', subject: 'Mathematics', class: 'Grade 10', date: '2024-01-15', duration: 45, type: 'Theory', materials: ['Lesson_Plan.pdf', 'Slides.ppt'], completed: true },
  { id: 2, title: 'Quadratic Formula Derivation', subject: 'Mathematics', class: 'Grade 10', date: '2024-01-20', duration: 60, type: 'Theory + Practice', materials: ['Derivation.pdf', 'Practice_Problems.pdf'], completed: false },
  { id: 3, title: 'Triangle Properties Lab', subject: 'Mathematics', class: 'Grade 10', date: '2024-01-25', duration: 90, type: 'Practical', materials: ['Lab_Manual.pdf', 'Video_Tutorial.mp4'], completed: false }
])

const materials = ref([
  { id: 1, name: 'Chapter 1 Notes', subject: 'Mathematics', type: 'PDF', uploadDate: '2024-01-10' },
  { id: 2, name: 'Algebra Presentation', subject: 'Mathematics', type: 'PPT', uploadDate: '2024-01-12' },
  { id: 3, name: 'Equation Solving Tutorial', subject: 'Mathematics', type: 'Video', uploadDate: '2024-01-14' },
  { id: 4, name: 'Practice Worksheet', subject: 'Mathematics', type: 'Document', uploadDate: '2024-01-16' }
])

const assignments = ref([
  { id: 1, title: 'Linear Equations Practice', subject: 'Mathematics', class: 'Grade 10', description: 'Solve 20 linear equations', assignedDate: '2024-01-15', dueDate: '2024-01-22', submissions: 35, totalStudents: 40, maxMarks: 20, status: 'Active' },
  { id: 2, title: 'Quadratic Problems', subject: 'Mathematics', class: 'Grade 10', description: 'Solve quadratic equations using different methods', assignedDate: '2024-01-20', dueDate: '2024-01-27', submissions: 28, totalStudents: 40, maxMarks: 25, status: 'Active' },
  { id: 3, title: 'Geometry Assignment', subject: 'Mathematics', class: 'Grade 10', description: 'Triangle properties and theorems', assignedDate: '2024-01-10', dueDate: '2024-01-17', submissions: 40, totalStudents: 40, maxMarks: 30, status: 'Completed' }
])

const tests = ref([
  { id: 1, name: 'Unit Test 1', subject: 'Mathematics', class: 'Grade 10', type: 'Unit Test', date: '2024-01-18', maxMarks: 50, avgMarks: 38, highestMarks: 48, lowestMarks: 25 },
  { id: 2, name: 'Class Test - Algebra', subject: 'Mathematics', class: 'Grade 10', type: 'Class Test', date: '2024-01-25', maxMarks: 25, avgMarks: 20, highestMarks: 25, lowestMarks: 12 }
])

const materialFilter = ref({ subject: '', type: '' })
const testFilter = ref({ subject: '' })

const newSubject = ref({
  name: '',
  code: '',
  class: '',
  teacher: '',
  periodsPerWeek: 5,
  difficulty: '',
  exams: [] as string[]
})

const recentActivity = ref([
  { id: 1, icon: '📝', title: 'New Lesson Plan Added', description: 'Quadratic Formula Derivation', time: '2 hours ago' },
  { id: 2, icon: '📋', title: 'Assignment Submitted', description: '35 students submitted Linear Equations Practice', time: '5 hours ago' },
  { id: 3, icon: '📚', title: 'Material Uploaded', description: 'Chapter 2 Notes uploaded', time: '1 day ago' }
])

const completedTopics = computed(() => 156)
const totalMaterials = computed(() => materials.value.length)
const pendingAssignments = computed(() => assignments.value.filter(a => a.status === 'Active').length)

const filteredMaterials = computed(() => {
  let filtered = materials.value
  if (materialFilter.value.subject) {
    filtered = filtered.filter(m => m.subject === materialFilter.value.subject)
  }
  if (materialFilter.value.type) {
    filtered = filtered.filter(m => m.type === materialFilter.value.type)
  }
  return filtered
})

const filteredTests = computed(() => {
  if (!testFilter.value.subject) return tests.value
  return tests.value.filter(t => t.subject === testFilter.value.subject)
})

function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Advanced': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getProgressColor(percent: number) {
  if (percent >= 75) return 'bg-green-500'
  if (percent >= 50) return 'bg-blue-500'
  if (percent >= 25) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getAssignmentBorderColor(status: string) {
  return status === 'Completed' ? 'border-green-300' : 'border-yellow-300'
}

function getAssignmentStatusBadge(status: string) {
  return status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

function getFileIcon(type: string) {
  switch (type) {
    case 'PDF': return '📄'
    case 'PPT': return '📊'
    case 'Video': return '🎥'
    case 'Document': return '📝'
    default: return '📁'
  }
}

function toggleUnit(unitId: number) {
  const index = expandedUnits.value.indexOf(unitId)
  if (index > -1) {
    expandedUnits.value.splice(index, 1)
  } else {
    expandedUnits.value.push(unitId)
  }
}

function viewSubjectDetails(subject: any) {
  selectedSubject.value = subject.id
  activeTab.value = 'syllabus'
}

function uploadSyllabus() {
  alert('📤 Upload Syllabus PDF functionality')
}

function downloadLesson(lesson: any) {
  alert(`📥 Downloading ${lesson.title}`)
}

function editLesson(lesson: any) {
  alert(`✏️ Editing ${lesson.title}`)
}

function uploadMaterial() {
  alert('📤 Upload Material functionality')
}

function viewMaterial(material: any) {
  alert(`👁️ Viewing ${material.name}`)
}

function downloadMaterial(material: any) {
  alert(`📥 Downloading ${material.name}`)
}

function viewSubmissions(assignment: any) {
  alert(`📊 Viewing submissions for ${assignment.title}`)
}

function gradeAssignment(assignment: any) {
  alert(`✏️ Grading ${assignment.title}`)
}

function viewTestDetails(test: any) {
  alert(`📊 Viewing details for ${test.name}`)
}

function viewSubjectMaterials(subject: any) {
  alert(`📚 Viewing materials for ${subject.name}`)
}

function addSubject() {
  alert(`✅ Adding subject: ${newSubject.value.name}`)
  showAddSubject.value = false
}
</script>
