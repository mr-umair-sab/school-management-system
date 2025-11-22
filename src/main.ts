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

studentsStore.loadFromLocalStorage()
teachersStore.loadFromLocalStorage()
feesStore.loadFromLocalStorage()
attendanceStore.loadFromLocalStorage()
examsStore.loadFromLocalStorage()
libraryStore.loadFromLocalStorage()
noticesStore.loadFromLocalStorage()
timetableStore.loadFromLocalStorage()
transportStore.loadFromLocalStorage()
hostelStore.loadFromLocalStorage()
inventoryStore.loadFromLocalStorage()
homeworkStore.loadFromLocalStorage()
dashboardStore.loadFromLocalStorage()
communicationStore.loadFromLocalStorage()
installmentsStore.loadFromLocalStorage()

app.mount('#app')
