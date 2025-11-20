<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Exam Management System" />

    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showCreateExam = true" class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg">
            ➕ Create Exam
          </button>
          <button @click="activeTab = 'schedule'" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📅 Schedule
          </button>
          <button @click="activeTab = 'seating'" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🪑 Seating
          </button>
          <button @click="activeTab = 'marks'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            📝 Marks Entry
          </button>
          <button @click="activeTab = 'results'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📊 Results
          </button>
          <button @click="activeTab = 'analytics'" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            📈 Analytics
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
            class=" py-2 font-semibold whitespace-nowrap text-sm"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Exam Types Management -->
      <div v-if="activeTab === 'types'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📋 Exam Types Management</h2>
          <button @click="showAddExamType = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Add Exam Type
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="examType in examTypes" :key="examType.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ examType.name }}</h3>
                <p class="text-sm text-gray-600">{{ examType.description }}</p>
              </div>
              <button @click="editExamType(examType)" class="text-blue-500 hover:text-blue-700">
                ✏️
              </button>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Grading Method:</span>
                <span class="font-semibold">{{ examType.gradingMethod }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Weightage:</span>
                <span class="font-semibold">{{ examType.weightage }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pass Criteria:</span>
                <span class="font-semibold">{{ examType.passCriteria }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Max Marks:</span>
                <span class="font-semibold">{{ examType.maxMarks }}</span>
              </div>
            </div>

            <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full" :style="`width: ${examType.weightage}%`"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Schedule Creator -->
      <div v-if="activeTab === 'schedule'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📅 Exam Schedule Creator</h2>
          <div class="flex gap-2">
            <button @click="autoGenerateSchedule" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              🤖 Auto-Generate
            </button>
            <button @click="downloadSchedulePDF" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📥 Download PDF
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold mb-2">Select Exam</label>
          <select v-model="selectedExam" class="px-4 py-2 border rounded-lg">
            <option value="">Select Exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.name }} - {{ exam.class }}
            </option>
          </select>
        </div>

        <div v-if="selectedExam" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Date</th>
                <th class="border p-3 text-left">Time</th>
                <th class="border p-3 text-left">Subject</th>
                <th class="border p-3 text-left">Room</th>
                <th class="border p-3 text-left">Invigilator</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in examSchedules" :key="schedule.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ schedule.date }}</td>
                <td class="border p-3">{{ schedule.time }}</td>
                <td class="border p-3 font-semibold">{{ schedule.subject }}</td>
                <td class="border p-3">{{ schedule.room }}</td>
                <td class="border p-3">{{ schedule.invigilator }}</td>
                <td class="border p-3 text-center">
                  <span :class="getScheduleStatusBadge(schedule.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ schedule.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="editSchedule(schedule)" class="text-blue-500 hover:text-blue-700 mr-2">
                    ✏️
                  </button>
                  <button @click="deleteSchedule(schedule.id)" class="text-red-500 hover:text-red-700">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="clashDetected" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="font-bold text-red-700">⚠️ Clash Detected!</p>
          <p class="text-sm text-red-600">{{ clashMessage }}</p>
        </div>
      </div>

      <!-- Seating Arrangement -->
      <div v-if="activeTab === 'seating'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🪑 Seating Arrangement</h2>
          <div class="flex gap-2">
            <button @click="autoGenerateSeating" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              🤖 Auto-Generate
            </button>
            <button @click="exportSeatingPlan" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📥 Export PDF
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="seatingExam" class="px-4 py-2 border rounded-lg">
            <option value="">Select Exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.name }}
            </option>
          </select>
          <select v-model="seatingRoom" class="px-4 py-2 border rounded-lg">
            <option value="">Select Room</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }} (Capacity: {{ room.capacity }})
            </option>
          </select>
          <input type="number" v-model="seatsPerRow" placeholder="Seats per row"
                 class="px-4 py-2 border rounded-lg" />
        </div>

        <div v-if="seatingExam && seatingRoom" class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-600">Total Students</p>
                <p class="text-2xl font-bold text-blue-600">{{ seatingPlan.totalStudents }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Room Capacity</p>
                <p class="text-2xl font-bold text-green-600">{{ seatingPlan.roomCapacity }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Available Seats</p>
                <p class="text-2xl font-bold text-purple-600">{{ seatingPlan.availableSeats }}</p>
              </div>
            </div>
          </div>

          <!-- Seating Grid -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="text-center mb-4 p-2 bg-gray-700 text-white rounded">
              📋 BOARD
            </div>
            <div class="grid gap-2" :style="`grid-template-columns: repeat(${seatsPerRow}, 1fr)`">
              <div v-for="seat in seatingPlan.seats" :key="seat.id"
                   :class="seat.occupied ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'"
                   class="border-2 rounded p-2 text-center text-sm">
                <div class="font-bold">{{ seat.seatNumber }}</div>
                <div v-if="seat.occupied" class="text-xs text-gray-600">{{ seat.studentName }}</div>
                <div v-if="seat.occupied" class="text-xs text-gray-500">{{ seat.rollNumber }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Attendance -->
      <div v-if="activeTab === 'attendance'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">✅ Exam Attendance Management</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="attendanceExam" class="px-4 py-2 border rounded-lg">
            <option value="">Select Exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.name }}
            </option>
          </select>
          <select v-model="attendanceSubject" class="px-4 py-2 border rounded-lg">
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
          </select>
          <button @click="sendAbsentSMS" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📱 Send SMS to Absent
          </button>
        </div>

        <div v-if="attendanceExam" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Roll No</th>
                <th class="border p-3 text-left">Student Name</th>
                <th class="border p-3 text-center">Present</th>
                <th class="border p-3 text-center">Absent</th>
                <th class="border p-3 text-center">Late Entry</th>
                <th class="border p-3 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in examAttendanceList" :key="student.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ student.rollNumber }}</td>
                <td class="border p-3 font-semibold">{{ student.name }}</td>
                <td class="border p-3 text-center">
                  <input type="radio" :name="`attendance-${student.id}`" value="present"
                         v-model="student.status" class="w-5 h-5" />
                </td>
                <td class="border p-3 text-center">
                  <input type="radio" :name="`attendance-${student.id}`" value="absent"
                         v-model="student.status" class="w-5 h-5" />
                </td>
                <td class="border p-3 text-center">
                  <input type="checkbox" v-model="student.lateEntry" class="w-5 h-5" />
                </td>
                <td class="border p-3">
                  <input type="text" v-model="student.remarks"
                         class="w-full px-2 py-1 border rounded text-sm" />
                </td>
              </tr>
            </tbody>
          </table>

          <button @click="saveExamAttendance" class="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            💾 Save Attendance
          </button>
        </div>
      </div>

      <!-- Marks Entry -->
      <div v-if="activeTab === 'marks'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📝 Marks Entry System</h2>
          <div class="flex gap-2">
            <button @click="bulkUpload" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              📤 Bulk Upload (Excel)
            </button>
            <button @click="submitForApproval" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              ✅ Submit for Approval
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="marksExam" class="px-4 py-2 border rounded-lg">
            <option value="">Select Exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.name }}
            </option>
          </select>
          <select v-model="marksSubject" class="px-4 py-2 border rounded-lg">
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
          </select>
          <input type="number" v-model="maxMarks" placeholder="Max Marks"
                 class="px-4 py-2 border rounded-lg" />
        </div>

        <div v-if="marksExam && marksSubject" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Roll No</th>
                <th class="border p-3 text-left">Student Name</th>
                <th class="border p-3 text-center">Marks Obtained</th>
                <th class="border p-3 text-center">Grade</th>
                <th class="border p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in marksEntryList" :key="student.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ student.rollNumber }}</td>
                <td class="border p-3 font-semibold">{{ student.name }}</td>
                <td class="border p-3 text-center">
                  <input type="number" v-model="student.marks" :max="maxMarks"
                         @input="calculateGrade(student)"
                         class="w-20 px-2 py-1 border rounded text-center" />
                </td>
                <td class="border p-3 text-center">
                  <span :class="getGradeBadge(student.grade)" class="px-3 py-1 rounded-full font-bold">
                    {{ student.grade }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="student.marks >= (maxMarks * 0.4) ? 'text-green-600' : 'text-red-600'"
                        class="font-semibold">
                    {{ student.marks >= (maxMarks * 0.4) ? 'Pass' : 'Fail' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-4 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-600">Average</p>
                <p class="text-2xl font-bold text-blue-600">{{ calculateAverage() }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Highest</p>
                <p class="text-2xl font-bold text-green-600">{{ calculateHighest() }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Lowest</p>
                <p class="text-2xl font-bold text-red-600">{{ calculateLowest() }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Pass %</p>
                <p class="text-2xl font-bold text-purple-600">{{ calculatePassPercentage() }}%</p>
              </div>
            </div>
          </div>

          <button @click="saveMarks" class="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            💾 Save Marks
          </button>
        </div>
      </div>

      <!-- Results Publishing -->
      <div v-if="activeTab === 'results'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📊 Result Publishing System</h2>
          <button @click="publishResults" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🚀 Publish Results
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="p-4 border rounded-lg">
            <h3 class="font-bold mb-3">Result Status</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="radio" v-model="resultStatus" value="draft" />
                <span>Draft (Not Visible)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="resultStatus" value="pending-approval" />
                <span>Pending Approval</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="resultStatus" value="published" />
                <span>Published (Visible to All)</span>
              </label>
            </div>
          </div>

          <div class="p-4 border rounded-lg">
            <h3 class="font-bold mb-3">Notification Settings</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="notifyEmail" />
                <span>Send Email Notification</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="notifySMS" />
                <span>Send SMS Notification</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="notifyParents" />
                <span>Notify Parents</span>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="result in publishedResults" :key="result.id"
               class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg">{{ result.examName }}</h3>
                <p class="text-sm text-gray-600">{{ result.class }} - {{ result.term }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="downloadMarksheet(result)"
                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  📥 Download
                </button>
                <button @click="viewResult(result)"
                        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  👁️ View
                </button>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-3 text-sm">
              <div>
                <p class="text-gray-600">Total Students</p>
                <p class="font-bold">{{ result.totalStudents }}</p>
              </div>
              <div>
                <p class="text-gray-600">Pass</p>
                <p class="font-bold text-green-600">{{ result.passed }}</p>
              </div>
              <div>
                <p class="text-gray-600">Fail</p>
                <p class="font-bold text-red-600">{{ result.failed }}</p>
              </div>
              <div>
                <p class="text-gray-600">Status</p>
                <span :class="getResultStatusBadge(result.status)" class="px-2 py-1 rounded-full text-xs">
                  {{ result.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Analytics -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📈 Performance Analytics</h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-blue-600">85%</p>
              <p class="text-sm text-gray-600">Overall Pass Rate</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-green-600">78.5</p>
              <p class="text-sm text-gray-600">Average Score</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-purple-600">12</p>
              <p class="text-sm text-gray-600">Top Performers</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg text-center">
              <p class="text-3xl font-bold text-yellow-600">5</p>
              <p class="text-sm text-gray-600">Need Attention</p>
            </div>
          </div>

          <!-- Top Performers -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">🏆 Top 3 Performers</h3>
            <div class="space-y-2">
              <div v-for="(student, index) in topPerformers" :key="student.id"
                   class="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ ['🥇', '🥈', '🥉'][index] }}</span>
                  <div>
                    <p class="font-bold">{{ student.name }}</p>
                    <p class="text-sm text-gray-600">{{ student.class }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-green-600">{{ student.percentage }}%</p>
                  <p class="text-sm text-gray-600">Grade: {{ student.grade }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Subject-wise Performance -->
          <div>
            <h3 class="font-bold text-lg mb-4">📚 Subject-wise Performance</h3>
            <div class="space-y-3">
              <div v-for="subject in subjectPerformance" :key="subject.name"
                   class="flex items-center gap-4">
                <span class="text-sm font-semibold w-32">{{ subject.name }}</span>
                <div class="flex-1">
                  <div class="w-full bg-gray-200 rounded-full h-6">
                    <div :class="getPerformanceColor(subject.average)"
                         class="h-6 rounded-full flex items-center justify-end pr-2"
                         :style="`width: ${subject.average}%`">
                      <span class="text-xs text-white font-bold">{{ subject.average }}%</span>
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ subject.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Re-check System -->
      <div v-if="activeTab === 'recheck'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">🔄 Re-Check / Re-Evaluation System</h2>

        <div class="space-y-4">
          <div v-for="request in recheckRequests" :key="request.id"
               class="p-4 border-2 rounded-lg"
               :class="getRecheckBorderColor(request.status)">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold">{{ request.studentName }}</h3>
                <p class="text-sm text-gray-600">{{ request.exam }} - {{ request.subject }}</p>
                <p class="text-sm text-gray-600">Roll No: {{ request.rollNumber }}</p>
              </div>
              <span :class="getRecheckStatusBadge(request.status)" class="px-3 py-1 rounded-full text-xs">
                {{ request.status }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 text-sm mb-3">
              <div>
                <p class="text-gray-600">Original Marks</p>
                <p class="font-bold">{{ request.originalMarks }}</p>
              </div>
              <div>
                <p class="text-gray-600">After Re-check</p>
                <p class="font-bold text-green-600">{{ request.newMarks || '-' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Difference</p>
                <p :class="request.difference > 0 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                  {{ request.difference > 0 ? '+' : '' }}{{ request.difference || '-' }}
                </p>
              </div>
            </div>

            <div v-if="request.status === 'pending'" class="flex gap-2">
              <button @click="approveRecheck(request)"
                      class="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                ✅ Approve
              </button>
              <button @click="rejectRecheck(request)"
                      class="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Exam Modal -->
    <div v-if="showCreateExam" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">➕ Create New Exam</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="newExam.name" placeholder="Exam Name" class="px-4 py-2 border rounded-lg" />
            <select v-model="newExam.type" class="px-4 py-2 border rounded-lg">
              <option value="">Select Type</option>
              <option value="Monthly Test">Monthly Test</option>
              <option value="Mid-Term">Mid-Term</option>
              <option value="Final-Term">Final-Term</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input v-model="newExam.startDate" type="date" class="px-4 py-2 border rounded-lg" />
            <input v-model="newExam.endDate" type="date" class="px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="createExam" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Create
          </button>
          <button @click="showCreateExam = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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

const activeTab = ref('types')
const showCreateExam = ref(false)
const showAddExamType = ref(false)
const selectedExam = ref('')
const clashDetected = ref(false)
const clashMessage = ref('')

const tabs = [
  { id: 'types', label: '📋 Exam Types' },
  { id: 'schedule', label: '📅 Schedule' },
  { id: 'seating', label: '🪑 Seating' },
  { id: 'attendance', label: '✅ Attendance' },
  { id: 'marks', label: '📝 Marks Entry' },
  { id: 'results', label: '📊 Results' },
  { id: 'analytics', label: '📈 Analytics' },
  { id: 'recheck', label: '🔄 Re-check' }
]

const examTypes = ref([
  { id: 1, name: 'Monthly Test', description: 'Regular monthly assessment', gradingMethod: 'Percentage', weightage: 10, passCriteria: 40, maxMarks: 50 },
  { id: 2, name: 'Mid-Term', description: 'Half-yearly examination', gradingMethod: 'GPA', weightage: 30, passCriteria: 40, maxMarks: 100 },
  { id: 3, name: 'Final-Term', description: 'Annual final examination', gradingMethod: 'Letter Grade', weightage: 50, passCriteria: 40, maxMarks: 100 },
  { id: 4, name: 'Weekly Quiz', description: 'Weekly quick assessment', gradingMethod: 'Percentage', weightage: 10, passCriteria: 35, maxMarks: 20 }
])

const exams = ref([
  { id: 1, name: 'Mid-Term 2024', class: 'Grade 10', type: 'Mid-Term', startDate: '2024-03-01', endDate: '2024-03-15' },
  { id: 2, name: 'Final-Term 2024', class: 'Grade 10', type: 'Final-Term', startDate: '2024-06-01', endDate: '2024-06-20' }
])

const examSchedules = ref([
  { id: 1, date: '2024-03-01', time: '09:00-12:00', subject: 'Mathematics', room: 'Room 101', invigilator: 'Mr. John', status: 'Scheduled' },
  { id: 2, date: '2024-03-03', time: '09:00-12:00', subject: 'Physics', room: 'Room 102', invigilator: 'Ms. Sarah', status: 'Scheduled' },
  { id: 3, date: '2024-03-05', time: '09:00-12:00', subject: 'Chemistry', room: 'Room 103', invigilator: 'Mr. David', status: 'Completed' }
])

const rooms = ref([
  { id: 1, name: 'Room 101', capacity: 40 },
  { id: 2, name: 'Room 102', capacity: 35 },
  { id: 3, name: 'Hall A', capacity: 100 }
])

const seatingExam = ref('')
const seatingRoom = ref('')
const seatsPerRow = ref(5)

const seatingPlan = ref({
  totalStudents: 40,
  roomCapacity: 40,
  availableSeats: 0,
  seats: Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    seatNumber: `S${i + 1}`,
    occupied: i < 40,
    studentName: i < 40 ? `Student ${i + 1}` : '',
    rollNumber: i < 40 ? `R${String(i + 1).padStart(3, '0')}` : ''
  }))
})

const attendanceExam = ref('')
const attendanceSubject = ref('')

const examAttendanceList = ref([
  { id: 1, rollNumber: 'R001', name: 'John Doe', status: 'present', lateEntry: false, remarks: '' },
  { id: 2, rollNumber: 'R002', name: 'Jane Smith', status: 'present', lateEntry: false, remarks: '' },
  { id: 3, rollNumber: 'R003', name: 'Mike Johnson', status: 'absent', lateEntry: false, remarks: '' }
])

const marksExam = ref('')
const marksSubject = ref('')
const maxMarks = ref(100)

const marksEntryList = ref([
  { id: 1, rollNumber: 'R001', name: 'John Doe', marks: 85, grade: 'A' },
  { id: 2, rollNumber: 'R002', name: 'Jane Smith', marks: 78, grade: 'B+' },
  { id: 3, rollNumber: 'R003', name: 'Mike Johnson', marks: 92, grade: 'A+' }
])

const resultStatus = ref('draft')
const notifyEmail = ref(true)
const notifySMS = ref(true)
const notifyParents = ref(true)

const publishedResults = ref([
  { id: 1, examName: 'Mid-Term 2024', class: 'Grade 10', term: 'Term 1', totalStudents: 40, passed: 35, failed: 5, status: 'Published' },
  { id: 2, examName: 'Monthly Test', class: 'Grade 10', term: 'Term 1', totalStudents: 40, passed: 38, failed: 2, status: 'Pending Approval' }
])

const topPerformers = ref([
  { id: 1, name: 'Alice Johnson', class: 'Grade 10-A', percentage: 95, grade: 'A+' },
  { id: 2, name: 'Bob Smith', class: 'Grade 10-B', percentage: 93, grade: 'A+' },
  { id: 3, name: 'Carol White', class: 'Grade 10-A', percentage: 91, grade: 'A' }
])

const subjectPerformance = ref([
  { name: 'Mathematics', average: 78, difficulty: 'Hard' },
  { name: 'Physics', average: 72, difficulty: 'Hard' },
  { name: 'English', average: 85, difficulty: 'Medium' },
  { name: 'Chemistry', average: 75, difficulty: 'Hard' }
])

const recheckRequests = ref([
  { id: 1, studentName: 'John Doe', rollNumber: 'R001', exam: 'Mid-Term', subject: 'Mathematics', originalMarks: 45, newMarks: 48, difference: 3, status: 'Approved' },
  { id: 2, studentName: 'Jane Smith', rollNumber: 'R002', exam: 'Mid-Term', subject: 'Physics', originalMarks: 38, newMarks: null, difference: null, status: 'Pending' }
])

const newExam = ref({
  name: '',
  type: '',
  startDate: '',
  endDate: ''
})

function getScheduleStatusBadge(status: string) {
  switch (status) {
    case 'Scheduled': return 'bg-blue-100 text-blue-800'
    case 'Completed': return 'bg-green-100 text-green-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getGradeBadge(grade: string) {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800'
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800'
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getResultStatusBadge(status: string) {
  switch (status) {
    case 'Published': return 'bg-green-100 text-green-800'
    case 'Pending Approval': return 'bg-yellow-100 text-yellow-800'
    case 'Draft': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getRecheckBorderColor(status: string) {
  switch (status) {
    case 'Approved': return 'border-green-300'
    case 'Rejected': return 'border-red-300'
    case 'Pending': return 'border-yellow-300'
    default: return 'border-gray-300'
  }
}

function getRecheckStatusBadge(status: string) {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800'
    case 'Rejected': return 'bg-red-100 text-red-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPerformanceColor(percent: number) {
  if (percent >= 80) return 'bg-green-500'
  if (percent >= 60) return 'bg-blue-500'
  if (percent >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function calculateGrade(student: any) {
  const percentage = (student.marks / maxMarks.value) * 100
  if (percentage >= 90) student.grade = 'A+'
  else if (percentage >= 80) student.grade = 'A'
  else if (percentage >= 70) student.grade = 'B+'
  else if (percentage >= 60) student.grade = 'B'
  else if (percentage >= 50) student.grade = 'C'
  else student.grade = 'F'
}

function calculateAverage() {
  const total = marksEntryList.value.reduce((sum, s) => sum + (s.marks || 0), 0)
  return (total / marksEntryList.value.length).toFixed(1)
}

function calculateHighest() {
  return Math.max(...marksEntryList.value.map(s => s.marks || 0))
}

function calculateLowest() {
  return Math.min(...marksEntryList.value.map(s => s.marks || 0))
}

function calculatePassPercentage() {
  const passed = marksEntryList.value.filter(s => s.marks >= (maxMarks.value * 0.4)).length
  return ((passed / marksEntryList.value.length) * 100).toFixed(0)
}

function autoGenerateSchedule() {
  alert('🤖 Auto-generating exam schedule...')
}

function downloadSchedulePDF() {
  alert('📥 Downloading exam schedule PDF...')
}

function editSchedule(schedule: any) {
  alert(`✏️ Editing schedule for ${schedule.subject}`)
}

function deleteSchedule(id: number) {
  if (confirm('Delete this schedule?')) {
    examSchedules.value = examSchedules.value.filter(s => s.id !== id)
  }
}

function autoGenerateSeating() {
  alert('🤖 Auto-generating seating arrangement...')
}

function exportSeatingPlan() {
  alert('📥 Exporting seating plan PDF...')
}

function sendAbsentSMS() {
  const absent = examAttendanceList.value.filter(s => s.status === 'absent')
  alert(`📱 Sending SMS to ${absent.length} absent students' parents`)
}

function saveExamAttendance() {
  alert('✅ Exam attendance saved successfully!')
}

function bulkUpload() {
  alert('📤 Upload Excel file for bulk marks entry')
}

function submitForApproval() {
  alert('✅ Marks submitted for approval!')
}

function saveMarks() {
  alert('💾 Marks saved successfully!')
}

function publishResults() {
  alert('🚀 Results published successfully!')
}

function downloadMarksheet(result: any) {
  alert(`📥 Downloading marksheet for ${result.examName}`)
}

function viewResult(result: any) {
  alert(`👁️ Viewing result for ${result.examName}`)
}

function approveRecheck(request: any) {
  alert(`✅ Re-check approved for ${request.studentName}`)
}

function rejectRecheck(request: any) {
  alert(`❌ Re-check rejected for ${request.studentName}`)
}

function editExamType(examType: any) {
  alert(`✏️ Editing ${examType.name}`)
}

function createExam() {
  alert(`✅ Creating exam: ${newExam.value.name}`)
  showCreateExam.value = false
}
</script>
