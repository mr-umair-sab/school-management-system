<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Communication & Notification System" />
    
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-20 right-4 z-50 transition-all duration-300">
      <div :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'" class="text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <span>{{ toastMessage }}</span>
      </div>
    </div>
    
    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showSMSModal = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">📱 Send SMS</button>
          <button @click="showEmailModal = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">📧 Send Email</button>
          <button @click="showPushModal = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">🔔 Push Notification</button>
          <button @click="showAnnouncementModal = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">📢 Announcement</button>
          <button @click="showEmergencyModal = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">🚨 Emergency Alert</button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📱</span>
          <h3 class="text-2xl font-bold mt-2">{{ smsSentToday }}</h3>
          <p class="text-xs opacity-80">SMS Sent Today</p>
        </div>
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📧</span>
          <h3 class="text-2xl font-bold mt-2">{{ emailsSent }}</h3>
          <p class="text-xs opacity-80">Emails Sent</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🔔</span>
          <h3 class="text-2xl font-bold mt-2">{{ pushNotificationsSent }}</h3>
          <p class="text-xs opacity-80">Push Notifications</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📢</span>
          <h3 class="text-2xl font-bold mt-2">{{ announcementsCount }}</h3>
          <p class="text-xs opacity-80">Announcements</p>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">💬</span>
          <h3 class="text-2xl font-bold mt-2">{{ unreadMessages }}</h3>
          <p class="text-xs opacity-80">Unread Messages</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⚠️</span>
          <h3 class="text-2xl font-bold mt-2">{{ emergencyAlertsCount }}</h3>
          <p class="text-xs opacity-80">Emergency Alerts</p>
        </div>
      </div>

      <!-- SMS Categories -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">📱 SMS Alert Categories</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="cat in smsCategories" :key="cat.category" 
               @click="viewSMSHistory(cat.category)"
               class="p-4 border-2 rounded-lg hover:shadow-md cursor-pointer transition">
            <span class="text-3xl block mb-2">{{ cat.icon }}</span>
            <p class="font-semibold">{{ cat.category }}</p>
            <p class="text-sm text-gray-600">{{ cat.count }} sent</p>
            <p class="text-xs text-green-600">{{ cat.deliveryRate }}% delivery</p>
          </div>
        </div>
      </div>

      <!-- Email Templates -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">📧 Email Templates</h3>
          <button @click="showAddTemplateModal = true" class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">+ Add Template</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="tmpl in emailTemplates" :key="tmpl.id" 
               @click="useTemplate(tmpl)"
               class="p-4 border-2 rounded-lg hover:shadow-md cursor-pointer transition">
            <span class="text-2xl">{{ tmpl.icon }}</span>
            <p class="font-semibold mt-2">{{ tmpl.name }}</p>
            <p class="text-xs text-gray-600">Used {{ tmpl.usageCount }} times</p>
          </div>
        </div>
      </div>

      <!-- Internal Messaging -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">💬 Internal Messaging</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="msg in messageCategories" :key="msg.category" 
               @click="viewMessages(msg.category)"
               class="p-4 border-2 rounded-lg hover:shadow-md cursor-pointer transition">
            <div class="flex justify-between items-center">
              <span class="text-2xl">{{ msg.icon }}</span>
              <span v-if="msg.unread > 0" class="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{{ msg.unread }}</span>
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
              <span class="font-bold">{{ ptmStats.upcoming }}</span>
            </div>
            <div class="flex justify-between p-3 bg-green-50 rounded-lg">
              <span>Booked Slots</span>
              <span class="font-bold">{{ ptmStats.bookedSlots }}</span>
            </div>
            <div class="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span>Available Slots</span>
              <span class="font-bold">{{ ptmStats.availableSlots }}</span>
            </div>
          </div>
          <button @click="showPTMModal = true" class="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Schedule PTM</button>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📝 Feedback System</h3>
          <div class="space-y-3">
            <div class="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span>Total Feedback</span>
              <span class="font-bold">{{ feedbackStats.total }}</span>
            </div>
            <div class="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span>Pending Review</span>
              <span class="font-bold">{{ feedbackStats.pending }}</span>
            </div>
            <div class="flex justify-between p-3 bg-green-50 rounded-lg">
              <span>Resolved</span>
              <span class="font-bold">{{ feedbackStats.resolved }}</span>
            </div>
          </div>
          <button @click="showFeedbackModal = true" class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">View Feedback</button>
        </div>
      </div>
    </div>

    <!-- Send SMS Modal -->
    <div v-if="showSMSModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">📱 Send SMS</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Category</label>
            <select v-model="smsForm.category" class="w-full px-4 py-2 border rounded-lg">
              <option value="Fee Reminder">💰 Fee Reminder</option>
              <option value="Absence Alert">⚠️ Absence Alert</option>
              <option value="Late Arrival">⏰ Late Arrival</option>
              <option value="Exam Schedule">📝 Exam Schedule</option>
              <option value="Emergency">🚨 Emergency</option>
              <option value="Event Reminder">🎉 Event Reminder</option>
              <option value="Holiday Notice">🏖️ Holiday Notice</option>
              <option value="Weather Alert">🌧️ Weather Alert</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Message</label>
            <textarea v-model="smsForm.message" rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Enter SMS message..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Recipients (comma-separated phone numbers)</label>
            <input v-model="smsForm.recipients" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., +923001234567, +923009876543" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="sendSMS" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Send SMS</button>
          <button @click="showSMSModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Send Email Modal -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">📧 Send Email</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Template</label>
            <select v-model="emailForm.templateId" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Template</option>
              <option v-for="tmpl in emailTemplates" :key="tmpl.id" :value="tmpl.id">{{ tmpl.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Subject</label>
            <input v-model="emailForm.subject" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Email subject" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Body</label>
            <textarea v-model="emailForm.body" rows="6" class="w-full px-4 py-2 border rounded-lg" placeholder="Email body..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Recipients (comma-separated emails)</label>
            <input v-model="emailForm.recipients" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., parent1@email.com, parent2@email.com" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="sendEmail" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Send Email</button>
          <button @click="showEmailModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Push Notification Modal -->
    <div v-if="showPushModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">🔔 Send Push Notification</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Title</label>
            <input v-model="pushForm.title" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Notification title" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Message</label>
            <textarea v-model="pushForm.body" rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Notification message..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Recipients (comma-separated user IDs)</label>
            <input v-model="pushForm.recipients" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., user1, user2, user3" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="sendPushNotification" class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Send Notification</button>
          <button @click="showPushModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Announcement Modal -->
    <div v-if="showAnnouncementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">📢 Create Announcement</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Title</label>
            <input v-model="announcementForm.title" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Announcement title" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Content</label>
            <textarea v-model="announcementForm.content" rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Announcement content..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Priority</label>
            <select v-model="announcementForm.priority" class="w-full px-4 py-2 border rounded-lg">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Target Audience</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" value="students" v-model="announcementForm.targetAudience" />
                <span>Students</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="teachers" v-model="announcementForm.targetAudience" />
                <span>Teachers</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="parents" v-model="announcementForm.targetAudience" />
                <span>Parents</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" value="all" v-model="announcementForm.targetAudience" />
                <span>All</span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="createAnnouncement" class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Create Announcement</button>
          <button @click="showAnnouncementModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Emergency Alert Modal -->
    <div v-if="showEmergencyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4 text-red-600">🚨 Send Emergency Alert</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Title</label>
            <input v-model="emergencyForm.title" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Alert title" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Message</label>
            <textarea v-model="emergencyForm.message" rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Emergency message..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Severity</label>
            <select v-model="emergencyForm.severity" class="w-full px-4 py-2 border rounded-lg">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="sendEmergencyAlert" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Send Alert</button>
          <button @click="showEmergencyModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add Email Template Modal -->
    <div v-if="showAddTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">➕ Add Email Template</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Template Name</label>
            <input v-model="templateForm.name" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Template name" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Icon (emoji)</label>
            <input v-model="templateForm.icon" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 📧" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Subject</label>
            <input v-model="templateForm.subject" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Email subject" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Body</label>
            <textarea v-model="templateForm.body" rows="6" class="w-full px-4 py-2 border rounded-lg" placeholder="Email body template..."></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="addEmailTemplate" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Template</button>
          <button @click="showAddTemplateModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- PTM Schedule Modal -->
    <div v-if="showPTMModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-2xl font-bold mb-4">👥 Schedule PTM</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Title</label>
            <input v-model="ptmForm.title" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="PTM title" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Class</label>
              <input v-model="ptmForm.class" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Class 10" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Venue</label>
              <input v-model="ptmForm.venue" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="Venue" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Date</label>
              <input v-model="ptmForm.date" type="date" class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Time</label>
              <input v-model="ptmForm.time" type="time" class="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Total Slots</label>
            <input v-model.number="ptmForm.totalSlots" type="number" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 50" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="schedulePTM" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Schedule PTM</button>
          <button @click="showPTMModal = false" class="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>

    <!-- View Feedback Modal -->
    <div v-if="showFeedbackModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-4">📝 Feedback List</h3>
        <div class="space-y-3">
          <div v-for="fb in feedbackList" :key="fb.id" class="p-4 border rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-semibold">{{ fb.subject }}</p>
                <p class="text-sm text-gray-600">From: {{ fb.userName }} ({{ fb.userType }})</p>
                <p class="text-xs text-gray-500">{{ fb.submittedDate }}</p>
              </div>
              <span :class="getFeedbackStatusClass(fb.status)" class="px-2 py-1 rounded text-xs">{{ fb.status }}</span>
            </div>
            <p class="text-sm mb-2">{{ fb.message }}</p>
            <div v-if="fb.status === 'pending'" class="flex gap-2">
              <button @click="resolveFeedback(fb.id)" class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Mark Resolved</button>
            </div>
          </div>
        </div>
        <button @click="showFeedbackModal = false" class="mt-4 w-full px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import * as commFirebase from '@/services/communicationFirebase'
import type { SMS, Email, EmailTemplate, PushNotification, EmergencyAlert, PTMSchedule, Feedback } from '@/types'

// Toast
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

// Modals
const showSMSModal = ref(false)
const showEmailModal = ref(false)
const showPushModal = ref(false)
const showAnnouncementModal = ref(false)
const showEmergencyModal = ref(false)
const showAddTemplateModal = ref(false)
const showPTMModal = ref(false)
const showFeedbackModal = ref(false)

// Data
const smsList = ref<SMS[]>([])
const emailsList = ref<Email[]>([])
const emailTemplates = ref<EmailTemplate[]>([])
const pushNotifications = ref<PushNotification[]>([])
const emergencyAlerts = ref<EmergencyAlert[]>([])
const announcements = ref<any[]>([])
const ptmSchedules = ref<PTMSchedule[]>([])
const feedbackList = ref<Feedback[]>([])

// Stats
const smsSentToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return smsList.value.filter(s => s.sentDate === today).length
})

const emailsSent = computed(() => emailsList.value.length)
const pushNotificationsSent = computed(() => pushNotifications.value.length)
const announcementsCount = computed(() => announcements.value.length)
const emergencyAlertsCount = computed(() => emergencyAlerts.value.length)
const unreadMessages = ref(0)

const ptmStats = ref({ upcoming: 0, totalSlots: 0, bookedSlots: 0, availableSlots: 0 })
const feedbackStats = ref({ total: 0, pending: 0, reviewed: 0, resolved: 0 })

// SMS Categories
const smsCategories = computed(() => {
  const categories: Record<string, { category: string, icon: string, count: number, deliveryRate: number }> = {}
  
  smsList.value.forEach(sms => {
    if (!categories[sms.category]) {
      const icons: Record<string, string> = {
        'Fee Reminder': '💰',
        'Absence Alert': '⚠️',
        'Late Arrival': '⏰',
        'Exam Schedule': '📝',
        'Emergency': '🚨',
        'Event Reminder': '🎉',
        'Holiday Notice': '🏖️',
        'Weather Alert': '🌧️'
      }
      categories[sms.category] = {
        category: sms.category,
        icon: icons[sms.category] || '📱',
        count: 0,
        deliveryRate: 0
      }
    }
    categories[sms.category].count++
    categories[sms.category].deliveryRate = Math.round(
      (categories[sms.category].deliveryRate * (categories[sms.category].count - 1) + sms.deliveryRate) / categories[sms.category].count
    )
  })
  
  return Object.values(categories)
})

// Message Categories
const messageCategories = ref([
  { category: 'Admin-Teachers', name: 'Admin ↔ Teachers', icon: '👨‍💼', unread: 0 },
  { category: 'Teachers-Parents', name: 'Teachers ↔ Parents', icon: '👨‍🏫', unread: 0 },
  { category: 'Teachers-Students', name: 'Teachers ↔ Students', icon: '📚', unread: 0 },
  { category: 'Group Chats', name: 'Group Chats', icon: '👥', unread: 0 }
])

// Forms
const smsForm = ref({ category: 'Fee Reminder', message: '', recipients: '' })
const emailForm = ref({ templateId: '', subject: '', body: '', recipients: '' })
const pushForm = ref({ title: '', body: '', recipients: '' })
const announcementForm = ref({ title: '', content: '', priority: 'normal' as any, targetAudience: [] as any[] })
const emergencyForm = ref({ title: '', message: '', severity: 'high' as any })
const templateForm = ref({ name: '', icon: '📧', subject: '', body: '', usageCount: 0 })
const ptmForm = ref({ title: '', class: '', date: '', time: '', venue: '', totalSlots: 50, bookedSlots: 0, status: 'scheduled' as any })

// Subscriptions
let unsubscribeSMS: any = null
let unsubscribeEmails: any = null
let unsubscribePush: any = null
let unsubscribeAlerts: any = null
let unsubscribeAnnouncements: any = null
let unsubscribePTM: any = null
let unsubscribeFeedback: any = null

onMounted(async () => {
  // Subscribe to all data
  unsubscribeSMS = commFirebase.subscribeToSMS((data) => {
    smsList.value = data
  })
  
  unsubscribeEmails = commFirebase.subscribeToEmails((data) => {
    emailsList.value = data
  })
  
  unsubscribePush = commFirebase.subscribeToPushNotifications((data) => {
    pushNotifications.value = data
  })
  
  unsubscribeAlerts = commFirebase.subscribeToEmergencyAlerts((data) => {
    emergencyAlerts.value = data
  })
  
  unsubscribeAnnouncements = commFirebase.subscribeToAnnouncements((data) => {
    announcements.value = data
  })
  
  unsubscribePTM = commFirebase.subscribeToPTMSchedules((data) => {
    ptmSchedules.value = data
  })
  
  unsubscribeFeedback = commFirebase.subscribeToFeedback((data) => {
    feedbackList.value = data
  })
  
  // Load email templates
  emailTemplates.value = await commFirebase.getEmailTemplates()
  
  // Load stats
  ptmStats.value = await commFirebase.getPTMStats()
  feedbackStats.value = await commFirebase.getFeedbackStats()
})

onUnmounted(() => {
  if (unsubscribeSMS) unsubscribeSMS()
  if (unsubscribeEmails) unsubscribeEmails()
  if (unsubscribePush) unsubscribePush()
  if (unsubscribeAlerts) unsubscribeAlerts()
  if (unsubscribeAnnouncements) unsubscribeAnnouncements()
  if (unsubscribePTM) unsubscribePTM()
  if (unsubscribeFeedback) unsubscribeFeedback()
})

// Functions
async function sendSMS() {
  if (!smsForm.value.message || !smsForm.value.recipients) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createSMS({
      category: smsForm.value.category,
      message: smsForm.value.message,
      recipients: smsForm.value.recipients.split(',').map(r => r.trim()),
      sentDate: new Date().toISOString().split('T')[0],
      deliveryRate: 98,
      status: 'sent'
    })
    showToastMessage('SMS sent successfully!', 'success')
    showSMSModal.value = false
    smsForm.value = { category: 'Fee Reminder', message: '', recipients: '' }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to send SMS', 'error')
  }
}

async function sendEmail() {
  if (!emailForm.value.subject || !emailForm.value.body || !emailForm.value.recipients) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createEmail({
      templateId: emailForm.value.templateId,
      subject: emailForm.value.subject,
      body: emailForm.value.body,
      recipients: emailForm.value.recipients.split(',').map(r => r.trim()),
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent'
    })
    
    if (emailForm.value.templateId) {
      await commFirebase.updateEmailTemplateUsage(emailForm.value.templateId)
    }
    
    showToastMessage('Email sent successfully!', 'success')
    showEmailModal.value = false
    emailForm.value = { templateId: '', subject: '', body: '', recipients: '' }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to send email', 'error')
  }
}

async function sendPushNotification() {
  if (!pushForm.value.title || !pushForm.value.body || !pushForm.value.recipients) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createPushNotification({
      title: pushForm.value.title,
      body: pushForm.value.body,
      recipients: pushForm.value.recipients.split(',').map(r => r.trim()),
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent'
    })
    showToastMessage('Push notification sent successfully!', 'success')
    showPushModal.value = false
    pushForm.value = { title: '', body: '', recipients: '' }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to send push notification', 'error')
  }
}

async function createAnnouncement() {
  if (!announcementForm.value.title || !announcementForm.value.content) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createAnnouncement({
      title: announcementForm.value.title,
      content: announcementForm.value.content,
      date: new Date().toISOString().split('T')[0],
      targetAudience: announcementForm.value.targetAudience,
      priority: announcementForm.value.priority,
      createdBy: 1 // TODO: Get from auth
    })
    showToastMessage('Announcement created successfully!', 'success')
    showAnnouncementModal.value = false
    announcementForm.value = { title: '', content: '', priority: 'normal', targetAudience: [] }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to create announcement', 'error')
  }
}

async function sendEmergencyAlert() {
  if (!emergencyForm.value.title || !emergencyForm.value.message) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createEmergencyAlert({
      title: emergencyForm.value.title,
      message: emergencyForm.value.message,
      severity: emergencyForm.value.severity,
      sentDate: new Date().toISOString().split('T')[0],
      recipients: ['all'] // Send to all
    })
    showToastMessage('Emergency alert sent successfully!', 'success')
    showEmergencyModal.value = false
    emergencyForm.value = { title: '', message: '', severity: 'high' }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to send emergency alert', 'error')
  }
}

async function addEmailTemplate() {
  if (!templateForm.value.name || !templateForm.value.subject || !templateForm.value.body) {
    showToastMessage('Please fill all fields', 'error')
    return
  }
  
  try {
    await commFirebase.createEmailTemplate(templateForm.value)
    emailTemplates.value = await commFirebase.getEmailTemplates()
    showToastMessage('Template added successfully!', 'success')
    showAddTemplateModal.value = false
    templateForm.value = { name: '', icon: '📧', subject: '', body: '', usageCount: 0 }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to add template', 'error')
  }
}

async function schedulePTM() {
  if (!ptmForm.value.title || !ptmForm.value.class || !ptmForm.value.date) {
    showToastMessage('Please fill all required fields', 'error')
    return
  }
  
  try {
    await commFirebase.createPTMSchedule(ptmForm.value)
    ptmStats.value = await commFirebase.getPTMStats()
    showToastMessage('PTM scheduled successfully!', 'success')
    showPTMModal.value = false
    ptmForm.value = { title: '', class: '', date: '', time: '', venue: '', totalSlots: 50, bookedSlots: 0, status: 'scheduled' }
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to schedule PTM', 'error')
  }
}

async function resolveFeedback(id: string) {
  try {
    await commFirebase.updateFeedbackStatus(id, 'resolved')
    feedbackStats.value = await commFirebase.getFeedbackStats()
    showToastMessage('Feedback marked as resolved!', 'success')
  } catch (error) {
    console.error(error)
    showToastMessage('Failed to update feedback', 'error')
  }
}

function useTemplate(template: EmailTemplate) {
  emailForm.value.templateId = template.id
  emailForm.value.subject = template.subject
  emailForm.value.body = template.body
  showEmailModal.value = true
}

function viewSMSHistory(category: string) {
  alert(`Viewing SMS history for: ${category}`)
}

function viewMessages(category: string) {
  alert(`Viewing messages for: ${category}`)
}

function getFeedbackStatusClass(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'reviewed': return 'bg-blue-100 text-blue-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
