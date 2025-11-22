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
import type { Exam, Result } from '@/types'

const EXAM_COLLECTION = 'exams'
const RESULT_COLLECTION = 'results'

// --- Exams ---

export async function createExam(exam: Omit<Exam, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EXAM_COLLECTION), {
            ...exam,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create exam: ${error.message}`)
    }
}

export async function updateExam(id: string, data: Partial<Exam>): Promise<void> {
    try {
        const docRef = doc(db, EXAM_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update exam: ${error.message}`)
    }
}

export async function deleteExam(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, EXAM_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete exam: ${error.message}`)
    }
}

export function subscribeToExams(callback: (exams: Exam[]) => void): Unsubscribe {
    const q = query(collection(db, EXAM_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const exams: Exam[] = []
        snapshot.forEach((doc) => {
            exams.push({ id: doc.id, ...doc.data() } as unknown as Exam)
        })
        callback(exams)
    })
}

// --- Results ---

export async function createResult(result: Omit<Result, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, RESULT_COLLECTION), {
            ...result,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create result: ${error.message}`)
    }
}

export async function updateResult(id: string, data: Partial<Result>): Promise<void> {
    try {
        const docRef = doc(db, RESULT_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update result: ${error.message}`)
    }
}

export function subscribeToResults(callback: (results: Result[]) => void): Unsubscribe {
    const q = query(collection(db, RESULT_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const results: Result[] = []
        snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() } as unknown as Result)
        })
        callback(results)
    })
}

export function subscribeToStudentResults(studentId: string, callback: (results: Result[]) => void): Unsubscribe {
    const q = query(collection(db, RESULT_COLLECTION), where('studentId', '==', studentId))
    return onSnapshot(q, (snapshot) => {
        const results: Result[] = []
        snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() } as unknown as Result)
        })
        callback(results)
    })
}
