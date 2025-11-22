// Subjects Firebase Service - Complete CRUD with Real-time Updates
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
import type { Subject } from '@/types'

const COLLECTION = 'subjects'

// Create new subject
export async function createSubject(subjectData: Omit<Subject, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...subjectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Subject created:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating subject:', error)
    throw new Error(`Failed to create subject: ${error.message}`)
  }
}

// Get single subject by ID
export async function getSubject(id: string): Promise<Subject | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Subject
    }
    return null
  } catch (error: any) {
    console.error('❌ Error getting subject:', error)
    throw new Error(`Failed to get subject: ${error.message}`)
  }
}

// Get all subjects
export async function getAllSubjects(): Promise<Subject[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const subjects: Subject[] = []

    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })

    console.log(`✅ Loaded ${subjects.length} subjects`)
    return subjects
  } catch (error: any) {
    console.error('❌ Error getting subjects:', error)
    throw new Error(`Failed to get subjects: ${error.message}`)
  }
}

// Get subjects by class
export async function getSubjectsByClass(className: string): Promise<Subject[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('class', '==', className)
    )

    const querySnapshot = await getDocs(q)
    const subjects: Subject[] = []

    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })

    return subjects
  } catch (error: any) {
    console.error('❌ Error getting subjects by class:', error)
    throw new Error(`Failed to get subjects by class: ${error.message}`)
  }
}

// Get subjects by teacher
export async function getSubjectsByTeacher(teacherId: number): Promise<Subject[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('teacher', '==', teacherId)
    )

    const querySnapshot = await getDocs(q)
    const subjects: Subject[] = []

    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })

    return subjects
  } catch (error: any) {
    console.error('❌ Error getting subjects by teacher:', error)
    throw new Error(`Failed to get subjects by teacher: ${error.message}`)
  }
}

// Get core subjects
export async function getCoreSubjects(): Promise<Subject[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('type', '==', 'core')
    )

    const querySnapshot = await getDocs(q)
    const subjects: Subject[] = []

    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })

    return subjects
  } catch (error: any) {
    console.error('❌ Error getting core subjects:', error)
    throw new Error(`Failed to get core subjects: ${error.message}`)
  }
}

// Get elective subjects
export async function getElectiveSubjects(): Promise<Subject[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('type', '==', 'elective')
    )

    const querySnapshot = await getDocs(q)
    const subjects: Subject[] = []

    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })

    return subjects
  } catch (error: any) {
    console.error('❌ Error getting elective subjects:', error)
    throw new Error(`Failed to get elective subjects: ${error.message}`)
  }
}

// Update subject
export async function updateSubject(id: string, data: Partial<Subject>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    console.log('✅ Subject updated:', id)
  } catch (error: any) {
    console.error('❌ Error updating subject:', error)
    throw new Error(`Failed to update subject: ${error.message}`)
  }
}

// Delete subject
export async function deleteSubject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    console.log('✅ Subject deleted:', id)
  } catch (error: any) {
    console.error('❌ Error deleting subject:', error)
    throw new Error(`Failed to delete subject: ${error.message}`)
  }
}

// Search subjects by name or code
export async function searchSubjects(searchTerm: string): Promise<Subject[]> {
  try {
    const allSubjects = await getAllSubjects()
    const term = searchTerm.toLowerCase()

    return allSubjects.filter(subject =>
      subject.name.toLowerCase().includes(term) ||
      subject.code.toLowerCase().includes(term) ||
      subject.class?.toLowerCase().includes(term)
    )
  } catch (error: any) {
    console.error('❌ Error searching subjects:', error)
    throw new Error(`Failed to search subjects: ${error.message}`)
  }
}

// Real-time listener for all subjects
export function subscribeToSubjects(callback: (subjects: Subject[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const subjects: Subject[] = []
    snapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })
    console.log(`🔄 Real-time update: ${subjects.length} subjects`)
    callback(subjects)
  }, (error) => {
    console.error('❌ Real-time listener error:', error)
  })
}

// Real-time listener for subjects by class
export function subscribeToSubjectsByClass(
  className: string,
  callback: (subjects: Subject[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('class', '==', className)
  )

  return onSnapshot(q, (snapshot) => {
    const subjects: Subject[] = []
    snapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject)
    })
    callback(subjects)
  })
}

// Bulk operations
export async function bulkCreateSubjects(subjectsData: Omit<Subject, 'id'>[]): Promise<string[]> {
  try {
    const ids: string[] = []
    for (const subjectData of subjectsData) {
      const id = await createSubject(subjectData)
      ids.push(id)
    }
    console.log(`✅ Bulk created ${ids.length} subjects`)
    return ids
  } catch (error: any) {
    console.error('❌ Error bulk creating subjects:', error)
    throw new Error(`Failed to bulk create subjects: ${error.message}`)
  }
}

// Assign teacher to subject
export async function assignTeacherToSubject(subjectId: string, teacherId: number): Promise<void> {
  try {
    await updateSubject(subjectId, { teacher: teacherId })
    console.log(`✅ Teacher ${teacherId} assigned to subject:`, subjectId)
  } catch (error: any) {
    throw new Error(`Failed to assign teacher: ${error.message}`)
  }
}

// Remove teacher from subject
export async function removeTeacherFromSubject(subjectId: string): Promise<void> {
  try {
    await updateSubject(subjectId, { teacher: 0 })
    console.log(`✅ Teacher removed from subject:`, subjectId)
  } catch (error: any) {
    throw new Error(`Failed to remove teacher: ${error.message}`)
  }
}

// Get subjects count by class
export async function getSubjectsCountByClass(): Promise<Record<string, number>> {
  try {
    const subjects = await getAllSubjects()
    const counts: Record<string, number> = {}

    subjects.forEach(subject => {
      if (subject.class) {
        counts[subject.class] = (counts[subject.class] || 0) + 1
      }
    })

    return counts
  } catch (error: any) {
    throw new Error(`Failed to get subjects count: ${error.message}`)
  }
}

// Get subjects count by type
export async function getSubjectsCountByType(): Promise<{ core: number; elective: number }> {
  try {
    const subjects = await getAllSubjects()
    let core = 0
    let elective = 0

    subjects.forEach(subject => {
      if (subject.type === 'core') core++
      else if (subject.type === 'elective') elective++
    })

    return { core, elective }
  } catch (error: any) {
    throw new Error(`Failed to get subjects count by type: ${error.message}`)
  }
}

// Check if subject code exists
export async function isSubjectCodeExists(code: string, excludeId?: string): Promise<boolean> {
  try {
    const subjects = await getAllSubjects()
    return subjects.some(subject =>
      subject.code.toLowerCase() === code.toLowerCase() &&
      subject.id !== excludeId
    )
  } catch (error: any) {
    throw new Error(`Failed to check subject code: ${error.message}`)
  }
}

// Get subjects without teacher assigned
export async function getSubjectsWithoutTeacher(): Promise<Subject[]> {
  try {
    const subjects = await getAllSubjects()
    return subjects.filter(subject => !subject.teacher || subject.teacher === 0)
  } catch (error: any) {
    throw new Error(`Failed to get subjects without teacher: ${error.message}`)
  }
}
