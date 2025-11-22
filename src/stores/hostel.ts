import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HostelRoom } from '@/types'
import * as hostelFirebase from '@/services/hostelFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useHostelStore = defineStore('hostel', () => {
  const rooms = ref<HostelRoom[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  const availableRooms = computed(() =>
    rooms.value.filter(r => r.status === 'available' && r.occupied < r.capacity)
  )

  async function initialize() {
    try {
      loading.value = true

      unsubscribe = hostelFirebase.subscribeToRooms((data) => {
        rooms.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize hostel store:', err)
    }
  }

  async function addRoom(room: Omit<HostelRoom, 'id'>) {
    try {
      loading.value = true
      await hostelFirebase.createRoom(room)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateRoom(id: string, data: Partial<HostelRoom>) {
    try {
      loading.value = true
      await hostelFirebase.updateRoom(id, data)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteRoom(id: string) {
    try {
      loading.value = true
      await hostelFirebase.deleteRoom(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Hostel. Use initialize() instead.')
  }

  function cleanup() {
    if (unsubscribe) unsubscribe()
  }

  return {
    rooms,
    availableRooms,
    loading,
    error,
    initialize,
    addRoom,
    updateRoom,
    deleteRoom,
    loadFromLocalStorage,
    cleanup
  }
})

