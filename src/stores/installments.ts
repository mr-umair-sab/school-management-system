import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as installmentsFirebase from '@/services/installmentsFirebase'
import type { Unsubscribe } from 'firebase/firestore'

// Installment Plan Structure
export interface InstallmentPlan {
  id: number | string
  planID: string
  title: string
  description: string
  totalAmount: number
  academicYear: string
  applicableClasses: string[]
  createdBy: number
  createdDate: string
  status: 'active' | 'inactive' | 'archived'
  installments: InstallmentDetail[]
}

export interface InstallmentDetail {
  id: number | string
  installmentID: string
  planID: string
  title: string
  amount: number
  dueDate: string
  sequence: number
  lateFeeRule: LateFeeRule
  discountRule: DiscountRule
  description?: string
  attachmentURL?: string
}

export interface LateFeeRule {
  enabled: boolean
  type: 'flat' | 'percentage'
  amount: number
  gracePeriodDays: number
  maxLateFee?: number
}

export interface DiscountRule {
  enabled: boolean
  type: 'early-payment' | 'scholarship' | 'custom'
  amount: number
  percentage?: number
  earlyPaymentDays?: number
  description?: string
}

// Student Fee Profile
export interface StudentFeeProfile {
  id: number | string
  studentId: number | string
  planID: string
  feeType: 'monthly' | 'quarterly' | 'installment' | 'custom'
  totalFee: number
  totalPaid: number
  totalRemaining: number
  totalDiscount: number
  totalLateFee: number
  installments: StudentInstallment[]
  paymentHistory: PaymentRecord[]
  status: 'active' | 'completed' | 'defaulter'
  lastPaymentDate?: string
}

export interface StudentInstallment {
  id: number | string
  installmentID: string
  studentId: number | string
  title: string
  amount: number
  dueDate: string
  paidAmount: number
  remainingAmount: number
  lateFee: number
  discount: number
  status: 'pending' | 'paid' | 'partial' | 'overdue'
  paymentDate?: string
  invoiceNumber?: string
  invoiceURL?: string
  receiptURL?: string
}

export interface PaymentRecord {
  id: number | string
  paymentID: string
  studentId: number | string
  installmentID: string
  amount: number
  paymentDate: string
  paymentMethod: 'cash' | 'bank' | 'online' | 'jazzcash' | 'easypaisa' | 'card' | 'cheque'
  transactionID?: string
  receiptNumber: string
  receiptURL?: string
  collectedBy: number
  notes?: string
  status: 'completed' | 'pending' | 'failed'
}

// Invoice
export interface Invoice {
  id: number | string
  invoiceNumber: string
  studentId: number | string
  installmentID: string
  issueDate: string
  dueDate: string
  amount: number
  lateFee: number
  discount: number
  totalAmount: number
  status: 'issued' | 'paid' | 'overdue' | 'cancelled'
  invoiceURL?: string
}

// Receipt
export interface Receipt {
  id: number | string
  receiptNumber: string
  studentId: number | string
  installmentID: string
  paymentID: string
  amount: number
  paymentDate: string
  paymentMethod: string
  collectedBy: number
  receiptURL?: string
}

// Notification
export interface FeeNotification {
  id: number | string
  studentId: number | string
  type: 'due-reminder' | 'overdue-alert' | 'payment-received' | 'balance-alert'
  message: string
  sentDate: string
  channel: 'sms' | 'email' | 'whatsapp' | 'push'
  status: 'sent' | 'pending' | 'failed'
}

export const useInstallmentsStore = defineStore('installments', () => {
  // State
  const plans = ref<InstallmentPlan[]>([])
  const studentFeeProfiles = ref<StudentFeeProfile[]>([])
  const payments = ref<PaymentRecord[]>([])
  const invoices = ref<Invoice[]>([])
  const receipts = ref<Receipt[]>([])
  const notifications = ref<FeeNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let plansUnsubscribe: Unsubscribe | null = null
  let profilesUnsubscribe: Unsubscribe | null = null
  let paymentsUnsubscribe: Unsubscribe | null = null
  let invoicesUnsubscribe: Unsubscribe | null = null
  let receiptsUnsubscribe: Unsubscribe | null = null
  let notificationsUnsubscribe: Unsubscribe | null = null

  // Computed
  const activePlans = computed(() =>
    plans.value.filter(p => p.status === 'active')
  )

  const totalCollected = computed(() =>
    payments.value
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  )

  const totalPending = computed(() =>
    studentFeeProfiles.value.reduce((sum, profile) => sum + profile.totalRemaining, 0)
  )

  const overdueInstallments = computed(() => {
    const today = new Date().toISOString().split('T')[0] || ''
    const overdue: StudentInstallment[] = []

    studentFeeProfiles.value.forEach(profile => {
      profile.installments.forEach(inst => {
        if (inst.status !== 'paid' && inst.dueDate < today) {
          overdue.push(inst)
        }
      })
    })

    return overdue
  })

  const defaulters = computed(() =>
    studentFeeProfiles.value.filter(p => p.status === 'defaulter')
  )

  async function initialize() {
    try {
      loading.value = true

      plansUnsubscribe = installmentsFirebase.subscribeToPlans((data) => {
        plans.value = data
      })

      profilesUnsubscribe = installmentsFirebase.subscribeToProfiles((data) => {
        studentFeeProfiles.value = data
      })

      paymentsUnsubscribe = installmentsFirebase.subscribeToPayments((data) => {
        payments.value = data
      })

      invoicesUnsubscribe = installmentsFirebase.subscribeToInvoices((data) => {
        invoices.value = data
      })

      receiptsUnsubscribe = installmentsFirebase.subscribeToReceipts((data) => {
        receipts.value = data
      })

      notificationsUnsubscribe = installmentsFirebase.subscribeToNotifications((data) => {
        notifications.value = data
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      console.error('Failed to initialize installments store:', err)
    }
  }

  // Actions - Installment Plan Management
  async function createPlan(plan: Omit<InstallmentPlan, 'id' | 'planID'>) {
    try {
      loading.value = true
      const planID = `PLAN-${Date.now()}`
      const newPlan = {
        ...plan,
        planID,
        installments: plan.installments.map((inst, index) => ({
          ...inst,
          id: Date.now() + index,
          installmentID: `${planID}-INST-${index + 1}`,
          planID
        }))
      }
      await installmentsFirebase.createPlan(newPlan)
      loading.value = false
      return newPlan
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function updatePlan(id: string, plan: Partial<InstallmentPlan>) {
    try {
      loading.value = true
      await installmentsFirebase.updatePlan(id, plan)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function deletePlan(id: string) {
    try {
      loading.value = true
      await installmentsFirebase.deletePlan(id)
      loading.value = false
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function duplicatePlan(id: string, newTitle: string) {
    const plan = plans.value.find(p => p.id == id)
    if (plan) {
      const duplicated = {
        ...plan,
        title: newTitle,
        createdDate: new Date().toISOString().split('T')[0]
      }
      delete (duplicated as any).id
      delete (duplicated as any).planID
      return createPlan(duplicated as Omit<InstallmentPlan, 'id' | 'planID'>)
    }
  }

  // Student Fee Profile Management
  async function assignPlanToStudent(studentId: number | string, planID: string, customizations?: Partial<StudentFeeProfile>) {
    const plan = plans.value.find(p => p.planID === planID)
    if (!plan) return null

    const profile: Omit<StudentFeeProfile, 'id'> = {
      studentId,
      planID,
      feeType: 'installment',
      totalFee: plan.totalAmount,
      totalPaid: 0,
      totalRemaining: plan.totalAmount,
      totalDiscount: 0,
      totalLateFee: 0,
      installments: plan.installments.map(inst => ({
        id: Date.now() + Math.random(),
        installmentID: inst.installmentID,
        studentId,
        title: inst.title,
        amount: inst.amount,
        dueDate: inst.dueDate,
        paidAmount: 0,
        remainingAmount: inst.amount,
        lateFee: 0,
        discount: 0,
        status: 'pending'
      })),
      paymentHistory: [],
      status: 'active',
      ...customizations
    }

    try {
      loading.value = true
      const id = await installmentsFirebase.createProfile(profile)
      loading.value = false
      return { ...profile, id }
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  async function bulkAssignPlan(studentIds: (number | string)[], planID: string) {
    const results = await Promise.all(studentIds.map(studentId => assignPlanToStudent(studentId, planID)))
    return results.filter(r => r !== null)
  }

  function getStudentFeeProfile(studentId: number | string) {
    return studentFeeProfiles.value.find(p => p.studentId == studentId)
  }

  async function updateStudentFeeProfile(studentId: number | string, updates: Partial<StudentFeeProfile>) {
    const profile = studentFeeProfiles.value.find(p => p.studentId == studentId)
    if (profile) {
      try {
        loading.value = true
        await installmentsFirebase.updateProfile(profile.id.toString(), updates)
        loading.value = false
      } catch (err: any) {
        error.value = err.message
        loading.value = false
        throw err
      }
    }
  }

  // Payment Collection
  async function collectPayment(payment: Omit<PaymentRecord, 'id' | 'paymentID' | 'receiptNumber'>) {
    const paymentID = `PAY-${Date.now()}`
    const receiptNumber = `REC-${Date.now()}`

    const newPayment: Omit<PaymentRecord, 'id'> = {
      ...payment,
      paymentID,
      receiptNumber,
      status: 'completed'
    }

    try {
      loading.value = true
      await installmentsFirebase.createPayment(newPayment)

      // Update student installment
      const profile = studentFeeProfiles.value.find(p => p.studentId == payment.studentId)
      if (profile) {
        const installment = profile.installments.find(i => i.installmentID === payment.installmentID)
        if (installment) {
          installment.paidAmount += payment.amount
          installment.remainingAmount = Math.max(0, installment.amount - installment.paidAmount + installment.lateFee - installment.discount)

          if (installment.remainingAmount === 0) {
            installment.status = 'paid'
            installment.paymentDate = payment.paymentDate
          } else if (installment.paidAmount > 0) {
            installment.status = 'partial'
          }
        }

        // Update profile totals
        profile.totalPaid += payment.amount
        profile.totalRemaining = Math.max(0, profile.totalFee - profile.totalPaid + profile.totalLateFee - profile.totalDiscount)
        profile.lastPaymentDate = payment.paymentDate || new Date().toISOString().split('T')[0]
        // Note: paymentHistory update is handled by real-time listener on payments collection if we link them, 
        // but here we might need to update the profile document if we store history there.
        // For now, let's assume history is derived or stored separately.

        // Update status
        if (profile.totalRemaining === 0) {
          profile.status = 'completed'
        }

        await installmentsFirebase.updateProfile(profile.id.toString(), {
          installments: profile.installments,
          totalPaid: profile.totalPaid,
          totalRemaining: profile.totalRemaining,
          lastPaymentDate: profile.lastPaymentDate,
          status: profile.status
        })
      }

      // Generate receipt
      await generateReceipt({ ...newPayment, id: 'temp' } as PaymentRecord)

      // Send notification
      await sendNotification({
        studentId: payment.studentId,
        type: 'payment-received',
        message: `Payment of ₹${payment.amount} received successfully. Receipt: ${receiptNumber}`,
        channel: 'sms'
      })

      loading.value = false
      return newPayment
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Invoice Generation
  async function generateInvoice(studentId: number | string, installmentID: string) {
    const profile = studentFeeProfiles.value.find(p => p.studentId == studentId)
    if (!profile) return null

    const installment = profile.installments.find(i => i.installmentID === installmentID)
    if (!installment) return null

    const invoiceNumber = `INV-${Date.now()}`
    const invoice: Omit<Invoice, 'id'> = {
      invoiceNumber,
      studentId,
      installmentID,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: installment.dueDate,
      amount: installment.amount,
      lateFee: installment.lateFee,
      discount: installment.discount,
      totalAmount: installment.amount + installment.lateFee - installment.discount,
      status: installment.status === 'paid' ? 'paid' :
        installment.dueDate < new Date().toISOString().split('T')[0] ? 'overdue' : 'issued'
    }

    try {
      loading.value = true
      await installmentsFirebase.createInvoice(invoice)

      installment.invoiceNumber = invoiceNumber
      await installmentsFirebase.updateProfile(profile.id.toString(), {
        installments: profile.installments
      })

      loading.value = false
      return invoice
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  // Receipt Generation
  async function generateReceipt(payment: PaymentRecord) {
    const receipt: Omit<Receipt, 'id'> = {
      receiptNumber: payment.receiptNumber,
      studentId: payment.studentId,
      installmentID: payment.installmentID,
      paymentID: payment.paymentID,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      collectedBy: payment.collectedBy
    }

    try {
      await installmentsFirebase.createReceipt(receipt)
      return receipt
    } catch (err: any) {
      console.error('Failed to generate receipt:', err)
      throw err
    }
  }

  // Late Fee Calculation
  function calculateLateFee(installmentID: string, studentId: number | string) {
    const profile = studentFeeProfiles.value.find(p => p.studentId == studentId)
    if (!profile) return 0

    const installment = profile.installments.find(i => i.installmentID === installmentID)
    if (!installment || installment.status === 'paid') return 0

    const plan = plans.value.find(p => p.planID === profile.planID)
    if (!plan) return 0

    const planInstallment = plan.installments.find(i => i.installmentID === installmentID)
    if (!planInstallment || !planInstallment.lateFeeRule.enabled) return 0

    const today = new Date()
    const dueDate = new Date(installment.dueDate)
    const gracePeriod = planInstallment.lateFeeRule.gracePeriodDays || 0

    dueDate.setDate(dueDate.getDate() + gracePeriod)

    if (today <= dueDate) return 0

    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    let lateFee = 0
    if (planInstallment.lateFeeRule.type === 'flat') {
      lateFee = planInstallment.lateFeeRule.amount
    } else {
      lateFee = (installment.amount * planInstallment.lateFeeRule.amount) / 100
    }

    if (planInstallment.lateFeeRule.maxLateFee) {
      lateFee = Math.min(lateFee, planInstallment.lateFeeRule.maxLateFee)
    }

    return lateFee
  }

  async function applyLateFees() {
    const today = new Date().toISOString().split('T')[0] || ''

    for (const profile of studentFeeProfiles.value) {
      let updated = false
      profile.installments.forEach(installment => {
        if (installment.status !== 'paid' && (installment.dueDate || '') < today) {
          const lateFee = calculateLateFee(installment.installmentID, profile.studentId)
          if (lateFee > 0 && installment.lateFee !== lateFee) {
            installment.lateFee = lateFee
            installment.remainingAmount = installment.amount - installment.paidAmount + lateFee - installment.discount
            installment.status = 'overdue'
            profile.totalLateFee += lateFee
            profile.totalRemaining += lateFee
            updated = true
          }
        }
      })

      // Update defaulter status
      const hasOverdue = profile.installments.some(i => i.status === 'overdue')
      if (hasOverdue && profile.status !== 'completed') {
        profile.status = 'defaulter'
        updated = true
      }

      if (updated && profile.id) {
        try {
          await installmentsFirebase.updateProfile(profile.id.toString(), {
            installments: profile.installments,
            totalLateFee: profile.totalLateFee,
            totalRemaining: profile.totalRemaining,
            status: profile.status
          })
        } catch (err) {
          console.error('Failed to update late fees for profile:', profile.id, err)
        }
      }
    }
  }

  // Discount Application
  async function applyDiscount(studentId: number | string, installmentID: string, discount: number, reason: string) {
    const profile = studentFeeProfiles.value.find(p => p.studentId == studentId)
    if (!profile) return false

    const installment = profile.installments.find(i => i.installmentID === installmentID)
    if (!installment) return false

    installment.discount = discount
    installment.remainingAmount = installment.amount - installment.paidAmount + installment.lateFee - discount
    profile.totalDiscount += discount
    profile.totalRemaining -= discount

    try {
      await installmentsFirebase.updateProfile(profile.id.toString(), {
        installments: profile.installments,
        totalDiscount: profile.totalDiscount,
        totalRemaining: profile.totalRemaining
      })
      return true
    } catch (err) {
      console.error('Failed to apply discount:', err)
      return false
    }
  }

  // Notification System
  async function sendNotification(notification: Omit<FeeNotification, 'id' | 'sentDate' | 'status'>) {
    const newNotification: Omit<FeeNotification, 'id'> = {
      ...notification,
      sentDate: new Date().toISOString(),
      status: 'sent'
    }

    try {
      await installmentsFirebase.createNotification(newNotification)
      return newNotification
    } catch (err) {
      console.error('Failed to send notification:', err)
      throw err
    }
  }

  async function sendDueReminders() {
    const today = new Date()
    const reminderDate = new Date(today)
    reminderDate.setDate(reminderDate.getDate() + 3) // 3 days before due

    for (const profile of studentFeeProfiles.value) {
      for (const installment of profile.installments) {
        if (installment.status === 'pending' || installment.status === 'partial') {
          const dueDate = new Date(installment.dueDate)
          if (dueDate <= reminderDate && dueDate >= today) {
            await sendNotification({
              studentId: profile.studentId,
              type: 'due-reminder',
              message: `Reminder: ${installment.title} of ₹${installment.remainingAmount} is due on ${installment.dueDate}`,
              channel: 'sms'
            })
          }
        }
      }
    }
  }

  async function sendOverdueAlerts() {
    for (const installment of overdueInstallments.value) {
      await sendNotification({
        studentId: installment.studentId,
        type: 'overdue-alert',
        message: `Alert: ${installment.title} is overdue. Please pay ₹${installment.remainingAmount} immediately.`,
        channel: 'sms'
      })
    }
  }

  // Analytics & Reporting
  function getCollectionByClass(className: string) {
    // This would need student store integration
    return {
      totalFee: 0,
      collected: 0,
      pending: 0,
      percentage: 0
    }
  }

  function getCollectionByDate(startDate: string, endDate: string) {
    return payments.value.filter(p =>
      p.paymentDate >= startDate &&
      p.paymentDate <= endDate &&
      p.status === 'completed'
    )
  }

  function getDailyCollectionSummary(date: string) {
    const dayPayments = payments.value.filter(p =>
      p.paymentDate === date && p.status === 'completed'
    )

    return {
      date,
      totalAmount: dayPayments.reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: dayPayments.length,
      byMethod: {
        cash: dayPayments.filter(p => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.amount, 0),
        bank: dayPayments.filter(p => p.paymentMethod === 'bank').reduce((sum, p) => sum + p.amount, 0),
        online: dayPayments.filter(p => p.paymentMethod === 'online').reduce((sum, p) => sum + p.amount, 0),
        jazzcash: dayPayments.filter(p => p.paymentMethod === 'jazzcash').reduce((sum, p) => sum + p.amount, 0),
        easypaisa: dayPayments.filter(p => p.paymentMethod === 'easypaisa').reduce((sum, p) => sum + p.amount, 0)
      }
    }
  }

  function getInstallmentWiseCollection() {
    const installmentStats = new Map<string, { title: string; total: number; collected: number; pending: number }>()

    studentFeeProfiles.value.forEach(profile => {
      profile.installments.forEach(inst => {
        const existing = installmentStats.get(inst.installmentID) || {
          title: inst.title,
          total: 0,
          collected: 0,
          pending: 0
        }

        existing.total += inst.amount
        existing.collected += inst.paidAmount
        existing.pending += inst.remainingAmount

        installmentStats.set(inst.installmentID, existing)
      })
    })

    return Array.from(installmentStats.values())
  }

  function getOverdueReport() {
    return overdueInstallments.value.map(inst => {
      const profile = studentFeeProfiles.value.find(p => p.studentId === inst.studentId)
      return {
        studentId: inst.studentId,
        installmentTitle: inst.title,
        amount: inst.remainingAmount,
        dueDate: inst.dueDate,
        daysOverdue: Math.floor(
          (new Date().getTime() - new Date(inst.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        ),
        lateFee: inst.lateFee,
        totalDue: inst.remainingAmount
      }
    })
  }

  // Export Data
  function exportToCSV(type: 'payments' | 'overdue' | 'collection') {
    let data: any[] = []
    let headers: string[] = []

    if (type === 'payments') {
      headers = ['Date', 'Student ID', 'Amount', 'Method', 'Receipt', 'Status']
      data = payments.value.map(p => [
        p.paymentDate,
        p.studentId,
        p.amount,
        p.paymentMethod,
        p.receiptNumber,
        p.status
      ])
    } else if (type === 'overdue') {
      const report = getOverdueReport()
      headers = ['Student ID', 'Installment', 'Amount', 'Due Date', 'Days Overdue', 'Late Fee']
      data = report.map(r => [
        r.studentId,
        r.installmentTitle,
        r.amount,
        r.dueDate,
        r.daysOverdue,
        r.lateFee
      ])
    } else if (type === 'collection') {
      const collection = getInstallmentWiseCollection()
      headers = ['Installment', 'Total', 'Collected', 'Pending', 'Percentage']
      data = collection.map(c => [
        c.title,
        c.total,
        c.collected,
        c.pending,
        ((c.collected / c.total) * 100).toFixed(2) + '%'
      ])
    }

    const csv = [headers.join(','), ...data.map(row => row.join(','))].join('\n')
    return csv
  }

  function loadFromLocalStorage() {
    console.warn('loadFromLocalStorage is deprecated for Installments. Use initialize() instead.')
  }

  function cleanup() {
    if (plansUnsubscribe) plansUnsubscribe()
    if (profilesUnsubscribe) profilesUnsubscribe()
    if (paymentsUnsubscribe) paymentsUnsubscribe()
    if (invoicesUnsubscribe) invoicesUnsubscribe()
    if (receiptsUnsubscribe) receiptsUnsubscribe()
    if (notificationsUnsubscribe) notificationsUnsubscribe()
  }

  return {
    // State
    plans,
    studentFeeProfiles,
    payments,
    invoices,
    receipts,
    notifications,
    loading,
    error,

    // Computed
    activePlans,
    totalCollected,
    totalPending,
    overdueInstallments,
    defaulters,

    // Initialization
    initialize,

    // Plan Management
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,

    // Student Fee Management
    assignPlanToStudent,
    bulkAssignPlan,
    getStudentFeeProfile,
    updateStudentFeeProfile,

    // Payment
    collectPayment,

    // Invoice & Receipt
    generateInvoice,
    generateReceipt,

    // Late Fee & Discount
    calculateLateFee,
    applyLateFees,
    applyDiscount,

    // Notifications
    sendNotification,
    sendDueReminders,
    sendOverdueAlerts,

    // Analytics
    getCollectionByClass,
    getCollectionByDate,
    getDailyCollectionSummary,
    getInstallmentWiseCollection,
    getOverdueReport,

    // Export
    exportToCSV,

    // Persistence
    loadFromLocalStorage,
    cleanup
  }
})

