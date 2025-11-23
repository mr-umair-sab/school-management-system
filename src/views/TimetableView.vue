<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Advanced Timetable Management" />

    <div class="p-6">
      <!-- Quick Actions Bar -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAutoGenerate = true" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg">
            🤖 Auto-Generate Timetable
          </button>
          <button @click="activeTab = 'builder'" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            🎨 Manual Builder
          </button>
          <button @click="checkTeacherAvailability" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            👨‍🏫 Teacher Availability
          </button>
          <button @click="checkRoomAvailability" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            🏫 Room Availability
          </button>
          <button @click="showSubstitution = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            🔄 Substitution
          </button>
          <button @click="exportAllTimetables" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            📄 Export All
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
            class=" font-semibold  text-sm"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Auto-Generate Timetable -->
      <div v-if="activeTab === 'auto-generate'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">🤖 AI-Based Auto-Generate Timetable</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4">Generation Rules</h3>
            <div class="space-y-3">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoGenRules.smartConflictResolution" class="w-4 h-4" />
                <span class="text-sm">Smart Conflict Resolution</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoGenRules.balanceTeacherLoad" class="w-4 h-4" />
                <span class="text-sm">Balance Teacher Workload</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoGenRules.avoidBackToBack" class="w-4 h-4" />
                <span class="text-sm">Avoid Back-to-Back Same Subject</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoGenRules.respectTeacherPreferences" class="w-4 h-4" />
                <span class="text-sm">Respect Teacher Preferences</span>
              </label>
              <div>
                <label class="block text-sm font-semibold mb-2">Max Subjects Per Day</label>
                <input type="number" v-model="autoGenRules.maxSubjectsPerDay" min="4" max="8"
                       class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Max Teacher Hours/Day</label>
                <input type="number" v-model="autoGenRules.maxTeacherHours" min="4" max="8"
                       class="w-full px-3 py-2 border rounded" />
              </div>
            </div>
          </div>

          <div class="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4">Break Scheduling</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold mb-2">Recess Break</label>
                <div class="flex gap-2">
                  <input type="time" v-model="breaks.recess.start" class="flex-1 px-3 py-2 border rounded" />
                  <input type="time" v-model="breaks.recess.end" class="flex-1 px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Prayer Break</label>
                <div class="flex gap-2">
                  <input type="time" v-model="breaks.prayer.start" class="flex-1 px-3 py-2 border rounded" />
                  <input type="time" v-model="breaks.prayer.end" class="flex-1 px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Lunch Break</label>
                <div class="flex gap-2">
                  <input type="time" v-model="breaks.lunch.start" class="flex-1 px-3 py-2 border rounded" />
                  <input type="time" v-model="breaks.lunch.end" class="flex-1 px-3 py-2 border rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p class="text-sm">⚠️ Auto-generation will overwrite existing timetables. Make sure to save a backup first.</p>
        </div>

        <button @click="generateTimetable" class="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-xl font-bold text-lg">
          🚀 Generate Complete Timetable
        </button>

        <div v-if="generationProgress > 0" class="mt-6">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-semibold">Generating...</span>
            <span class="text-sm font-semibold">{{ generationProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full transition-all"
                 :style="`width: ${generationProgress}%`">
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Timetable Builder -->
      <div v-if="activeTab === 'builder'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🎨 Manual Timetable Builder</h2>
          <div class="flex gap-2">
            <select v-model="builderClass" class="px-4 py-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="cls in timetableStore.classes" :key="cls.id" :value="`${cls.name}-${cls.section}`">
                {{ cls.name }}-{{ cls.section }}
              </option>
            </select>
            <button @click="saveTimetable" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              💾 Save
            </button>
          </div>
        </div>

        <div v-if="builderClass" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-3 text-left">Day</th>
                <th v-for="n in 8" :key="n" class="border p-3 text-center">
                  <div>Period {{ n }}</div>
                  <div class="text-xs text-gray-500">{{ getPeriodTime(n) }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day">
                <td class="border p-3 font-bold">{{ day }}</td>
                <td v-for="n in 8" :key="n"
                    class="border p-2 hover:bg-blue-50 cursor-pointer"
                    @click="openPeriodEditor(day, n)"
                    @dragover.prevent
                    @drop="handleDrop($event, day, n)">
                  <div v-if="getPeriodData(day, n)"
                       class="p-2 bg-blue-100 rounded hover:bg-blue-200 transition"
                       draggable="true"
                       @dragstart="handleDragStart($event, day, n)">
                    <div class="font-bold text-sm">{{ getPeriodData(day, n)?.subject }}</div>
                    <div class="text-xs text-gray-600">{{ getPeriodData(day, n)?.teacher }}</div>
                    <div class="text-xs text-gray-500">{{ getPeriodData(day, n)?.room }}</div>
                  </div>
                  <div v-else class="text-center text-gray-400 text-sm">
                    + Add
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Teacher Availability Checker -->
      <div v-if="activeTab === 'teacher-availability'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">👨‍🏫 Teacher Availability Checker</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Select Day</label>
            <select v-model="availabilityDay" class="w-full px-4 py-2 border rounded-lg">
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Select Period</label>
            <select v-model="availabilityPeriod" class="w-full px-4 py-2 border rounded-lg">
              <option v-for="n in 8" :key="n" :value="n">Period {{ n }} ({{ getPeriodTime(n) }})</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4 text-green-700">✅ Available Teachers</h3>
            <div class="space-y-2">
              <div v-for="teacher in availableTeachers" :key="teacher.id"
                   class="p-3 bg-white rounded border border-green-200 hover:shadow-md transition">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-semibold">{{ teacher.name }}</p>
                    <p class="text-sm text-gray-600">{{ teacher.subjects.join(', ') }}</p>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {{ teacher.workloadToday }}h today
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-lg mb-4 text-red-700">❌ Busy Teachers</h3>
            <div class="space-y-2">
              <div v-for="teacher in busyTeachers" :key="teacher.id"
                   class="p-3 bg-white rounded border border-red-200">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-semibold">{{ teacher.name }}</p>
                    <p class="text-sm text-gray-600">Teaching: {{ teacher.currentClass }}</p>
                  </div>
                  <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    Occupied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Classroom Availability -->
      <div v-if="activeTab === 'room-availability'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">🏫 Classroom Availability Checker</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Select Day</label>
            <select v-model="roomAvailabilityDay" class="w-full px-4 py-2 border rounded-lg">
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Select Period</label>
            <select v-model="roomAvailabilityPeriod" class="w-full px-4 py-2 border rounded-lg">
              <option v-for="n in 8" :key="n" :value="n">Period {{ n }} ({{ getPeriodTime(n) }})</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="room in classrooms" :key="room.id"
               :class="room.isOccupied ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'"
               class="p-4 border-2 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold">{{ room.name }}</h3>
              <span :class="room.isOccupied ? 'text-red-500' : 'text-green-500'" class="text-2xl">
                {{ room.isOccupied ? '🔴' : '🟢' }}
              </span>
            </div>
            <p class="text-sm text-gray-600">Capacity: {{ room.capacity }}</p>
            <p v-if="room.isOccupied" class="text-sm font-semibold text-red-700 mt-2">
              {{ room.occupiedBy }}
            </p>
            <p v-else class="text-sm font-semibold text-green-700 mt-2">
              Available
            </p>
          </div>
        </div>
      </div>

      <!-- Teacher Timetable View -->
      <div v-if="activeTab === 'teacher-view'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👨‍🏫 Teacher Timetable</h2>
          <select v-model="selectedTeacher" class="px-4 py-2 border rounded-lg">
            <option value="">Select Teacher</option>
            <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
        </div>

        <div v-if="selectedTeacher" class="space-y-4">
          <div class="p-4 bg-indigo-50 rounded-lg">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-600">Total Periods/Week</p>
                <p class="text-2xl font-bold text-indigo-600">{{ teacherWorkload.total }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Free Periods</p>
                <p class="text-2xl font-bold text-green-600">{{ teacherWorkload.free }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Classes Teaching</p>
                <p class="text-2xl font-bold text-blue-600">{{ teacherWorkload.classes }}</p>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-3 text-left">Day</th>
                  <th v-for="n in 8" :key="n" class="border p-3 text-center">P{{ n }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="day in days" :key="day">
                  <td class="border p-3 font-bold">{{ day }}</td>
                  <td v-for="n in 8" :key="n" class="border p-2 text-center">
                    <div v-if="getTeacherPeriod(day, n)" class="p-2 bg-blue-100 rounded">
                      <div class="font-bold text-sm">{{ getTeacherPeriod(day, n)?.class }}</div>
                      <div class="text-xs text-gray-600">{{ getTeacherPeriod(day, n)?.subject }}</div>
                    </div>
                    <div v-else class="text-gray-400 text-sm">Free</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Student Timetable View -->
      <div v-if="activeTab === 'student-view'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🎓 Student Timetable</h2>
          <select v-model="selectedStudentClass" class="px-4 py-2 border rounded-lg">
            <option value="">Select Class</option>
            <option v-for="cls in timetableStore.classes" :key="cls.id" :value="`${cls.name}-${cls.section}`">
              {{ cls.name }}-{{ cls.section }}
            </option>
          </select>
        </div>

        <div v-if="selectedStudentClass" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th class="border p-3 text-left">Day</th>
                <th v-for="n in 8" :key="n" class="border p-3 text-center">
                  <div>Period {{ n }}</div>
                  <div class="text-xs">{{ getPeriodTime(n) }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day" class="hover:bg-gray-50">
                <td class="border p-3 font-bold bg-gray-100">{{ day }}</td>
                <td v-for="n in 8" :key="n" class="border p-2">
                  <div v-if="getStudentPeriod(day, n)" class="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded">
                    <div class="font-bold">{{ getStudentPeriod(day, n)?.subject }}</div>
                    <div class="text-sm text-gray-600">{{ getStudentPeriod(day, n)?.teacher }}</div>
                    <div class="text-xs text-gray-500">Room: {{ getStudentPeriod(day, n)?.room }}</div>
                  </div>
                  <div v-else-if="isBreakTime(n)" class="p-3 bg-yellow-50 rounded text-center">
                    <div class="font-bold text-yellow-700">Break</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Substitution Management -->
      <div v-if="activeTab === 'substitution'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">🔄 Substitution Management</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Absent Teacher</label>
            <select v-model="absentTeacher" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Teacher</option>
              <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Date</label>
            <input type="date" v-model="substitutionDate" class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div v-if="absentTeacher" class="space-y-4">
          <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <h3 class="font-bold mb-2">Affected Periods</h3>
            <div class="space-y-2">
              <div v-for="period in affectedPeriods" :key="period.id"
                   class="p-3 bg-white rounded flex justify-between items-center">
                <div>
                  <p class="font-semibold">{{ period.class }} - Period {{ period.period }}</p>
                  <p class="text-sm text-gray-600">{{ period.subject }} ({{ period.time }})</p>
                </div>
                <button @click="findSubstitute(period)"
                        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Find Substitute
                </button>
              </div>
            </div>
          </div>

          <div v-if="suggestedSubstitutes.length > 0" class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold mb-3">✅ Suggested Substitutes</h3>
            <div class="space-y-2">
              <div v-for="sub in suggestedSubstitutes" :key="sub.id"
                   class="p-3 bg-white rounded flex justify-between items-center">
                <div>
                  <p class="font-semibold">{{ sub.name }}</p>
                  <p class="text-sm text-gray-600">{{ sub.subjects.join(', ') }}</p>
                  <p class="text-xs text-green-600">Free at this time</p>
                </div>
                <button @click="assignSubstitute(sub)"
                        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timetable History -->
      <div v-if="activeTab === 'history'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📜 Timetable History</h2>

        <div class="space-y-4">
          <div v-for="version in timetableHistory" :key="version.id"
               class="p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold">{{ version.name }}</h3>
                <p class="text-sm text-gray-600">Created: {{ version.date }}</p>
                <p class="text-sm text-gray-600">By: {{ version.createdBy }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="previewVersion(version)"
                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  Preview
                </button>
                <button @click="restoreVersion(version)"
                        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event/Exam Blocking -->
      <div v-if="activeTab === 'events'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📅 Event & Exam Blocking</h2>
          <button @click="showAddEvent = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ➕ Add Event
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="event in blockedEvents" :key="event.id"
               class="p-4 border-2 rounded-lg"
               :class="event.type === 'exam' ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-lg">{{ event.name }}</h3>
                <p class="text-sm text-gray-600">{{ event.startDate }} to {{ event.endDate }}</p>
                <p class="text-sm text-gray-600">Type: {{ event.type }}</p>
                <p class="text-sm font-semibold mt-2">
                  {{ event.affectedClasses.length }} classes affected
                </p>
              </div>
              <div class="flex gap-2">
                <button @click="adjustTimetable(event)"
                        class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                  Auto-Adjust
                </button>
                <button @click="removeEvent(event)"
                        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Period Editor Modal -->
    <div v-if="showPeriodEditor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Edit Period</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Subject</label>
            <select v-model="editingPeriod.subject" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Subject</option>
              <option v-for="subject in timetableStore.subjects" :key="subject.id" :value="subject.name">
                {{ subject.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Teacher</label>
            <select v-model="editingPeriod.teacher" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Teacher</option>
              <option v-for="teacher in teachersStore.activeTeachers" :key="teacher.id" :value="teacher.name">
                {{ teacher.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Room</label>
            <input v-model="editingPeriod.room" placeholder="Room Number"
                   class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="savePeriod" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Save
          </button>
          <button @click="showPeriodEditor = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Auto-Generate Modal -->
    <div v-if="showAutoGenerate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">🤖 Auto-Generate Timetable</h3>
        <p class="text-gray-600 mb-4">This will generate a complete timetable for all classes using AI-based smart scheduling.</p>
        <div class="flex gap-2">
          <button @click="startAutoGeneration" class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Start Generation
          </button>
          <button @click="showAutoGenerate = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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
import { useTimetableStore } from '@/stores/timetable'
import { useTeachersStore } from '@/stores/teachers'

const timetableStore = useTimetableStore()
const teachersStore = useTeachersStore()

const activeTab = ref('auto-generate')
const showAutoGenerate = ref(false)
const showPeriodEditor = ref(false)
const showSubstitution = ref(false)
const showAddEvent = ref(false)

const tabs = [
  { id: 'auto-generate', label: '🤖 Auto-Generate' },
  { id: 'builder', label: '🎨 Manual Builder' },
  { id: 'teacher-availability', label: '👨‍🏫 Teacher Availability' },
  { id: 'room-availability', label: '🏫 Room Availability' },
  { id: 'teacher-view', label: '👨‍🏫 Teacher Timetable' },
  { id: 'student-view', label: '🎓 Student Timetable' },
  { id: 'substitution', label: '🔄 Substitution' },
  { id: 'history', label: '📜 History' },
  { id: 'events', label: '📅 Events' }
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const autoGenRules = ref({
  smartConflictResolution: true,
  balanceTeacherLoad: true,
  avoidBackToBack: true,
  respectTeacherPreferences: true,
  maxSubjectsPerDay: 6,
  maxTeacherHours: 6
})

const breaks = ref({
  recess: { start: '10:30', end: '10:45' },
  prayer: { start: '12:00', end: '12:15' },
  lunch: { start: '13:00', end: '13:30' }
})

const generationProgress = ref(0)
const builderClass = ref('')
const availabilityDay = ref('Monday')
const availabilityPeriod = ref(1)
const roomAvailabilityDay = ref('Monday')
const roomAvailabilityPeriod = ref(1)
const selectedTeacher = ref('')
const selectedStudentClass = ref('')
const absentTeacher = ref('')
const substitutionDate = ref(new Date().toISOString().split('T')[0])

const editingPeriod = ref({
  day: '',
  period: 0,
  subject: '',
  teacher: '',
  room: ''
})

const timetableData = ref<any>({})

const classrooms = ref([
  { id: 1, name: 'Room 101', capacity: 40, isOccupied: false, occupiedBy: '' },
  { id: 2, name: 'Room 102', capacity: 40, isOccupied: true, occupiedBy: 'Grade 10-A' },
  { id: 3, name: 'Room 103', capacity: 35, isOccupied: false, occupiedBy: '' },
  { id: 4, name: 'Room 104', capacity: 35, isOccupied: true, occupiedBy: 'Grade 9-B' },
  { id: 5, name: 'Lab 1', capacity: 30, isOccupied: false, occupiedBy: '' },
  { id: 6, name: 'Lab 2', capacity: 30, isOccupied: false, occupiedBy: '' },
  { id: 7, name: 'Computer Lab', capacity: 40, isOccupied: true, occupiedBy: 'Grade 11-A' },
  { id: 8, name: 'Library', capacity: 50, isOccupied: false, occupiedBy: '' }
])

const availableTeachers = computed(() => {
  return teachersStore.activeTeachers.slice(0, 5).map(t => ({
    ...t,
    workloadToday: Math.floor(Math.random() * 3) + 4
  }))
})

const busyTeachers = computed(() => {
  return teachersStore.activeTeachers.slice(5, 8).map(t => ({
    ...t,
    currentClass: 'Grade ' + (Math.floor(Math.random() * 5) + 8) + '-A'
  }))
})

const teacherWorkload = computed(() => ({
  total: 30,
  free: 10,
  classes: 5
}))

const affectedPeriods = ref([
  { id: 1, class: 'Grade 10-A', period: 1, subject: 'Mathematics', time: '08:00-08:45' },
  { id: 2, class: 'Grade 10-B', period: 3, subject: 'Mathematics', time: '09:30-10:15' },
  { id: 3, class: 'Grade 9-A', period: 5, subject: 'Mathematics', time: '11:15-12:00' }
])

const suggestedSubstitutes = ref<any[]>([])

const timetableHistory = ref([
  { id: 1, name: 'Timetable v1.0', date: '2024-01-15', createdBy: 'Admin' },
  { id: 2, name: 'Timetable v1.1 (Updated)', date: '2024-01-20', createdBy: 'Principal' },
  { id: 3, name: 'Timetable v2.0 (New Session)', date: '2024-02-01', createdBy: 'Admin' }
])

const blockedEvents = ref([
  { id: 1, name: 'Annual Exams', type: 'exam', startDate: '2024-03-01', endDate: '2024-03-15', affectedClasses: ['All'] },
  { id: 2, name: 'Sports Day', type: 'event', startDate: '2024-02-20', endDate: '2024-02-20', affectedClasses: ['Grade 6-12'] }
])

function getPeriodTime(period: number) {
  const times = [
    '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
    '11:15-12:00', '12:00-12:45', '13:30-14:15', '14:15-15:00'
  ]
  return times[period - 1] || ''
}

function generateTimetable() {
  activeTab.value = 'auto-generate'
}

function startAutoGeneration() {
  showAutoGenerate.value = false
  generationProgress.value = 0

  const interval = setInterval(() => {
    generationProgress.value += 10
    if (generationProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        alert('✅ Timetable generated successfully!')
        generationProgress.value = 0
      }, 500)
    }
  }, 300)
}

function checkTeacherAvailability() {
  activeTab.value = 'teacher-availability'
}

function checkRoomAvailability() {
  activeTab.value = 'room-availability'
}

function exportAllTimetables() {
  alert('📄 Exporting all timetables to PDF...')
}

function openPeriodEditor(day: string, period: number) {
  editingPeriod.value = {
    day,
    period,
    subject: '',
    teacher: '',
    room: ''
  }
  showPeriodEditor.value = true
}

function savePeriod() {
  const key = `${builderClass.value}-${editingPeriod.value.day}-${editingPeriod.value.period}`
  timetableData.value[key] = { ...editingPeriod.value }
  showPeriodEditor.value = false
}

function getPeriodData(day: string, period: number) {
  const key = `${builderClass.value}-${day}-${period}`
  return timetableData.value[key]
}

function handleDragStart(event: DragEvent, day: string, period: number) {
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', JSON.stringify({ day, period }))
}

function handleDrop(event: DragEvent, targetDay: string, targetPeriod: number) {
  event.preventDefault()
  const data = JSON.parse(event.dataTransfer!.getData('text/plain'))

  const sourceKey = `${builderClass.value}-${data.day}-${data.period}`
  const targetKey = `${builderClass.value}-${targetDay}-${targetPeriod}`

  const temp = timetableData.value[sourceKey]
  timetableData.value[sourceKey] = timetableData.value[targetKey]
  timetableData.value[targetKey] = temp
}

function saveTimetable() {
  alert('💾 Timetable saved successfully!')
}

function getTeacherPeriod(day: string, period: number) {
  // Mock data
  if (Math.random() > 0.3) {
    return {
      class: 'Grade ' + (Math.floor(Math.random() * 5) + 8) + '-A',
      subject: ['Math', 'Science', 'English'][Math.floor(Math.random() * 3)]
    }
  }
  return null
}

function getStudentPeriod(day: string, period: number) {
  // Mock data
  if (Math.random() > 0.2) {
    return {
      subject: ['Mathematics', 'Science', 'English', 'Social Studies'][Math.floor(Math.random() * 4)],
      teacher: 'Mr. ' + ['John', 'Smith', 'David'][Math.floor(Math.random() * 3)],
      room: 'Room ' + (Math.floor(Math.random() * 10) + 101)
    }
  }
  return null
}

function isBreakTime(period: number) {
  return period === 3 || period === 5
}

function findSubstitute(period: any) {
  suggestedSubstitutes.value = availableTeachers.value.slice(0, 3) as any
}

function assignSubstitute(teacher: any) {
  alert(`✅ ${teacher.name} assigned as substitute!`)
  suggestedSubstitutes.value = []
}

function previewVersion(version: any) {
  alert(`👁️ Previewing ${version.name}`)
}

function restoreVersion(version: any) {
  if (confirm(`Are you sure you want to restore ${version.name}?`)) {
    alert(`✅ ${version.name} restored successfully!`)
  }
}

function adjustTimetable(event: any) {
  alert(`🔄 Auto-adjusting timetable for ${event.name}`)
}

function removeEvent(event: any) {
  if (confirm(`Remove ${event.name}?`)) {
    blockedEvents.value = blockedEvents.value.filter(e => e.id !== event.id)
  }
}
</script>
