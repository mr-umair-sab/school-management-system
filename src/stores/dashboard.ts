import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as dashboardFirebase from '@/services/dashboardFirebase'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendancePercentage: 0
  })

  const recentActivities = ref([
    {
      id: 1,
      title: 'New Student Admission',
      description: 'Rahul Kumar admitted to Class X-A',
      time: '2 hours ago',
      type: 'admission'
    },
    {
      id: 2,
      title: 'Fees Collected',
      description: 'Total ₹45,000 collected today',
      time: '4 hours ago',
      type: 'finance'
    },
    {
      id: 3,
      title: 'Staff Meeting',
      description: 'Monthly staff meeting scheduled for tomorrow',
      time: '5 hours ago',
      type: 'meeting'
    }
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function initialize() {
    try {
      loading.value = true
      const data = await dashboardFirebase.getDashboardStats()
      stats.value = data
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize dashboard store:', err)
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Dashboard. Use initialize() instead.')
  }

  return {
    stats,
    recentActivities,
    loading,
    error,
    initialize,
    loadFromLocalStorage
  }
})
