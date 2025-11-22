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
import type { Notice, Event } from '@/types'

const NOTICE_COLLECTION = 'notices'
const EVENT_COLLECTION = 'events'

// --- Notices ---

export async function createNotice(notice: Omit<Notice, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, NOTICE_COLLECTION), {
            ...notice,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create notice: ${error.message}`)
    }
}

export async function updateNotice(id: string, data: Partial<Notice>): Promise<void> {
    try {
        const docRef = doc(db, NOTICE_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update notice: ${error.message}`)
    }
}

export async function deleteNotice(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, NOTICE_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete notice: ${error.message}`)
    }
}

export function subscribeToNotices(callback: (notices: Notice[]) => void): Unsubscribe {
    const q = query(collection(db, NOTICE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const notices: Notice[] = []
        snapshot.forEach((doc) => {
            notices.push({ id: doc.id, ...doc.data() } as unknown as Notice)
        })
        callback(notices)
    })
}

// --- Events ---

export async function createEvent(event: Omit<Event, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EVENT_COLLECTION), {
            ...event,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create event: ${error.message}`)
    }
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
    try {
        const docRef = doc(db, EVENT_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update event: ${error.message}`)
    }
}

export async function deleteEvent(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, EVENT_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete event: ${error.message}`)
    }
}

export function subscribeToEvents(callback: (events: Event[]) => void): Unsubscribe {
    const q = query(collection(db, EVENT_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const events: Event[] = []
        snapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as unknown as Event)
        })
        callback(events)
    })
}
