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
import type { Transport, Leave } from '@/types'

const ROUTE_COLLECTION = 'transportRoutes'
const LEAVE_COLLECTION = 'leaves'

// --- Routes ---

export async function createRoute(route: Omit<Transport, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ROUTE_COLLECTION), {
            ...route,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create route: ${error.message}`)
    }
}

export async function updateRoute(id: string, data: Partial<Transport>): Promise<void> {
    try {
        const docRef = doc(db, ROUTE_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update route: ${error.message}`)
    }
}

export async function deleteRoute(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, ROUTE_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete route: ${error.message}`)
    }
}

export function subscribeToRoutes(callback: (routes: Transport[]) => void): Unsubscribe {
    const q = query(collection(db, ROUTE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const routes: Transport[] = []
        snapshot.forEach((doc) => {
            routes.push({ id: doc.id, ...doc.data() } as unknown as Transport)
        })
        callback(routes)
    })
}

// --- Leaves ---

export async function createLeave(leave: Omit<Leave, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, LEAVE_COLLECTION), {
            ...leave,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create leave: ${error.message}`)
    }
}

export async function updateLeave(id: string, data: Partial<Leave>): Promise<void> {
    try {
        const docRef = doc(db, LEAVE_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update leave: ${error.message}`)
    }
}

export function subscribeToLeaves(callback: (leaves: Leave[]) => void): Unsubscribe {
    const q = query(collection(db, LEAVE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const leaves: Leave[] = []
        snapshot.forEach((doc) => {
            leaves.push({ id: doc.id, ...doc.data() } as unknown as Leave)
        })
        callback(leaves)
    })
}

export function subscribeToUserLeaves(userId: string, userType: 'teacher' | 'student', callback: (leaves: Leave[]) => void): Unsubscribe {
    const q = query(
        collection(db, LEAVE_COLLECTION),
        where('userId', '==', userId),
        where('userType', '==', userType)
    )
    return onSnapshot(q, (snapshot) => {
        const leaves: Leave[] = []
        snapshot.forEach((doc) => {
            leaves.push({ id: doc.id, ...doc.data() } as unknown as Leave)
        })
        callback(leaves)
    })
}
