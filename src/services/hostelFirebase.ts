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
import type { HostelRoom } from '@/types'

const COLLECTION = 'hostelRooms'

export async function createRoom(room: Omit<HostelRoom, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION), {
            ...room,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create room: ${error.message}`)
    }
}

export async function updateRoom(id: string, data: Partial<HostelRoom>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update room: ${error.message}`)
    }
}

export async function deleteRoom(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete room: ${error.message}`)
    }
}

export function subscribeToRooms(callback: (rooms: HostelRoom[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const rooms: HostelRoom[] = []
        snapshot.forEach((doc) => {
            rooms.push({ id: doc.id, ...doc.data() } as unknown as HostelRoom)
        })
        callback(rooms)
    })
}
