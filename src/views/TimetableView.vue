<template>
  <div>
    <Navbar page-title="Timetable Management" />

    <div class="p-6">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Class Timetable</h2>
          <div class="flex gap-2">
            <select v-model="selectedClass" class="p-2 border rounded-lg">
              <option value="">Select Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="`${cls.name}-${cls.section}`">
                {{ cls.name }}-{{ cls.section }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="selectedClass" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-3 text-left">Day</th>
                <th v-for="n in 8" :key="n" class="border p-3 text-center">Period {{ n }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day" class="border-t">
                <td class="border p-3 font-bold">{{ day }}</td>
                <td v-for="period in getPeriods(day)" :key="period.periodNumber"
                    class="border p-3 text-center">
                  <div v-if="period" class="p-2 bg-blue-50 rounded">
                    <div class="font-bold text-sm">{{ getSubjectName(period.subject) }}</div>
                    <div class="text-xs text-gray-600">{{ period.startTime }}-{{ period.endTime }}</div>
                    <div class="text-xs text-gray-500">{{ getTeacherName(period.teacher) }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Subjects</h3>
            <button
              @click="showAddSubject = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Add Subject
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="subject in timetableStore.subjects" :key="subject.id"
                 class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div class="font-bold">{{ subject.name }}</div>
                <div class="text-sm text-gray-600">{{ subject.code }} • Class {{ subject.class }}</div>
              </div>
              <div class="text-sm text-gray-600">
                {{ getTeacherName(subject.teacher) }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Classes</h3>
            <button
              @click="showAddClass = true"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              + Add Class
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="cls in timetableStore.classes" :key="cls.id"
                 class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-bold">{{ cls.name }}-{{ cls.section }}</div>
                  <div class="text-sm text-gray-600">
                    Class Teacher: {{ getTeacherName(cls.classTeacher) }}
                  </div>
                </div>
                <div class="text-sm text-gray-600">
                  {{ cls.students.length }}/{{ cls.capacity }} students
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddSubject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Subject</h3>
        <form @submit.prevent="addSubject">
          <input v-model="newSubject.name" placeholder="Subject Name" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newSubject.code" placeholder="Subject Code" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newSubject.class" placeholder="Class" class="w-full mb-3 p-2 border rounded" required />
          <input v-model.number="newSubject.credits" type="number" placeholder="Credits" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Add</button>
            <button type="button" @click="showAddSubject = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Class</h3>
        <form @submit.prevent="addClass">
          <input v-model="newClass.name" placeholder="Class Name" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newClass.section" placeholder="Section" class="w-full mb-3 p-2 border rounded" required />
          <input v-model.number="newClass.capacity" type="number" placeholder="Capacity" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Add</button>
            <button type="button" @click="showAddClass = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
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

const selectedClass = ref('')
const showAddSubject = ref(false)
const showAddClass = ref(false)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const classes = computed(() => timetableStore.classes)

const newSubject = ref({
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

function getSubjectName(subjectId: number) {
  const subject = timetableStore.subjects.find(s => s.id === subjectId)
  return subject ? subject.name : 'Unknown'
}

function getTeacherName(teacherId: number) {
  const teacher = teachersStore.getTeacherById(teacherId)
  return teacher ? teacher.name : 'Unknown'
}

function addSubject() {
  timetableStore.addSubject(newSubject.value)
  newSubject.value = { name: '', code: '', class: '', teacher: 0, credits: 0 }
  showAddSubject.value = false
}

function addClass() {
  timetableStore.addClass(newClass.value)
  newClass.value = { name: '', section: '', classTeacher: 0, subjects: [], students: [], capacity: 0 }
  showAddClass.value = false
}
</script>
