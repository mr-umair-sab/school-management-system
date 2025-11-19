<template>
  <div>
    <Navbar page-title="Events & Activities" />

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Upcoming Events" :value="noticesStore.upcomingEvents.length" color="blue">
          <template #icon><span class="text-3xl">🎉</span></template>
        </DashboardCard>
        <DashboardCard title="This Month" :value="thisMonthEvents" color="green">
          <template #icon><span class="text-3xl">📅</span></template>
        </DashboardCard>
        <DashboardCard title="Total Notices" :value="noticesStore.notices.length" color="purple">
          <template #icon><span class="text-3xl">📢</span></template>
        </DashboardCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Events</h2>
            <button
              @click="showAddEvent = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Add Event
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="event in noticesStore.events" :key="event.id"
                 class="p-4 border rounded-lg hover:shadow-md transition">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-bold text-lg">{{ event.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ event.description }}</p>
                </div>
                <span :class="getEventTypeClass(event.type)" class="px-3 py-1 rounded-full text-xs">
                  {{ event.type }}
                </span>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-600 mt-3">
                <span>📅 {{ formatDate(event.date) }}</span>
                <span>🕐 {{ event.startTime }} - {{ event.endTime }}</span>
                <span>📍 {{ event.venue }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Notices</h2>
            <button
              @click="showAddNotice = true"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              + Add Notice
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="notice in noticesStore.notices" :key="notice.id"
                 class="p-4 border-l-4 rounded"
                 :class="getPriorityClass(notice.priority)">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold">{{ notice.title }}</h3>
                    <span :class="getPriorityBadge(notice.priority)" class="px-2 py-0.5 rounded text-xs">
                      {{ notice.priority }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm">{{ notice.content }}</p>
                  <div class="flex gap-2 mt-2">
                    <span v-for="role in notice.targetAudience" :key="role"
                          class="text-xs bg-gray-100 px-2 py-1 rounded">
                      {{ role }}
                    </span>
                  </div>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(notice.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Event Calendar</h2>
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
               class="text-center font-bold text-gray-600 p-2">
            {{ day }}
          </div>
          <div v-for="n in 35" :key="n"
               class="aspect-square border rounded p-2 hover:bg-gray-50 cursor-pointer">
            <div class="text-sm">{{ n }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <div v-if="showAddEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Event</h3>
        <form @submit.prevent="addEvent">
          <input v-model="newEvent.title" placeholder="Event Title" class="w-full mb-3 p-2 border rounded" required />
          <textarea v-model="newEvent.description" placeholder="Description" class="w-full mb-3 p-2 border rounded" rows="3" required></textarea>
          <input v-model="newEvent.date" type="date" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newEvent.startTime" type="time" placeholder="Start Time" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newEvent.endTime" type="time" placeholder="End Time" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newEvent.venue" placeholder="Venue" class="w-full mb-3 p-2 border rounded" required />
          <select v-model="newEvent.type" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Type</option>
            <option value="academic">Academic</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="holiday">Holiday</option>
            <option value="other">Other</option>
          </select>
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Add</button>
            <button type="button" @click="showAddEvent = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Notice Modal -->
    <div v-if="showAddNotice" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Notice</h3>
        <form @submit.prevent="addNotice">
          <input v-model="newNotice.title" placeholder="Notice Title" class="w-full mb-3 p-2 border rounded" required />
          <textarea v-model="newNotice.content" placeholder="Content" class="w-full mb-3 p-2 border rounded" rows="4" required></textarea>
          <select v-model="newNotice.priority" class="w-full mb-3 p-2 border rounded" required>
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <div class="mb-3">
            <label class="block text-sm font-semibold mb-2">Target Audience</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" value="admin" v-model="newNotice.targetAudience" />
                <span>Admin</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="teacher" v-model="newNotice.targetAudience" />
                <span>Teachers</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="student" v-model="newNotice.targetAudience" />
                <span>Students</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="parent" v-model="newNotice.targetAudience" />
                <span>Parents</span>
              </label>
            </div>
          </div>
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Add</button>
            <button type="button" @click="showAddNotice = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useNoticesStore } from '@/stores/notices'
import { useAuthStore } from '@/stores/auth'

const noticesStore = useNoticesStore()
const authStore = useAuthStore()

const showAddEvent = ref(false)
const showAddNotice = ref(false)

const newEvent = ref({
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  type: '' as any
})

const newNotice = ref({
  title: '',
  content: '',
  priority: '' as any,
  targetAudience: [] as any[],
  createdBy: 0
})

const thisMonthEvents = computed(() => {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  return noticesStore.events.filter(e => {
    const eventDate = new Date(e.date)
    return eventDate.getMonth() === month && eventDate.getFullYear() === year
  }).length
})

function addEvent() {
  noticesStore.addEvent(newEvent.value)
  newEvent.value = { title: '', description: '', date: '', startTime: '', endTime: '', venue: '', type: '' as any }
  showAddEvent.value = false
}

function addNotice() {
  noticesStore.addNotice({
    ...newNotice.value,
    date: new Date().toISOString().split('T')[0],
    createdBy: authStore.user?.id || 1
  })
  newNotice.value = { title: '', content: '', priority: '' as any, targetAudience: [], createdBy: 0 }
  showAddNotice.value = false
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getEventTypeClass(type: string) {
  switch (type) {
    case 'academic': return 'bg-blue-100 text-blue-800'
    case 'sports': return 'bg-green-100 text-green-800'
    case 'cultural': return 'bg-purple-100 text-purple-800'
    case 'holiday': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50'
    case 'high': return 'border-orange-500 bg-orange-50'
    case 'medium': return 'border-yellow-500 bg-yellow-50'
    default: return 'border-blue-500 bg-blue-50'
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'urgent': return 'bg-red-500 text-white'
    case 'high': return 'bg-orange-500 text-white'
    case 'medium': return 'bg-yellow-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
}
</script>
