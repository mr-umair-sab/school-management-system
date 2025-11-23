import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    Timestamp,
    orderBy,
    limit,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
    Announcement,
    Meeting,
    SMS,
    Email,
    EmailTemplate,
    PushNotification,
    EmergencyAlert,
    InternalMessage,
    PTMSchedule,
    Feedback
} from '@/types'

const ANNOUNCEMENT_COLLECTION = 'announcements'
const MEETING_COLLECTION = 'meetings'
const SMS_COLLECTION = 'sms'
const EMAIL_COLLECTION = 'emails'
const EMAIL_TEMPLATE_COLLECTION = 'emailTemplates'
const PUSH_NOTIFICATION_COLLECTION = 'pushNotifications'
const EMERGENCY_ALERT_COLLECTION = 'emergencyAlerts'
const INTERNAL_MESSAGE_COLLECTION = 'internalMessages'
const PTM_SCHEDULE_COLLECTION = 'ptmSchedules'
const FEEDBACK_COLLECTION = 'feedback'

// --- Announcements ---

export async function createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ANNOUNCEMENT_COLLECTION), {
            ...announcement,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create announcement: ${error.message}`)
    }
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
    try {
        const docRef = doc(db, ANNOUNCEMENT_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update announcement: ${error.message}`)
    }
}

export async function deleteAnnouncement(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, ANNOUNCEMENT_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete announcement: ${error.message}`)
    }
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
    const q = query(collection(db, ANNOUNCEMENT_COLLECTION), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const announcements: Announcement[] = []
        snapshot.forEach((doc) => {
            announcements.push({ id: doc.id, ...doc.data() } as unknown as Announcement)
        })
        callback(announcements)
    })
}

// --- Meetings ---

export async function createMeeting(meeting: Omit<Meeting, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, MEETING_COLLECTION), {
            ...meeting,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create meeting: ${error.message}`)
    }
}

export async function updateMeeting(id: string, data: Partial<Meeting>): Promise<void> {
    try {
        const docRef = doc(db, MEETING_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update meeting: ${error.message}`)
    }
}

export async function deleteMeeting(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, MEETING_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete meeting: ${error.message}`)
    }
}

export function subscribeToMeetings(callback: (meetings: Meeting[]) => void): Unsubscribe {
    const q = query(collection(db, MEETING_COLLECTION), orderBy('date', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const meetings: Meeting[] = []
        snapshot.forEach((doc) => {
            meetings.push({ id: doc.id, ...doc.data() } as unknown as Meeting)
        })
        callback(meetings)
    })
}

// --- SMS Management ---

export async function createSMS(sms: Omit<SMS, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, SMS_COLLECTION), {
            ...sms,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create SMS: ${error.message}`)
    }
}

export function subscribeToSMS(callback: (sms: SMS[]) => void): Unsubscribe {
    const q = query(collection(db, SMS_COLLECTION), orderBy('sentDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const sms: SMS[] = []
        snapshot.forEach((doc) => {
            sms.push({ id: doc.id, ...doc.data() } as unknown as SMS)
        })
        callback(sms)
    })
}

export async function getSMSByCategory(category: string): Promise<SMS[]> {
    try {
        const q = query(collection(db, SMS_COLLECTION), where('category', '==', category))
        const snapshot = await getDocs(q)
        const sms: SMS[] = []
        snapshot.forEach((doc) => {
            sms.push({ id: doc.id, ...doc.data() } as unknown as SMS)
        })
        return sms
    } catch (error: any) {
        throw new Error(`Failed to get SMS by category: ${error.message}`)
    }
}

export async function getSMSStats(): Promise<{ total: number, sent: number, failed: number, pending: number }> {
    try {
        const snapshot = await getDocs(collection(db, SMS_COLLECTION))
        let sent = 0, failed = 0, pending = 0
        snapshot.forEach((doc) => {
            const data = doc.data()
            if (data.status === 'sent') sent++
            else if (data.status === 'failed') failed++
            else if (data.status === 'pending') pending++
        })
        return { total: snapshot.size, sent, failed, pending }
    } catch (error: any) {
        throw new Error(`Failed to get SMS stats: ${error.message}`)
    }
}

// --- Email Management ---

export async function createEmail(email: Omit<Email, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EMAIL_COLLECTION), {
            ...email,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create email: ${error.message}`)
    }
}

export function subscribeToEmails(callback: (emails: Email[]) => void): Unsubscribe {
    const q = query(collection(db, EMAIL_COLLECTION), orderBy('sentDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const emails: Email[] = []
        snapshot.forEach((doc) => {
            emails.push({ id: doc.id, ...doc.data() } as unknown as Email)
        })
        callback(emails)
    })
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
        const snapshot = await getDocs(collection(db, EMAIL_TEMPLATE_COLLECTION))
        const templates: EmailTemplate[] = []
        snapshot.forEach((doc) => {
            templates.push({ id: doc.id, ...doc.data() } as unknown as EmailTemplate)
        })
        return templates
    } catch (error: any) {
        throw new Error(`Failed to get email templates: ${error.message}`)
    }
}

export async function createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EMAIL_TEMPLATE_COLLECTION), template)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create email template: ${error.message}`)
    }
}

export async function updateEmailTemplateUsage(templateId: string): Promise<void> {
    try {
        const docRef = doc(db, EMAIL_TEMPLATE_COLLECTION, templateId)
        const snapshot = await getDocs(query(collection(db, EMAIL_TEMPLATE_COLLECTION), where('__name__', '==', templateId)))
        if (!snapshot.empty) {
            const currentCount = snapshot.docs[0].data().usageCount || 0
            await updateDoc(docRef, { usageCount: currentCount + 1 })
        }
    } catch (error: any) {
        throw new Error(`Failed to update template usage: ${error.message}`)
    }
}

// --- Push Notifications ---

export async function createPushNotification(notification: Omit<PushNotification, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PUSH_NOTIFICATION_COLLECTION), {
            ...notification,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create push notification: ${error.message}`)
    }
}

export function subscribeToPushNotifications(callback: (notifications: PushNotification[]) => void): Unsubscribe {
    const q = query(collection(db, PUSH_NOTIFICATION_COLLECTION), orderBy('sentDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const notifications: PushNotification[] = []
        snapshot.forEach((doc) => {
            notifications.push({ id: doc.id, ...doc.data() } as unknown as PushNotification)
        })
        callback(notifications)
    })
}

export async function getPushNotificationStats(): Promise<{ total: number, sent: number, failed: number, pending: number }> {
    try {
        const snapshot = await getDocs(collection(db, PUSH_NOTIFICATION_COLLECTION))
        let sent = 0, failed = 0, pending = 0
        snapshot.forEach((doc) => {
            const data = doc.data()
            if (data.status === 'sent') sent++
            else if (data.status === 'failed') failed++
            else if (data.status === 'pending') pending++
        })
        return { total: snapshot.size, sent, failed, pending }
    } catch (error: any) {
        throw new Error(`Failed to get push notification stats: ${error.message}`)
    }
}

// --- Emergency Alerts ---

export async function createEmergencyAlert(alert: Omit<EmergencyAlert, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, EMERGENCY_ALERT_COLLECTION), {
            ...alert,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create emergency alert: ${error.message}`)
    }
}

export function subscribeToEmergencyAlerts(callback: (alerts: EmergencyAlert[]) => void): Unsubscribe {
    const q = query(collection(db, EMERGENCY_ALERT_COLLECTION), orderBy('sentDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const alerts: EmergencyAlert[] = []
        snapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() } as unknown as EmergencyAlert)
        })
        callback(alerts)
    })
}

// --- Internal Messaging ---

export async function createMessage(message: Omit<InternalMessage, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, INTERNAL_MESSAGE_COLLECTION), {
            ...message,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create message: ${error.message}`)
    }
}

export function subscribeToMessages(userId: string, callback: (messages: InternalMessage[]) => void): Unsubscribe {
    const q = query(
        collection(db, INTERNAL_MESSAGE_COLLECTION),
        where('recipientId', '==', userId),
        orderBy('sentDate', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
        const messages: InternalMessage[] = []
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as unknown as InternalMessage)
        })
        callback(messages)
    })
}

export async function getMessagesByCategory(category: string): Promise<InternalMessage[]> {
    try {
        const q = query(collection(db, INTERNAL_MESSAGE_COLLECTION), where('category', '==', category))
        const snapshot = await getDocs(q)
        const messages: InternalMessage[] = []
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as unknown as InternalMessage)
        })
        return messages
    } catch (error: any) {
        throw new Error(`Failed to get messages by category: ${error.message}`)
    }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
    try {
        const docRef = doc(db, INTERNAL_MESSAGE_COLLECTION, messageId)
        await updateDoc(docRef, { read: true })
    } catch (error: any) {
        throw new Error(`Failed to mark message as read: ${error.message}`)
    }
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
    try {
        const q = query(
            collection(db, INTERNAL_MESSAGE_COLLECTION),
            where('recipientId', '==', userId),
            where('read', '==', false)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
    } catch (error: any) {
        throw new Error(`Failed to get unread message count: ${error.message}`)
    }
}

// --- PTM Management ---

export async function createPTMSchedule(ptm: Omit<PTMSchedule, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PTM_SCHEDULE_COLLECTION), {
            ...ptm,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create PTM schedule: ${error.message}`)
    }
}

export function subscribeToPTMSchedules(callback: (ptms: PTMSchedule[]) => void): Unsubscribe {
    const q = query(collection(db, PTM_SCHEDULE_COLLECTION), orderBy('date', 'asc'))
    return onSnapshot(q, (snapshot) => {
        const ptms: PTMSchedule[] = []
        snapshot.forEach((doc) => {
            const data = doc.data()
            ptms.push({
                id: doc.id,
                ...data,
                availableSlots: data.totalSlots - data.bookedSlots
            } as unknown as PTMSchedule)
        })
        callback(ptms)
    })
}

export async function bookPTMSlot(ptmId: string): Promise<void> {
    try {
        const docRef = doc(db, PTM_SCHEDULE_COLLECTION, ptmId)
        const snapshot = await getDocs(query(collection(db, PTM_SCHEDULE_COLLECTION), where('__name__', '==', ptmId)))
        if (!snapshot.empty) {
            const currentBooked = snapshot.docs[0].data().bookedSlots || 0
            await updateDoc(docRef, { bookedSlots: currentBooked + 1 })
        }
    } catch (error: any) {
        throw new Error(`Failed to book PTM slot: ${error.message}`)
    }
}

export async function getPTMStats(): Promise<{ upcoming: number, totalSlots: number, bookedSlots: number, availableSlots: number }> {
    try {
        const q = query(collection(db, PTM_SCHEDULE_COLLECTION), where('status', '==', 'scheduled'))
        const snapshot = await getDocs(q)
        let totalSlots = 0, bookedSlots = 0
        snapshot.forEach((doc) => {
            const data = doc.data()
            totalSlots += data.totalSlots || 0
            bookedSlots += data.bookedSlots || 0
        })
        return {
            upcoming: snapshot.size,
            totalSlots,
            bookedSlots,
            availableSlots: totalSlots - bookedSlots
        }
    } catch (error: any) {
        throw new Error(`Failed to get PTM stats: ${error.message}`)
    }
}

// --- Feedback System ---

export async function createFeedback(feedback: Omit<Feedback, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
            ...feedback,
            createdAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create feedback: ${error.message}`)
    }
}

export function subscribeToFeedback(callback: (feedback: Feedback[]) => void): Unsubscribe {
    const q = query(collection(db, FEEDBACK_COLLECTION), orderBy('submittedDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const feedback: Feedback[] = []
        snapshot.forEach((doc) => {
            feedback.push({ id: doc.id, ...doc.data() } as unknown as Feedback)
        })
        callback(feedback)
    })
}

export async function updateFeedbackStatus(id: string, status: 'pending' | 'reviewed' | 'resolved', response?: string): Promise<void> {
    try {
        const docRef = doc(db, FEEDBACK_COLLECTION, id)
        const updateData: any = { status }
        if (response) updateData.response = response
        await updateDoc(docRef, updateData)
    } catch (error: any) {
        throw new Error(`Failed to update feedback status: ${error.message}`)
    }
}

export async function getFeedbackStats(): Promise<{ total: number, pending: number, reviewed: number, resolved: number }> {
    try {
        const snapshot = await getDocs(collection(db, FEEDBACK_COLLECTION))
        let pending = 0, reviewed = 0, resolved = 0
        snapshot.forEach((doc) => {
            const data = doc.data()
            if (data.status === 'pending') pending++
            else if (data.status === 'reviewed') reviewed++
            else if (data.status === 'resolved') resolved++
        })
        return { total: snapshot.size, pending, reviewed, resolved }
    } catch (error: any) {
        throw new Error(`Failed to get feedback stats: ${error.message}`)
    }
}
