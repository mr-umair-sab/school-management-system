import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Asset,
  AssetCategory,
  AssetIssue,
  StockItem,
  PurchaseRequest,
  MaintenanceRecord,
  DepartmentAllocation
} from '@/types'
import * as inventoryFirebase from '@/services/inventoryFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const assets = ref<Asset[]>([])
  const categories = ref<AssetCategory[]>([])
  const issues = ref<AssetIssue[]>([])
  const stockItems = ref<StockItem[]>([])
  const purchaseRequests = ref<PurchaseRequest[]>([])
  const maintenanceRecords = ref<MaintenanceRecord[]>([])
  const departments = ref<DepartmentAllocation[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Unsubscribers
  let assetsUnsub: Unsubscribe | null = null
  let categoriesUnsub: Unsubscribe | null = null
  let issuesUnsub: Unsubscribe | null = null
  let stockUnsub: Unsubscribe | null = null
  let purchaseUnsub: Unsubscribe | null = null
  let maintenanceUnsub: Unsubscribe | null = null
  let departmentsUnsub: Unsubscribe | null = null

  // Computed Properties
  const lowStockAssets = computed(() =>
    stockItems.value.filter(item => item.current < item.minimum)
  )

  const totalAssets = computed(() => assets.value.length)
  const availableAssets = computed(() => assets.value.filter(a => a.status === 'Available').length)
  const issuedAssets = computed(() => assets.value.filter(a => a.status === 'Issued').length)
  const maintenanceDue = computed(() => maintenanceRecords.value.filter(m => m.status === 'Scheduled' || m.status === 'In Progress').length)

  const totalValue = computed(() => {
    const sum = assets.value.reduce((acc, curr) => acc + (curr.value || 0), 0)
    return sum >= 1000000 ? `${(sum / 1000000).toFixed(2)}M` : `${(sum / 1000).toFixed(1)}K`
  })

  const depreciationData = computed(() => {
    return assets.value.map(asset => {
      const purchaseDate = new Date(asset.purchaseDate)
      const now = new Date()
      const ageYears = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      const rate = asset.depreciationRate || 20 // Default 20%

      // Simple straight line depreciation for demo
      let currentValue = asset.originalValue * Math.pow((1 - rate / 100), ageYears)
      if (currentValue < 0) currentValue = 0

      return {
        id: asset.id,
        name: asset.name,
        purchaseDate: asset.purchaseDate,
        originalValue: asset.originalValue,
        age: Math.floor(ageYears),
        depreciationRate: rate,
        currentValue: Math.round(currentValue),
        writeOff: asset.writeOff || false
      }
    })
  })

  // Actions
  async function initialize() {
    try {
      loading.value = true

      assetsUnsub = inventoryFirebase.subscribeToAssets((data) => assets.value = data)
      categoriesUnsub = inventoryFirebase.subscribeToCategories((data) => categories.value = data)
      issuesUnsub = inventoryFirebase.subscribeToIssues((data) => issues.value = data)
      stockUnsub = inventoryFirebase.subscribeToStock((data) => stockItems.value = data)
      purchaseUnsub = inventoryFirebase.subscribeToPurchaseRequests((data) => purchaseRequests.value = data)
      maintenanceUnsub = inventoryFirebase.subscribeToMaintenance((data) => maintenanceRecords.value = data)
      departmentsUnsub = inventoryFirebase.subscribeToDepartments((data) => departments.value = data)

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize inventory store:', err)
    }
  }

  // Asset Actions
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

  // Category Actions
  async function addCategory(category: Omit<AssetCategory, 'id'>) {
    await inventoryFirebase.createCategory(category)
  }

  async function deleteCategory(id: string) {
    try {
      loading.value = true
      await inventoryFirebase.deleteCategory(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Issue Actions
  async function issueAsset(issue: Omit<AssetIssue, 'id'>) {
    try {
      loading.value = true
      await inventoryFirebase.createIssue(issue)
      // Update asset status
      const asset = assets.value.find(a => a.assetId === issue.assetId)
      if (asset) {
        await inventoryFirebase.updateAsset(asset.id.toString(), { status: 'Issued' })
      }
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function returnAsset(issueId: string, returnDate: string, condition: string) {
    try {
      loading.value = true
      await inventoryFirebase.updateIssue(issueId, {
        returnDate,
        returnCondition: condition,
        status: 'Returned'
      })

      // Find the issue to get asset ID
      const issue = issues.value.find(i => i.id === issueId)
      if (issue) {
        const asset = assets.value.find(a => a.assetId === issue.assetId)
        if (asset) {
          await inventoryFirebase.updateAsset(asset.id.toString(), { status: 'Available', condition: condition as any })
        }
      }
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Stock Actions
  async function addStockItem(item: Omit<StockItem, 'id'>) {
    await inventoryFirebase.createStockItem(item)
  }

  async function updateStockItem(id: string, data: Partial<StockItem>) {
    await inventoryFirebase.updateStockItem(id, data)
  }

  // Purchase Actions
  async function createPurchaseRequest(request: Omit<PurchaseRequest, 'id'>) {
    await inventoryFirebase.createPurchaseRequest(request)
  }

  async function updatePurchaseRequest(id: string, data: Partial<PurchaseRequest>) {
    await inventoryFirebase.updatePurchaseRequest(id, data)
  }

  // Maintenance Actions
  async function scheduleMaintenance(record: Omit<MaintenanceRecord, 'id'>) {
    try {
      loading.value = true
      await inventoryFirebase.createMaintenanceRecord(record)
      // Update asset status
      const asset = assets.value.find(a => a.assetId === record.assetId)
      if (asset) {
        await inventoryFirebase.updateAsset(asset.id.toString(), { status: 'Maintenance' })
      }
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateMaintenance(id: string, data: Partial<MaintenanceRecord>) {
    await inventoryFirebase.updateMaintenanceRecord(id, data)
    // If completed, update asset status back to Available
    if (data.status === 'Completed') {
      const record = maintenanceRecords.value.find(r => r.id === id)
      if (record) {
        const asset = assets.value.find(a => a.assetId === record.assetId)
        if (asset) {
          await inventoryFirebase.updateAsset(asset.id.toString(), { status: 'Available' })
        }
      }
    }
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Inventory. Use initialize() instead.')
  }

  function cleanup() {
    if (assetsUnsub) assetsUnsub()
    if (categoriesUnsub) categoriesUnsub()
    if (issuesUnsub) issuesUnsub()
    if (stockUnsub) stockUnsub()
    if (purchaseUnsub) purchaseUnsub()
    if (maintenanceUnsub) maintenanceUnsub()
    if (departmentsUnsub) departmentsUnsub()
  }

  return {
    // State
    assets,
    categories,
    issues,
    stockItems,
    purchaseRequests,
    maintenanceRecords,
    departments,
    loading,
    error,

    // Computed
    lowStockAssets,
    totalAssets,
    availableAssets,
    issuedAssets,
    maintenanceDue,
    totalValue,
    depreciationData,

    // Actions
    initialize,
    addAsset,
    updateAsset,
    deleteAsset,
    addCategory,
    deleteCategory,
    issueAsset,
    returnAsset,
    addStockItem,
    updateStockItem,
    createPurchaseRequest,
    updatePurchaseRequest,
    scheduleMaintenance,
    updateMaintenance,
    loadFromLocalStorage,
    cleanup
  }
})

