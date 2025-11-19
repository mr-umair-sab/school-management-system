import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FeeStructure, FeeRecord, Payment } from '@/types'

export const useFeesStore = defineStore('fees', () => {
  const feeStructures = ref<FeeStructure[]>([])
  const feeRecords = ref<FeeRecord[]>([])

  const totalCollected = computed(() =>
    feeRecords.value.reduce((sum, record) => sum + record.paidAmount, 0)
  )

  const totalPending = computed(() =>
    feeRecords.value.reduce((sum, record) => sum + record.pendingAmount, 0)
  )

  const overdueRecords = computed(() =>
    feeRecords.value.filter(r => r.status === 'overdue')
  )

  function addFeeStructure(structure: Omit<FeeStructure, 'id'>) {
    feeStructures.value.push({ ...structure, id: Date.now() })
    saveToLocalStorage()
  }

  function addFeeRecord(record: Omit<FeeRecord, 'id'>) {
    feeRecords.value.push({ ...record, id: Date.now() })
    saveToLocalStorage()
  }

  function addPayment(recordId: number, payment: Omit<Payment, 'id'>) {
    const record = feeRecords.value.find(r => r.id === recordId)
    if (record) {
      const newPayment = { ...payment, id: Date.now() }
      record.payments.push(newPayment)
      record.paidAmount += payment.amount
      record.pendingAmount -= payment.amount
      record.status = record.pendingAmount === 0 ? 'paid' :
                     record.pendingAmount < record.totalFee ? 'partial' : 'pending'
      saveToLocalStorage()
    }
  }

  function getFeeRecordByStudent(studentId: number) {
    return feeRecords.value.filter(r => r.studentId === studentId)
  }

  function saveToLocalStorage() {
    localStorage.setItem('feeStructures', JSON.stringify(feeStructures.value))
    localStorage.setItem('feeRecords', JSON.stringify(feeRecords.value))
  }

  function loadFromLocalStorage() {
    const structures = localStorage.getItem('feeStructures')
    const records = localStorage.getItem('feeRecords')
    if (structures) feeStructures.value = JSON.parse(structures)
    if (records) feeRecords.value = JSON.parse(records)
  }

  return {
    feeStructures,
    feeRecords,
    totalCollected,
    totalPending,
    overdueRecords,
    addFeeStructure,
    addFeeRecord,
    addPayment,
    getFeeRecordByStudent,
    loadFromLocalStorage
  }
})
