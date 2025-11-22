// Teachers Firebase Service - Complete CRUD with Real-time Updates
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
import type { Teacher } from '@/types'

const COLLECTION = 'teachers'

// Create new teacher
export async function createTeacher(teacherData: Omit<Teacher, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...teacherData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Teacher created:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating teacher:', error)
    throw new Error(`Failed to create teacher: ${error.message}`)
  }
}

// Get single teacher by ID
export async function getTeacher(id: string): Promise<Teacher | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Teacher
    }
    return null
  } catch (error: any) {
    console.error('❌ Error getting teacher:', error)
    throw new Error(`Failed to get teacher: ${error.message}`)
  }
}

// Get all teachers
export async function getAllTeachers(): Promise<Teacher[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const teachers: Teacher[] = []

    querySnapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })

    console.log(`✅ Loaded ${teachers.length} teachers`)
    return teachers
  } catch (error: any) {
    console.error('❌ Error getting teachers:', error)
    throw new Error(`Failed to get teachers: ${error.message}`)
  }
}

// Get active teachers only
export async function getActiveTeachers(): Promise<Teacher[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', 'active')
    )

    const querySnapshot = await getDocs(q)
    const teachers: Teacher[] = []

    querySnapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })

    return teachers
  } catch (error: any) {
    console.error('❌ Error getting active teachers:', error)
    throw new Error(`Failed to get active teachers: ${error.message}`)
  }
}

// Get teachers by subject
export async function getTeachersBySubject(subject: string): Promise<Teacher[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('subjects', 'array-contains', subject)
    )

    const querySnapshot = await getDocs(q)
    const teachers: Teacher[] = []

    querySnapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })

    return teachers
  } catch (error: any) {
    console.error('❌ Error getting teachers by subject:', error)
    throw new Error(`Failed to get teachers by subject: ${error.message}`)
  }
}

// Get teachers by class
export async function getTeachersByClass(className: string): Promise<Teacher[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('classes', 'array-contains', className)
    )

    const querySnapshot = await getDocs(q)
    const teachers: Teacher[] = []

    querySnapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })

    return teachers
  } catch (error: any) {
    console.error('❌ Error getting teachers by class:', error)
    throw new Error(`Failed to get teachers by class: ${error.message}`)
  }
}

// Update teacher
export async function updateTeacher(id: string, data: Partial<Teacher>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    console.log('✅ Teacher updated:', id)
  } catch (error: any) {
    console.error('❌ Error updating teacher:', error)
    throw new Error(`Failed to update teacher: ${error.message}`)
  }
}

// Delete teacher
export async function deleteTeacher(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    console.log('✅ Teacher deleted:', id)
  } catch (error: any) {
    console.error('❌ Error deleting teacher:', error)
    throw new Error(`Failed to delete teacher: ${error.message}`)
  }
}

// Search teachers by name or employee ID
export async function searchTeachers(searchTerm: string): Promise<Teacher[]> {
  try {
    const allTeachers = await getAllTeachers()
    const term = searchTerm.toLowerCase()

    return allTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(term) ||
      teacher.employeeId.toLowerCase().includes(term) ||
      teacher.email?.toLowerCase().includes(term) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(term))
    )
  } catch (error: any) {
    console.error('❌ Error searching teachers:', error)
    throw new Error(`Failed to search teachers: ${error.message}`)
  }
}

// Real-time listener for all teachers
export function subscribeToTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const teachers: Teacher[] = []
    snapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })
    console.log(`🔄 Real-time update: ${teachers.length} teachers`)
    callback(teachers)
  }, (error) => {
    console.error('❌ Real-time listener error:', error)
  })
}

// Real-time listener for active teachers
export function subscribeToActiveTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'active')
  )

  return onSnapshot(q, (snapshot) => {
    const teachers: Teacher[] = []
    snapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() } as Teacher)
    })
    callback(teachers)
  })
}

// Bulk operations
export async function bulkCreateTeachers(teachersData: Omit<Teacher, 'id'>[]): Promise<string[]> {
  try {
    const ids: string[] = []
    for (const teacherData of teachersData) {
      const id = await createTeacher(teacherData)
      ids.push(id)
    }
    console.log(`✅ Bulk created ${ids.length} teachers`)
    return ids
  } catch (error: any) {
    console.error('❌ Error bulk creating teachers:', error)
    throw new Error(`Failed to bulk create teachers: ${error.message}`)
  }
}

// Update teacher status (active/inactive/on-leave)
export async function updateTeacherStatus(
  id: string,
  status: 'active' | 'inactive' | 'on-leave'
): Promise<void> {
  try {
    await updateTeacher(id, { status })
    console.log(`✅ Teacher status updated to ${status}:`, id)
  } catch (error: any) {
    throw new Error(`Failed to update teacher status: ${error.message}`)
  }
}

// Assign subject to teacher
export async function assignSubjectToTeacher(id: string, subject: string): Promise<void> {
  try {
    const teacher = await getTeacher(id)
    if (!teacher) throw new Error('Teacher not found')

    if (!teacher.subjects.includes(subject)) {
      const updatedSubjects = [...teacher.subjects, subject]
      await updateTeacher(id, { subjects: updatedSubjects })
      console.log(`✅ Subject "${subject}" assigned to teacher:`, id)
    }
  } catch (error: any) {
    throw new Error(`Failed to assign subject: ${error.message}`)
  }
}

// Remove subject from teacher
export async function removeSubjectFromTeacher(id: string, subject: string): Promise<void> {
  try {
    const teacher = await getTeacher(id)
    if (!teacher) throw new Error('Teacher not found')

    const updatedSubjects = teacher.subjects.filter(s => s !== subject)
    await updateTeacher(id, { subjects: updatedSubjects })
    console.log(`✅ Subject "${subject}" removed from teacher:`, id)
  } catch (error: any) {
    throw new Error(`Failed to remove subject: ${error.message}`)
  }
}

// Assign class to teacher
export async function assignClassToTeacher(id: string, className: string): Promise<void> {
  try {
    const teacher = await getTeacher(id)
    if (!teacher) throw new Error('Teacher not found')

    if (!teacher.classes.includes(className)) {
      const updatedClasses = [...teacher.classes, className]
      await updateTeacher(id, { classes: updatedClasses })
      console.log(`✅ Class "${className}" assigned to teacher:`, id)
    }
  } catch (error: any) {
    throw new Error(`Failed to assign class: ${error.message}`)
  }
}

// Remove class from teacher
export async function removeClassFromTeacher(id: string, className: string): Promise<void> {
  try {
    const teacher = await getTeacher(id)
    if (!teacher) throw new Error('Teacher not found')

    const updatedClasses = teacher.classes.filter(c => c !== className)
    await updateTeacher(id, { classes: updatedClasses })
    console.log(`✅ Class "${className}" removed from teacher:`, id)
  } catch (error: any) {
    throw new Error(`Failed to remove class: ${error.message}`)
  }
}

// Get teachers count by subject
export async function getTeachersCountBySubject(): Promise<Record<string, number>> {
  try {
    const teachers = await getAllTeachers()
    const counts: Record<string, number> = {}

    teachers.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        counts[subject] = (counts[subject] || 0) + 1
      })
    })

    return counts
  } catch (error: any) {
    throw new Error(`Failed to get teachers count: ${error.message}`)
  }
}

// Get teacher workload (number of classes and subjects)
export async function getTeacherWorkload(id: string): Promise<{
  totalClasses: number
  totalSubjects: number
  subjects: string[]
  classes: string[]
}> {
  try {
    const teacher = await getTeacher(id)
    if (!teacher) throw new Error('Teacher not found')

    return {
      totalClasses: teacher.classes.length,
      totalSubjects: teacher.subjects.length,
      subjects: teacher.subjects,
      classes: teacher.classes
    }
  } catch (error: any) {
    throw new Error(`Failed to get teacher workload: ${error.message}`)
  }
}
