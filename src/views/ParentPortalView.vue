<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Parent Portal - Advanced Dashboard" />

    <div class="p-6">
      <!-- Multi-Child Support Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">👨‍👩‍👧‍👦 My Children</h2>
          <div class="flex gap-2">
            <button @click="showLanguageSelector = true" class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              🌐 {{ selectedLanguage }}
            </button>
            <button @click="showAIAssistant = true" class="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
              🤖 AI Assistant
            </button>
            <button @click="showNotifications = true" class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 relative">
              🔔 Alerts
              <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {{ unreadNotifications }}
              </span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="student in myChildren" :key="student.id"
               class="p-4 border-2 rounded-lg hover:shadow-md transition cursor-pointer"
               :class="selectedStudent?.id === student.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
               @click="selectedStudent = student">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {{ student.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg">{{ student.name }}</h3>
                <p class="text-gray-600 text-sm">Class: {{ student.class }}-{{ student.section }}</p>
                <p class="text-gray-600 text-sm">Roll No: {{ student.rollNumber }}</p>
                <div class="flex gap-2 mt-2">
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{{ getAttendancePercentage(student.id) }}% Attendance</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Rank: {{ getStudentRank(student.id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedStudent" class="space-y-6">
        <!-- Quick Stats Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">✅</span>
            <h3 class="text-2xl font-bold mt-2">{{ getAttendancePercentage(selectedStudent.id) }}%</h3>
            <p class="text-xs opacity-80">Attendance</p>
          </div>
          <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">💰</span>
            <h3 class="text-2xl font-bold mt-2">{{ getFeeStatus(selectedStudent.id) }}</h3>
            <p class="text-xs opacity-80">Fee Status</p>
          </div>
          <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">📊</span>
            <h3 class="text-2xl font-bold mt-2">{{ getAverageGrade(selectedStudent.id) }}</h3>
            <p class="text-xs opacity-80">Avg Grade</p>
          </div>
          <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">🏆</span>
            <h3 class="text-2xl font-bold mt-2">#{{ getStudentRank(selectedStudent.id) }}</h3>
            <p class="text-xs opacity-80">Class Rank</p>
          </div>
          <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">📝</span>
            <h3 class="text-2xl font-bold mt-2">{{ getPendingHomework(selectedStudent.id) }}</h3>
            <p class="text-xs opacity-80">Pending HW</p>
          </div>
          <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
            <span class="text-3xl">⭐</span>
            <h3 class="text-2xl font-bold mt-2">{{ getBehaviorPoints(selectedStudent.id) }}</h3>
            <p class="text-xs opacity-80">Behavior Pts</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <div class="flex gap-2 border-b overflow-x-auto">
            <button v-for="tab in tabs" :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'"
                    class="px-4 py-2 font-semibold whitespace-nowrap text-sm">
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 1. Academic Data Tab -->
        <div v-if="activeTab === 'academic'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📚 Complete Academic Data</h3>

          <!-- Attendance Details -->
          <div class="mb-6">
            <h4 class="font-bold mb-3">✅ Attendance History</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div class="p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-600">Daily Average</p>
                <p class="text-2xl font-bold text-green-600">{{ dailyAttendance }}%</p>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-600">Monthly Average</p>
                <p class="text-2xl font-bold text-blue-600">{{ monthlyAttendance }}%</p>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <p class="text-sm text-gray-600">Yearly Average</p>
                <p class="text-2xl font-bold text-purple-600">{{ yearlyAttendance }}%</p>
              </div>
              <div class="p-4 bg-red-50 rounded-lg">
                <p class="text-sm text-gray-600">Absent Days</p>
                <p class="text-2xl font-bold text-red-600">{{ absentDays }}</p>
              </div>
            </div>

            <!-- Subject-wise Attendance -->
            <h5 class="font-semibold mb-2">Subject-wise Attendance</h5>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Subject</th>
                    <th class="border p-2 text-center">Present</th>
                    <th class="border p-2 text-center">Absent</th>
                    <th class="border p-2 text-center">Late</th>
                    <th class="border p-2 text-center">Percentage</th>
                    <th class="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="att in subjectAttendance" :key="att.subject" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ att.subject }}</td>
                    <td class="border p-2 text-center text-green-600">{{ att.present }}</td>
                    <td class="border p-2 text-center text-red-600">{{ att.absent }}</td>
                    <td class="border p-2 text-center text-yellow-600">{{ att.late }}</td>
                    <td class="border p-2 text-center font-bold">{{ att.percentage }}%</td>
                    <td class="border p-2 text-center">
                      <span :class="att.percentage < 75 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                            class="px-2 py-1 rounded text-xs">
                        {{ att.percentage < 75 ? '⚠️ Low' : '✅ Good' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- AI Prediction -->
            <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p class="font-semibold text-blue-700">🤖 AI Prediction:</p>
              <p class="text-sm text-gray-700">Based on current trends, your child's attendance is likely to reach <strong>{{ predictedAttendance }}%</strong> by year-end. {{ attendanceAdvice }}</p>
            </div>
          </div>
        </div>

        <!-- 2. Exam & Results Tab -->
        <div v-if="activeTab === 'exams'" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">📊 Exam & Result Monitoring</h3>
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
              📥 Download Report Card (PDF)
            </button>
          </div>

          <!-- Subject-wise Results -->
          <div class="mb-6">
            <h4 class="font-bold mb-3">Subject-wise Performance</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Subject</th>
                    <th class="border p-2 text-center">Marks Obtained</th>
                    <th class="border p-2 text-center">Total Marks</th>
                    <th class="border p-2 text-center">Percentage</th>
                    <th class="border p-2 text-center">Grade</th>
                    <th class="border p-2 text-center">Class Avg</th>
                    <th class="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in subjectResults" :key="result.subject" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ result.subject }}</td>
                    <td class="border p-2 text-center">{{ result.obtained }}</td>
                    <td class="border p-2 text-center">{{ result.total }}</td>
                    <td class="border p-2 text-center font-bold">{{ result.percentage }}%</td>
                    <td class="border p-2 text-center">
                      <span :class="getGradeColor(result.grade)" class="px-2 py-1 rounded text-xs font-bold">
                        {{ result.grade }}
                      </span>
                    </td>
                    <td class="border p-2 text-center">{{ result.classAvg }}%</td>
                    <td class="border p-2 text-center">
                      <span v-if="result.percentage >= result.classAvg" class="text-green-600">💪 Strong</span>
                      <span v-else class="text-red-600">⚠️ Weak</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Performance Insights -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p class="font-semibold text-green-700">💪 Strong Subjects</p>
              <p class="text-sm text-gray-700 mt-1">{{ strongSubjects.join(', ') }}</p>
            </div>
            <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p class="font-semibold text-red-700">⚠️ Needs Improvement</p>
              <p class="text-sm text-gray-700 mt-1">{{ weakSubjects.join(', ') }}</p>
            </div>
          </div>

          <!-- AI Performance Insights -->
          <div class="p-4 bg-purple-50 border-l-4 border-purple-500 rounded mb-6">
            <p class="font-semibold text-purple-700">🤖 AI Performance Insights</p>
            <ul class="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Your child shows consistent improvement in Mathematics (+12% from last term)</li>
              <li>• Science requires additional attention - consider extra tutoring</li>
              <li>• English performance is above class average - excellent work!</li>
              <li>• Predicted final grade: <strong>A</strong> (if current trend continues)</li>
            </ul>
          </div>

          <!-- Past Exam History -->
          <div>
            <h4 class="font-bold mb-3">📋 Past Exam History</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Exam</th>
                    <th class="border p-2 text-center">Date</th>
                    <th class="border p-2 text-center">Total Marks</th>
                    <th class="border p-2 text-center">Percentage</th>
                    <th class="border p-2 text-center">Grade</th>
                    <th class="border p-2 text-center">Rank</th>
                    <th class="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in getStudentResults(selectedStudent.id)" :key="result.id" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ getExamName(result.examId) }}</td>
                    <td class="border p-2 text-center">{{ formatDate('2024-11-15') }}</td>
                    <td class="border p-2 text-center">{{ result.totalMarks }}</td>
                    <td class="border p-2 text-center font-bold">{{ result.percentage.toFixed(2) }}%</td>
                    <td class="border p-2 text-center">
                      <span :class="getGradeColor(result.grade)" class="px-2 py-1 rounded text-xs font-bold">
                        {{ result.grade }}
                      </span>
                    </td>
                    <td class="border p-2 text-center">{{ result.rank || '-' }}</td>
                    <td class="border p-2 text-center">
                      <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                        📥 Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. Fee & Finance Tab -->
        <div v-if="activeTab === 'fees'" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">💰 Fee & Finance Tracking</h3>
            <div class="flex gap-2">
              <button @click="showPaymentModal = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                💳 Pay Online
              </button>
              <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                📥 Download Voucher
              </button>
            </div>
          </div>

          <!-- Fee Summary -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Fee</p>
              <p class="text-2xl font-bold text-blue-600">RS: {{ totalFee }}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Paid Amount</p>
              <p class="text-2xl font-bold text-green-600">RS: {{ paidFee }}</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-gray-600">Pending Amount</p>
              <p class="text-2xl font-bold text-red-600">RS: {{ getPendingFees(selectedStudent.id) }}</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-gray-600">Next Due Date</p>
              <p class="text-2xl font-bold text-yellow-600">{{ nextDueDate }}</p>
            </div>
          </div>

          <!-- Fee Breakdown -->
          <div class="mb-6">
            <h4 class="font-bold mb-3">Fee Breakdown</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Fee Type</th>
                    <th class="border p-2 text-center">Amount</th>
                    <th class="border p-2 text-center">Discount</th>
                    <th class="border p-2 text-center">Net Amount</th>
                    <th class="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="fee in feeBreakdown" :key="fee.type" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ fee.type }}</td>
                    <td class="border p-2 text-center">RS: {{ fee.amount }}</td>
                    <td class="border p-2 text-center text-green-600">{{ fee.discount }}%</td>
                    <td class="border p-2 text-center font-bold">RS: {{ fee.netAmount }}</td>
                    <td class="border p-2 text-center">
                      <span :class="fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                            class="px-2 py-1 rounded text-xs">
                        {{ fee.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payment History -->
          <div>
            <h4 class="font-bold mb-3">💳 Complete Payment History (Ledger)</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Date</th>
                    <th class="border p-2 text-left">Description</th>
                    <th class="border p-2 text-center">Amount</th>
                    <th class="border p-2 text-center">Payment Method</th>
                    <th class="border p-2 text-center">Receipt No</th>
                    <th class="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in paymentHistory" :key="payment.id" class="hover:bg-gray-50">
                    <td class="border p-2">{{ payment.date }}</td>
                    <td class="border p-2">{{ payment.description }}</td>
                    <td class="border p-2 text-center font-bold text-green-600">RS: {{ payment.amount }}</td>
                    <td class="border p-2 text-center">{{ payment.method }}</td>
                    <td class="border p-2 text-center">{{ payment.receiptNo }}</td>
                    <td class="border p-2 text-center">
                      <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                        📥 Receipt
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 4. Homework & Assignments Tab -->
        <div v-if="activeTab === 'homework'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📝 Homework & Assignments</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Assigned</p>
              <p class="text-2xl font-bold text-blue-600">{{ totalHomework }}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-green-600">{{ completedHomework }}</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-red-600">{{ getPendingHomework(selectedStudent.id) }}</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2 text-left">Date</th>
                  <th class="border p-2 text-left">Subject</th>
                  <th class="border p-2 text-left">Assignment</th>
                  <th class="border p-2 text-center">Due Date</th>
                  <th class="border p-2 text-center">Status</th>
                  <th class="border p-2 text-center">Teacher Feedback</th>
                  <th class="border p-2 text-center">Files</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hw in homeworkList" :key="hw.id" class="hover:bg-gray-50">
                  <td class="border p-2">{{ hw.date }}</td>
                  <td class="border p-2 font-semibold">{{ hw.subject }}</td>
                  <td class="border p-2">{{ hw.assignment }}</td>
                  <td class="border p-2 text-center">{{ hw.dueDate }}</td>
                  <td class="border p-2 text-center">
                    <span :class="hw.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                          class="px-2 py-1 rounded text-xs">
                      {{ hw.status }}
                    </span>
                  </td>
                  <td class="border p-2 text-center">{{ hw.feedback || '-' }}</td>
                  <td class="border p-2 text-center">
                    <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      📥 Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Communication Tab -->
        <div v-if="activeTab === 'communication'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">💬 Communication Tools</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">👨‍🏫 Chat with Teachers</h4>
              <div class="space-y-2">
                <button v-for="teacher in teachers" :key="teacher.id"
                        class="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 text-left">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold">{{ teacher.name }}</span>
                    <span class="text-xs bg-red-500 text-white rounded-full px-2 py-1">{{ teacher.unread }}</span>
                  </div>
                  <p class="text-xs text-gray-600">{{ teacher.subject }}</p>
                </button>
              </div>
            </div>

            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">🏫 School Admin</h4>
              <button class="w-full p-3 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 text-left mb-3">
                <span class="font-semibold">💬 Chat with Admin</span>
              </button>
              <button @click="showVideoPTM = true" class="w-full p-3 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 text-left mb-3">
                <span class="font-semibold">📹 Video Call PTM</span>
              </button>
              <button class="w-full p-3 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 text-left mb-3">
                <span class="font-semibold">📅 Schedule PTM</span>
              </button>
              <button class="w-full p-3 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 text-left">
                <span class="font-semibold">📝 Submit Complaint/Suggestion</span>
              </button>
            </div>
          </div>

          <!-- PTM Schedule -->
          <div class="mb-6">
            <h4 class="font-bold mb-3">📅 Scheduled PTM</h4>
            <div class="space-y-3">
              <div v-for="ptm in ptmSchedule" :key="ptm.id" class="p-4 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-semibold">{{ ptm.title }}</h5>
                    <p class="text-sm text-gray-600">{{ ptm.date }} • {{ ptm.time }}</p>
                    <p class="text-sm text-gray-600">Teacher: {{ ptm.teacher }}</p>
                  </div>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ ptm.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Transport Tab -->
        <div v-if="activeTab === 'transport'" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">🚌 Transport Information</h3>
            <button @click="showBusTracking = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
              🛰️ Live Tracking
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Bus Details</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Route:</span>
                  <span class="font-semibold">{{ busRoute }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Bus Number:</span>
                  <span class="font-semibold">{{ busNumber }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Pick-up Time:</span>
                  <span class="font-semibold">{{ pickupTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Drop-off Time:</span>
                  <span class="font-semibold">{{ dropoffTime }}</span>
                </div>
              </div>
            </div>

            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Driver & Conductor</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Driver</p>
                  <p class="font-semibold">{{ driverName }}</p>
                  <p class="text-sm text-gray-600">📞 {{ driverPhone }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Conductor</p>
                  <p class="font-semibold">{{ conductorName }}</p>
                  <p class="text-sm text-gray-600">📞 {{ conductorPhone }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-6">
            <p class="font-semibold text-blue-700">🚌 Live Tracking (Coming Soon)</p>
            <p class="text-sm text-gray-700">GPS-based real-time bus tracking will be available soon!</p>
          </div>

          <div>
            <h4 class="font-bold mb-3">Recent Alerts</h4>
            <div class="space-y-2">
              <div v-for="alert in busAlerts" :key="alert.id" class="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p class="text-sm font-semibold">{{ alert.message }}</p>
                <p class="text-xs text-gray-600">{{ alert.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. Behavior & Discipline Tab -->
        <div v-if="activeTab === 'behavior'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">⭐ Student Behavior & Discipline</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Behavior Points</p>
              <p class="text-3xl font-bold text-green-600">{{ getBehaviorPoints(selectedStudent.id) }}</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Appreciation Certificates</p>
              <p class="text-3xl font-bold text-blue-600">{{ appreciationCount }}</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-gray-600">Warnings</p>
              <p class="text-3xl font-bold text-yellow-600">{{ warningCount }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-bold mb-3">Teacher Remarks</h4>
            <div class="space-y-3">
              <div v-for="remark in teacherRemarks" :key="remark.id"
                   class="p-4 border-l-4 rounded"
                   :class="remark.type === 'positive' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold">{{ remark.teacher }}</p>
                    <p class="text-sm text-gray-700 mt-1">{{ remark.remark }}</p>
                  </div>
                  <span class="text-xs text-gray-500">{{ remark.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p class="font-semibold text-purple-700">🎮 Gamification (Coming Soon)</p>
            <p class="text-sm text-gray-700">Earn reward points for good behavior and academic excellence!</p>
          </div>
        </div>

        <!-- 8. Notices & Events Tab -->
        <div v-if="activeTab === 'notices'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📢 Notices & Announcements</h3>
          <div class="space-y-3">
            <div v-for="notice in parentNotices" :key="notice.id"
                 class="p-4 border-l-4 rounded"
                 :class="getPriorityClass(notice.priority)">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold">{{ notice.title }}</h4>
                  <p class="text-gray-600 mt-1">{{ notice.content }}</p>
                  <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                    📥 Download Circular
                  </button>
                </div>
                <span class="text-sm text-gray-500">{{ formatDate(notice.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. Events Tab -->
        <div v-if="activeTab === 'events'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">🎉 School Events</h3>
          <div class="space-y-3">
            <div v-for="event in upcomingEvents" :key="event.id"
                 class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-bold">{{ event.title }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ event.description }}</p>
                  <p class="text-gray-500 text-sm mt-1">📍 {{ event.venue }} • ⏰ {{ event.startTime }}</p>
                  <div class="flex gap-2 mt-3">
                    <button class="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                      ✅ Register
                    </button>
                    <button class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                      📸 View Photos
                    </button>
                    <button class="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600">
                      📝 Permission Slip
                    </button>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-blue-600">{{ formatDate(event.date) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 10. Health & Safety Tab -->
        <div v-if="activeTab === 'health'" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">🏥 Health & Safety</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Medical Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Blood Group:</span>
                  <span class="font-semibold">{{ bloodGroup }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Allergies:</span>
                  <span class="font-semibold">{{ allergies }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Checkup:</span>
                  <span class="font-semibold">{{ lastCheckup }}</span>
                </div>
              </div>
            </div>

            <div class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Emergency Contacts</h4>
              <div class="space-y-2">
                <div>
                  <p class="text-sm text-gray-600">Primary Contact</p>
                  <p class="font-semibold">{{ emergencyContact1 }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Secondary Contact</p>
                  <p class="font-semibold">{{ emergencyContact2 }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-bold mb-3">Health Records</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Date</th>
                    <th class="border p-2 text-left">Type</th>
                    <th class="border p-2 text-left">Notes</th>
                    <th class="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in healthRecords" :key="record.id" class="hover:bg-gray-50">
                    <td class="border p-2">{{ record.date }}</td>
                    <td class="border p-2">{{ record.type }}</td>
                    <td class="border p-2">{{ record.notes }}</td>
                    <td class="border p-2 text-center">
                      <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Assistant Modal -->
      <div v-if="showAIAssistant" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showAIAssistant = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">🤖 AI Assistant</h3>
            <button @click="showAIAssistant = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <!-- AI Chat Interface -->
            <div class="border-2 rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
              <div v-for="msg in aiMessages" :key="msg.id" class="mb-4">
                <div :class="msg.sender === 'ai' ? 'text-left' : 'text-right'">
                  <div :class="msg.sender === 'ai' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'"
                       class="inline-block px-4 py-2 rounded-lg max-w-[80%]">
                    <p class="text-sm">{{ msg.message }}</p>
                    <p class="text-xs text-gray-600 mt-1">{{ msg.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Questions -->
            <div class="grid grid-cols-2 gap-2">
              <button @click="askAI('What is my child\'s attendance?')" class="p-2 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 text-sm">
                📊 Check Attendance
              </button>
              <button @click="askAI('Show exam results')" class="p-2 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 text-sm">
                📝 View Results
              </button>
              <button @click="askAI('What is the fee status?')" class="p-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 text-sm">
                💰 Fee Status
              </button>
              <button @click="askAI('Any pending homework?')" class="p-2 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 text-sm">
                📚 Homework Status
              </button>
            </div>

            <!-- Input -->
            <div class="flex gap-2">
              <input v-model="aiInput" @keyup.enter="sendAIMessage"
                     type="text" placeholder="Ask me anything..."
                     class="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
              <button @click="sendAIMessage" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Selector Modal -->
      <div v-if="showLanguageSelector" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showLanguageSelector = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">🌐 Select Language</h3>
            <button @click="showLanguageSelector = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-2">
            <button v-for="lang in languages" :key="lang.code"
                    @click="changeLanguage(lang.code)"
                    :class="selectedLanguage === lang.name ? 'bg-blue-500 text-white' : 'bg-gray-100'"
                    class="w-full p-4 rounded-lg hover:shadow-md transition text-left">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ lang.flag }}</span>
                <div>
                  <p class="font-semibold">{{ lang.name }}</p>
                  <p class="text-xs opacity-80">{{ lang.nativeName }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Online Payment Modal -->
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showPaymentModal = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">💳 Online Fee Payment</h3>
            <button @click="showPaymentModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <!-- Payment Summary -->
            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 class="font-bold mb-2">Payment Summary</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Student Name:</span>
                  <span class="font-semibold">{{ selectedStudent?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Total Pending:</span>
                  <span class="font-semibold text-red-600">RS: {{ selectedStudent ? getPendingFees(selectedStudent.id) : 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div>
              <h4 class="font-bold mb-3">Select Payment Method</h4>
              <div class="grid grid-cols-2 gap-3">
                <button @click="paymentMethod = 'card'"
                        :class="paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                        class="p-4 border-2 rounded-lg hover:shadow-md transition">
                  <span class="text-3xl block mb-2">💳</span>
                  <p class="font-semibold">Credit/Debit Card</p>
                </button>
                <button @click="paymentMethod = 'bank'"
                        :class="paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                        class="p-4 border-2 rounded-lg hover:shadow-md transition">
                  <span class="text-3xl block mb-2">🏦</span>
                  <p class="font-semibold">Bank Transfer</p>
                </button>
                <button @click="paymentMethod = 'easypaisa'"
                        :class="paymentMethod === 'easypaisa' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                        class="p-4 border-2 rounded-lg hover:shadow-md transition">
                  <span class="text-3xl block mb-2">📱</span>
                  <p class="font-semibold">EasyPaisa</p>
                </button>
                <button @click="paymentMethod = 'jazzcash'"
                        :class="paymentMethod === 'jazzcash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                        class="p-4 border-2 rounded-lg hover:shadow-md transition">
                  <span class="text-3xl block mb-2">💰</span>
                  <p class="font-semibold">JazzCash</p>
                </button>
              </div>
            </div>

            <!-- Payment Form -->
            <div v-if="paymentMethod" class="border-2 rounded-lg p-4">
              <h4 class="font-bold mb-3">Payment Details</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-semibold mb-1">Amount to Pay</label>
                  <input v-model="paymentAmount" type="number" class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
                </div>
                <div v-if="paymentMethod === 'card'">
                  <label class="block text-sm font-semibold mb-1">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
                </div>
                <div v-if="paymentMethod === 'card'" class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-semibold mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold mb-1">CVV</label>
                    <input type="text" placeholder="123" class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
                  </div>
                </div>
                <div v-if="paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash'">
                  <label class="block text-sm font-semibold mb-1">Mobile Number</label>
                  <input type="text" placeholder="03XX-XXXXXXX" class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
                </div>
              </div>
            </div>

            <!-- Pay Button -->
            <button @click="processPayment" class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg">
              💳 Pay RS: {{ paymentAmount }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Bus Tracking Modal -->
      <div v-if="showBusTracking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showBusTracking = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">🚌 Live Bus Tracking</h3>
            <button @click="showBusTracking = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <!-- Bus Status -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-600">Current Location</p>
                <p class="text-lg font-bold text-blue-600">{{ busLocation }}</p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-600">ETA to Your Stop</p>
                <p class="text-lg font-bold text-green-600">{{ busETA }} mins</p>
              </div>
              <div class="p-4 bg-yellow-50 rounded-lg">
                <p class="text-sm text-gray-600">Bus Speed</p>
                <p class="text-lg font-bold text-yellow-600">{{ busSpeed }} km/h</p>
              </div>
            </div>

            <!-- Map Placeholder -->
            <div class="border-2 rounded-lg p-8 bg-gray-100 text-center h-96 flex items-center justify-center">
              <div>
                <span class="text-6xl block mb-4">🗺️</span>
                <p class="text-xl font-bold text-gray-700">Live GPS Map</p>
                <p class="text-sm text-gray-600 mt-2">Real-time bus location tracking</p>
                <p class="text-xs text-gray-500 mt-4">Integration with Google Maps / OpenStreetMap</p>
              </div>
            </div>

            <!-- Route Stops -->
            <div>
              <h4 class="font-bold mb-3">Route Stops</h4>
              <div class="space-y-2">
                <div v-for="stop in busStops" :key="stop.id"
                     :class="stop.status === 'completed' ? 'bg-green-50 border-green-500' : stop.status === 'current' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'"
                     class="p-3 border-l-4 rounded">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-semibold">{{ stop.name }}</p>
                      <p class="text-xs text-gray-600">{{ stop.time }}</p>
                    </div>
                    <span v-if="stop.status === 'completed'" class="text-green-600">✅</span>
                    <span v-if="stop.status === 'current'" class="text-blue-600">🚌</span>
                    <span v-if="stop.status === 'upcoming'" class="text-gray-400">⏳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Call PTM Modal -->
      <div v-if="showVideoPTM" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showVideoPTM = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">📹 Video Call - Parent Teacher Meeting</h3>
            <button @click="showVideoPTM = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-4">
            <!-- Video Call Interface -->
            <div class="border-2 rounded-lg bg-gray-900 h-96 flex items-center justify-center relative">
              <div class="text-center text-white">
                <span class="text-6xl block mb-4">📹</span>
                <p class="text-xl font-bold">Video Call Interface</p>
                <p class="text-sm mt-2">Integration with Zoom / Google Meet / Microsoft Teams</p>
              </div>

              <!-- Call Controls -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <button class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                  🎤
                </button>
                <button class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600">
                  📹
                </button>
                <button class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600">
                  💬
                </button>
                <button class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700">
                  📞
                </button>
              </div>
            </div>

            <!-- Meeting Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border-2 rounded-lg p-4">
                <h4 class="font-bold mb-2">Meeting Details</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Teacher:</span>
                    <span class="font-semibold">Ms. Sarah Ahmed</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subject:</span>
                    <span class="font-semibold">Mathematics</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-semibold">30 minutes</span>
                  </div>
                </div>
              </div>

              <div class="border-2 rounded-lg p-4">
                <h4 class="font-bold mb-2">Quick Actions</h4>
                <div class="space-y-2">
                  <button class="w-full p-2 bg-blue-50 border-2 border-blue-200 rounded hover:bg-blue-100 text-sm">
                    📊 Share Screen
                  </button>
                  <button class="w-full p-2 bg-green-50 border-2 border-green-200 rounded hover:bg-green-100 text-sm">
                    📝 Take Notes
                  </button>
                  <button class="w-full p-2 bg-purple-50 border-2 border-purple-200 rounded hover:bg-purple-100 text-sm">
                    📅 Schedule Next Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Panel -->
      <div v-if="showNotifications" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showNotifications = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">🔔 Notifications & Alerts</h3>
            <button @click="showNotifications = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div class="space-y-3">
            <div v-for="notif in notifications" :key="notif.id"
                 :class="notif.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'"
                 class="p-4 border-2 rounded-lg">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">{{ notif.icon }}</span>
                    <p class="font-bold">{{ notif.title }}</p>
                  </div>
                  <p class="text-sm text-gray-700">{{ notif.message }}</p>
                  <p class="text-xs text-gray-500 mt-2">{{ notif.time }}</p>
                </div>
                <button v-if="!notif.read" @click="markAsRead(notif.id)" class="text-blue-600 text-xs hover:underline">
                  Mark Read
                </button>
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
import { useStudentsStore } from '@/stores/students'
import { useFeesStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamsStore } from '@/stores/exams'
import { useNoticesStore } from '@/stores/notices'

const studentsStore = useStudentsStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const noticesStore = useNoticesStore()

const selectedStudent = ref<typeof studentsStore.students[0] | null>(null)
const activeTab = ref('academic')

// Modal States
const showAIAssistant = ref(false)
const showLanguageSelector = ref(false)
const showPaymentModal = ref(false)
const showBusTracking = ref(false)
const showVideoPTM = ref(false)
const showNotifications = ref(false)

// Language Support
const selectedLanguage = ref('English')
const languages = ref([
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
])

// AI Assistant
const aiInput = ref('')
const aiMessages = ref([
  { id: 1, sender: 'ai', message: 'Hello! I\'m your AI assistant. How can I help you today?', time: '10:00 AM' },
  { id: 2, sender: 'user', message: 'What is my child\'s attendance?', time: '10:01 AM' },
  { id: 3, sender: 'ai', message: 'Your child has 95% attendance this month. That\'s excellent! They have been present for 19 out of 20 days.', time: '10:01 AM' }
])

// Payment
const paymentMethod = ref('')
const paymentAmount = ref(15000)

// Bus Tracking
const busLocation = ref('Main Boulevard, 2km away')
const busETA = ref(8)
const busSpeed = ref(35)
const busStops = ref([
  { id: 1, name: 'School', time: '7:00 AM', status: 'completed' },
  { id: 2, name: 'Stop 1 - Garden Town', time: '7:15 AM', status: 'completed' },
  { id: 3, name: 'Stop 2 - Main Boulevard', time: '7:25 AM', status: 'current' },
  { id: 4, name: 'Stop 3 - Model Town (Your Stop)', time: '7:35 AM', status: 'upcoming' },
  { id: 5, name: 'Stop 4 - Johar Town', time: '7:45 AM', status: 'upcoming' }
])

// Notifications
const unreadNotifications = ref(5)
const notifications = ref([
  { id: 1, icon: '⚠️', title: 'Low Attendance Alert', message: 'Science attendance is below 85%. Please ensure regular attendance.', time: '2 hours ago', read: false },
  { id: 2, icon: '💰', title: 'Fee Reminder', message: 'Fee payment due on 25th December. Amount: RS 15,000', time: '5 hours ago', read: false },
  { id: 3, icon: '📝', title: 'New Homework', message: 'Mathematics homework assigned: Chapter 5 Exercise 5.1', time: '1 day ago', read: false },
  { id: 4, icon: '📢', title: 'School Announcement', message: 'Winter holidays from 25th Dec to 5th Jan', time: '2 days ago', read: false },
  { id: 5, icon: '🎉', title: 'Event Invitation', message: 'Annual Sports Day on 15th December. Register now!', time: '3 days ago', read: false },
  { id: 6, icon: '✅', title: 'Homework Submitted', message: 'English essay submitted successfully', time: '4 days ago', read: true }
])

// Tabs
const tabs = [
  { id: 'academic', label: '📚 Academic Data' },
  { id: 'exams', label: '📊 Exams & Results' },
  { id: 'fees', label: '💰 Fee & Finance' },
  { id: 'homework', label: '📝 Homework' },
  { id: 'communication', label: '💬 Communication' },
  { id: 'transport', label: '🚌 Transport' },
  { id: 'behavior', label: '⭐ Behavior' },
  { id: 'notices', label: '📢 Notices' },
  { id: 'events', label: '🎉 Events' },
  { id: 'health', label: '🏥 Health' }
]

// Mock data - in real app, this would come from parent's linked students
const myChildren = computed(() => studentsStore.students.slice(0, 3))

const parentNotices = computed(() =>
  noticesStore.getNoticesByRole('parent').slice(0, 5)
)

const upcomingEvents = computed(() =>
  noticesStore.upcomingEvents.slice(0, 5)
)

// Academic Data
const dailyAttendance = ref(95)
const monthlyAttendance = ref(92)
const yearlyAttendance = ref(94)
const absentDays = ref(12)
const predictedAttendance = ref(93)
const attendanceAdvice = ref('Maintain current attendance to avoid any issues.')

const subjectAttendance = ref([
  { subject: 'Mathematics', present: 45, absent: 3, late: 2, percentage: 90 },
  { subject: 'English', present: 48, absent: 1, late: 1, percentage: 96 },
  { subject: 'Science', present: 42, absent: 5, late: 3, percentage: 84 },
  { subject: 'Urdu', present: 47, absent: 2, late: 1, percentage: 94 },
  { subject: 'Islamiat', present: 49, absent: 0, late: 1, percentage: 98 },
  { subject: 'Social Studies', present: 44, absent: 4, late: 2, percentage: 88 }
])

// Exam Results
const subjectResults = ref([
  { subject: 'Mathematics', obtained: 85, total: 100, percentage: 85, grade: 'A', classAvg: 78 },
  { subject: 'English', obtained: 92, total: 100, percentage: 92, grade: 'A+', classAvg: 82 },
  { subject: 'Science', obtained: 78, total: 100, percentage: 78, grade: 'B+', classAvg: 75 },
  { subject: 'Urdu', obtained: 88, total: 100, percentage: 88, grade: 'A', classAvg: 80 },
  { subject: 'Islamiat', obtained: 95, total: 100, percentage: 95, grade: 'A+', classAvg: 85 },
  { subject: 'Social Studies', obtained: 82, total: 100, percentage: 82, grade: 'A-', classAvg: 77 }
])

const strongSubjects = computed(() =>
  subjectResults.value.filter(s => s.percentage >= s.classAvg).map(s => s.subject)
)

const weakSubjects = computed(() =>
  subjectResults.value.filter(s => s.percentage < s.classAvg).map(s => s.subject)
)

// Fee Data
const totalFee = ref(50000)
const paidFee = ref(35000)
const nextDueDate = ref('25 Dec 2024')

const feeBreakdown = ref([
  { type: 'Tuition Fee', amount: 25000, discount: 10, netAmount: 22500, status: 'Paid' },
  { type: 'Transport Fee', amount: 8000, discount: 0, netAmount: 8000, status: 'Paid' },
  { type: 'Library Fee', amount: 2000, discount: 0, netAmount: 2000, status: 'Paid' },
  { type: 'Lab Fee', amount: 3000, discount: 0, netAmount: 3000, status: 'Paid' },
  { type: 'Sports Fee', amount: 2000, discount: 0, netAmount: 2000, status: 'Pending' },
  { type: 'Exam Fee', amount: 5000, discount: 0, netAmount: 5000, status: 'Pending' },
  { type: 'Annual Charges', amount: 5000, discount: 0, netAmount: 5000, status: 'Pending' }
])

const paymentHistory = ref([
  { id: 1, date: '2024-11-01', description: 'November Fee Payment', amount: 15000, method: 'Bank Transfer', receiptNo: 'RCP-2024-1101' },
  { id: 2, date: '2024-10-01', description: 'October Fee Payment', amount: 15000, method: 'Cash', receiptNo: 'RCP-2024-1001' },
  { id: 3, date: '2024-09-01', description: 'September Fee Payment', amount: 15000, method: 'Online', receiptNo: 'RCP-2024-0901' }
])

// Homework Data
const totalHomework = ref(45)
const completedHomework = ref(38)

const homeworkList = ref([
  { id: 1, date: '2024-11-20', subject: 'Mathematics', assignment: 'Chapter 5 Exercise 5.1', dueDate: '2024-11-22', status: 'Pending', feedback: null },
  { id: 2, date: '2024-11-19', subject: 'English', assignment: 'Essay on Climate Change', dueDate: '2024-11-21', status: 'Completed', feedback: 'Excellent work!' },
  { id: 3, date: '2024-11-18', subject: 'Science', assignment: 'Lab Report - Experiment 3', dueDate: '2024-11-20', status: 'Completed', feedback: 'Good effort' },
  { id: 4, date: '2024-11-17', subject: 'Urdu', assignment: 'Poem Memorization', dueDate: '2024-11-19', status: 'Completed', feedback: 'Well done!' }
])

// Communication Data
const teachers = ref([
  { id: 1, name: 'Ms. Sarah Ahmed', subject: 'Mathematics', unread: 2 },
  { id: 2, name: 'Mr. Ali Khan', subject: 'English', unread: 0 },
  { id: 3, name: 'Ms. Fatima Hassan', subject: 'Science', unread: 1 },
  { id: 4, name: 'Mr. Ahmed Raza', subject: 'Urdu', unread: 0 }
])

const ptmSchedule = ref([
  { id: 1, title: 'Mid-Term PTM', date: '2024-12-05', time: '10:00 AM', teacher: 'Ms. Sarah Ahmed', status: 'Confirmed' },
  { id: 2, title: 'Progress Discussion', date: '2024-12-10', time: '2:00 PM', teacher: 'Mr. Ali Khan', status: 'Pending' }
])

// Transport Data
const busRoute = ref('Route 5 - Model Town')
const busNumber = ref('SCH-BUS-05')
const pickupTime = ref('7:30 AM')
const dropoffTime = ref('2:30 PM')
const driverName = ref('Mr. Hassan Ali')
const driverPhone = ref('+92-300-1234567')
const conductorName = ref('Mr. Usman Tariq')
const conductorPhone = ref('+92-301-7654321')

const busAlerts = ref([
  { id: 1, message: 'Bus running 10 minutes late due to traffic', time: '7:40 AM' },
  { id: 2, message: 'Route change notification - temporary detour', time: 'Yesterday' }
])

// Behavior Data
const appreciationCount = ref(8)
const warningCount = ref(1)

const teacherRemarks = ref([
  { id: 1, teacher: 'Ms. Sarah Ahmed', remark: 'Excellent participation in class discussions', type: 'positive', date: '2024-11-18' },
  { id: 2, teacher: 'Mr. Ali Khan', remark: 'Outstanding performance in English debate', type: 'positive', date: '2024-11-15' },
  { id: 3, teacher: 'Ms. Fatima Hassan', remark: 'Needs to improve lab work discipline', type: 'negative', date: '2024-11-10' }
])

// Health Data
const bloodGroup = ref('A+')
const allergies = ref('None')
const lastCheckup = ref('2024-10-15')
const emergencyContact1 = ref('Father: +92-300-1234567')
const emergencyContact2 = ref('Mother: +92-301-7654321')

const healthRecords = ref([
  { id: 1, date: '2024-10-15', type: 'Annual Checkup', notes: 'All vitals normal' },
  { id: 2, date: '2024-09-20', type: 'Vaccination', notes: 'Flu vaccine administered' },
  { id: 3, date: '2024-08-10', type: 'Dental Checkup', notes: 'No cavities found' }
])

// Helper Functions
function getAttendancePercentage(studentId: number) {
  return Math.round(attendanceStore.calculateAttendancePercentage(studentId, 30))
}

function getFeeStatus(_studentId: number) {
  const records = feesStore.getFeeRecordByStudent(_studentId)
  if (records.length === 0) return 'Partial'
  const latest = records[records.length - 1]
  return latest ? latest.status.toUpperCase() : 'N/A'
}

function getPendingFees(_studentId: number) {
  const records = feesStore.getFeeRecordByStudent(_studentId)
  if (records.length === 0) return 15000
  return records.reduce((sum, r) => sum + r.pendingAmount, 0)
}

function getAverageGrade(_studentId: number) {
  return 'A'
}

function getStudentRank(_studentId: number) {
  return 5
}

function getPendingHomework(_studentId: number) {
  return 7
}

function getBehaviorPoints(_studentId: number) {
  return 450
}

function getStudentResults(studentId: number) {
  return examsStore.getResultsByStudent(studentId)
}

function getExamName(examId: number) {
  const exam = examsStore.exams.find(e => e.id === examId)
  return exam ? exam.name : 'Unknown'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50'
    case 'high': return 'border-orange-500 bg-orange-50'
    case 'medium': return 'border-yellow-500 bg-yellow-50'
    default: return 'border-blue-500 bg-blue-50'
  }
}

function getGradeColor(grade: string) {
  if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-700'
  if (grade === 'A-' || grade === 'B+') return 'bg-blue-100 text-blue-700'
  if (grade === 'B' || grade === 'B-') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

// AI Assistant Functions
function askAI(question: string) {
  aiInput.value = question
  sendAIMessage()
}

function sendAIMessage() {
  if (!aiInput.value.trim()) return

  const userMessage = {
    id: aiMessages.value.length + 1,
    sender: 'user',
    message: aiInput.value,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  aiMessages.value.push(userMessage)

  // Simulate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(aiInput.value)
    aiMessages.value.push({
      id: aiMessages.value.length + 1,
      sender: 'ai',
      message: aiResponse,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    })
  }, 1000)

  aiInput.value = ''
}

function generateAIResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes('attendance')) {
    return `Your child has ${dailyAttendance.value}% attendance this month. That's excellent! They have been present for 19 out of 20 days. Keep up the good work!`
  } else if (lowerQuestion.includes('result') || lowerQuestion.includes('exam')) {
    return `Your child's latest exam results show an average grade of A with 85% marks. Strong subjects: English (92%), Mathematics (85%). Science needs some attention (78%).`
  } else if (lowerQuestion.includes('fee')) {
    return `Current fee status: RS ${paidFee.value} paid out of RS ${totalFee.value}. Pending amount: RS ${totalFee.value - paidFee.value}. Next due date: ${nextDueDate.value}`
  } else if (lowerQuestion.includes('homework')) {
    return `Your child has ${totalHomework.value - completedHomework.value} pending homework assignments. Latest: Mathematics Chapter 5 Exercise 5.1 due on Nov 22.`
  } else if (lowerQuestion.includes('behavior') || lowerQuestion.includes('discipline')) {
    return `Your child has ${getBehaviorPoints(1)} behavior points with ${appreciationCount.value} appreciation certificates. Recent teacher remark: "Excellent participation in class discussions"`
  } else if (lowerQuestion.includes('transport') || lowerQuestion.includes('bus')) {
    return `Bus ${busNumber.value} is currently at ${busLocation.value}. ETA to your stop: ${busETA.value} minutes. You can track live location in the Transport tab.`
  } else {
    return `I'm here to help! You can ask me about attendance, exam results, fee status, homework, behavior, transport, or any other school-related information.`
  }
}

// Language Functions
function changeLanguage(code: string) {
  const lang = languages.value.find(l => l.code === code)
  if (lang) {
    selectedLanguage.value = lang.name
    showLanguageSelector.value = false
    // In real implementation, this would trigger translation
    console.log(`Language changed to: ${lang.name}`)
  }
}

// Payment Functions
function processPayment() {
  if (!paymentMethod.value || !paymentAmount.value) {
    alert('Please select payment method and enter amount')
    return
  }

  // Simulate payment processing
  alert(`Processing payment of RS ${paymentAmount.value} via ${paymentMethod.value}...`)

  setTimeout(() => {
    alert('Payment successful! Receipt will be sent to your email.')
    showPaymentModal.value = false

    // Add to payment history
    paymentHistory.value.unshift({
      id: paymentHistory.value.length + 1,
      date: new Date().toISOString().split('T')[0],
      description: 'Online Fee Payment',
      amount: paymentAmount.value,
      method: paymentMethod.value,
      receiptNo: `RCP-${Date.now()}`
    })

    // Update fee status
    paidFee.value += paymentAmount.value
  }, 2000)
}

// Notification Functions
function markAsRead(notifId: number) {
  const notif = notifications.value.find(n => n.id === notifId)
  if (notif) {
    notif.read = true
    unreadNotifications.value = notifications.value.filter(n => !n.read).length
  }
}

</script>
