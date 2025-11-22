import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  type Unsubscribe 
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { FeeStructure, FeeRecord, Payment } from '@/types'

const STRUCTURE_COLLECTION = 'feeStructures'
const RECORD_COLLECTION = 'feeRecords'

// --- Fee Structures ---

export async function createFeeStructure(structure: Omit<FeeStructure, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, STRUCTURE_COLLECTION), {
      ...structure,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(`Failed to create fee structure: ${error.message}`)
  }
}

export async function updateFeeStructure(id: string, data: Partial<FeeStructure>): Promise<void> {
  try {
    const docRef = doc(db, STRUCTURE_COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
  } catch (error: any) {
    throw new Error(`Failed to update fee structure: ${error.message}`)
  }
}

export async function deleteFeeStructure(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, STRUCTURE_COLLECTION, id))
  } catch (error: any) {
    throw new Error(`Failed to delete fee structure: ${error.message}`)
  }
}

export function subscribeToFeeStructures(callback: (structures: FeeStructure[]) => void): Unsubscribe {
  const q = query(collection(db, STRUCTURE_COLLECTION))
  return onSnapshot(q, (snapshot) => {
    const structures: FeeStructure[] = []
    snapshot.forEach((doc) => {
      structures.push({ id: doc.id, ...doc.data() } as unknown as FeeStructure)
    })
    callback(structures)
  })
}

// --- Fee Records ---

export async function createFeeRecord(record: Omit<FeeRecord, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, RECORD_COLLECTION), {
      ...record,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(`Failed to create fee record: ${error.message}`)
  }
}

export async function updateFeeRecord(id: string, data: Partial<FeeRecord>): Promise<void> {
  try {
    const docRef = doc(db, RECORD_COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
  } catch (error: any) {
    throw new Error(`Failed to update fee record: ${error.message}`)
  }
}

export async function addPayment(recordId: string, payment: Omit<Payment, 'id'>): Promise<void> {
  try {
    const recordRef = doc(db, RECORD_COLLECTION, recordId)
    const recordSnap = await getDoc(recordRef)
    
    if (!recordSnap.exists()) {
      throw new Error('Fee record not found')
    }

    const record = recordSnap.data() as FeeRecord
    const newPayment = { ...payment, id: Date.now().toString() } // Use timestamp string for sub-ID
    const updatedPayments = [...(record.payments || []), newPayment]
    
    const paidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = record.totalFee - paidAmount
    const status = pendingAmount <= 0 ? 'paid' : (paidAmount > 0 ? 'partial' : 'pending')

    await updateDoc(recordRef, {
      payments: updatedPayments,
      paidAmount,
      pendingAmount,
      status,
      updatedAt: Timestamp.now()
    })
  } catch (error: any) {
    throw new Error(`Failed to add payment: ${error.message}`)
  }
}

export function subscribeToFeeRecords(callback: (records: FeeRecord[]) => void): Unsubscribe {
  const q = query(collection(db, RECORD_COLLECTION))
  return onSnapshot(q, (snapshot) => {
    const records: FeeRecord[] = []
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as unknown as FeeRecord)
    })
    callback(records)
  })
}

export function subscribeToStudentFeeRecords(studentId: string, callback: (records: FeeRecord[]) => void): Unsubscribe {
  const q = query(collection(db, RECORD_COLLECTION), where('studentId', '==', studentId))
  return onSnapshot(q, (snapshot) => {
    const records: FeeRecord[] = []
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as unknown as FeeRecord)
    })
    callback(records)
  })
}
