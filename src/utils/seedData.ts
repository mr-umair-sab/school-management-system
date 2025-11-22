// Data initialization for all stores
import { useHostelStore } from '@/stores/hostel'
import { useInventoryStore } from '@/stores/inventory'
import { useHomeworkStore } from '@/stores/homework'
import { useDashboardStore } from '@/stores/dashboard'
import { useCommunicationStore } from '@/stores/communication'
import { useInstallmentsStore } from '@/stores/installments'

function getDateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0] || ''
}

export function initializeData() {
  const hasData = localStorage.getItem('hostelRooms')

  if (!hasData) {
    console.log('Initializing store data...')
    seedAllStores()
    console.log('Data initialization completed!')
  }
}

function seedAllStores() {
  seedHostel()
  seedInventory()
  seedHomework()
  seedDashboard()
  seedCommunication()
  seedInstallments()
}

function seedHostel() {
  const store = useHostelStore()

  const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel A', 'Girls Hostel B']
  hostels.forEach(hostelName => {
    for (let floor = 1; floor <= 3; floor++) {
      for (let room = 1; room <= 10; room++) {
        const roomNumber = `${floor}${String(room).padStart(2, '0')}`
        const types: Array<'single' | 'double' | 'triple' | 'quad'> = ['single', 'double', 'triple', 'quad']
        const type = types[Math.floor(Math.random() * 4)] as 'single' | 'double' | 'triple' | 'quad'
        const capacity = type === 'single' ? 1 : type === 'double' ? 2 : type === 'triple' ? 3 : 4
        const occupied = Math.floor(Math.random() * (capacity + 1))

        store.addRoom({
          roomNumber,
          floor,
          capacity,
          occupied,
          type,
          hostelName,
          status: occupied >= capacity ? 'full' : 'available'
        })
      }
    }
  })
}

function seedInventory() {
  const store = useInventoryStore()

  const assets = [
    { name: 'Classroom Desks', category: 'furniture' as const, quantity: 500, location: 'Classrooms', price: 2000 },
    { name: 'Chairs', category: 'furniture' as const, quantity: 600, location: 'Classrooms', price: 1000 },
    { name: 'Projectors', category: 'electronics' as const, quantity: 25, location: 'Smart Classrooms', price: 35000 },
    { name: 'Computers', category: 'electronics' as const, quantity: 80, location: 'Computer Lab', price: 45000 },
    { name: 'Microscopes', category: 'lab-equipment' as const, quantity: 30, location: 'Biology Lab', price: 15000 }
  ]

  assets.forEach(asset => {
    store.addAsset({
      name: asset.name,
      category: asset.category,
      quantity: asset.quantity,
      location: asset.location,
      purchaseDate: '2023-01-15',
      purchasePrice: asset.price,
      condition: 'good',
      status: 'available',
      supplier: 'ABC Suppliers'
    })
  })
}

function seedHomework() {
  const store = useHomeworkStore()

  const classes = ['9', '10']
  const sections = ['A', 'B']
  const subjects = ['Mathematics', 'English', 'Science']

  classes.forEach(cls => {
    sections.forEach(section => {
      subjects.forEach(subject => {
        store.addHomework({
          title: `${subject} Assignment 1`,
          description: `Complete exercises from chapter 1`,
          subject,
          class: cls,
          section,
          teacherId: 1,
          assignedDate: getDateOffset(-5),
          dueDate: getDateOffset(7),
          totalMarks: 20,
          difficulty: 'medium'
        })
      })
    })
  })
}

function seedDashboard() {
  const store = useDashboardStore()

  for (let i = 0; i < 10; i++) {
    store.addVisitorLog({
      name: `Visitor ${i + 1}`,
      purpose: 'Meeting',
      personToMeet: 'Principal',
      inTime: '10:00',
      date: getDateOffset(-i),
      idProof: 'Aadhar'
    })
  }

  for (let i = 101; i <= 120; i++) {
    store.classroomOccupancy.push({
      roomNumber: `Room ${i}`,
      capacity: 40,
      currentOccupancy: Math.floor(Math.random() * 40),
      status: Math.random() > 0.8 ? 'maintenance' : Math.random() > 0.5 ? 'occupied' : 'vacant'
    })
  }
}

function seedCommunication() {
  const store = useCommunicationStore()

  store.createAnnouncement({
    title: 'School Reopening',
    content: 'School will reopen on 1st June 2024',
    date: getDateOffset(-10),
    targetAudience: ['all'],
    priority: 'high',
    createdBy: 1
  })

  store.scheduleMeeting({
    title: 'Parent-Teacher Meeting',
    type: 'parent-teacher',
    date: getDateOffset(15),
    time: '10:00',
    duration: 2,
    location: 'School Auditorium',
    organizer: 1,
    participants: [1, 2, 3],
    agenda: 'Discuss student progress'
  })
}


function seedInstallments() {
  const store = useInstallmentsStore()

  // Create installment plan for Class 9-10
  const plan1 = store.createPlan({
    title: 'Annual Fee Plan 2024-25 (Class 9-10)',
    description: 'Standard annual fee divided into 4 installments',
    totalAmount: 50000,
    academicYear: '2024-25',
    applicableClasses: ['9', '10'],
    createdBy: 1,
    createdDate: getDateOffset(-90),
    status: 'active',
    installments: [
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'First Installment - Admission Fee',
        amount: 15000,
        dueDate: getDateOffset(-60),
        sequence: 1,
        lateFeeRule: {
          enabled: true,
          type: 'flat',
          amount: 500,
          gracePeriodDays: 7
        },
        discountRule: {
          enabled: true,
          type: 'early-payment',
          amount: 500,
          earlyPaymentDays: 10,
          description: 'Early payment discount'
        }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'Second Installment - Mid Term',
        amount: 12000,
        dueDate: getDateOffset(-30),
        sequence: 2,
        lateFeeRule: {
          enabled: true,
          type: 'percentage',
          amount: 5,
          gracePeriodDays: 5,
          maxLateFee: 1000
        },
        discountRule: {
          enabled: false,
          type: 'custom',
          amount: 0
        }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'Third Installment - Pre-Final',
        amount: 11500,
        dueDate: getDateOffset(30),
        sequence: 3,
        lateFeeRule: {
          enabled: true,
          type: 'flat',
          amount: 500,
          gracePeriodDays: 7
        },
        discountRule: {
          enabled: false,
          type: 'custom',
          amount: 0
        }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'Fourth Installment - Final',
        amount: 11500,
        dueDate: getDateOffset(90),
        sequence: 4,
        lateFeeRule: {
          enabled: true,
          type: 'flat',
          amount: 500,
          gracePeriodDays: 7
        },
        discountRule: {
          enabled: true,
          type: 'early-payment',
          amount: 1000,
          earlyPaymentDays: 15,
          description: 'Final installment early payment bonus'
        }
      }
    ]
  })

  // Create installment plan for Class 11-12
  const plan2 = store.createPlan({
    title: 'Annual Fee Plan 2024-25 (Class 11-12)',
    description: 'Senior classes fee divided into 3 installments',
    totalAmount: 60000,
    academicYear: '2024-25',
    applicableClasses: ['11', '12'],
    createdBy: 1,
    createdDate: getDateOffset(-90),
    status: 'active',
    installments: [
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'First Installment',
        amount: 25000,
        dueDate: getDateOffset(-60),
        sequence: 1,
        lateFeeRule: {
          enabled: true,
          type: 'flat',
          amount: 1000,
          gracePeriodDays: 7
        },
        discountRule: {
          enabled: true,
          type: 'early-payment',
          amount: 1000,
          earlyPaymentDays: 10
        }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'Second Installment',
        amount: 20000,
        dueDate: getDateOffset(15),
        sequence: 2,
        lateFeeRule: {
          enabled: true,
          type: 'percentage',
          amount: 5,
          gracePeriodDays: 5,
          maxLateFee: 1500
        },
        discountRule: {
          enabled: false,
          type: 'custom',
          amount: 0
        }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: 'Third Installment',
        amount: 15000,
        dueDate: getDateOffset(75),
        sequence: 3,
        lateFeeRule: {
          enabled: true,
          type: 'flat',
          amount: 750,
          gracePeriodDays: 7
        },
        discountRule: {
          enabled: false,
          type: 'custom',
          amount: 0
        }
      }
    ]
  })

  // Assign plans to sample students
  for (let studentId = 1000; studentId <= 1010; studentId++) {
    store.assignPlanToStudent(studentId, plan1.planID)
  }

  for (let studentId = 1011; studentId <= 1020; studentId++) {
    store.assignPlanToStudent(studentId, plan2.planID)
  }

  // Create sample payments
  for (let i = 0; i < 15; i++) {
    const studentId = 1000 + i
    const profile = store.getStudentFeeProfile(studentId)

    if (profile && profile.installments.length > 0) {
      const firstInstallment = profile.installments[0]

      // Pay first installment for most students
      if (Math.random() > 0.3) {
        store.collectPayment({
          studentId,
          installmentID: firstInstallment.installmentID,
          amount: firstInstallment.amount,
          paymentDate: getDateOffset(-50),
          paymentMethod: ['cash', 'bank', 'online', 'jazzcash'][Math.floor(Math.random() * 4)] as any,
          collectedBy: 1,
          notes: 'First installment payment'
        })
      }

      // Partial payment for second installment
      if (profile.installments.length > 1 && Math.random() > 0.5) {
        const secondInstallment = profile.installments[1]
        store.collectPayment({
          studentId,
          installmentID: secondInstallment.installmentID,
          amount: Math.floor(secondInstallment.amount * 0.5),
          paymentDate: getDateOffset(-20),
          paymentMethod: 'online',
          collectedBy: 1,
          notes: 'Partial payment'
        })
      }
    }
  }

  // Apply late fees
  store.applyLateFees()

  // Generate invoices
  store.studentFeeProfiles.forEach(profile => {
    profile.installments.forEach(inst => {
      if (inst.status !== 'paid') {
        store.generateInvoice(profile.studentId, inst.installmentID)
      }
    })
  })

  console.log('✓ Installment system seeded')
}
