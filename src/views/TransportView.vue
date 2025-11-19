<template>
  <div>
    <Navbar page-title="Transport Management" />

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Total Routes" :value="transportStore.routes.length" color="blue">
          <template #icon><span class="text-3xl">🚌</span></template>
        </DashboardCard>
        <DashboardCard title="Total Students" :value="totalStudentsInTransport" color="green">
          <template #icon><span class="text-3xl">👨‍🎓</span></template>
        </DashboardCard>
        <DashboardCard title="Pending Leaves" :value="transportStore.getPendingLeaves().length" color="yellow">
          <template #icon><span class="text-3xl">📝</span></template>
        </DashboardCard>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Bus Routes</h2>
          <button
            @click="showAddRoute = true"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add Route
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="route in transportStore.routes" :key="route.id"
               class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ route.routeName }}</h3>
                <p class="text-gray-600 text-sm">Route #{{ route.routeNumber }}</p>
              </div>
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {{ route.students.length }}/{{ route.capacity }}
              </span>
            </div>

            <div class="space-y-2 mb-3">
              <div class="flex items-center gap-2 text-sm">
                <span>🚗</span>
                <span>{{ route.vehicleNumber }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span>👨‍✈️</span>
                <span>{{ route.driverName }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span>📞</span>
                <span>{{ route.driverPhone }}</span>
              </div>
            </div>

            <div class="border-t pt-3">
              <p class="text-sm font-semibold mb-2">Stops ({{ route.stops.length }})</p>
              <div class="space-y-1">
                <div v-for="stop in route.stops.slice(0, 3)" :key="stop.sequence"
                     class="text-xs text-gray-600 flex justify-between">
                  <span>{{ stop.name }}</span>
                  <span>{{ stop.time }}</span>
                </div>
                <p v-if="route.stops.length > 3" class="text-xs text-blue-500">
                  +{{ route.stops.length - 3 }} more stops
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Leave Requests</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">User</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">From</th>
                <th class="px-4 py-3 text-left">To</th>
                <th class="px-4 py-3 text-left">Reason</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="leave in transportStore.leaves" :key="leave.id" class="border-t">
                <td class="px-4 py-3">{{ getUserName(leave.userId, leave.userType) }}</td>
                <td class="px-4 py-3">{{ leave.userType }}</td>
                <td class="px-4 py-3">{{ formatDate(leave.startDate) }}</td>
                <td class="px-4 py-3">{{ formatDate(leave.endDate) }}</td>
                <td class="px-4 py-3">{{ leave.reason }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(leave.status)">
                    {{ leave.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div v-if="leave.status === 'pending'" class="flex gap-2">
                    <button
                      @click="approveLeave(leave.id)"
                      class="text-green-500 hover:text-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      @click="rejectLeave(leave.id)"
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Route Modal -->
    <div v-if="showAddRoute" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Add New Route</h3>
        <form @submit.prevent="addRoute">
          <input v-model="newRoute.routeNumber" placeholder="Route Number" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newRoute.routeName" placeholder="Route Name" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newRoute.driverName" placeholder="Driver Name" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newRoute.driverPhone" placeholder="Driver Phone" class="w-full mb-3 p-2 border rounded" required />
          <input v-model="newRoute.vehicleNumber" placeholder="Vehicle Number" class="w-full mb-3 p-2 border rounded" required />
          <input v-model.number="newRoute.capacity" type="number" placeholder="Capacity" class="w-full mb-3 p-2 border rounded" required />
          <div class="flex gap-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Add</button>
            <button type="button" @click="showAddRoute = false" class="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useTransportStore } from '@/stores/transport'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import { useAuthStore } from '@/stores/auth'

const transportStore = useTransportStore()
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const authStore = useAuthStore()

const showAddRoute = ref(false)
const newRoute = ref({
  routeNumber: '',
  routeName: '',
  driverName: '',
  driverPhone: '',
  vehicleNumber: '',
  capacity: 0,
  stops: [],
  students: []
})

const totalStudentsInTransport = computed(() =>
  transportStore.routes.reduce((sum, route) => sum + route.students.length, 0)
)

function addRoute() {
  transportStore.addRoute(newRoute.value)
  newRoute.value = {
    routeNumber: '',
    routeName: '',
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    capacity: 0,
    stops: [],
    students: []
  }
  showAddRoute.value = false
}

function getUserName(userId: number, userType: string) {
  if (userType === 'student') {
    const student = studentsStore.getStudentById(userId)
    return student ? student.name : 'Unknown'
  } else {
    const teacher = teachersStore.getTeacherById(userId)
    return teacher ? teacher.name : 'Unknown'
  }
}

function approveLeave(leaveId: number) {
  transportStore.updateLeaveStatus(leaveId, 'approved', authStore.user?.id || 1)
}

function rejectLeave(leaveId: number) {
  transportStore.updateLeaveStatus(leaveId, 'rejected', authStore.user?.id || 1)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getStatusClass(status: string) {
  switch (status) {
    case 'approved': return 'text-green-600 font-semibold'
    case 'rejected': return 'text-red-600 font-semibold'
    case 'pending': return 'text-yellow-600 font-semibold'
    default: return ''
  }
}
</script>
