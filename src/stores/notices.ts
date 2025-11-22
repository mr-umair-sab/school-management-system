import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notice, Event } from '@/types'
import * as noticesFirebase from '@/services/noticesFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useNoticesStore = defineStore('notices', () => {
  const notices = ref<Notice[]>([])
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let noticesUnsubscribe: Unsubscribe | null = null
  let eventsUnsubscribe: Unsubscribe | null = null

  const urgentNotices = computed(() =>
    notices.value.filter(n => n.priority === 'urgent' || n.priority === 'high')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    return events.value.filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  async function initialize() {
    try {
      loading.value = true

      noticesUnsubscribe = noticesFirebase.subscribeToNotices((data) => {
        notices.value = data
      })

      eventsUnsubscribe = noticesFirebase.subscribeToEvents((data) => {
        events.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize notices store:', err)
    }
  }

  async function addNotice(notice: Omit<Notice, 'id'>) {
    try {
      loading.value = true
      await noticesFirebase.createNotice(notice)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateNotice(id: string, notice: Partial<Notice>) {
    try {
      loading.value = true
      await noticesFirebase.updateNotice(id, notice)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteNotice(id: string) {
    try {
      loading.value = true
      await noticesFirebase.deleteNotice(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function addEvent(event: Omit<Event, 'id'>) {
    try {
      loading.value = true
      await noticesFirebase.createEvent(event)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateEvent(id: string, event: Partial<Event>) {
    try {
      loading.value = true
      await noticesFirebase.updateEvent(id, event)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteEvent(id: string) {
    try {
      loading.value = true
      await noticesFirebase.deleteEvent(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getNoticesByRole(role: string) {
    return notices.value.filter(n =>
      n.targetAudience.includes(role as any)
    )
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Notices. Use initialize() instead.')
  }

  function cleanup() {
    if (noticesUnsubscribe) noticesUnsubscribe()
    if (eventsUnsubscribe) eventsUnsubscribe()
  }

  return {
    notices,
    events,
    urgentNotices,
    upcomingEvents,
    loading,
    error,
    initialize,
    addNotice,
    updateNotice,
    deleteNotice,
    addEvent,
    updateEvent,
    deleteEvent,
    getNoticesByRole,
    loadFromLocalStorage,
    cleanup
  }
})

