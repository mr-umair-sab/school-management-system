<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Communication & Notification System" />
    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">📱 Send SMS</button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">📧 Send Email</button>
          <button class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">🔔 Push Notification</button>
          <button class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">📢 Announcement</button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">🚨 Emergency Alert</button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📱</span>
          <h3 class="text-2xl font-bold mt-2">345</h3>
          <p class="text-xs opacity-80">SMS Sent Today</p>
        </div>
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📧</span>
          <h3 class="text-2xl font-bold mt-2">156</h3>
          <p class="text-xs opacity-80">Emails Sent</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🔔</span>
          <h3 class="text-2xl font-bold mt-2">892</h3>
          <p class="text-xs opacity-80">Push Notifications</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📢</span>
          <h3 class="text-2xl font-bold mt-2">18</h3>
          <p class="text-xs opacity-80">Announcements</p>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">💬</span>
          <h3 class="text-2xl font-bold mt-2">47</h3>
          <p class="text-xs opacity-80">Unread Messages</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⚠️</span>
          <h3 class="text-2xl font-bold mt-2">3</h3>
          <p class="text-xs opacity-80">Emergency Alerts</p>
        </div>
      </div>

      <!-- SMS Categories -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">📱 SMS Alert Categories</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="cat in smsCategories" :key="cat.id" class="p-4 border-2 rounded-lg hover:shadow-md cursor-pointer">
            <span class="text-3xl block mb-2">{{ cat.icon }}</span>
            <p class="font-semibold">{{ cat.name }}</p>
            <p class="text-sm text-gray-600">{{ cat.sent }} sent</p>
            <p class="text-xs text-green-600">{{ cat.rate }}% delivery</p>
          </div>
        </div>
      </div>

      <!-- Email Templates -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">📧 Email Templates</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="tmpl in emailTemplates" :key="tmpl.id" class="p-4 border-2 rounded-lg hover:shadow-md">
            <span class="text-2xl">{{ tmpl.icon }}</span>
            <p class="font-semibold mt-2">{{ tmpl.name }}</p>
            <p class="text-xs text-gray-600">Used {{ tmpl.count }} times</p>
          </div>
        </div>
      </div>

      <!-- Internal Messaging -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">💬 Internal Messaging</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="msg in messageCategories" :key="msg.id" class="p-4 border-2 rounded-lg hover:shadow-md">
            <div class="flex justify-between items-center">
              <span class="text-2xl">{{ msg.icon }}</span>
              <span class="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{{ msg.unread }}</span>
            </div>
            <p class="font-semibold mt-2">{{ msg.name }}</p>
          </div>
        </div>
      </div>

      <!-- PTM & Feedback -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">👥 PTM Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span>Upcoming PTMs</span>
              <span class="font-bold">3</span>
            </div>
            <div class="flex justify-between p-3 bg-green-50 rounded-lg">
              <span>Booked Slots</span>
              <span class="font-bold">67</span>
            </div>
            <div class="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span>Available Slots</span>
              <span class="font-bold">23</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📝 Feedback System</h3>
          <div class="space-y-3">
            <div class="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span>Total Feedback</span>
              <span class="font-bold">234</span>
            </div>
            <div class="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span>Pending Review</span>
              <span class="font-bold">28</span>
            </div>
            <div class="flex justify-between p-3 bg-green-50 rounded-lg">
              <span>Resolved</span>
              <span class="font-bold">198</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'

const smsCategories = [
  { id: 1, name: 'Fee Reminder', icon: '💰', sent: 78, rate: 98 },
  { id: 2, name: 'Absence Alert', icon: '⚠️', sent: 45, rate: 100 },
  { id: 3, name: 'Late Arrival', icon: '⏰', sent: 23, rate: 97 },
  { id: 4, name: 'Exam Schedule', icon: '📝', sent: 89, rate: 99 },
  { id: 5, name: 'Emergency', icon: '🚨', sent: 3, rate: 100 },
  { id: 6, name: 'Event Reminder', icon: '🎉', sent: 67, rate: 96 },
  { id: 7, name: 'Holiday Notice', icon: '🏖️', sent: 12, rate: 98 },
  { id: 8, name: 'Weather Alert', icon: '🌧️', sent: 0, rate: 100 }
]

const emailTemplates = [
  { id: 1, name: 'Fee Invoice', icon: '💰', count: 234 },
  { id: 2, name: 'Exam Results', icon: '📊', count: 189 },
  { id: 3, name: 'PTM Reminder', icon: '👥', count: 145 },
  { id: 4, name: 'Attendance Report', icon: '✅', count: 198 },
  { id: 5, name: 'Assignment', icon: '📝', count: 312 },
  { id: 6, name: 'Circular', icon: '📢', count: 167 },
  { id: 7, name: 'Event Invitation', icon: '🎉', count: 89 },
  { id: 8, name: 'Progress Report', icon: '📈', count: 156 }
]

const messageCategories = [
  { id: 1, name: 'Admin ↔ Teachers', icon: '👨‍💼', unread: 5 },
  { id: 2, name: 'Teachers ↔ Parents', icon: '👨‍🏫', unread: 12 },
  { id: 3, name: 'Teachers ↔ Students', icon: '📚', unread: 8 },
  { id: 4, name: 'Group Chats', icon: '👥', unread: 3 }
]
</script>
