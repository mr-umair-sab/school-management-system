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
import type { Announcement, Meeting } from '@/types'

const ANNOUNCEMENT_COLLECTION = 'announcements'
const MEETING_COLLECTION = 'meetings'

// --- Announcements ---

export async function createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ANNOUNCEMENT_COLLECTION), {
            ...announcement,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create announcement: ${error.message}`)
    }
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
    try {
        const docRef = doc(db, ANNOUNCEMENT_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update announcement: ${error.message}`)
    }
}

export async function deleteAnnouncement(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, ANNOUNCEMENT_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete announcement: ${error.message}`)
    }
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
    const q = query(collection(db, ANNOUNCEMENT_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const announcements: Announcement[] = []
        snapshot.forEach((doc) => {
            announcements.push({ id: doc.id, ...doc.data() } as unknown as Announcement)
        })
        callback(announcements)
    })
}

// --- Meetings ---

export async function createMeeting(meeting: Omit<Meeting, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, MEETING_COLLECTION), {
            ...meeting,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create meeting: ${error.message}`)
    }
}

export async function updateMeeting(id: string, data: Partial<Meeting>): Promise<void> {
    try {
        const docRef = doc(db, MEETING_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update meeting: ${error.message}`)
    }
}

export async function deleteMeeting(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, MEETING_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete meeting: ${error.message}`)
    }
}

export function subscribeToMeetings(callback: (meetings: Meeting[]) => void): Unsubscribe {
    const q = query(collection(db, MEETING_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const meetings: Meeting[] = []
        snapshot.forEach((doc) => {
            meetings.push({ id: doc.id, ...doc.data() } as unknown as Meeting)
        })
        callback(meetings)
    })
}
