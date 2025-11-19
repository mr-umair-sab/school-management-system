import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notice, Event } from '@/types'

export const useNoticesStore = defineStore('notices', () => {
  const notices = ref<Notice[]>([])
  const events = ref<Event[]>([])

  const urgentNotices = computed(() =>
    notices.value.filter(n => n.priority === 'urgent' || n.priority === 'high')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.value.filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  function addNotice(notice: Omit<Notice, 'id'>) {
    notices.value.unshift({ ...notice, id: Date.now() })
    saveToLocalStorage()
  }

  function updateNotice(id: number, notice: Partial<Notice>) {
    const index = notices.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notices.value[index] = { ...notices.value[index], ...notice } as Notice
      saveToLocalStorage()
    }
  }

  function deleteNotice(id: number) {
    notices.value = notices.value.filter(n => n.id !== id)
    saveToLocalStorage()
  }

  function addEvent(event: Omit<Event, 'id'>) {
    events.value.push({ ...event, id: Date.now() })
    saveToLocalStorage()
  }

  function updateEvent(id: number, event: Partial<Event>) {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...event } as Event
      saveToLocalStorage()
    }
  }

  function deleteEvent(id: number) {
    events.value = events.value.filter(e => e.id !== id)
    saveToLocalStorage()
  }

  function getNoticesByRole(role: string) {
    return notices.value.filter(n =>
      n.targetAudience.includes(role as any)
    )
  }

  function saveToLocalStorage() {
    localStorage.setItem('notices', JSON.stringify(notices.value))
    localStorage.setItem('events', JSON.stringify(events.value))
  }

  function loadFromLocalStorage() {
    const savedNotices = localStorage.getItem('notices')
    const savedEvents = localStorage.getItem('events')
    if (savedNotices) notices.value = JSON.parse(savedNotices)
    if (savedEvents) events.value = JSON.parse(savedEvents)
  }

  return {
    notices,
    events,
    urgentNotices,
    upcomingEvents,
    addNotice,
    updateNotice,
    deleteNotice,
    addEvent,
    updateEvent,
    deleteEvent,
    getNoticesByRole,
    loadFromLocalStorage
  }
})
