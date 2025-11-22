// Classes Firebase Service - Complete CRUD with Real-time Updates
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
import type { Class } from '@/types'

const COLLECTION = 'classes'

// Create new class
export async function createClass(classData: Omit<Class, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...classData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Class created:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating class:', error)
    throw new Error(`Failed to create class: ${error.message}`)
  }
}

// Get single class by ID
export async function getClass(id: string): Promise<Class | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Class
    }
    return null
  } catch (error: any) {
    console.error('❌ Error getting class:', error)
    throw new Error(`Failed to get class: ${error.message}`)
  }
}

// Get all classes
export async function getAllClasses(): Promise<Class[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const classes: Class[] = []

    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class)
    })

    console.log(`✅ Loaded ${classes.length} classes`)
    return classes
  } catch (error: any) {
    console.error('❌ Error getting classes:', error)
    throw new Error(`Failed to get classes: ${error.message}`)
  }
}

// Get classes by name
export async function getClassesByName(name: string): Promise<Class[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('name', '==', name)
    )

    const querySnapshot = await getDocs(q)
    const classes: Class[] = []

    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class)
    })

    return classes
  } catch (error: any) {
    console.error('❌ Error getting classes by name:', error)
    throw new Error(`Failed to get classes by name: ${error.message}`)
  }
}

// Get classes by section
export async function getClassesBySection(section: string): Promise<Class[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('section', '==', section)
    )

    const querySnapshot = await getDocs(q)
    const classes: Class[] = []

    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class)
    })

    return classes
  } catch (error: any) {
    console.error('❌ Error getting classes by section:', error)
    throw new Error(`Failed to get classes by section: ${error.message}`)
  }
}

// Get classes by class teacher
export async function getClassesByTeacher(teacherId: number): Promise<Class[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('classTeacher', '==', teacherId)
    )

    const querySnapshot = await getDocs(q)
    const classes: Class[] = []

    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class)
    })

    return classes
  } catch (error: any) {
    console.error('❌ Error getting classes by teacher:', error)
    throw new Error(`Failed to get classes by teacher: ${error.message}`)
  }
}

// Update class
export async function updateClass(id: string, data: Partial<Class>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    console.log('✅ Class updated:', id)
  } catch (error: any) {
    console.error('❌ Error updating class:', error)
    throw new Error(`Failed to update class: ${error.message}`)
  }
}

// Delete class
export async function deleteClass(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    console.log('✅ Class deleted:', id)
  } catch (error: any) {
    console.error('❌ Error deleting class:', error)
    throw new Error(`Failed to delete class: ${error.message}`)
  }
}

// Search classes
export async function searchClasses(searchTerm: string): Promise<Class[]> {
  try {
    const allClasses = await getAllClasses()
    const term = searchTerm.toLowerCase()

    return allClasses.filter(cls =>
      cls.name.toLowerCase().includes(term) ||
      cls.section.toLowerCase().includes(term) ||
      `${cls.name}-${cls.section}`.toLowerCase().includes(term)
    )
  } catch (error: any) {
    console.error('❌ Error searching classes:', error)
    throw new Error(`Failed to search classes: ${error.message}`)
  }
}

// Real-time listener for all classes
export function subscribeToClasses(callback: (classes: Class[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const classes: Class[] = []
    snapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class)
    })
    console.log(`🔄 Real-time update: ${classes.length} classes`)
    callback(classes)
  }, (error) => {
    console.error('❌ Real-time listener error:', error)
  })
}

// Bulk operations
export async function bulkCreateClasses(classesData: Omit<Class, 'id'>[]): Promise<string[]> {
  try {
    const ids: string[] = []
    for (const classData of classesData) {
      const id = await createClass(classData)
      ids.push(id)
    }
    console.log(`✅ Bulk created ${ids.length} classes`)
    return ids
  } catch (error: any) {
    console.error('❌ Error bulk creating classes:', error)
    throw new Error(`Failed to bulk create classes: ${error.message}`)
  }
}

// Assign class teacher
export async function assignClassTeacher(classId: string, teacherId: number): Promise<void> {
  try {
    await updateClass(classId, { classTeacher: teacherId })
    console.log(`✅ Teacher ${teacherId} assigned to class:`, classId)
  } catch (error: any) {
    throw new Error(`Failed to assign class teacher: ${error.message}`)
  }
}

// Remove class teacher
export async function removeClassTeacher(classId: string): Promise<void> {
  try {
    await updateClass(classId, { classTeacher: 0 })
    console.log(`✅ Class teacher removed from class:`, classId)
  } catch (error: any) {
    throw new Error(`Failed to remove class teacher: ${error.message}`)
  }
}

// Add student to class
export async function addStudentToClass(classId: string, studentId: number): Promise<void> {
  try {
    const cls = await getClass(classId)
    if (!cls) throw new Error('Class not found')

    if (!cls.students.includes(studentId)) {
      const updatedStudents = [...cls.students, studentId]
      await updateClass(classId, { students: updatedStudents })
      console.log(`✅ Student ${studentId} added to class:`, classId)
    }
  } catch (error: any) {
    throw new Error(`Failed to add student to class: ${error.message}`)
  }
}

// Remove student from class
export async function removeStudentFromClass(classId: string, studentId: number): Promise<void> {
  try {
    const cls = await getClass(classId)
    if (!cls) throw new Error('Class not found')

    const updatedStudents = cls.students.filter(s => s !== studentId)
    await updateClass(classId, { students: updatedStudents })
    console.log(`✅ Student ${studentId} removed from class:`, classId)
  } catch (error: any) {
    throw new Error(`Failed to remove student from class: ${error.message}`)
  }
}

// Add subject to class
export async function addSubjectToClass(classId: string, subjectId: number): Promise<void> {
  try {
    const cls = await getClass(classId)
    if (!cls) throw new Error('Class not found')

    if (!cls.subjects.includes(subjectId)) {
      const updatedSubjects = [...cls.subjects, subjectId]
      await updateClass(classId, { subjects: updatedSubjects })
      console.log(`✅ Subject ${subjectId} added to class:`, classId)
    }
  } catch (error: any) {
    throw new Error(`Failed to add subject to class: ${error.message}`)
  }
}

// Remove subject from class
export async function removeSubjectFromClass(classId: string, subjectId: number): Promise<void> {
  try {
    const cls = await getClass(classId)
    if (!cls) throw new Error('Class not found')

    const updatedSubjects = cls.subjects.filter(s => s !== subjectId)
    await updateClass(classId, { subjects: updatedSubjects })
    console.log(`✅ Subject ${subjectId} removed from class:`, classId)
  } catch (error: any) {
    throw new Error(`Failed to remove subject from class: ${error.message}`)
  }
}

// Check if class name-section combination exists
export async function isClassExists(name: string, section: string, excludeId?: string): Promise<boolean> {
  try {
    const classes = await getAllClasses()
    return classes.some(cls =>
      cls.name === name &&
      cls.section === section &&
      cls.id !== excludeId
    )
  } catch (error: any) {
    throw new Error(`Failed to check class existence: ${error.message}`)
  }
}

// Get class statistics
export async function getClassStatistics(classId: string): Promise<{
  totalStudents: number
  totalSubjects: number
  capacity: number
  occupancyRate: number
  hasClassTeacher: boolean
}> {
  try {
    const cls = await getClass(classId)
    if (!cls) throw new Error('Class not found')

    const totalStudents = cls.students.length
    const totalSubjects = cls.subjects.length
    const capacity = cls.capacity
    const occupancyRate = (totalStudents / capacity) * 100
    const hasClassTeacher = cls.classTeacher !== 0

    return {
      totalStudents,
      totalSubjects,
      capacity,
      occupancyRate,
      hasClassTeacher
    }
  } catch (error: any) {
    throw new Error(`Failed to get class statistics: ${error.message}`)
  }
}

// Get classes with available seats
export async function getClassesWithAvailableSeats(): Promise<Class[]> {
  try {
    const classes = await getAllClasses()
    return classes.filter(cls => cls.students.length < cls.capacity)
  } catch (error: any) {
    throw new Error(`Failed to get classes with available seats: ${error.message}`)
  }
}

// Get classes without class teacher
export async function getClassesWithoutTeacher(): Promise<Class[]> {
  try {
    const classes = await getAllClasses()
    return classes.filter(cls => !cls.classTeacher || cls.classTeacher === 0)
  } catch (error: any) {
    throw new Error(`Failed to get classes without teacher: ${error.message}`)
  }
}
