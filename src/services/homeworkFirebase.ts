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
import type { Homework } from '@/types'

const COLLECTION = 'homework'

export async function createHomework(homework: Omit<Homework, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION), {
            ...homework,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create homework: ${error.message}`)
    }
}

export async function updateHomework(id: string, data: Partial<Homework>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update homework: ${error.message}`)
    }
}

export async function deleteHomework(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete homework: ${error.message}`)
    }
}

export function subscribeToHomework(callback: (homeworkList: Homework[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const homeworkList: Homework[] = []
        snapshot.forEach((doc) => {
            homeworkList.push({ id: doc.id, ...doc.data() } as unknown as Homework)
        })
        callback(homeworkList)
    })
}

export function subscribeToClassHomework(className: string, section: string, callback: (homeworkList: Homework[]) => void): Unsubscribe {
    const q = query(
        collection(db, COLLECTION),
        where('class', '==', className),
        where('section', '==', section)
    )
    return onSnapshot(q, (snapshot) => {
        const homeworkList: Homework[] = []
        snapshot.forEach((doc) => {
            homeworkList.push({ id: doc.id, ...doc.data() } as unknown as Homework)
        })
        callback(homeworkList)
    })
}
