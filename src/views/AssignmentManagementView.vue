<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Assignment & Homework Management System" />
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
                  <span class="font-bold" :class="assignment.submittedCount >= assignment.totalStudents * 0.8 ? 'text-green-600' : 'text-red-600'">
                    {{ assignment.submittedCount }}/{{ assignment.totalStudents }}
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
                    📎 {{ submission.fileCount }} files
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
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

const activeTab = ref('assignments')
const showCreateAssignment = ref(false)
const showAIChecker = ref(false)

// Tabs
const tabs = [
  { id: 'assignments', label: '📚 All Assignments' },
  { id: 'submissions', label: '📥 Submissions' },
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'analytics', label: '📊 Analytics' }
]

// Stats
const totalAssignments = ref(156)
const submittedCount = ref(1245)
const pendingCount = ref(234)
const lateSubmissions = ref(45)
const avgCompletionRate = ref(84)
const avgMarks = ref(78)

// Filters
const filterSubject = ref('')
const filterClass = ref('')
const selectedAssignmentForReview = ref('')

const subjects = ['Mathematics', 'English', 'Science', 'Urdu', 'Islamiat', 'Social Studies']
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

// Assignments Data
const assignments = ref([
  { id: 1, title: 'Chapter 5 Exercise 5.1', description: 'Complete all questions', subject: 'Mathematics', class: 'Class 10', category: 'Homework', difficulty: 'Medium', dueDate: '2024-11-25', totalMarks: 20, submittedCount: 35, totalStudents: 45 },
  { id: 2, title: 'Essay on Climate Change', description: 'Write 500 words essay', subject: 'English', class: 'Class 9', category: 'Project', difficulty: 'Hard', dueDate: '2024-11-28', totalMarks: 50, submittedCount: 28, totalStudents: 40 },
  { id: 3, title: 'Lab Report - Experiment 3', description: 'Submit detailed lab report', subject: 'Science', class: 'Class 10', category: 'Classwork', difficulty: 'Medium', dueDate: '2024-11-22', totalMarks: 30, submittedCount: 42, totalStudents: 45 },
  { id: 4, title: 'Poem Memorization', description: 'Memorize and recite', subject: 'Urdu', class: 'Class 8', category: 'Homework', difficulty: 'Easy', dueDate: '2024-11-24', totalMarks: 10, submittedCount: 38, totalStudents: 42 },
  { id: 5, title: 'Islamic History Quiz', description: 'Online quiz on Islamic history', subject: 'Islamiat', class: 'Class 9', category: 'Quiz', difficulty: 'Medium', dueDate: '2024-11-26', totalMarks: 25, submittedCount: 32, totalStudents: 40 }
])

// Submissions Data
const submissions = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNo: '101', submittedDate: '2024-11-20 10:30 AM', status: 'Submitted', fileCount: 2, marks: null, totalMarks: 20 },
  { id: 2, studentName: 'Fatima Hassan', rollNo: '102', submittedDate: '2024-11-20 09:15 AM', status: 'Reviewed', fileCount: 1, marks: 18, totalMarks: 20 },
  { id: 3, studentName: 'Ali Raza', rollNo: '103', submittedDate: '2024-11-21 11:00 AM', status: 'Late', fileCount: 3, marks: null, totalMarks: 20 },
  { id: 4, studentName: 'Sara Ahmed', rollNo: '104', submittedDate: null, status: 'Pending', fileCount: 0, marks: null, totalMarks: 20 }
])

// Calendar Data
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const calendarDates = ref([
  { date: '2024-11-17', day: 17, isToday: false, homework: [] },
  { date: '2024-11-18', day: 18, isToday: false, homework: [{ id: 1, subject: 'Math', difficulty: 'Medium' }] },
  { date: '2024-11-19', day: 19, isToday: false, homework: [{ id: 2, subject: 'English', difficulty: 'Hard' }] },
  { date: '2024-11-20', day: 20, isToday: false, homework: [{ id: 3, subject: 'Science', difficulty: 'Easy' }] },
  { date: '2024-11-21', day: 21, isToday: true, homework: [{ id: 4, subject: 'Urdu', difficulty: 'Easy' }, { id: 5, subject: 'Math', difficulty: 'Medium' }] },
  { date: '2024-11-22', day: 22, isToday: false, homework: [{ id: 6, subject: 'Islamiat', difficulty: 'Medium' }] },
  { date: '2024-11-23', day: 23, isToday: false, homework: [] }
])

// Analytics Data
const subjectStats = ref([
  { subject: 'Mathematics', completionRate: 88, submitted: 132, total: 150 },
  { subject: 'English', completionRate: 82, submitted: 123, total: 150 },
  { subject: 'Science', completionRate: 90, submitted: 135, total: 150 },
  { subject: 'Urdu', completionRate: 85, submitted: 128, total: 150 },
  { subject: 'Islamiat', completionRate: 92, submitted: 138, total: 150 }
])

const topPerformers = ref([
  { id: 1, name: 'Fatima Hassan', class: 'Class 10-A', avgMarks: 95 },
  { id: 2, name: 'Ahmed Ali', class: 'Class 10-A', avgMarks: 92 },
  { id: 3, name: 'Sara Ahmed', class: 'Class 9-B', avgMarks: 90 }
])

const needsAttention = ref([
  { id: 1, name: 'Ali Raza', class: 'Class 10-A', submissionRate: 45 },
  { id: 2, name: 'Hassan Khan', class: 'Class 9-B', submissionRate: 52 },
  { id: 3, name: 'Ayesha Malik', class: 'Class 8-C', submissionRate: 58 }
])

const teacherStats = ref([
  { id: 1, name: 'Ms. Sarah Ahmed', assignmentsCreated: 45, avgCompletionRate: 88, avgMarks: 82, feedbackGiven: 42 },
  { id: 2, name: 'Mr. Ali Khan', assignmentsCreated: 38, avgCompletionRate: 85, avgMarks: 79, feedbackGiven: 35 },
  { id: 3, name: 'Ms. Fatima Hassan', assignmentsCreated: 42, avgCompletionRate: 90, avgMarks: 85, feedbackGiven: 40 }
])

// New Assignment Form
const newAssignment = ref({
  title: '',
  subject: '',
  description: '',
  class: '',
  section: '',
  category: 'Homework',
  difficulty: 'Medium',
  totalMarks: 100,
  dueDate: '',
  videoLink: '',
  references: '',
  allowLateSubmission: false,
  allowResubmission: false,
  autoNotifyParents: true,
  sendSMS: false
})

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

function viewAssignment(assignment: typeof assignments.value[0]) {
  console.log('Viewing assignment:', assignment)
}

function editAssignment(assignment: typeof assignments.value[0]) {
  console.log('Editing assignment:', assignment)
}

function duplicateAssignment(assignment: typeof assignments.value[0]) {
  console.log('Duplicating assignment:', assignment)
  alert(`Assignment "${assignment.title}" duplicated successfully!`)
}

function reviewSubmission(submission: typeof submissions.value[0]) {
  console.log('Reviewing submission:', submission)
}

function createAssignment() {
  if (!newAssignment.value.title || !newAssignment.value.subject || !newAssignment.value.class) {
    alert('Please fill all required fields')
    return
  }

  alert('Assignment created successfully!')
  showCreateAssignment.value = false

  // Reset form
  newAssignment.value = {
    title: '',
    subject: '',
    description: '',
    class: '',
    section: '',
    category: 'Homework',
    difficulty: 'Medium',
    totalMarks: 100,
    dueDate: '',
    videoLink: '',
    references: '',
    allowLateSubmission: false,
    allowResubmission: false,
    autoNotifyParents: true,
    sendSMS: false
  }
}
</script>
