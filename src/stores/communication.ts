import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Announcement, Meeting } from '@/types'
import * as communicationFirebase from '@/services/communicationFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useCommunicationStore = defineStore('communication', () => {
  const announcements = ref<Announcement[]>([])
  const meetings = ref<Meeting[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let announcementsUnsubscribe: Unsubscribe | null = null
  let meetingsUnsubscribe: Unsubscribe | null = null

  async function initialize() {
    try {
      loading.value = true

      announcementsUnsubscribe = communicationFirebase.subscribeToAnnouncements((data) => {
        announcements.value = data
      })

      meetingsUnsubscribe = communicationFirebase.subscribeToMeetings((data) => {
        meetings.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize communication store:', err)
    }
  }

  async function createAnnouncement(announcement: Omit<Announcement, 'id'>) {
    try {
      loading.value = true
      await communicationFirebase.createAnnouncement(announcement)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateAnnouncement(id: string, announcement: Partial<Announcement>) {
    try {
      loading.value = true
      await communicationFirebase.updateAnnouncement(id, announcement)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteAnnouncement(id: string) {
    try {
      loading.value = true
      await communicationFirebase.deleteAnnouncement(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function scheduleMeeting(meeting: Omit<Meeting, 'id'>) {
    try {
      loading.value = true
      await communicationFirebase.createMeeting(meeting)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateMeeting(id: string, meeting: Partial<Meeting>) {
    try {
      loading.value = true
      await communicationFirebase.updateMeeting(id, meeting)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteMeeting(id: string) {
    try {
      loading.value = true
      await communicationFirebase.deleteMeeting(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Communication. Use initialize() instead.')
  }

  function cleanup() {
    if (announcementsUnsubscribe) announcementsUnsubscribe()
    if (meetingsUnsubscribe) meetingsUnsubscribe()
  }

  return {
    announcements,
    meetings,
    loading,
    error,
    initialize,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    scheduleMeeting,
    updateMeeting,
    deleteMeeting,
    loadFromLocalStorage,
    cleanup
  }
})

