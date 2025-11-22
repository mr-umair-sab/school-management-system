import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initializeData } from './utils/seedData'

// Import all stores for initialization
import { useStudentsStore } from './stores/students'
import { useTeachersStore } from './stores/teachers'
import { useFeesStore } from './stores/fees'
import { useAttendanceStore } from './stores/attendance'
import { useExamsStore } from './stores/exams'
import { useLibraryStore } from './stores/library'
import { useNoticesStore } from './stores/notices'
import { useTimetableStore } from './stores/timetable'
import { useTransportStore } from './stores/transport'
import { useHostelStore } from './stores/hostel'
import { useInventoryStore } from './stores/inventory'
import { useHomeworkStore } from './stores/homework'
import { useDashboardStore } from './stores/dashboard'
import { useCommunicationStore } from './stores/communication'
import { useInstallmentsStore } from './stores/installments'
import { useSubjectsStore } from './stores/subjects'
import { useClassesStore } from './stores/classes'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize data (seed if not exists)
initializeData()

// Load all stores from localStorage
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const libraryStore = useLibraryStore()
const noticesStore = useNoticesStore()
const timetableStore = useTimetableStore()
const transportStore = useTransportStore()
const hostelStore = useHostelStore()
const inventoryStore = useInventoryStore()
const homeworkStore = useHomeworkStore()
const dashboardStore = useDashboardStore()
const communicationStore = useCommunicationStore()
const installmentsStore = useInstallmentsStore()
const subjectsStore = useSubjectsStore()
const classesStore = useClassesStore()

// Initialize Students Store with Firebase real-time updates
studentsStore.initialize().catch(err => {
  console.error('Failed to initialize students store:', err)
  // Fallback to localStorage if Firebase fails
  studentsStore.loadFromLocalStorage()
})
// Initialize Teachers Store with Firebase real-time updates
teachersStore.initialize().catch(err => {
  console.error('Failed to initialize teachers store:', err)
  // Fallback to localStorage if Firebase fails
  teachersStore.loadFromLocalStorage()
})

// Initialize Subjects Store with Firebase real-time updates
subjectsStore.initialize().catch(err => {
  console.error('Failed to initialize subjects store:', err)
  // Fallback to localStorage if Firebase fails
  subjectsStore.loadFromLocalStorage()
})

// Initialize Classes Store with Firebase real-time updates
classesStore.initialize().catch(err => {
  console.error('Failed to initialize classes store:', err)
  // Fallback to localStorage if Firebase fails
  classesStore.loadFromLocalStorage()
})

// Initialize Timetable Store with Firebase real-time updates
timetableStore.initialize().catch(err => {
  console.error('Failed to initialize timetable store:', err)
  // Fallback to localStorage if Firebase fails
  timetableStore.loadFromLocalStorage()
})

// Initialize Fees Store with Firebase real-time updates
feesStore.initialize().catch(err => {
  console.error('Failed to initialize fees store:', err)
  // Fallback to localStorage if Firebase fails
  feesStore.loadFromLocalStorage()
})

// Initialize Attendance Store with Firebase real-time updates
attendanceStore.initialize().catch(err => {
  console.error('Failed to initialize attendance store:', err)
  // Fallback to localStorage if Firebase fails
  attendanceStore.loadFromLocalStorage()
})

// Initialize Exams Store with Firebase real-time updates
examsStore.initialize().catch(err => {
  console.error('Failed to initialize exams store:', err)
  // Fallback to localStorage if Firebase fails
  examsStore.loadFromLocalStorage()
})

// Initialize Library Store with Firebase real-time updates
libraryStore.initialize().catch(err => {
  console.error('Failed to initialize library store:', err)
  // Fallback to localStorage if Firebase fails
  libraryStore.loadFromLocalStorage()
})

// Initialize Notices Store with Firebase real-time updates
noticesStore.initialize().catch(err => {
  console.error('Failed to initialize notices store:', err)
  // Fallback to localStorage if Firebase fails
  noticesStore.loadFromLocalStorage()
})

// Initialize Timetable Store with Firebase real-time updates
timetableStore.initialize().catch(err => {
  console.error('Failed to initialize timetable store:', err)
  // Fallback to localStorage if Firebase fails
  timetableStore.loadFromLocalStorage()
})
// Initialize Transport Store with Firebase real-time updates
transportStore.initialize().catch(err => {
  console.error('Failed to initialize transport store:', err)
  // Fallback to localStorage if Firebase fails
  transportStore.loadFromLocalStorage()
})

// Initialize Hostel Store with Firebase real-time updates
hostelStore.initialize().catch(err => {
  console.error('Failed to initialize hostel store:', err)
  // Fallback to localStorage if Firebase fails
  hostelStore.loadFromLocalStorage()
})

// Initialize Inventory Store with Firebase real-time updates
inventoryStore.initialize().catch(err => {
  console.error('Failed to initialize inventory store:', err)
  // Fallback to localStorage if Firebase fails
  inventoryStore.loadFromLocalStorage()
})

// Initialize Homework Store with Firebase real-time updates
homeworkStore.initialize().catch(err => {
  console.error('Failed to initialize homework store:', err)
  // Fallback to localStorage if Firebase fails
  homeworkStore.loadFromLocalStorage()
})
// Initialize Dashboard Store with Firebase real-time updates
dashboardStore.initialize().catch(err => {
  console.error('Failed to initialize dashboard store:', err)
  // Fallback to localStorage if Firebase fails
  dashboardStore.loadFromLocalStorage()
})

// Initialize Communication Store with Firebase real-time updates
communicationStore.initialize().catch(err => {
  console.error('Failed to initialize communication store:', err)
  // Fallback to localStorage if Firebase fails
  communicationStore.loadFromLocalStorage()
})
// Initialize Installments Store with Firebase real-time updates
installmentsStore.initialize().catch(err => {
  console.error('Failed to initialize installments store:', err)
  // Fallback to localStorage if Firebase fails
  installmentsStore.loadFromLocalStorage()
})

app.mount('#app')
