import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Announcement {
  id: number
  title: string
  content: string
  date: string
  targetAudience: ('students' | 'teachers' | 'parents' | 'all')[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  createdBy: number
}

export interface Meeting {
  id: number
  title: string
  type: 'parent-teacher' | 'staff' | 'pta' | 'other'
  date: string
  time: string
  duration: number
  location: string
  organizer: number
  participants: number[]
  agenda: string
}

export const useCommunicationStore = defineStore('communication', () => {
  const announcements = ref<Announcement[]>([])
  const meetings = ref<Meeting[]>([])

  function createAnnouncement(announcement: Omit<Announcement, 'id'>) {
    announcements.value.unshift({ ...announcement, id: Date.now() })
    saveToLocalStorage()
  }

  function scheduleMeeting(meeting: Omit<Meeting, 'id'>) {
    meetings.value.push({ ...meeting, id: Date.now() })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('announcements', JSON.stringify(announcements.value))
    localStorage.setItem('meetings', JSON.stringify(meetings.value))
  }

  function loadFromLocalStorage() {
    const savedAnnouncements = localStorage.getItem('announcements')
    const savedMeetings = localStorage.getItem('meetings')
    if (savedAnnouncements) announcements.value = JSON.parse(savedAnnouncements)
    if (savedMeetings) meetings.value = JSON.parse(savedMeetings)
  }

  return {
    announcements,
    meetings,
    createAnnouncement,
    scheduleMeeting,
    loadFromLocalStorage
  }
})
