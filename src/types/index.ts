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
  id: number | string
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
  id: number | string
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
  id: number | string
  name: string
  type: string
  url: string
  uploadDate: string
}

export interface Class {
  id: number | string
  name: string
  section: string
  classTeacher: number | string // teacher id
  subjects: (number | string)[] // subject ids
  students: (number | string)[] // student ids
  capacity: number
}

export interface Subject {
  id: number | string
  name: string
  code: string
  class: string
  teacher: number | string // teacher id
  credits: number
}

export interface Timetable {
  id: number | string
  class: string
  section: string
  day: string
  periods: Period[]
}

export interface Period {
  periodNumber: number
  startTime: string
  endTime: string
  subject: number | string // subject id
  teacher: number | string // teacher id
  room: string
}

export interface Attendance {
  id: number | string
  date: string
  class: string
  section: string
  records: AttendanceRecord[]
}

export interface AttendanceRecord {
  studentId: number | string
  status: 'present' | 'absent' | 'late' | 'half-day'
  remarks?: string
}

export interface Exam {
  id: number | string
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
  id: number | string
  examId: number | string
  studentId: number | string
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
  id: number | string
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
  id: number | string
  studentId: number | string
  academicYear: string
  totalFee: number
  paidAmount: number
  pendingAmount: number
  payments: Payment[]
  status: 'paid' | 'partial' | 'pending' | 'overdue'
}

export interface Payment {
  id: number | string
  date: string
  amount: number
  method: 'cash' | 'card' | 'upi' | 'bank-transfer' | 'cheque'
  receiptNumber: string
  remarks?: string
}

export interface Book {
  id: number | string
  title: string
  author: string
  isbn: string
  category: string
  quantity: number
  available: number
  location: string
}

export interface BookIssue {
  id: number | string
  bookId: number | string
  studentId: number | string
  issueDate: string
  dueDate: string
  returnDate?: string
  status: 'issued' | 'returned' | 'overdue'
  fine?: number
}

export interface Notice {
  id: number | string
  title: string
  content: string
  date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetAudience: UserRole[]
  attachments?: string[]
  createdBy: number
}

export interface Event {
  id: number | string
  title: string
  description: string
  date: string
  time: string
  venue: string
  organizer: string
  category: 'academic' | 'sports' | 'cultural' | 'admin' | 'other'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  icon?: string
  participants?: number[]
}

export interface Competition {
  id: number | string
  title: string
  type: string
  participants: number
  teams: number
  judges: number
  winner?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  date: string
  venue?: string
}

export interface Trip {
  id: number | string
  title: string
  destination: string
  date: string
  students: number
  capacity: number
  fee: number
  busNumber: string
  driver: string
  permissionSlips: number
  feeCollected: number
  status: 'confirmed' | 'pending' | 'cancelled'
}

export interface PTMSchedule {
  id: number | string
  title: string
  class: string
  date: string
  time: string
  venue: string
  bookedSlots: number
  totalSlots: number
  status: 'scheduled' | 'ongoing' | 'completed'
}

export interface GalleryMedia {
  id: number | string
  title: string
  event: string
  type: 'photo' | 'video'
  url?: string
  icon: string
  uploadDate: string
  category: string
}

export interface Certificate {
  id: number | string
  studentName: string
  award: string
  event: string
  date: string
  delivered: boolean
}

export interface EventBudget {
  id: number | string
  category: string
  amount: number
  eventId?: string
}

export interface Leave {
  id: number | string
  userId: number | string
  userType: 'teacher' | 'student'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: number
}

export interface Transport {
  id: number | string
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

export interface Homework {
  id: string
  title: string
  description: string
  subject: string
  class: string
  section: string
  teacherId: string
  assignedDate: string
  dueDate: string
  totalMarks: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Homework' | 'Classwork' | 'Project' | 'Quiz'
  videoLink?: string
  references?: string
  allowLateSubmission: boolean
  allowResubmission: boolean
  autoNotifyParents: boolean
  sendSMS: boolean
  attachments?: string[]
  createdAt?: any
  updatedAt?: any
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  rollNo: string
  submittedDate: string
  status: 'Submitted' | 'Reviewed' | 'Late' | 'Pending'
  files: string[]
  marks?: number
  feedback?: string
  totalMarks: number
}

export interface Asset {
  id: number | string
  assetId: string // Custom ID like AST-2024-001
  name: string
  category: string
  serialNo: string
  quantity: number // For consumable items, otherwise 1
  location: string
  purchaseDate: string
  value: number // Current value or purchase price
  originalValue: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Damaged'
  status: 'Available' | 'Issued' | 'Maintenance' | 'Disposed' | 'In Use'
  warrantyActive: boolean
  warrantyExpiry: string
  supplier?: string
  depreciationRate?: number
  writeOff?: boolean
}

export interface AssetCategory {
  id: number | string
  name: string
  icon: string
  count: number
  available: number
  issued: number
}

export interface AssetIssue {
  id: number | string
  assetId: string
  assetName: string
  issuedTo: string // Name of person/dept
  issuedToId?: number | string // ID if linked to user
  type: 'Teacher' | 'Student' | 'Department' | 'Staff'
  issueDate: string
  returnDate?: string
  dueDate?: string
  status: 'Issued' | 'Returned' | 'Overdue'
  returnCondition?: string
}

export interface StockItem {
  id: number | string
  name: string
  category: string
  current: number
  minimum: number
  maximum: number
  unit: string
  expiryDate?: string
}

export interface PurchaseRequest {
  id: number | string
  requestId: string
  department: string
  items: string
  quantity: number
  estimatedCost: number
  status: 'Pending' | 'Approved' | 'Rejected'
  requestDate: string
}

export interface MaintenanceRecord {
  id: number | string
  assetId: string
  assetName: string
  type: 'Routine Service' | 'Repair' | 'Inspection'
  scheduledDate: string
  completionDate?: string
  lastService?: string
  cost: number
  vendor?: string
  status: 'Scheduled' | 'In Progress' | 'Completed'
  description?: string
}

export interface DepartmentAllocation {
  id: number | string
  name: string
  head: string
  icon: string
  totalAssets: number
  value: number
}

export interface Announcement {
  id: number | string
  title: string
  content: string
  date: string
  targetAudience: ('students' | 'teachers' | 'parents' | 'all')[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  createdBy: number
}

export interface Meeting {
  id: number | string
  title: string
  type: 'parent-teacher' | 'staff' | 'pta' | 'other'
  date: string
  time: string
  duration: number
  location: string
  organizer: number
  participants: number[]
  agenda: string
}
