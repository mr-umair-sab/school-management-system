import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Asset {
  id: number
  name: string
  category: 'furniture' | 'electronics' | 'sports' | 'lab-equipment' | 'stationery' | 'other'
  quantity: number
  location: string
  purchaseDate: string
  purchasePrice: number
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
  status: 'available' | 'in-use' | 'maintenance' | 'disposed'
  supplier?: string
}

export const useInventoryStore = defineStore('inventory', () => {
  const assets = ref<Asset[]>([])

  const lowStockAssets = computed(() =>
    assets.value.filter(a => a.quantity < 10 && a.status === 'available')
  )

  function addAsset(asset: Omit<Asset, 'id'>) {
    assets.value.push({ ...asset, id: Date.now() })
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('assets', JSON.stringify(assets.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('assets')
    if (saved) assets.value = JSON.parse(saved)
  }

  return {
    assets,
    lowStockAssets,
    addAsset,
    loadFromLocalStorage
  }
})
