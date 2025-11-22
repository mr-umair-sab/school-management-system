// Students Firebase Service - Complete CRUD with Real-time Updates
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
  orderBy,
  onSnapshot,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Student } from '@/types'

const COLLECTION = 'students'

// Create new student
export async function createStudent(studentData: Omit<Student, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...studentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Student created:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating student:', error)
    throw new Error(`Failed to create student: ${error.message}`)
  }
}

// Get single student by ID
export async function getStudent(id: string): Promise<Student | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Student
    }
    return null
  } catch (error: any) {
    console.error('❌ Error getting student:', error)
    throw new Error(`Failed to get student: ${error.message}`)
  }
}

// Get all students
export async function getAllStudents(): Promise<Student[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const students: Student[] = []

    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student)
    })

    console.log(`✅ Loaded ${students.length} students`)
    return students
  } catch (error: any) {
    console.error('❌ Error getting students:', error)
    throw new Error(`Failed to get students: ${error.message}`)
  }
}

// Get students by class and section
export async function getStudentsByClass(className: string, section: string): Promise<Student[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('class', '==', className),
      where('section', '==', section),
      where('status', '==', 'active')
    )

    const querySnapshot = await getDocs(q)
    const students: Student[] = []

    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student)
    })

    return students
  } catch (error: any) {
    console.error('❌ Error getting students by class:', error)
    throw new Error(`Failed to get students by class: ${error.message}`)
  }
}

// Get active students only
export async function getActiveStudents(): Promise<Student[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', 'active')
    )

    const querySnapshot = await getDocs(q)
    const students: Student[] = []

    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student)
    })

    return students
  } catch (error: any) {
    console.error('❌ Error getting active students:', error)
    throw new Error(`Failed to get active students: ${error.message}`)
  }
}

// Update student
export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    console.log('✅ Student updated:', id)
  } catch (error: any) {
    console.error('❌ Error updating student:', error)
    throw new Error(`Failed to update student: ${error.message}`)
  }
}

// Delete student
export async function deleteStudent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    console.log('✅ Student deleted:', id)
  } catch (error: any) {
    console.error('❌ Error deleting student:', error)
    throw new Error(`Failed to delete student: ${error.message}`)
  }
}

// Search students by name or roll number
export async function searchStudents(searchTerm: string): Promise<Student[]> {
  try {
    const allStudents = await getAllStudents()
    const term = searchTerm.toLowerCase()

    return allStudents.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.rollNumber.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    )
  } catch (error: any) {
    console.error('❌ Error searching students:', error)
    throw new Error(`Failed to search students: ${error.message}`)
  }
}

// Real-time listener for all students
export function subscribeToStudents(callback: (students: Student[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const students: Student[] = []
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student)
    })
    console.log(`🔄 Real-time update: ${students.length} students`)
    callback(students)
  }, (error) => {
    console.error('❌ Real-time listener error:', error)
  })
}

// Real-time listener for students by class
export function subscribeToStudentsByClass(
  className: string,
  section: string,
  callback: (students: Student[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('class', '==', className),
    where('section', '==', section)
  )

  return onSnapshot(q, (snapshot) => {
    const students: Student[] = []
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student)
    })
    callback(students)
  })
}

// Bulk operations
export async function bulkCreateStudents(studentsData: Omit<Student, 'id'>[]): Promise<string[]> {
  try {
    const ids: string[] = []
    for (const studentData of studentsData) {
      const id = await createStudent(studentData)
      ids.push(id)
    }
    console.log(`✅ Bulk created ${ids.length} students`)
    return ids
  } catch (error: any) {
    console.error('❌ Error bulk creating students:', error)
    throw new Error(`Failed to bulk create students: ${error.message}`)
  }
}

// Update student status (active/inactive/graduated)
export async function updateStudentStatus(
  id: string,
  status: 'active' | 'inactive' | 'graduated'
): Promise<void> {
  try {
    await updateStudent(id, { status })
    console.log(`✅ Student status updated to ${status}:`, id)
  } catch (error: any) {
    throw new Error(`Failed to update student status: ${error.message}`)
  }
}

// Get students count by class
export async function getStudentsCountByClass(): Promise<Record<string, number>> {
  try {
    const students = await getAllStudents()
    const counts: Record<string, number> = {}

    students.forEach(student => {
      const key = `${student.class}-${student.section}`
      counts[key] = (counts[key] || 0) + 1
    })

    return counts
  } catch (error: any) {
    throw new Error(`Failed to get students count: ${error.message}`)
  }
}
