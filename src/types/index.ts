// Core Types for School Management System

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent'

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
}

export interface Contact {
  name: string
  relation: string
  phone: string
  email: string
  address: Address
}

export interface MedicalInfo {
  bloodGroup: string
  allergies: string[]
  medications: string[]
  emergencyContact: string
}

export interface Student {
  id: number
  name: string
  rollNumber: string
  class: string
  section: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  photo?: string
  email: string
  phone: string
  address: Address
  parentGuardian: Contact[]
  medicalInfo: MedicalInfo
  enrollmentDate: string
  previousSchool?: string
  documents: Document[]
  status: 'active' | 'inactive' | 'graduated'
}

export interface Teacher {
  id: number
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  address: Address
  qualification: string
  experience: number
  subjects: string[]
  classes: string[]
  joiningDate: string
  employeeId: string
  photo?: string
  documents: Document[]
  status: 'active' | 'inactive' | 'on-leave'
}

export interface Document {
  id: number
  name: string
  type: string
  url: string
  uploadDate: string
}

export interface Class {
  id: number
  name: string
  section: string
  classTeacher: number // teacher id
  subjects: number[] // subject ids
  students: number[] // student ids
  capacity: number
}

export interface Subject {
  id: number
  name: string
  code: string
  class: string
  teacher: number // teacher id
  credits: number
}

export interface Timetable {
  id: number
  class: string
  section: string
  day: string
  periods: Period[]
}

export interface Period {
  periodNumber: number
  startTime: string
  endTime: string
  subject: number // subject id
  teacher: number // teacher id
  room: string
}

export interface Attendance {
  id: number
  date: string
  class: string
  section: string
  records: AttendanceRecord[]
}

export interface AttendanceRecord {
  studentId: number
  status: 'present' | 'absent' | 'late' | 'half-day'
  remarks?: string
}

export interface Exam {
  id: number
  name: string
  type: 'unit-test' | 'mid-term' | 'final' | 'practical'
  class: string
  section: string
  startDate: string
  endDate: string
  subjects: ExamSubject[]
  totalMarks: number
}

export interface ExamSubject {
  subjectId: number
  date: string
  time: string
  duration: number
  maxMarks: number
  passingMarks: number
}

export interface Result {
  id: number
  examId: number
  studentId: number
  marks: SubjectMarks[]
  totalMarks: number
  percentage: number
  grade: string
  rank?: number
  remarks?: string
}

export interface SubjectMarks {
  subjectId: number
  marksObtained: number
  maxMarks: number
  grade: string
}

export interface FeeStructure {
  id: number
  class: string
  academicYear: string
  components: FeeComponent[]
  totalAmount: number
}

export interface FeeComponent {
  name: string
  amount: number
  type: 'monthly' | 'yearly' | 'one-time'
  mandatory: boolean
}

export interface FeeRecord {
  id: number
  studentId: number
  academicYear: string
  totalFee: number
  paidAmount: number
  pendingAmount: number
  payments: Payment[]
  status: 'paid' | 'partial' | 'pending' | 'overdue'
}

export interface Payment {
  id: number
  date: string
  amount: number
  method: 'cash' | 'card' | 'upi' | 'bank-transfer' | 'cheque'
  receiptNumber: string
  remarks?: string
}

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  quantity: number
  available: number
  location: string
}

export interface BookIssue {
  id: number
  bookId: number
  studentId: number
  issueDate: string
  dueDate: string
  returnDate?: string
  status: 'issued' | 'returned' | 'overdue'
  fine?: number
}

export interface Notice {
  id: number
  title: string
  content: string
  date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetAudience: UserRole[]
  attachments?: string[]
  createdBy: number
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  venue: string
  type: 'academic' | 'sports' | 'cultural' | 'holiday' | 'other'
  participants?: number[]
}

export interface Leave {
  id: number
  userId: number
  userType: 'teacher' | 'student'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: number
}

export interface Transport {
  id: number
  routeNumber: string
  routeName: string
  driverName: string
  driverPhone: string
  vehicleNumber: string
  capacity: number
  stops: BusStop[]
  students: number[]
}

export interface BusStop {
  name: string
  time: string
  sequence: number
}
