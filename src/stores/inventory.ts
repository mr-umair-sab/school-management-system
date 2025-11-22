import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Asset } from '@/types'
import * as inventoryFirebase from '@/services/inventoryFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useInventoryStore = defineStore('inventory', () => {
  const assets = ref<Asset[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  const lowStockAssets = computed(() =>
    assets.value.filter(a => a.quantity < 10 && a.status === 'available')
  )

  async function initialize() {
    try {
      loading.value = true

      unsubscribe = inventoryFirebase.subscribeToAssets((data) => {
        assets.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize inventory store:', err)
    }
  }

  async function addAsset(asset: Omit<Asset, 'id'>) {
    try {
      loading.value = true
      await inventoryFirebase.createAsset(asset)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateAsset(id: string, data: Partial<Asset>) {
    try {
      loading.value = true
      await inventoryFirebase.updateAsset(id, data)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteAsset(id: string) {
    try {
      loading.value = true
      await inventoryFirebase.deleteAsset(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Inventory. Use initialize() instead.')
  }

  function cleanup() {
    if (unsubscribe) unsubscribe()
  }

  return {
    assets,
    lowStockAssets,
    loading,
    error,
    initialize,
    addAsset,
    updateAsset,
    deleteAsset,
    loadFromLocalStorage,
    cleanup
  }
})

