import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
    InstallmentPlan,
    StudentFeeProfile,
    PaymentRecord,
    Invoice,
    Receipt,
    FeeNotification
} from '@/stores/installments'

const PLANS_COLLECTION = 'installmentPlans'
const PROFILES_COLLECTION = 'studentFeeProfiles'
const PAYMENTS_COLLECTION = 'feePayments'
const INVOICES_COLLECTION = 'feeInvoices'
const RECEIPTS_COLLECTION = 'feeReceipts'
const NOTIFICATIONS_COLLECTION = 'feeNotifications'

// --- Installment Plans ---

export async function createPlan(plan: Omit<InstallmentPlan, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PLANS_COLLECTION), {
            ...plan,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create plan: ${error.message}`)
    }
}

export async function updatePlan(id: string, data: Partial<InstallmentPlan>): Promise<void> {
    try {
        const docRef = doc(db, PLANS_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update plan: ${error.message}`)
    }
}

export async function deletePlan(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, PLANS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete plan: ${error.message}`)
    }
}

export function subscribeToPlans(callback: (plans: InstallmentPlan[]) => void): Unsubscribe {
    const q = query(collection(db, PLANS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const plans: InstallmentPlan[] = []
        snapshot.forEach((doc) => {
            plans.push({ id: doc.id, ...doc.data() } as unknown as InstallmentPlan)
        })
        callback(plans)
    })
}

// --- Student Fee Profiles ---

export async function createProfile(profile: Omit<StudentFeeProfile, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PROFILES_COLLECTION), {
            ...profile,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create profile: ${error.message}`)
    }
}

export async function updateProfile(id: string, data: Partial<StudentFeeProfile>): Promise<void> {
    try {
        const docRef = doc(db, PROFILES_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update profile: ${error.message}`)
    }
}

export function subscribeToProfiles(callback: (profiles: StudentFeeProfile[]) => void): Unsubscribe {
    const q = query(collection(db, PROFILES_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const profiles: StudentFeeProfile[] = []
        snapshot.forEach((doc) => {
            profiles.push({ id: doc.id, ...doc.data() } as unknown as StudentFeeProfile)
        })
        callback(profiles)
    })
}

// --- Payments ---

export async function createPayment(payment: Omit<PaymentRecord, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), {
            ...payment,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create payment: ${error.message}`)
    }
}

export function subscribeToPayments(callback: (payments: PaymentRecord[]) => void): Unsubscribe {
    const q = query(collection(db, PAYMENTS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const payments: PaymentRecord[] = []
        snapshot.forEach((doc) => {
            payments.push({ id: doc.id, ...doc.data() } as unknown as PaymentRecord)
        })
        callback(payments)
    })
}

// --- Invoices ---

export async function createInvoice(invoice: Omit<Invoice, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, INVOICES_COLLECTION), {
            ...invoice,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create invoice: ${error.message}`)
    }
}

export function subscribeToInvoices(callback: (invoices: Invoice[]) => void): Unsubscribe {
    const q = query(collection(db, INVOICES_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const invoices: Invoice[] = []
        snapshot.forEach((doc) => {
            invoices.push({ id: doc.id, ...doc.data() } as unknown as Invoice)
        })
        callback(invoices)
    })
}

// --- Receipts ---

export async function createReceipt(receipt: Omit<Receipt, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, RECEIPTS_COLLECTION), {
            ...receipt,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create receipt: ${error.message}`)
    }
}

export function subscribeToReceipts(callback: (receipts: Receipt[]) => void): Unsubscribe {
    const q = query(collection(db, RECEIPTS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const receipts: Receipt[] = []
        snapshot.forEach((doc) => {
            receipts.push({ id: doc.id, ...doc.data() } as unknown as Receipt)
        })
        callback(receipts)
    })
}

// --- Notifications ---

export async function createNotification(notification: Omit<FeeNotification, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
            ...notification,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create notification: ${error.message}`)
    }
}

export function subscribeToNotifications(callback: (notifications: FeeNotification[]) => void): Unsubscribe {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const notifications: FeeNotification[] = []
        snapshot.forEach((doc) => {
            notifications.push({ id: doc.id, ...doc.data() } as unknown as FeeNotification)
        })
        callback(notifications)
    })
}
