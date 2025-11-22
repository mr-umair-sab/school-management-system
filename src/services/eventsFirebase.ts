import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
    Event,
    Competition,
    Trip,
    PTMSchedule,
    GalleryMedia,
    Certificate,
    EventBudget
} from '@/types'

const EVENTS_COLLECTION = 'events'
const COMPETITIONS_COLLECTION = 'competitions'
const TRIPS_COLLECTION = 'trips'
const PTM_COLLECTION = 'ptm_schedules'
const GALLERY_COLLECTION = 'gallery_media'
const CERTIFICATES_COLLECTION = 'certificates'
const BUDGETS_COLLECTION = 'event_budgets'

// --- Events ---
export async function createEvent(event: Omit<Event, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
            ...event,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create event: ${error.message}`)
    }
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id)
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
        await deleteDoc(doc(db, EVENTS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete event: ${error.message}`)
    }
}

export function subscribeToEvents(callback: (events: Event[]) => void): Unsubscribe {
    const q = query(collection(db, EVENTS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const events: Event[] = []
        snapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as unknown as Event)
        })
        callback(events)
    })
}

// --- Competitions ---
export async function createCompetition(competition: Omit<Competition, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COMPETITIONS_COLLECTION), competition)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create competition: ${error.message}`)
    }
}

export async function updateCompetition(id: string, data: Partial<Competition>): Promise<void> {
    try {
        const docRef = doc(db, COMPETITIONS_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update competition: ${error.message}`)
    }
}

export async function deleteCompetition(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COMPETITIONS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete competition: ${error.message}`)
    }
}

export function subscribeToCompetitions(callback: (competitions: Competition[]) => void): Unsubscribe {
    const q = query(collection(db, COMPETITIONS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const competitions: Competition[] = []
        snapshot.forEach((doc) => {
            competitions.push({ id: doc.id, ...doc.data() } as unknown as Competition)
        })
        callback(competitions)
    })
}

// --- Trips ---
export async function createTrip(trip: Omit<Trip, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, TRIPS_COLLECTION), trip)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create trip: ${error.message}`)
    }
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<void> {
    try {
        const docRef = doc(db, TRIPS_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update trip: ${error.message}`)
    }
}

export async function deleteTrip(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, TRIPS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete trip: ${error.message}`)
    }
}

export function subscribeToTrips(callback: (trips: Trip[]) => void): Unsubscribe {
    const q = query(collection(db, TRIPS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const trips: Trip[] = []
        snapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() } as unknown as Trip)
        })
        callback(trips)
    })
}

// --- PTM Schedules ---
export async function createPTM(ptm: Omit<PTMSchedule, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PTM_COLLECTION), ptm)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create PTM: ${error.message}`)
    }
}

export async function updatePTM(id: string, data: Partial<PTMSchedule>): Promise<void> {
    try {
        const docRef = doc(db, PTM_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update PTM: ${error.message}`)
    }
}

export async function deletePTM(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, PTM_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete PTM: ${error.message}`)
    }
}

export function subscribeToPTMs(callback: (ptms: PTMSchedule[]) => void): Unsubscribe {
    const q = query(collection(db, PTM_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const ptms: PTMSchedule[] = []
        snapshot.forEach((doc) => {
            ptms.push({ id: doc.id, ...doc.data() } as unknown as PTMSchedule)
        })
        callback(ptms)
    })
}

// --- Gallery Media ---
export async function createGalleryMedia(media: Omit<GalleryMedia, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
            ...media,
            uploadDate: new Date().toISOString()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create gallery media: ${error.message}`)
    }
}

export async function deleteGalleryMedia(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, GALLERY_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete gallery media: ${error.message}`)
    }
}

export function subscribeToGalleryMedia(callback: (media: GalleryMedia[]) => void): Unsubscribe {
    const q = query(collection(db, GALLERY_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const media: GalleryMedia[] = []
        snapshot.forEach((doc) => {
            media.push({ id: doc.id, ...doc.data() } as unknown as GalleryMedia)
        })
        callback(media)
    })
}

// --- Certificates ---
export async function createCertificate(certificate: Omit<Certificate, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, CERTIFICATES_COLLECTION), certificate)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create certificate: ${error.message}`)
    }
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
    try {
        const docRef = doc(db, CERTIFICATES_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update certificate: ${error.message}`)
    }
}

export async function deleteCertificate(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, CERTIFICATES_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete certificate: ${error.message}`)
    }
}

export function subscribeToCertificates(callback: (certificates: Certificate[]) => void): Unsubscribe {
    const q = query(collection(db, CERTIFICATES_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const certificates: Certificate[] = []
        snapshot.forEach((doc) => {
            certificates.push({ id: doc.id, ...doc.data() } as unknown as Certificate)
        })
        callback(certificates)
    })
}

// --- Event Budgets ---
export async function createBudget(budget: Omit<EventBudget, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, BUDGETS_COLLECTION), budget)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create budget: ${error.message}`)
    }
}

export async function updateBudget(id: string, data: Partial<EventBudget>): Promise<void> {
    try {
        const docRef = doc(db, BUDGETS_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update budget: ${error.message}`)
    }
}

export async function deleteBudget(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, BUDGETS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete budget: ${error.message}`)
    }
}

export function subscribeToBudgets(callback: (budgets: EventBudget[]) => void): Unsubscribe {
    const q = query(collection(db, BUDGETS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const budgets: EventBudget[] = []
        snapshot.forEach((doc) => {
            budgets.push({ id: doc.id, ...doc.data() } as unknown as EventBudget)
        })
        callback(budgets)
    })
}
