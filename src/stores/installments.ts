import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Installment Plan Structure
export interface InstallmentPlan {
  id: number
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
  id: number
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
  id: number
  studentId: number
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
  id: number
  installmentID: string
  studentId: number
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
  id: number
  paymentID: string
  studentId: number
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
  id: number
  invoiceNumber: string
  studentId: number
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
  id: number
  receiptNumber: string
  studentId: number
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
  id: number
  studentId: number
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
    const today = new Date().toISOString().split('T')[0]
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

  // Actions - Installment Plan Management
  function createPlan(plan: Omit<InstallmentPlan, 'id' | 'planID'>) {
    const planID = `PLAN-${Date.now()}`
    const newPlan: InstallmentPlan = {
      ...plan,
      id: Date.now(),
      planID,
      installments: plan.installments.map((inst, index) => ({
        ...inst,
        id: Date.now() + index,
        installmentID: `${planID}-INST-${index + 1}`,
        planID
      }))
    }
    plans.value.push(newPlan)
    saveToLocalStorage()
    return newPlan
  }

  function updatePlan(id: number, plan: Partial<InstallmentPlan>) {
    const index = plans.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plans.value[index] = { ...plans.value[index], ...plan }
      saveToLocalStorage()
    }
  }

  function deletePlan(id: number) {
    plans.value = plans.value.filter(p => p.id !== id)
    saveToLocalStorage()
  }

  function duplicatePlan(id: number, newTitle: string) {
    const plan = plans.value.find(p => p.id === id)
    if (plan) {
      const duplicated = {
        ...plan,
        title: newTitle,
        createdDate: new Date().toISOString().split('T')[0]
      }
      delete (duplicated as any).id
      delete (duplicated as any).planID
      return createPlan(duplicated)
    }
  }

  // Student Fee Profile Management
  function assignPlanToStudent(studentId: number, planID: string, customizations?: Partial<StudentFeeProfile>) {
    const plan = plans.value.find(p => p.planID === planID)
    if (!plan) return null

    const profile: StudentFeeProfile = {
      id: Date.now(),
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

    studentFeeProfiles.value.push(profile)
    saveToLocalStorage()
    return profile
  }

  function bulkAssignPlan(studentIds: number[], planID: string) {
    const results = studentIds.map(studentId => assignPlanToStudent(studentId, planID))
    return results.filter(r => r !== null)
  }

  function getStudentFeeProfile(studentId: number) {
    return studentFeeProfiles.value.find(p => p.studentId === studentId)
  }

  function updateStudentFeeProfile(studentId: number, updates: Partial<StudentFeeProfile>) {
    const index = studentFeeProfiles.value.findIndex(p => p.studentId === studentId)
    if (index !== -1) {
      studentFeeProfiles.value[index] = { ...studentFeeProfiles.value[index], ...updates }
      saveToLocalStorage()
    }
  }

  // Payment Collection
  function collectPayment(payment: Omit<PaymentRecord, 'id' | 'paymentID' | 'receiptNumber'>) {
    const paymentID = `PAY-${Date.now()}`
    const receiptNumber = `REC-${Date.now()}`

    const newPayment: PaymentRecord = {
      ...payment,
      id: Date.now(),
      paymentID,
      receiptNumber,
      status: 'completed'
    }

    payments.value.push(newPayment)

    // Update student installment
    const profile = studentFeeProfiles.value.find(p => p.studentId === payment.studentId)
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
      profile.lastPaymentDate = payment.paymentDate
      profile.paymentHistory.push(newPayment)

      // Update status
      if (profile.totalRemaining === 0) {
        profile.status = 'completed'
      }
    }

    // Generate receipt
    generateReceipt(newPayment)

    // Send notification
    sendNotification({
      studentId: payment.studentId,
      type: 'payment-received',
      message: `Payment of ₹${payment.amount} received successfully. Receipt: ${receiptNumber}`,
      channel: 'sms'
    })

    saveToLocalStorage()
    return newPayment
  }

  // Invoice Generation
  function generateInvoice(studentId: number, installmentID: string) {
    const profile = studentFeeProfiles.value.find(p => p.studentId === studentId)
    if (!profile) return null

    const installment = profile.installments.find(i => i.installmentID === installmentID)
    if (!installment) return null

    const invoiceNumber = `INV-${Date.now()}`
    const invoice: Invoice = {
      id: Date.now(),
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

    invoices.value.push(invoice)
    installment.invoiceNumber = invoiceNumber
    saveToLocalStorage()
    return invoice
  }

  // Receipt Generation
  function generateReceipt(payment: PaymentRecord) {
    const receipt: Receipt = {
      id: Date.now(),
      receiptNumber: payment.receiptNumber,
      studentId: payment.studentId,
      installmentID: payment.installmentID,
      paymentID: payment.paymentID,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      collectedBy: payment.collectedBy
    }

    receipts.value.push(receipt)
    saveToLocalStorage()
    return receipt
  }

  // Late Fee Calculation
  function calculateLateFee(installmentID: string, studentId: number) {
    const profile = studentFeeProfiles.value.find(p => p.studentId === studentId)
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

  function applyLateFees() {
    const today = new Date().toISOString().split('T')[0]

    studentFeeProfiles.value.forEach(profile => {
      profile.installments.forEach(installment => {
        if (installment.status !== 'paid' && installment.dueDate < today) {
          const lateFee = calculateLateFee(installment.installmentID, profile.studentId)
          if (lateFee > 0 && installment.lateFee !== lateFee) {
            installment.lateFee = lateFee
            installment.remainingAmount = installment.amount - installment.paidAmount + lateFee - installment.discount
            installment.status = 'overdue'
            profile.totalLateFee += lateFee
            profile.totalRemaining += lateFee
          }
        }
      })

      // Update defaulter status
      const hasOverdue = profile.installments.some(i => i.status === 'overdue')
      if (hasOverdue && profile.status !== 'completed') {
        profile.status = 'defaulter'
      }
    })

    saveToLocalStorage()
  }

  // Discount Application
  function applyDiscount(studentId: number, installmentID: string, discount: number, reason: string) {
    const profile = studentFeeProfiles.value.find(p => p.studentId === studentId)
    if (!profile) return false

    const installment = profile.installments.find(i => i.installmentID === installmentID)
    if (!installment) return false

    installment.discount = discount
    installment.remainingAmount = installment.amount - installment.paidAmount + installment.lateFee - discount
    profile.totalDiscount += discount
    profile.totalRemaining -= discount

    saveToLocalStorage()
    return true
  }

  // Notification System
  function sendNotification(notification: Omit<FeeNotification, 'id' | 'sentDate' | 'status'>) {
    const newNotification: FeeNotification = {
      ...notification,
      id: Date.now(),
      sentDate: new Date().toISOString(),
      status: 'sent'
    }

    notifications.value.push(newNotification)
    saveToLocalStorage()
    return newNotification
  }

  function sendDueReminders() {
    const today = new Date()
    const reminderDate = new Date(today)
    reminderDate.setDate(reminderDate.getDate() + 3) // 3 days before due

    studentFeeProfiles.value.forEach(profile => {
      profile.installments.forEach(installment => {
        if (installment.status === 'pending' || installment.status === 'partial') {
          const dueDate = new Date(installment.dueDate)
          if (dueDate <= reminderDate && dueDate >= today) {
            sendNotification({
              studentId: profile.studentId,
              type: 'due-reminder',
              message: `Reminder: ${installment.title} of ₹${installment.remainingAmount} is due on ${installment.dueDate}`,
              channel: 'sms'
            })
          }
        }
      })
    })
  }

  function sendOverdueAlerts() {
    overdueInstallments.value.forEach(installment => {
      sendNotification({
        studentId: installment.studentId,
        type: 'overdue-alert',
        message: `Alert: ${installment.title} is overdue. Please pay ₹${installment.remainingAmount} immediately.`,
        channel: 'sms'
      })
    })
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

  // Persistence
  function saveToLocalStorage() {
    localStorage.setItem('installmentPlans', JSON.stringify(plans.value))
    localStorage.setItem('studentFeeProfiles', JSON.stringify(studentFeeProfiles.value))
    localStorage.setItem('feePayments', JSON.stringify(payments.value))
    localStorage.setItem('feeInvoices', JSON.stringify(invoices.value))
    localStorage.setItem('feeReceipts', JSON.stringify(receipts.value))
    localStorage.setItem('feeNotifications', JSON.stringify(notifications.value))
  }

  function loadFromLocalStorage() {
    const savedPlans = localStorage.getItem('installmentPlans')
    const savedProfiles = localStorage.getItem('studentFeeProfiles')
    const savedPayments = localStorage.getItem('feePayments')
    const savedInvoices = localStorage.getItem('feeInvoices')
    const savedReceipts = localStorage.getItem('feeReceipts')
    const savedNotifications = localStorage.getItem('feeNotifications')

    if (savedPlans) plans.value = JSON.parse(savedPlans)
    if (savedProfiles) studentFeeProfiles.value = JSON.parse(savedProfiles)
    if (savedPayments) payments.value = JSON.parse(savedPayments)
    if (savedInvoices) invoices.value = JSON.parse(savedInvoices)
    if (savedReceipts) receipts.value = JSON.parse(savedReceipts)
    if (savedNotifications) notifications.value = JSON.parse(savedNotifications)
  }

  return {
    // State
    plans,
    studentFeeProfiles,
    payments,
    invoices,
    receipts,
    notifications,

    // Computed
    activePlans,
    totalCollected,
    totalPending,
    overdueInstallments,
    defaulters,

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
    loadFromLocalStorage
  }
})
