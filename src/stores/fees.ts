import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FeeStructure, FeeRecord, Payment } from '@/types'
import * as feesFirebase from '@/services/feesFirebase'
import type { Unsubscribe } from 'firebase/firestore'

export const useFeesStore = defineStore('fees', () => {
  const feeStructures = ref<FeeStructure[]>([])
  const feeRecords = ref<FeeRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let structuresUnsubscribe: Unsubscribe | null = null
  let recordsUnsubscribe: Unsubscribe | null = null

  const totalCollected = computed(() =>
    feeRecords.value.reduce((sum, record) => sum + record.paidAmount, 0)
  )

  const totalPending = computed(() =>
    feeRecords.value.reduce((sum, record) => sum + record.pendingAmount, 0)
  )

  const overdueRecords = computed(() =>
    feeRecords.value.filter(r => r.status === 'overdue')
  )

  async function initialize() {
    try {
      loading.value = true

      // Subscribe to Fee Structures
      structuresUnsubscribe = feesFirebase.subscribeToFeeStructures((structures) => {
        feeStructures.value = structures
      })

      // Subscribe to Fee Records
      recordsUnsubscribe = feesFirebase.subscribeToFeeRecords((records) => {
        feeRecords.value = records
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize fees store:', err)
    }
  }

  async function addFeeStructure(structure: Omit<FeeStructure, 'id'>) {
    try {
      loading.value = true
      await feesFirebase.createFeeStructure(structure)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updateFeeStructure(id: string, data: Partial<FeeStructure>) {
    try {
      loading.value = true
      await feesFirebase.updateFeeStructure(id, data)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deleteFeeStructure(id: string) {
    try {
      loading.value = true
      await feesFirebase.deleteFeeStructure(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function addFeeRecord(record: Omit<FeeRecord, 'id'>) {
    try {
      loading.value = true
      await feesFirebase.createFeeRecord(record)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function addPayment(recordId: string, payment: Omit<Payment, 'id'>) {
    try {
      loading.value = true
      await feesFirebase.addPayment(recordId, payment)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  function getFeeRecordByStudent(studentId: string | number) {
    // Handle both string and number IDs for compatibility
    return feeRecords.value.filter(r => r.studentId == studentId)
  }

  function loadFromLocalStorage() {
    // Fallback or migration logic if needed
    console.warn('loadFromLocalStorage is deprecated for Fees. Use initialize() instead.')
  }

  function cleanup() {
    if (structuresUnsubscribe) structuresUnsubscribe()
    if (recordsUnsubscribe) recordsUnsubscribe()
  }

  return {
    feeStructures,
    feeRecords,
    totalCollected,
    totalPending,
    overdueRecords,
    loading,
    error,
    initialize,
    addFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    addFeeRecord,
    addPayment,
    getFeeRecordByStudent,
    loadFromLocalStorage,
    cleanup
  }
})

