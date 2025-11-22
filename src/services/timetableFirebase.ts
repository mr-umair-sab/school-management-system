// Timetable Firebase Service - Complete CRUD with Real-time Updates
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
import type { Timetable } from '@/types'

const COLLECTION = 'timetables'

// Create new timetable
export async function createTimetable(timetableData: Omit<Timetable, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...timetableData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Timetable created:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating timetable:', error)
    throw new Error(`Failed to create timetable: ${error.message}`)
  }
}

// Get single timetable by ID
export async function getTimetable(id: string): Promise<Timetable | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Timetable
    }
    return null
  } catch (error: any) {
    console.error('❌ Error getting timetable:', error)
    throw new Error(`Failed to get timetable: ${error.message}`)
  }
}

// Get all timetables
export async function getAllTimetables(): Promise<Timetable[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const timetables: Timetable[] = []

    querySnapshot.forEach((doc) => {
      timetables.push({ id: doc.id, ...doc.data() } as Timetable)
    })

    console.log(`✅ Loaded ${timetables.length} timetables`)
    return timetables
  } catch (error: any) {
    console.error('❌ Error getting timetables:', error)
    throw new Error(`Failed to get timetables: ${error.message}`)
  }
}

// Get timetable by class and section
export async function getTimetableByClass(className: string, section: string): Promise<Timetable[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('class', '==', className),
      where('section', '==', section)
    )

    const querySnapshot = await getDocs(q)
    const timetables: Timetable[] = []

    querySnapshot.forEach((doc) => {
      timetables.push({ id: doc.id, ...doc.data() } as Timetable)
    })

    return timetables
  } catch (error: any) {
    console.error('❌ Error getting timetable by class:', error)
    throw new Error(`Failed to get timetable by class: ${error.message}`)
  }
}

// Get timetable by day
export async function getTimetableByDay(day: string): Promise<Timetable[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('day', '==', day)
    )

    const querySnapshot = await getDocs(q)
    const timetables: Timetable[] = []

    querySnapshot.forEach((doc) => {
      timetables.push({ id: doc.id, ...doc.data() } as Timetable)
    })

    return timetables
  } catch (error: any) {
    console.error('❌ Error getting timetable by day:', error)
    throw new Error(`Failed to get timetable by day: ${error.message}`)
  }
}

// Get timetable by teacher
export async function getTimetableByTeacher(teacherId: number): Promise<Timetable[]> {
  try {
    const allTimetables = await getAllTimetables()

    return allTimetables.filter(timetable =>
      timetable.periods.some(period => period.teacher === teacherId)
    )
  } catch (error: any) {
    console.error('❌ Error getting timetable by teacher:', error)
    throw new Error(`Failed to get timetable by teacher: ${error.message}`)
  }
}

// Update timetable
export async function updateTimetable(id: string, data: Partial<Timetable>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    console.log('✅ Timetable updated:', id)
  } catch (error: any) {
    console.error('❌ Error updating timetable:', error)
    throw new Error(`Failed to update timetable: ${error.message}`)
  }
}

// Delete timetable
export async function deleteTimetable(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    console.log('✅ Timetable deleted:', id)
  } catch (error: any) {
    console.error('❌ Error deleting timetable:', error)
    throw new Error(`Failed to delete timetable: ${error.message}`)
  }
}

// Check for teacher clash
export async function checkTeacherClash(
  teacherId: number,
  day: string,
  startTime: string,
  endTime: string,
  excludeTimetableId?: string
): Promise<boolean> {
  try {
    const dayTimetables = await getTimetableByDay(day)

    for (const timetable of dayTimetables) {
      if (excludeTimetableId && timetable.id === excludeTimetableId) continue

      for (const period of timetable.periods) {
        if (period.teacher !== teacherId) continue

        // Check time overlap
        if (
          (startTime >= period.startTime && startTime < period.endTime) ||
          (endTime > period.startTime && endTime <= period.endTime) ||
          (startTime <= period.startTime && endTime >= period.endTime)
        ) {
          return true // Clash found
        }
      }
    }

    return false // No clash
  } catch (error: any) {
    console.error('❌ Error checking teacher clash:', error)
    throw new Error(`Failed to check teacher clash: ${error.message}`)
  }
}

// Check for classroom clash
export async function checkClassroomClash(
  room: string,
  day: string,
  startTime: string,
  endTime: string,
  excludeTimetableId?: string
): Promise<boolean> {
  try {
    const dayTimetables = await getTimetableByDay(day)

    for (const timetable of dayTimetables) {
      if (excludeTimetableId && timetable.id === excludeTimetableId) continue

      for (const period of timetable.periods) {
        if (period.room !== room) continue

        // Check time overlap
        if (
          (startTime >= period.startTime && startTime < period.endTime) ||
          (endTime > period.startTime && endTime <= period.endTime) ||
          (startTime <= period.startTime && endTime >= period.endTime)
        ) {
          return true // Clash found
        }
      }
    }

    return false // No clash
  } catch (error: any) {
    console.error('❌ Error checking classroom clash:', error)
    throw new Error(`Failed to check classroom clash: ${error.message}`)
  }
}

// Real-time listener for all timetables
export function subscribeToTimetables(callback: (timetables: Timetable[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const timetables: Timetable[] = []
    snapshot.forEach((doc) => {
      timetables.push({ id: doc.id, ...doc.data() } as Timetable)
    })
    console.log(`🔄 Real-time update: ${timetables.length} timetables`)
    callback(timetables)
  }, (error) => {
    console.error('❌ Real-time listener error:', error)
  })
}

// Real-time listener for timetables by class
export function subscribeToTimetablesByClass(
  className: string,
  section: string,
  callback: (timetables: Timetable[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('class', '==', className),
    where('section', '==', section)
  )

  return onSnapshot(q, (snapshot) => {
    const timetables: Timetable[] = []
    snapshot.forEach((doc) => {
      timetables.push({ id: doc.id, ...doc.data() } as Timetable)
    })
    callback(timetables)
  })
}

// Bulk operations
export async function bulkCreateTimetables(timetablesData: Omit<Timetable, 'id'>[]): Promise<string[]> {
  try {
    const ids: string[] = []
    for (const timetableData of timetablesData) {
      const id = await createTimetable(timetableData)
      ids.push(id)
    }
    console.log(`✅ Bulk created ${ids.length} timetables`)
    return ids
  } catch (error: any) {
    console.error('❌ Error bulk creating timetables:', error)
    throw new Error(`Failed to bulk create timetables: ${error.message}`)
  }
}

// Delete all timetables for a class
export async function deleteTimetablesByClass(className: string, section: string): Promise<void> {
  try {
    const timetables = await getTimetableByClass(className, section)

    for (const timetable of timetables) {
      await deleteTimetable(timetable.id as string)
    }

    console.log(`✅ Deleted all timetables for ${className}-${section}`)
  } catch (error: any) {
    throw new Error(`Failed to delete timetables: ${error.message}`)
  }
}

// Get teacher's weekly schedule
export async function getTeacherWeeklySchedule(teacherId: number): Promise<Record<string, any[]>> {
  try {
    const allTimetables = await getAllTimetables()
    const schedule: Record<string, any[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    }

    allTimetables.forEach(timetable => {
      timetable.periods.forEach(period => {
        if (period.teacher === teacherId) {
          schedule[timetable.day].push({
            class: `${timetable.class}-${timetable.section}`,
            subject: period.subject,
            startTime: period.startTime,
            endTime: period.endTime,
            room: period.room
          })
        }
      })
    })

    // Sort by time
    Object.keys(schedule).forEach(day => {
      schedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })

    return schedule
  } catch (error: any) {
    throw new Error(`Failed to get teacher schedule: ${error.message}`)
  }
}

// Get classroom usage
export async function getClassroomUsage(room: string): Promise<Record<string, any[]>> {
  try {
    const allTimetables = await getAllTimetables()
    const usage: Record<string, any[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    }

    allTimetables.forEach(timetable => {
      timetable.periods.forEach(period => {
        if (period.room === room) {
          usage[timetable.day].push({
            class: `${timetable.class}-${timetable.section}`,
            subject: period.subject,
            startTime: period.startTime,
            endTime: period.endTime,
            teacher: period.teacher
          })
        }
      })
    })

    // Sort by time
    Object.keys(usage).forEach(day => {
      usage[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })

    return usage
  } catch (error: any) {
    throw new Error(`Failed to get classroom usage: ${error.message}`)
  }
}

// Get free periods for a teacher
export async function getTeacherFreePeriods(teacherId: number, day: string): Promise<string[]> {
  try {
    const schedule = await getTeacherWeeklySchedule(teacherId)
    const daySchedule = schedule[day] || []

    // Define all possible periods (8 AM to 4 PM)
    const allPeriods = [
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '12:00-13:00',
      '13:00-14:00',
      '14:00-15:00',
      '15:00-16:00'
    ]

    const busyPeriods = daySchedule.map(slot => `${slot.startTime}-${slot.endTime}`)
    const freePeriods = allPeriods.filter(period => !busyPeriods.includes(period))

    return freePeriods
  } catch (error: any) {
    throw new Error(`Failed to get free periods: ${error.message}`)
  }
}
