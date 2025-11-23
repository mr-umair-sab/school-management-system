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
    orderBy,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Homework, AssignmentSubmission } from '@/types'

const HOMEWORK_COLLECTION = 'homework'
const SUBMISSIONS_COLLECTION = 'assignment_submissions'

// --- Homework CRUD ---

export async function createHomework(homework: Omit<Homework, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, HOMEWORK_COLLECTION), {
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
        const docRef = doc(db, HOMEWORK_COLLECTION, id)
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
        await deleteDoc(doc(db, HOMEWORK_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete homework: ${error.message}`)
    }
}

export function subscribeToHomework(callback: (homeworkList: Homework[]) => void): Unsubscribe {
    const q = query(collection(db, HOMEWORK_COLLECTION), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const homeworkList: Homework[] = []
        snapshot.forEach((doc) => {
            homeworkList.push({ id: doc.id, ...doc.data() } as unknown as Homework)
        })
        callback(homeworkList)
    })
}

export function subscribeToClassHomework(className: string, section: string, callback: (homeworkList: Homework[]) => void): Unsubscribe {
    // Note: Compound queries might require an index in Firebase Console
    const q = query(
        collection(db, HOMEWORK_COLLECTION),
        where('class', '==', className),
        // where('section', '==', section), // Optional: enable if strict section filtering is needed
        orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
        const homeworkList: Homework[] = []
        snapshot.forEach((doc) => {
            homeworkList.push({ id: doc.id, ...doc.data() } as unknown as Homework)
        })
        callback(homeworkList)
    })
}
// --- Submissions ---

export async function submitAssignment(submission: Omit<AssignmentSubmission, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
            ...submission,
            submittedDate: new Date().toISOString(), // Use ISO string for consistency with type
            status: 'Submitted'
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to submit assignment: ${error.message}`)
    }
}

export function subscribeToSubmissions(assignmentId: string, callback: (submissions: AssignmentSubmission[]) => void): Unsubscribe {
    const q = query(
        collection(db, SUBMISSIONS_COLLECTION),
        where('assignmentId', '==', assignmentId)
    )
    return onSnapshot(q, (snapshot) => {
        const submissions: AssignmentSubmission[] = []
        snapshot.forEach((doc) => {
            submissions.push({ id: doc.id, ...doc.data() } as unknown as AssignmentSubmission)
        })
        callback(submissions)
    })
}

export async function gradeSubmission(submissionId: string, marks: number, feedback: string): Promise<void> {
    try {
        const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId)
        await updateDoc(docRef, {
            marks,
            feedback,
            status: 'Reviewed'
        })
    } catch (error: any) {
        throw new Error(`Failed to grade submission: ${error.message}`)
    }
}

export async function getStudentSubmissions(studentId: string): Promise<AssignmentSubmission[]> {
    try {
        const q = query(
            collection(db, SUBMISSIONS_COLLECTION),
            where('studentId', '==', studentId)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as AssignmentSubmission))
    } catch (error: any) {
        throw new Error(`Failed to get student submissions: ${error.message}`)
    }
}
