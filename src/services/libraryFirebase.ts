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
import type { Book, BookIssue } from '@/types'

const BOOK_COLLECTION = 'books'
const ISSUE_COLLECTION = 'bookIssues'

// --- Books ---

export async function createBook(book: Omit<Book, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, BOOK_COLLECTION), {
            ...book,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create book: ${error.message}`)
    }
}

export async function updateBook(id: string, data: Partial<Book>): Promise<void> {
    try {
        const docRef = doc(db, BOOK_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update book: ${error.message}`)
    }
}

export async function deleteBook(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, BOOK_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete book: ${error.message}`)
    }
}

export function subscribeToBooks(callback: (books: Book[]) => void): Unsubscribe {
    const q = query(collection(db, BOOK_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const books: Book[] = []
        snapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() } as unknown as Book)
        })
        callback(books)
    })
}

// --- Book Issues ---

export async function issueBook(issue: Omit<BookIssue, 'id'>): Promise<string> {
    try {
        // Create issue record
        const docRef = await addDoc(collection(db, ISSUE_COLLECTION), {
            ...issue,
            status: 'issued',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })

        // Update book availability
        const bookRef = doc(db, BOOK_COLLECTION, issue.bookId.toString())
        const bookSnap = await getDoc(bookRef)
        if (bookSnap.exists()) {
            const book = bookSnap.data() as Book
            if (book.available > 0) {
                await updateDoc(bookRef, {
                    available: book.available - 1,
                    updatedAt: Timestamp.now()
                })
            }
        }

        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to issue book: ${error.message}`)
    }
}

export async function returnBook(issueId: string, fine: number = 0): Promise<void> {
    try {
        const issueRef = doc(db, ISSUE_COLLECTION, issueId)
        const issueSnap = await getDoc(issueRef)

        if (!issueSnap.exists()) throw new Error('Issue record not found')

        const issue = issueSnap.data() as BookIssue

        // Update issue record
        await updateDoc(issueRef, {
            returnDate: new Date().toISOString().split('T')[0],
            status: 'returned',
            fine,
            updatedAt: Timestamp.now()
        })

        // Update book availability
        const bookRef = doc(db, BOOK_COLLECTION, issue.bookId.toString())
        const bookSnap = await getDoc(bookRef)
        if (bookSnap.exists()) {
            const book = bookSnap.data() as Book
            await updateDoc(bookRef, {
                available: book.available + 1,
                updatedAt: Timestamp.now()
            })
        }
    } catch (error: any) {
        throw new Error(`Failed to return book: ${error.message}`)
    }
}

export function subscribeToBookIssues(callback: (issues: BookIssue[]) => void): Unsubscribe {
    const q = query(collection(db, ISSUE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const issues: BookIssue[] = []
        snapshot.forEach((doc) => {
            issues.push({ id: doc.id, ...doc.data() } as unknown as BookIssue)
        })
        callback(issues)
    })
}

export function subscribeToStudentIssues(studentId: string, callback: (issues: BookIssue[]) => void): Unsubscribe {
    const q = query(collection(db, ISSUE_COLLECTION), where('studentId', '==', studentId))
    return onSnapshot(q, (snapshot) => {
        const issues: BookIssue[] = []
        snapshot.forEach((doc) => {
            issues.push({ id: doc.id, ...doc.data() } as unknown as BookIssue)
        })
        callback(issues)
    })
}
