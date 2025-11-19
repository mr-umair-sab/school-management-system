import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import stores for initialization
import { useStudentsStore } from './stores/students'
import { useTeachersStore } from './stores/teachers'
import { useFeesStore } from './stores/fees'
import { useAttendanceStore } from './stores/attendance'
import { useExamsStore } from './stores/exams'
import { useLibraryStore } from './stores/library'
import { useNoticesStore } from './stores/notices'
import { useTimetableStore } from './stores/timetable'
import { useTransportStore } from './stores/transport'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize all stores and load data from localStorage
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const feesStore = useFeesStore()
const attendanceStore = useAttendanceStore()
const examsStore = useExamsStore()
const libraryStore = useLibraryStore()
const noticesStore = useNoticesStore()
const timetableStore = useTimetableStore()
const transportStore = useTransportStore()

studentsStore.loadFromLocalStorage()
teachersStore.loadFromLocalStorage()
feesStore.loadFromLocalStorage()
attendanceStore.loadFromLocalStorage()
examsStore.loadFromLocalStorage()
libraryStore.loadFromLocalStorage()
noticesStore.loadFromLocalStorage()
timetableStore.loadFromLocalStorage()
transportStore.loadFromLocalStorage()

app.mount('#app')
