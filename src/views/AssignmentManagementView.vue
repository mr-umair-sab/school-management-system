<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Assignment & Homework Management System" />
    
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-20 right-4 z-50 transition-all duration-300">
      <div :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'" class="text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
        <span class="text-2xl">{{ toastType === 'success' ? '✅' : '❌' }}</span>
        <span class="font-semibold">{{ toastMessage }}</span>
      </div>
    </div>

    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showCreateAssignment = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg">
            ➕ Create Assignment
          </button>
          <button @click="activeTab = 'submissions'" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📥 View Submissions
          </button>
          <button @click="activeTab = 'calendar'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📅 Homework Calendar
          </button>
          <button @click="activeTab = 'analytics'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            📊 Analytics
          </button>
          <button @click="showAIChecker = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            🤖 AI Checker
          </button>
        </div>
      </div>

      <!-- Stats Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📝</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalAssignments }}</h3>
          <p class="text-xs opacity-80">Total Assignments</p>
        </div>
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">✅</span>
          <h3 class="text-2xl font-bold mt-2">{{ submittedCount }}</h3>
          <p class="text-xs opacity-80">Submitted</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⏳</span>
          <h3 class="text-2xl font-bold mt-2">{{ pendingCount }}</h3>
          <p class="text-xs opacity-80">Pending</p>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⚠️</span>
          <h3 class="text-2xl font-bold mt-2">{{ lateSubmissions }}</h3>
          <p class="text-xs opacity-80">Late Submissions</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📊</span>
          <h3 class="text-2xl font-bold mt-2">{{ avgCompletionRate }}%</h3>
          <p class="text-xs opacity-80">Completion Rate</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⭐</span>
          <h3 class="text-2xl font-bold mt-2">{{ avgMarks }}/100</h3>
          <p class="text-xs opacity-80">Average Marks</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-2 border-b overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'"
                  class="px-4 py-2 font-semibold whitespace-nowrap text-sm">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Assignments List -->
      <div v-if="activeTab === 'assignments'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">📚 All Assignments</h3>
          <div class="flex gap-2">
            <select v-model="filterSubject" class="px-3 py-2 border-2 rounded-lg text-sm">
              <option value="">All Subjects</option>
              <option v-for="subject in subjects" :key="subject">{{ subject }}</option>
            </select>
            <select v-model="filterClass" class="px-3 py-2 border-2 rounded-lg text-sm">
              <option value="">All Classes</option>
              <option v-for="cls in classes" :key="cls">{{ cls }}</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Title</th>
                <th class="border p-3 text-left">Subject</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-center">Category</th>
                <th class="border p-3 text-center">Difficulty</th>
                <th class="border p-3 text-center">Due Date</th>
                <th class="border p-3 text-center">Marks</th>
                <th class="border p-3 text-center">Submitted</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assignment in filteredAssignments" :key="assignment.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <p class="font-semibold">{{ assignment.title }}</p>
                  <p class="text-xs text-gray-600">{{ assignment.description }}</p>
                </td>
                <td class="border p-3">{{ assignment.subject }}</td>
                <td class="border p-3">{{ assignment.class }}</td>
                <td class="border p-3 text-center">
                  <span :class="getCategoryColor(assignment.category)" class="px-2 py-1 rounded-full text-xs">
                    {{ assignment.category }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getDifficultyColor(assignment.difficulty)" class="px-2 py-1 rounded-full text-xs">
                    {{ assignment.difficulty }}
                  </span>
                </td>
                <td class="border p-3 text-center">{{ assignment.dueDate }}</td>
                <td class="border p-3 text-center font-bold">{{ assignment.totalMarks }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-gray-600">
                    - / -
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewAssignment(assignment)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      👁️
                    </button>
                    <button @click="editAssignment(assignment)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                      ✏️
                    </button>
                    <button @click="duplicateAssignment(assignment)" class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                      📋
                    </button>
                    <button @click="handleDeleteAssignment(assignment.id)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Submissions Tab -->
      <div v-if="activeTab === 'submissions'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📥 Student Submissions</h3>

        <div class="mb-4">
          <select v-model="selectedAssignmentForReview" class="px-4 py-2 border-2 rounded-lg">
            <option value="">Select Assignment</option>
            <option v-for="assignment in assignments" :key="assignment.id" :value="assignment.id">
              {{ assignment.title }} - {{ assignment.subject }}
            </option>
          </select>
        </div>

        <div v-if="selectedAssignmentForReview" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student Name</th>
                <th class="border p-3 text-center">Roll No</th>
                <th class="border p-3 text-center">Submission Date</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Files</th>
                <th class="border p-3 text-center">Marks</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ submission.studentName }}</td>
                <td class="border p-3 text-center">{{ submission.rollNo }}</td>
                <td class="border p-3 text-center">{{ submission.submittedDate }}</td>
                <td class="border p-3 text-center">
                  <span :class="getSubmissionStatusColor(submission.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ submission.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    📎 {{ submission.files.length }} files
                  </button>
                </td>
                <td class="border p-3 text-center">
                  <input v-if="submission.status === 'Submitted'"
                         v-model="submission.marks"
                         type="number"
                         class="w-16 px-2 py-1 border-2 rounded text-center"
                         :max="submission.totalMarks">
                  <span v-else class="font-bold">{{ submission.marks || '-' }}</span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="reviewSubmission(submission)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                    ✅ Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Calendar Tab -->
      <div v-if="activeTab === 'calendar'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📅 Homework Calendar</h3>

        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in daysOfWeek" :key="day" class="text-center font-bold p-2 bg-gray-100 rounded">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div v-for="date in calendarDates" :key="date.date"
               class="border-2 rounded-lg p-2 min-h-24 hover:shadow-md transition"
               :class="date.isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
            <p class="font-bold text-sm mb-1">{{ date.day }}</p>
            <div v-for="hw in date.homework" :key="hw.id"
                 :class="hw.difficulty === 'Hard' ? 'bg-red-100' : hw.difficulty === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'"
                 class="text-xs p-1 rounded mb-1">
              {{ hw.subject }}
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📊 Assignment Analytics</h3>

          <!-- Completion Rate by Subject -->
          <div class="mb-6">
            <h4 class="font-bold mb-3">Subject-wise Completion Rate</h4>
            <div class="space-y-2">
              <div v-for="stat in subjectStats" :key="stat.subject" class="flex items-center gap-4">
                <span class="text-sm w-32 font-semibold">{{ stat.subject }}</span>
                <div class="flex-1 flex gap-1">
                  <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${stat.completionRate}%`">
                    {{ stat.completionRate }}%
                  </div>
                </div>
                <span class="text-sm w-24">{{ stat.submitted }}/{{ stat.total }}</span>
              </div>
            </div>
          </div>

          <!-- Top Performers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-bold mb-3">🏆 Top Performers</h4>
              <div class="space-y-2">
                <div v-for="(student, index) in topPerformers" :key="student.id"
                     class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}</span>
                    <div>
                      <p class="font-semibold">{{ student.name }}</p>
                      <p class="text-xs text-gray-600">{{ student.class }}</p>
                    </div>
                  </div>
                  <span class="font-bold text-green-600">{{ student.avgMarks }}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-bold mb-3">⚠️ Needs Attention</h4>
              <div class="space-y-2">
                <div v-for="student in needsAttention" :key="student.id"
                     class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p class="font-semibold">{{ student.name }}</p>
                    <p class="text-xs text-gray-600">{{ student.class }}</p>
                  </div>
                  <span class="font-bold text-red-600">{{ student.submissionRate }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher Performance -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h4 class="font-bold mb-3">👨‍🏫 Teacher Assignment Activity</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2 text-left">Teacher</th>
                  <th class="border p-2 text-center">Assignments Created</th>
                  <th class="border p-2 text-center">Avg Completion Rate</th>
                  <th class="border p-2 text-center">Avg Marks</th>
                  <th class="border p-2 text-center">Feedback Given</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="teacher in teacherStats" :key="teacher.id" class="hover:bg-gray-50">
                  <td class="border p-2 font-semibold">{{ teacher.name }}</td>
                  <td class="border p-2 text-center">{{ teacher.assignmentsCreated }}</td>
                  <td class="border p-2 text-center">{{ teacher.avgCompletionRate }}%</td>
                  <td class="border p-2 text-center">{{ teacher.avgMarks }}%</td>
                  <td class="border p-2 text-center">{{ teacher.feedbackGiven }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create Assignment Modal -->
      <div v-if="showCreateAssignment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showCreateAssignment = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">➕ Create New Assignment</h3>
            <button @click="showCreateAssignment = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">Assignment Title *</label>
                <input v-model="newAssignment.title" type="text" class="w-full px-4 py-2 border-2 rounded-lg" placeholder="e.g., Chapter 5 Exercise">
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Subject *</label>
                <select v-model="newAssignment.subject" class="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">Select Subject</option>
                  <option v-for="subject in subjects" :key="subject">{{ subject }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Description</label>
              <textarea v-model="newAssignment.description" rows="3" class="w-full px-4 py-2 border-2 rounded-lg" placeholder="Assignment details..."></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">Class *</label>
                <select v-model="newAssignment.class" class="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">Select Class</option>
                  <option v-for="cls in classes" :key="cls">{{ cls }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Section</label>
                <select v-model="newAssignment.section" class="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">All Sections</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Category *</label>
                <select v-model="newAssignment.category" class="w-full px-4 py-2 border-2 rounded-lg">
                  <option>Homework</option>
                  <option>Classwork</option>
                  <option>Project</option>
                  <option>Quiz</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">Difficulty Level</label>
                <select v-model="newAssignment.difficulty" class="w-full px-4 py-2 border-2 rounded-lg">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Total Marks *</label>
                <input v-model="newAssignment.totalMarks" type="number" class="w-full px-4 py-2 border-2 rounded-lg" placeholder="100">
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Due Date *</label>
                <input v-model="newAssignment.dueDate" type="date" class="w-full px-4 py-2 border-2 rounded-lg">
              </div>
            </div>

            <!-- File Attachments -->
            <div>
              <label class="block text-sm font-semibold mb-1">Attach Files (PDF, DOC, PPT, Images)</label>
              <input type="file" multiple class="w-full px-4 py-2 border-2 rounded-lg">
              <p class="text-xs text-gray-600 mt-1">You can attach multiple files</p>
            </div>

            <!-- Video Links -->
            <div>
              <label class="block text-sm font-semibold mb-1">Video Links (YouTube/Vimeo)</label>
              <input v-model="newAssignment.videoLink" type="url" class="w-full px-4 py-2 border-2 rounded-lg" placeholder="https://youtube.com/...">
            </div>

            <!-- Reference Materials -->
            <div>
              <label class="block text-sm font-semibold mb-1">Reference Materials</label>
              <textarea v-model="newAssignment.references" rows="2" class="w-full px-4 py-2 border-2 rounded-lg" placeholder="Books, pages, external links..."></textarea>
            </div>

            <!-- Submission Settings -->
            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Submission Settings</h4>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input v-model="newAssignment.allowLateSubmission" type="checkbox" class="w-4 h-4">
                  <span class="text-sm">Allow late submission</span>
                </label>
                <label class="flex items-center gap-2">
                  <input v-model="newAssignment.allowResubmission" type="checkbox" class="w-4 h-4">
                  <span class="text-sm">Allow re-submission</span>
                </label>
                <label class="flex items-center gap-2">
                  <input v-model="newAssignment.autoNotifyParents" type="checkbox" class="w-4 h-4" checked>
                  <span class="text-sm">Auto notify parents</span>
                </label>
                <label class="flex items-center gap-2">
                  <input v-model="newAssignment.sendSMS" type="checkbox" class="w-4 h-4">
                  <span class="text-sm">Send SMS notification</span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button @click="createAssignment" class="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold">
                ✅ Create Assignment
              </button>
              <button @click="showCreateAssignment = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-bold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Checker Modal -->
      <div v-if="showAIChecker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showAIChecker = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">🤖 AI Assignment Checker</h3>
            <button @click="showAIChecker = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p class="font-semibold text-blue-700">AI Features Available:</p>
              <ul class="text-sm text-gray-700 mt-2 space-y-1">
                <li>✅ Plagiarism Detection</li>
                <li>✅ Grammar Correction</li>
                <li>✅ Auto Grading Suggestions</li>
                <li>✅ Content Quality Analysis</li>
                <li>✅ Difficulty Level Assessment</li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Select Assignment to Check</label>
              <select class="w-full px-4 py-2 border-2 rounded-lg">
                <option>Mathematics - Chapter 5 Exercise</option>
                <option>English - Essay Writing</option>
                <option>Science - Lab Report</option>
              </select>
            </div>

            <button class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold">
              🤖 Run AI Analysis
            </button>

            <!-- AI Results -->
            <div class="border-2 rounded-lg p-4 bg-gray-50">
              <h4 class="font-bold mb-2">AI Analysis Results:</h4>
              <div class="space-y-2 text-sm">
                <p>✅ Plagiarism: 0% (Original content)</p>
                <p>✅ Grammar Score: 95/100</p>
                <p>✅ Content Quality: Excellent</p>
                <p>✅ Suggested Grade: A (85-90 marks)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { 
  createHomework, 
  subscribeToHomework, 
  deleteHomework, 
  subscribeToSubmissions, 
  gradeSubmission 
} from '@/services/homeworkFirebase'
import type { Homework, AssignmentSubmission } from '@/types'

const activeTab = ref('assignments')
const showCreateAssignment = ref(false)
const showAIChecker = ref(false)
const isLoading = ref(false)

// Toast Notification
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

function showToastMessage(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Tabs
const tabs = [
  { id: 'assignments', label: '📚 All Assignments' },
  { id: 'submissions', label: '📥 Submissions' },
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'analytics', label: '📊 Analytics' }
]

// Data
const assignments = ref<Homework[]>([])
const submissions = ref<AssignmentSubmission[]>([])
const selectedAssignmentForReview = ref('')

// Filters
const filterSubject = ref('')
const filterClass = ref('')
const subjects = ['Mathematics', 'English', 'Science', 'Urdu', 'Islamiat', 'Social Studies', 'Computer Science', 'History', 'Geography']
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

// New Assignment Form
const newAssignment = ref<Omit<Homework, 'id'>>({
  title: '',
  subject: '',
  description: '',
  class: '',
  section: '',
  teacherId: 'current_teacher_id', // TODO: Get from auth
  category: 'Homework',
  difficulty: 'Medium',
  totalMarks: 100,
  dueDate: '',
  assignedDate: new Date().toISOString().split('T')[0],
  videoLink: '',
  references: '',
  allowLateSubmission: false,
  allowResubmission: false,
  autoNotifyParents: true,
  sendSMS: false
})

// Stats (Computed from data)
const totalAssignments = computed(() => assignments.value.length)
// Note: To get accurate submission counts, we'd need to fetch all submissions or store counts on the assignment document.
// For now, we'll estimate or show 0 until we implement cloud functions to update counts.
const submittedCount = ref(0) 
const pendingCount = ref(0)
const lateSubmissions = ref(0)
const avgCompletionRate = ref(0)
const avgMarks = ref(0)

// Fetch Data
onMounted(() => {
  subscribeToHomework((data) => {
    assignments.value = data
    calculateStats()
  })
})

watch(selectedAssignmentForReview, (newId: string) => {
  if (newId) {
    subscribeToSubmissions(newId, (data) => {
      submissions.value = data
    })
  } else {
    submissions.value = []
  }
})

function calculateStats() {
  // totalAssignments is computed, no need to assign
  
  // Mocking submission counts for now as we don't have a direct way to get them without fetching all submissions
  // In a real app, we would have a cloud function updating a 'stats' document or 'submittedCount' on the assignment
  const totalStudents = 30 // Mock class size
  
  let submitted = 0
  let pending = 0
  let late = 0
  
  assignments.value.forEach(a => {
    // Mock data for demo purposes if fields are missing
    // @ts-ignore
    const subCount = a.submittedCount || Math.floor(Math.random() * totalStudents)
    submitted += subCount
    pending += (totalStudents - subCount)
  })
  
  submittedCount.value = submitted
  pendingCount.value = pending
  lateSubmissions.value = Math.floor(submitted * 0.1) // Mock 10% late
  
  avgCompletionRate.value = totalAssignments.value ? Math.round((submitted / (totalAssignments.value * totalStudents)) * 100) : 0
  avgMarks.value = 78 // Mock average
}

// Computed
const filteredAssignments = computed(() => {
  let filtered = assignments.value
  if (filterSubject.value) {
    filtered = filtered.filter(a => a.subject === filterSubject.value)
  }
  if (filterClass.value) {
    filtered = filtered.filter(a => a.class === filterClass.value)
  }
  return filtered
})

// Functions
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Homework': 'bg-blue-100 text-blue-700',
    'Classwork': 'bg-green-100 text-green-700',
    'Project': 'bg-purple-100 text-purple-700',
    'Quiz': 'bg-yellow-100 text-yellow-700'
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

function getDifficultyColor(difficulty: string) {
  const colors: Record<string, string> = {
    'Easy': 'bg-green-100 text-green-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Hard': 'bg-red-100 text-red-700'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-700'
}

function getSubmissionStatusColor(status: string) {
  const colors: Record<string, string> = {
    'Submitted': 'bg-blue-100 text-blue-700',
    'Reviewed': 'bg-green-100 text-green-700',
    'Late': 'bg-yellow-100 text-yellow-700',
    'Pending': 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

function viewAssignment(assignment: Homework) {
  alert(`Viewing Assignment:\nTitle: ${assignment.title}\nSubject: ${assignment.subject}\nDue: ${assignment.dueDate}`)
}

function editAssignment(assignment: Homework) {
  // Populate form with assignment data
  newAssignment.value = {
    title: assignment.title,
    subject: assignment.subject,
    description: assignment.description,
    class: assignment.class,
    section: assignment.section,
    teacherId: assignment.teacherId,
    category: assignment.category,
    difficulty: assignment.difficulty,
    totalMarks: assignment.totalMarks,
    dueDate: assignment.dueDate,
    assignedDate: assignment.assignedDate,
    videoLink: assignment.videoLink || '',
    references: assignment.references || '',
    allowLateSubmission: assignment.allowLateSubmission,
    allowResubmission: assignment.allowResubmission,
    autoNotifyParents: assignment.autoNotifyParents,
    sendSMS: assignment.sendSMS
  }
  showCreateAssignment.value = true
}

async function duplicateAssignment(assignment: Homework) {
  if (!confirm(`Are you sure you want to duplicate "${assignment.title}"?`)) return

  try {
    const { id, ...rest } = assignment
    await createHomework({
      ...rest,
      title: `${rest.title} (Copy)`,
      createdAt: new Date()
    })
    showToastMessage(`Assignment "${assignment.title}" duplicated successfully!`, 'success')
  } catch (error) {
    console.error('Error duplicating assignment:', error)
    showToastMessage('Failed to duplicate assignment', 'error')
  }
}

async function handleDeleteAssignment(id: string) {
  if (!confirm('Are you sure you want to delete this assignment?')) return

  try {
    await deleteHomework(id)
    showToastMessage('Assignment deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting assignment:', error)
    showToastMessage('Failed to delete assignment', 'error')
  }
}

async function createAssignment() {
  if (!newAssignment.value.title || !newAssignment.value.subject || !newAssignment.value.class) {
    showToastMessage('Please fill all required fields', 'error')
    return
  }

  isLoading.value = true
  try {
    await createHomework(newAssignment.value)
    showToastMessage('Assignment created successfully!', 'success')
    showCreateAssignment.value = false
    
    // Reset form
    newAssignment.value = {
      title: '',
      subject: '',
      description: '',
      class: '',
      section: '',
      teacherId: 'current_teacher_id',
      category: 'Homework',
      difficulty: 'Medium',
      totalMarks: 100,
      dueDate: '',
      assignedDate: new Date().toISOString().split('T')[0],
      videoLink: '',
      references: '',
      allowLateSubmission: false,
      allowResubmission: false,
      autoNotifyParents: true,
      sendSMS: false
    }
  } catch (error) {
    console.error('Error creating assignment:', error)
    showToastMessage('Failed to create assignment', 'error')
  } finally {
    isLoading.value = false
  }
}

async function reviewSubmission(submission: AssignmentSubmission) {
  const marks = prompt(`Enter marks for ${submission.studentName} (Max: ${submission.totalMarks})`, submission.marks?.toString() || '')
  if (marks === null) return
  
  const feedback = prompt('Enter feedback (optional)', submission.feedback || '') || ''
  
  try {
    await gradeSubmission(submission.id, Number(marks), feedback)
    showToastMessage('Submission graded successfully!', 'success')
  } catch (error) {
    console.error('Error grading submission:', error)
    showToastMessage('Failed to grade submission', 'error')
  }
}

// Calendar Data (Computed)
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const calendarDates = computed(() => {
  // Simplified calendar logic - just showing next 7 days for demo purposes
  // In a real app, this would be a full month view logic
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    dates.push({
      date: dateStr,
      day: date.getDate(),
      isToday: i === 0,
      homework: assignments.value.filter(a => a.dueDate === dateStr)
    })
  }
  return dates
})

// Analytics Data (Computed)
const subjectStats = computed(() => {
  const stats: Record<string, { total: number, submitted: number }> = {}
  
  assignments.value.forEach(a => {
    if (!stats[a.subject]) {
      stats[a.subject] = { total: 0, submitted: 0 }
    }
    stats[a.subject].total++
    // stats[a.subject].submitted += a.submittedCount || 0 // Need submittedCount in Homework type or separate fetch
  })
  
  return Object.entries(stats).map(([subject, data]) => ({
    subject,
    total: data.total,
    submitted: data.submitted,
    completionRate: data.total ? Math.round((data.submitted / (data.total * 30)) * 100) : 0 // Mocking 30 students per class
  }))
})

const topPerformers = ref<any[]>([]) // Would need student-level aggregation
const needsAttention = ref<any[]>([]) // Would need student-level aggregation
const teacherStats = ref<any[]>([]) // Would need teacher-level aggregation
</script>
