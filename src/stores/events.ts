import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
    Event,
    Competition,
    Trip,
    PTMSchedule,
    GalleryMedia,
    Certificate,
    EventBudget
} from '@/types'

export const useEventsStore = defineStore('events', () => {
    // State
    const events = ref<Event[]>([])
    const competitions = ref<Competition[]>([])
    const trips = ref<Trip[]>([])
    const ptmSchedules = ref<PTMSchedule[]>([])
    const galleryMedia = ref<GalleryMedia[]>([])
    const certificates = ref<Certificate[]>([])
    const budgets = ref<EventBudget[]>([])

    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed Properties
    const totalEvents = computed(() => events.value.length)
    const totalCompetitions = computed(() => competitions.value.length)
    const totalTrips = computed(() => trips.value.length)
    const totalPTMs = computed(() => ptmSchedules.value.length)
    const totalPhotos = computed(() => galleryMedia.value.length)
    const totalCertificates = computed(() => certificates.value.length)

    const scheduledPTMs = computed(() => ptmSchedules.value.filter(p => p.status === 'scheduled').length)
    const bookedSlots = computed(() => ptmSchedules.value.reduce((sum, p) => sum + p.bookedSlots, 0))
    const availableSlots = computed(() => ptmSchedules.value.reduce((sum, p) => sum + (p.totalSlots - p.bookedSlots), 0))

    const totalBudget = computed(() => budgets.value.reduce((sum, b) => sum + b.amount, 0))
    const totalSpent = computed(() => budgets.value.reduce((sum, b) => sum + b.amount, 0))
    const totalVendors = computed(() => 0)

    const todaysEvents = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return events.value.filter(e => e.date === today)
    })

    // LocalStorage helpers
    function saveToLocalStorage() {
        localStorage.setItem('events', JSON.stringify(events.value))
        localStorage.setItem('competitions', JSON.stringify(competitions.value))
        localStorage.setItem('trips', JSON.stringify(trips.value))
        localStorage.setItem('ptmSchedules', JSON.stringify(ptmSchedules.value))
        localStorage.setItem('galleryMedia', JSON.stringify(galleryMedia.value))
        localStorage.setItem('certificates', JSON.stringify(certificates.value))
        localStorage.setItem('budgets', JSON.stringify(budgets.value))
    }

    function loadFromLocalStorage() {
        const storedEvents = localStorage.getItem('events')
        const storedCompetitions = localStorage.getItem('competitions')
        const storedTrips = localStorage.getItem('trips')
        const storedPTMs = localStorage.getItem('ptmSchedules')
        const storedGallery = localStorage.getItem('galleryMedia')
        const storedCertificates = localStorage.getItem('certificates')
        const storedBudgets = localStorage.getItem('budgets')

        if (storedEvents) events.value = JSON.parse(storedEvents)
        if (storedCompetitions) competitions.value = JSON.parse(storedCompetitions)
        if (storedTrips) trips.value = JSON.parse(storedTrips)
        if (storedPTMs) ptmSchedules.value = JSON.parse(storedPTMs)
        if (storedGallery) galleryMedia.value = JSON.parse(storedGallery)
        if (storedCertificates) certificates.value = JSON.parse(storedCertificates)
        if (storedBudgets) budgets.value = JSON.parse(storedBudgets)
    }

    // Watch for changes and save to localStorage
    watch([events, competitions, trips, ptmSchedules, galleryMedia, certificates, budgets], () => {
        saveToLocalStorage()
    }, { deep: true })

    // Actions
    async function initialize() {
        loadFromLocalStorage()
    }

    // Event Actions
    async function addEvent(event: Omit<Event, 'id'>) {
        const newEvent = {
            ...event,
            id: Date.now().toString()
        }
        events.value.push(newEvent as Event)
    }

    async function updateEvent(id: string, data: Partial<Event>) {
        const index = events.value.findIndex(e => e.id.toString() === id)
        if (index !== -1) {
            events.value[index] = { ...events.value[index], ...data }
        }
    }

    async function deleteEvent(id: string) {
        events.value = events.value.filter(e => e.id.toString() !== id)
    }

    // Competition Actions
    async function addCompetition(competition: Omit<Competition, 'id'>) {
        const newCompetition = {
            ...competition,
            id: Date.now().toString()
        }
        competitions.value.push(newCompetition as Competition)
    }

    async function updateCompetition(id: string, data: Partial<Competition>) {
        const index = competitions.value.findIndex(c => c.id.toString() === id)
        if (index !== -1) {
            competitions.value[index] = { ...competitions.value[index], ...data }
        }
    }

    async function deleteCompetition(id: string) {
        competitions.value = competitions.value.filter(c => c.id.toString() !== id)
    }

    // Trip Actions
    async function addTrip(trip: Omit<Trip, 'id'>) {
        const newTrip = {
            ...trip,
            id: Date.now().toString()
        }
        trips.value.push(newTrip as Trip)
    }

    async function updateTrip(id: string, data: Partial<Trip>) {
        const index = trips.value.findIndex(t => t.id.toString() === id)
        if (index !== -1) {
            trips.value[index] = { ...trips.value[index], ...data }
        }
    }

    async function deleteTrip(id: string) {
        trips.value = trips.value.filter(t => t.id.toString() !== id)
    }

    // PTM Actions
    async function addPTM(ptm: Omit<PTMSchedule, 'id'>) {
        const newPTM = {
            ...ptm,
            id: Date.now().toString()
        }
        ptmSchedules.value.push(newPTM as PTMSchedule)
    }

    async function updatePTM(id: string, data: Partial<PTMSchedule>) {
        const index = ptmSchedules.value.findIndex(p => p.id.toString() === id)
        if (index !== -1) {
            ptmSchedules.value[index] = { ...ptmSchedules.value[index], ...data }
        }
    }

    async function deletePTM(id: string) {
        ptmSchedules.value = ptmSchedules.value.filter(p => p.id.toString() !== id)
    }

    // Gallery Actions
    async function addGalleryMedia(media: Omit<GalleryMedia, 'id'>) {
        const newMedia = {
            ...media,
            id: Date.now().toString(),
            uploadDate: new Date().toISOString()
        }
        galleryMedia.value.push(newMedia as GalleryMedia)
    }

    async function deleteGalleryMedia(id: string) {
        galleryMedia.value = galleryMedia.value.filter(m => m.id.toString() !== id)
    }

    // Certificate Actions
    async function addCertificate(certificate: Omit<Certificate, 'id'>) {
        const newCertificate = {
            ...certificate,
            id: Date.now().toString()
        }
        certificates.value.push(newCertificate as Certificate)
    }

    async function updateCertificate(id: string, data: Partial<Certificate>) {
        const index = certificates.value.findIndex(c => c.id.toString() === id)
        if (index !== -1) {
            certificates.value[index] = { ...certificates.value[index], ...data }
        }
    }

    async function deleteCertificate(id: string) {
        certificates.value = certificates.value.filter(c => c.id.toString() !== id)
    }

    // Budget Actions
    async function addBudget(budget: Omit<EventBudget, 'id'>) {
        const newBudget = {
            ...budget,
            id: Date.now().toString()
        }
        budgets.value.push(newBudget as EventBudget)
    }

    async function updateBudget(id: string, data: Partial<EventBudget>) {
        const index = budgets.value.findIndex(b => b.id.toString() === id)
        if (index !== -1) {
            budgets.value[index] = { ...budgets.value[index], ...data }
        }
    }

    async function deleteBudget(id: string) {
        budgets.value = budgets.value.filter(b => b.id.toString() !== id)
    }

    function cleanup() {
        // No cleanup needed for localStorage
    }

    return {
        // State
        events,
        competitions,
        trips,
        ptmSchedules,
        galleryMedia,
        certificates,
        budgets,
        loading,
        error,

        // Computed
        totalEvents,
        totalCompetitions,
        totalTrips,
        totalPTMs,
        totalPhotos,
        totalCertificates,
        scheduledPTMs,
        bookedSlots,
        availableSlots,
        totalBudget,
        totalSpent,
        totalVendors,
        todaysEvents,

        // Actions
        initialize,
        addEvent,
        updateEvent,
        deleteEvent,
        addCompetition,
        updateCompetition,
        deleteCompetition,
        addTrip,
        updateTrip,
        deleteTrip,
        addPTM,
        updatePTM,
        deletePTM,
        addGalleryMedia,
        deleteGalleryMedia,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addBudget,
        updateBudget,
        deleteBudget,
        cleanup
    }
})
