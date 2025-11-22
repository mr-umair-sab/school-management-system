import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    Event,
    Competition,
    Trip,
    PTMSchedule,
    GalleryMedia,
    Certificate,
    EventBudget
} from '@/types'
import * as eventsFirebase from '@/services/eventsFirebase'
import type { Unsubscribe } from 'firebase/firestore'

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

    // Unsubscribers
    let eventsUnsub: Unsubscribe | null = null
    let competitionsUnsub: Unsubscribe | null = null
    let tripsUnsub: Unsubscribe | null = null
    let ptmUnsub: Unsubscribe | null = null
    let galleryUnsub: Unsubscribe | null = null
    let certificatesUnsub: Unsubscribe | null = null
    let budgetsUnsub: Unsubscribe | null = null

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

    // Actions
    async function initialize() {
        try {
            loading.value = true

            eventsUnsub = eventsFirebase.subscribeToEvents((data) => events.value = data)
            competitionsUnsub = eventsFirebase.subscribeToCompetitions((data) => competitions.value = data)
            tripsUnsub = eventsFirebase.subscribeToTrips((data) => trips.value = data)
            ptmUnsub = eventsFirebase.subscribeToPTMs((data) => ptmSchedules.value = data)
            galleryUnsub = eventsFirebase.subscribeToGalleryMedia((data) => galleryMedia.value = data)
            certificatesUnsub = eventsFirebase.subscribeToCertificates((data) => certificates.value = data)
            budgetsUnsub = eventsFirebase.subscribeToBudgets((data) => budgets.value = data)

            loading.value = false
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            console.error('Failed to initialize events store:', err)
        }
    }

    // Event Actions
    async function addEvent(event: Omit<Event, 'id'>) {
        try {
            loading.value = true
            await eventsFirebase.createEvent(event)
            loading.value = false
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            throw err
        }
    }

    async function updateEvent(id: string, data: Partial<Event>) {
        try {
            loading.value = true
            await eventsFirebase.updateEvent(id, data)
            loading.value = false
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            throw err
        }
    }

    async function deleteEvent(id: string) {
        try {
            loading.value = true
            await eventsFirebase.deleteEvent(id)
            loading.value = false
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            throw err
        }
    }

    // Competition Actions
    async function addCompetition(competition: Omit<Competition, 'id'>) {
        await eventsFirebase.createCompetition(competition)
    }

    async function updateCompetition(id: string, data: Partial<Competition>) {
        await eventsFirebase.updateCompetition(id, data)
    }

    async function deleteCompetition(id: string) {
        await eventsFirebase.deleteCompetition(id)
    }

    // Trip Actions
    async function addTrip(trip: Omit<Trip, 'id'>) {
        await eventsFirebase.createTrip(trip)
    }

    async function updateTrip(id: string, data: Partial<Trip>) {
        await eventsFirebase.updateTrip(id, data)
    }

    async function deleteTrip(id: string) {
        await eventsFirebase.deleteTrip(id)
    }

    // PTM Actions
    async function addPTM(ptm: Omit<PTMSchedule, 'id'>) {
        await eventsFirebase.createPTM(ptm)
    }

    async function updatePTM(id: string, data: Partial<PTMSchedule>) {
        await eventsFirebase.updatePTM(id, data)
    }

    async function deletePTM(id: string) {
        await eventsFirebase.deletePTM(id)
    }

    // Gallery Actions
    async function addGalleryMedia(media: Omit<GalleryMedia, 'id'>) {
        await eventsFirebase.createGalleryMedia(media)
    }

    async function deleteGalleryMedia(id: string) {
        await eventsFirebase.deleteGalleryMedia(id)
    }

    // Certificate Actions
    async function addCertificate(certificate: Omit<Certificate, 'id'>) {
        await eventsFirebase.createCertificate(certificate)
    }

    async function updateCertificate(id: string, data: Partial<Certificate>) {
        await eventsFirebase.updateCertificate(id, data)
    }

    async function deleteCertificate(id: string) {
        await eventsFirebase.deleteCertificate(id)
    }

    // Budget Actions
    async function addBudget(budget: Omit<EventBudget, 'id'>) {
        await eventsFirebase.createBudget(budget)
    }

    async function updateBudget(id: string, data: Partial<EventBudget>) {
        await eventsFirebase.updateBudget(id, data)
    }

    async function deleteBudget(id: string) {
        await eventsFirebase.deleteBudget(id)
    }

    function cleanup() {
        if (eventsUnsub) eventsUnsub()
        if (competitionsUnsub) competitionsUnsub()
        if (tripsUnsub) tripsUnsub()
        if (ptmUnsub) ptmUnsub()
        if (galleryUnsub) galleryUnsub()
        if (certificatesUnsub) certificatesUnsub()
        if (budgetsUnsub) budgetsUnsub()
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
