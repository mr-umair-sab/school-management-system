import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HostelRoom {
  id: number
  roomNumber: string
  floor: number
  capacity: number
  occupied: number
  type: 'single' | 'double' | 'triple' | 'quad'
  hostelName: string
  status: 'available' | 'full' | 'maintenance'
}

export const useHostelStore = defineStore('hostel', () => {
  const rooms = ref<HostelRoom[]>([])

  const availableRooms = computed(() =>
    rooms.value.filter(r => r.status === 'available' && r.occupied < r.capacity)
  )

  function addRoom(room: Omit<HostelRoom, 'id'>) {
    rooms.value.push({ ...room, id: Date.now() })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('hostelRooms', JSON.stringify(rooms.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('hostelRooms')
    if (saved) rooms.value = JSON.parse(saved)
  }

  return {
    rooms,
    availableRooms,
    addRoom,
    loadFromLocalStorage
  }
})
