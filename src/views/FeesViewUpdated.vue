<template>
  <div>
    <Navbar page-title="Fee Management - Installments" />

    <div class="p-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="p-4 bg-green-50 rounded-lg">
          <p class="text-gray-600 text-sm">Total Collected</p>
          <h3 class="text-2xl font-bold text-green-600">₹{{ totalCollected.toLocaleString() }}</h3>
        </div>
        <div class="p-4 bg-yellow-50 rounded-lg">
          <p class="text-gray-600 text-sm">Pending</p>
          <h3 class="text-2xl font-bold text-yellow-600">₹{{ totalPending.toLocaleString() }}</h3>
        </div>
        <div class="p-4 bg-red-50 rounded-lg">
          <p class="text-gray-600 text-sm">Overdue</p>
          <h3 class="text-2xl font-bold text-red-600">{{ overdueCount }}</h3>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg">
          <p class="text-gray-600 text-sm">Defaulters</p>
          <h3 class="text-2xl font-bold text-purple-600">{{ defaultersCount }}</h3>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl shadow-lg mb-6">
        <div class="border-b">
          <div class="flex space-x-4 p-4">
            <button
              @click="activeTab = 'plans'"
              :class="activeTab === 'plans' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
              class="px-4 py-2 font-medium"
            >
              Installment Plans
            </button>
            <button
              @click="activeTab = 'students'"
              :class="activeTab === 'students' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
              class="px-4 py-2 font-medium"
            >
              Student Fees
            </button>
            <button
              @click="activeTab = 'payments'"
              :class="activeTab === 'payments' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
              class="px-4 py-2 font-medium"
            >
              Payments
            </button>
            <button
              @click="activeTab = 'overdue'"
              :class="activeTab === 'overdue' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
              class="px-4 py-2 font-medium"
            >
              Overdue
            </button>
          </div>
        </div>

        <!-- Plans Tab -->
        <div v-if="activeTab === 'plans'" class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Installment Plans</h3>
            <button
              @click="showCreatePlan = true"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Create Plan
            </button>
          </div>

          <div v-if="activePlans.length === 0" class="text-center py-8 text-gray-500">
            No installment plans created yet. Click "Create Plan" to get started.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="plan in activePlans"
              :key="plan.id"
              class="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-lg">{{ plan.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ plan.description }}</p>
                  <p class="text-sm text-gray-500 mt-1">
                    Academic Year: {{ plan.academicYear }} |
                    Classes: {{ plan.applicableClasses.join(', ') }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-indigo-600">₹{{ plan.totalAmount.toLocaleString() }}</p>
                  <p class="text-sm text-gray-500">{{ plan.installments.length }} Installments</p>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div
                  v-for="inst in plan.installments"
                  :key="inst.id"
                  class="p-2 bg-gray-50 rounded text-sm"
                >
                  <p class="font-medium">{{ inst.title }}</p>
                  <p class="text-gray-600">₹{{ inst.amount }} - Due: {{ inst.dueDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Students Tab -->
        <div v-if="activeTab === 'students'" class="p-6">
          <h3 class="text-xl font-bold mb-4">Student Fee Profiles</h3>

          <div v-if="studentFeeProfiles.length === 0" class="text-center py-8 text-gray-500">
            No students assigned to installment plans yet.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left">Student ID</th>
                  <th class="px-4 py-3 text-left">Total Fee</th>
                  <th class="px-4 py-3 text-left">Paid</th>
                  <th class="px-4 py-3 text-left">Remaining</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="profile in studentFeeProfiles"
                  :key="profile.id"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ profile.studentId }}</td>
                  <td class="px-4 py-3">₹{{ profile.totalFee.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-green-600">₹{{ profile.totalPaid.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-red-600">₹{{ profile.totalRemaining.toLocaleString() }}</td>
                  <td class="px-4 py-3">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': profile.status === 'completed',
                        'bg-blue-100 text-blue-800': profile.status === 'active',
                        'bg-red-100 text-red-800': profile.status === 'defaulter'
                      }"
                      class="px-3 py-1 rounded-full text-sm"
                    >
                      {{ profile.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <button
                      @click="selectedProfile = profile"
                      class="text-indigo-600 hover:text-indigo-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payments Tab -->
        <div v-if="activeTab === 'payments'" class="p-6">
          <h3 class="text-xl font-bold mb-4">Recent Payments</h3>

          <div v-if="payments.length === 0" class="text-center py-8 text-gray-500">
            No payments recorded yet.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left">Date</th>
                  <th class="px-4 py-3 text-left">Student ID</th>
                  <th class="px-4 py-3 text-left">Amount</th>
                  <th class="px-4 py-3 text-left">Method</th>
                  <th class="px-4 py-3 text-left">Receipt</th>
                  <th class="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="payment in payments.slice(0, 20)"
                  :key="payment.id"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ payment.paymentDate }}</td>
                  <td class="px-4 py-3">{{ payment.studentId }}</td>
                  <td class="px-4 py-3 font-medium">₹{{ payment.amount.toLocaleString() }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-gray-100 rounded text-sm">
                      {{ payment.paymentMethod }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ payment.receiptNumber }}</td>
                  <td class="px-4 py-3">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': payment.status === 'completed',
                        'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                        'bg-red-100 text-red-800': payment.status === 'failed'
                      }"
                      class="px-3 py-1 rounded-full text-sm"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Overdue Tab -->
        <div v-if="activeTab === 'overdue'" class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Overdue Installments</h3>
            <button
              @click="sendOverdueAlerts"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Send Alerts
            </button>
          </div>

          <div v-if="overdueInstallments.length === 0" class="text-center py-8 text-gray-500">
            No overdue installments. Great!
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left">Student ID</th>
                  <th class="px-4 py-3 text-left">Installment</th>
                  <th class="px-4 py-3 text-left">Amount</th>
                  <th class="px-4 py-3 text-left">Due Date</th>
                  <th class="px-4 py-3 text-left">Late Fee</th>
                  <th class="px-4 py-3 text-left">Total Due</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="inst in overdueInstallments"
                  :key="inst.id"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ inst.studentId }}</td>
                  <td class="px-4 py-3">{{ inst.title }}</td>
                  <td class="px-4 py-3">₹{{ inst.amount.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-red-600">{{ inst.dueDate }}</td>
                  <td class="px-4 py-3 text-orange-600">₹{{ inst.lateFee.toLocaleString() }}</td>
                  <td class="px-4 py-3 font-bold">₹{{ inst.remainingAmount.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create Plan Modal (Simple version) -->
      <div v-if="showCreatePlan" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-xl font-bold mb-4">Create Installment Plan</h3>
          <p class="text-gray-600 mb-4">
            This is a demo. In production, you would have a full form here.
          </p>
          <div class="flex justify-end space-x-2">
            <button
              @click="showCreatePlan = false"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="createDemoPlan"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Demo Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Student Profile Modal -->
      <div v-if="selectedProfile" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">Student Fee Details - ID: {{ selectedProfile.studentId }}</h3>
            <button @click="selectedProfile = null" class="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="p-3 bg-blue-50 rounded">
              <p class="text-sm text-gray-600">Total Fee</p>
              <p class="text-lg font-bold">₹{{ selectedProfile.totalFee.toLocaleString() }}</p>
            </div>
            <div class="p-3 bg-green-50 rounded">
              <p class="text-sm text-gray-600">Paid</p>
              <p class="text-lg font-bold text-green-600">₹{{ selectedProfile.totalPaid.toLocaleString() }}</p>
            </div>
            <div class="p-3 bg-red-50 rounded">
              <p class="text-sm text-gray-600">Remaining</p>
              <p class="text-lg font-bold text-red-600">₹{{ selectedProfile.totalRemaining.toLocaleString() }}</p>
            </div>
          </div>

          <h4 class="font-bold mb-2">Installments</h4>
          <div class="space-y-2">
            <div
              v-for="inst in selectedProfile.installments"
              :key="inst.id"
              class="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p class="font-medium">{{ inst.title }}</p>
                <p class="text-sm text-gray-600">Due: {{ inst.dueDate }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold">₹{{ inst.remainingAmount.toLocaleString() }}</p>
                <span
                  :class="{
                    'bg-green-100 text-green-800': inst.status === 'paid',
                    'bg-yellow-100 text-yellow-800': inst.status === 'partial',
                    'bg-red-100 text-red-800': inst.status === 'overdue',
                    'bg-gray-100 text-gray-800': inst.status === 'pending'
                  }"
                  class="px-2 py-1 rounded text-xs"
                >
                  {{ inst.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useInstallmentsStore } from '@/stores/installments'

const installmentsStore = useInstallmentsStore()

const activeTab = ref('plans')
const showCreatePlan = ref(false)
const selectedProfile = ref<any>(null)

// Computed properties from store
const activePlans = computed(() => installmentsStore.activePlans)
const studentFeeProfiles = computed(() => installmentsStore.studentFeeProfiles)
const payments = computed(() => installmentsStore.payments)
const overdueInstallments = computed(() => installmentsStore.overdueInstallments)
const totalCollected = computed(() => installmentsStore.totalCollected)
const totalPending = computed(() => installmentsStore.totalPending)
const overdueCount = computed(() => installmentsStore.overdueInstallments.length)
const defaultersCount = computed(() => installmentsStore.defaulters.length)

// Actions
function createDemoPlan() {
  installmentsStore.createPlan({
    title: 'Annual Fee Plan 2024-25',
    description: 'Complete annual fee divided into 4 installments',
    totalAmount: 50000,
    academicYear: '2024-25',
    applicableClasses: ['9', '10', '11', '12'],
    createdBy: 1,
    createdDate: new Date().toISOString().split('T')[0] || '',
    status: 'active',
    installments: [
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: '1st Installment',
        amount: 12500,
        dueDate: '2024-04-30',
        sequence: 1,
        lateFeeRule: { enabled: true, type: 'flat', amount: 500, gracePeriodDays: 7 },
        discountRule: { enabled: false, type: 'early-payment', amount: 0 }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: '2nd Installment',
        amount: 12500,
        dueDate: '2024-07-31',
        sequence: 2,
        lateFeeRule: { enabled: true, type: 'flat', amount: 500, gracePeriodDays: 7 },
        discountRule: { enabled: false, type: 'early-payment', amount: 0 }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: '3rd Installment',
        amount: 12500,
        dueDate: '2024-10-31',
        sequence: 3,
        lateFeeRule: { enabled: true, type: 'flat', amount: 500, gracePeriodDays: 7 },
        discountRule: { enabled: false, type: 'early-payment', amount: 0 }
      },
      {
        id: 0,
        installmentID: '',
        planID: '',
        title: '4th Installment',
        amount: 12500,
        dueDate: '2025-01-31',
        sequence: 4,
        lateFeeRule: { enabled: true, type: 'flat', amount: 500, gracePeriodDays: 7 },
        discountRule: { enabled: false, type: 'early-payment', amount: 0 }
      }
    ]
  })
  showCreatePlan.value = false
}

function sendOverdueAlerts() {
  installmentsStore.sendOverdueAlerts()
  alert('Overdue alerts sent to all defaulters!')
}
</script>
