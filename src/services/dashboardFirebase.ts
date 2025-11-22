import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// This service aggregates data from other collections for the dashboard
// In a real-world scenario, this might be better handled by Cloud Functions
// to maintain a separate 'stats' collection for performance.
// For now, we'll query existing collections.

export async function getDashboardStats() {
    try {
        const studentsSnapshot = await getDocs(collection(db, 'students'))
        const teachersSnapshot = await getDocs(collection(db, 'teachers'))
        const classesSnapshot = await getDocs(collection(db, 'classes'))

        // Calculate attendance percentage for today
        const today = new Date().toISOString().split('T')[0]
        const attendanceQuery = query(collection(db, 'attendance'), where('date', '==', today))
        const attendanceSnapshot = await getDocs(attendanceQuery)

        let totalPresent = 0
        let totalStudents = 0

        attendanceSnapshot.forEach(doc => {
            const data = doc.data()
            if (data.records) {
                totalStudents += data.records.length
                totalPresent += data.records.filter((r: any) => r.status === 'present').length
            }
        })

        const attendancePercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0

        return {
            totalStudents: studentsSnapshot.size,
            totalTeachers: teachersSnapshot.size,
            totalClasses: classesSnapshot.size,
            attendancePercentage
        }
    } catch (error: any) {
        throw new Error(`Failed to fetch dashboard stats: ${error.message}`)
    }
}

// Real-time listener for stats (optional, might be expensive if querying all collections)
// Better to just fetch on load or use a dedicated stats document updated by triggers.
