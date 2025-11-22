import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Attendance, AttendanceRecord } from '@/types'

const COLLECTION = 'attendance'

export async function markAttendance(attendanceData: Omit<Attendance, 'id'>): Promise<string> {
    try {
        // Check if attendance already exists for this date/class/section
        const q = query(
            collection(db, COLLECTION),
            where('date', '==', attendanceData.date),
            where('class', '==', attendanceData.class),
            where('section', '==', attendanceData.section)
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            // Update existing record
            const docSnapshot = snapshot.docs[0]
            if (!docSnapshot) throw new Error('Document not found')

            const docId = docSnapshot.id
            const docRef = doc(db, COLLECTION, docId)
            await updateDoc(docRef, {
                records: attendanceData.records,
                updatedAt: Timestamp.now()
            })
            return docId
        } else {
            // Create new record
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...attendanceData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            })
            return docRef.id
        }
    } catch (error: any) {
        throw new Error(`Failed to mark attendance: ${error.message}`)
    }
}

export async function getAttendanceByDate(date: string, className: string, section: string): Promise<Attendance | null> {
    try {
        const q = query(
            collection(db, COLLECTION),
            where('date', '==', date),
            where('class', '==', className),
            where('section', '==', section)
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            const doc = snapshot.docs[0]
            if (doc) {
                return { id: doc.id, ...doc.data() } as unknown as Attendance
            }
        }
        return null
    } catch (error: any) {
        throw new Error(`Failed to get attendance: ${error.message}`)
    }
}

export function subscribeToAttendance(callback: (attendanceList: Attendance[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const attendanceList: Attendance[] = []
        snapshot.forEach((doc) => {
            attendanceList.push({ id: doc.id, ...doc.data() } as unknown as Attendance)
        })
        callback(attendanceList)
    })
}

export function subscribeToClassAttendance(className: string, section: string, callback: (attendanceList: Attendance[]) => void): Unsubscribe {
    const q = query(
        collection(db, COLLECTION),
        where('class', '==', className),
        where('section', '==', section)
    )
    return onSnapshot(q, (snapshot) => {
        const attendanceList: Attendance[] = []
        snapshot.forEach((doc) => {
            attendanceList.push({ id: doc.id, ...doc.data() } as unknown as Attendance)
        })
        callback(attendanceList)
    })
}
