<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Transport / School Bus Management" />
    <div class="p-6">
      <!-- Quick Actions Dashboard -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAddBus = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg">
            🚌 Add Bus
          </button>
          <button @click="activeTab = 'routes'" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🗺️ Manage Routes
          </button>
          <button @click="activeTab = 'drivers'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            👨‍✈️ Drivers
          </button>
          <button @click="activeTab = 'attendance'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ✅ Attendance
          </button>
          <button @click="activeTab = 'fees'" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            💰 Transport Fees
          </button>
          <button @click="activeTab = 'tracking'" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            📍 Live Tracking
          </button>
        </div>
      </div>

      <!-- Transport Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🚌</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalBuses }}</h3>
          <p class="text-sm opacity-80">Total Buses</p>
        </div>

        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🗺️</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalRoutes }}</h3>
          <p class="text-sm opacity-80">Active Routes</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👨‍🎓</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalStudents }}</h3>
          <p class="text-sm opacity-80">Students Using Transport</p>
        </div>

        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👨‍✈️</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalDrivers }}</h3>
          <p class="text-sm opacity-80">Drivers</p>
        </div>

        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">⚠️</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ maintenanceAlerts }}</h3>
          <p class="text-sm opacity-80">Maintenance Alerts</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-2 border-b overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'"
            class=" py-2 font-semibold whitespace-nowrap text-sm"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Bus & Vehicle Management -->
      <div v-if="activeTab === 'buses'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🚌 Bus & Vehicle Management</h2>
          <button @click="showAddBus = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Add Bus
          </button>
        </div>

        <!-- Search & Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input v-model="busSearch" placeholder="🔍 Search by bus number or type..."
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="busTypeFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Types</option>
            <option value="hiace">Hiace</option>
            <option value="coaster">Coaster</option>
            <option value="van">School Van</option>
            <option value="bus">Bus</option>
          </select>
          <select v-model="busStatusFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <button @click="showMaintenanceSchedule = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            🔧 Maintenance Schedule
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="bus in filteredBuses" :key="bus.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition"
               :class="getBusStatusBorder(bus.status)">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-xl font-bold">{{ bus.busNumber }}</h3>
                <p class="text-sm text-gray-600">{{ bus.busId }}</p>
              </div>
              <span :class="getBusStatusBadge(bus.status)" class="px-2 py-1 rounded-full text-xs">
                {{ bus.status }}
              </span>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-semibold">{{ bus.vehicleType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Registration:</span>
                <span class="font-semibold">{{ bus.registrationNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Capacity:</span>
                <span class="font-semibold">{{ bus.seatingCapacity }} seats</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Fitness Valid:</span>
                <span :class="isExpiringSoon(bus.fitnessExpiry) ? 'text-red-600 font-bold' : 'text-green-600'">
                  {{ bus.fitnessExpiry }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Insurance:</span>
                <span :class="isExpiringSoon(bus.insuranceExpiry) ? 'text-red-600 font-bold' : 'text-green-600'">
                  {{ bus.insuranceExpiry }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Service:</span>
                <span class="font-semibold">{{ bus.lastMaintenance }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewBusDetails(bus)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                👁️ View
              </button>
              <button @click="editBus(bus)" class="flex-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                ✏️ Edit
              </button>
              <button @click="showMaintenanceLog(bus)" class="flex-1 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                🔧 Log
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Route Management -->
      <div v-if="activeTab === 'routes'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🗺️ Bus Route Management</h2>
          <button @click="showAddRoute = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Create Route
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="route in routes" :key="route.id"
               class="p-6 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold">{{ route.routeName }}</h3>
                <p class="text-gray-600">{{ route.routeId }} - {{ route.startPoint }} → {{ route.destination }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="editRoute(route)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  ✏️ Edit
                </button>
                <button @click="printRouteMap(route)" class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                  🖨️ Print Map
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div class="p-3 bg-blue-50 rounded">
                <p class="text-sm text-gray-600">Assigned Bus</p>
                <p class="font-bold text-blue-600">{{ route.assignedBus }}</p>
              </div>
              <div class="p-3 bg-green-50 rounded">
                <p class="text-sm text-gray-600">Distance</p>
                <p class="font-bold text-green-600">{{ route.distance }} km</p>
              </div>
              <div class="p-3 bg-yellow-50 rounded">
                <p class="text-sm text-gray-600">Duration</p>
                <p class="font-bold text-yellow-600">{{ route.duration }} min</p>
              </div>
              <div class="p-3 bg-purple-50 rounded">
                <p class="text-sm text-gray-600">Route Fee</p>
                <p class="font-bold text-purple-600">₹{{ route.routeFee }}</p>
              </div>
            </div>
            <div class="mb-4">
              <h4 class="font-bold mb-2">Stop Points ({{ route.stops.length }})</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="stop in route.stops" :key="stop.id"
                     class="p-2 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <p class="font-semibold text-sm">{{ stop.name }}</p>
                    <p class="text-xs text-gray-600">{{ stop.students }} students - ETA: {{ stop.eta }}</p>
                  </div>
                  <span class="text-xs font-bold text-blue-600">₹{{ stop.fee }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Morning: {{ route.morningTime }}
              </span>
              <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                Afternoon: {{ route.afternoonTime }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stop Points Management -->
      <div v-if="activeTab === 'stops'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📍 Stop Points / Pick-up Points</h2>
          <button @click="showAddStop = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Add Stop
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Stop Name</th>
                <th class="border p-3 text-left">Route</th>
                <th class="border p-3 text-center">Students</th>
                <th class="border p-3 text-center">Morning ETA</th>
                <th class="border p-3 text-center">Evening ETA</th>
                <th class="border p-3 text-center">Stop Fee</th>
                <th class="border p-3 text-left">Parent Contact</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stop in allStops" :key="stop.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ stop.name }}</p>
                    <p class="text-xs text-gray-600">{{ stop.gpsCoordinates }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ stop.routeName }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-blue-600">{{ stop.studentCount }}</span>
                </td>
                <td class="border p-3 text-center">{{ stop.morningETA }}</td>
                <td class="border p-3 text-center">{{ stop.eveningETA }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-green-600">₹{{ stop.fee }}</span>
                </td>
                <td class="border p-3">{{ stop.parentContact }}</td>
                <td class="border p-3 text-center">
                  <button @click="editStop(stop)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    ✏️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Driver & Staff Profiles -->
      <div v-if="activeTab === 'drivers'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👨‍✈️ Driver & Staff Profiles</h2>
          <button @click="showAddDriver = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            ➕ Add Driver
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="driver in drivers" :key="driver.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👨‍✈️
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ driver.name }}</h3>
                <p class="text-sm text-gray-600">{{ driver.driverId }}</p>
                <span :class="driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      class="px-2 py-1 rounded-full text-xs">
                  {{ driver.status }}
                </span>
              </div>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span class="text-gray-600">CNIC:</span>
                <span class="font-semibold">{{ driver.cnic }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">License:</span>
                <span class="font-semibold">{{ driver.licenseNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">License Expiry:</span>
                <span :class="isExpiringSoon(driver.licenseExpiry) ? 'text-red-600 font-bold' : 'text-green-600'">
                  {{ driver.licenseExpiry }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phone:</span>
                <span class="font-semibold">{{ driver.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Emergency:</span>
                <span class="font-semibold">{{ driver.emergencyContact }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Assigned Bus:</span>
                <span class="font-semibold text-blue-600">{{ driver.assignedBus }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rating:</span>
                <span class="font-semibold text-yellow-600">⭐ {{ driver.rating }}/5</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewDriverHistory(driver)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                History
              </button>
              <button @click="editDriver(driver)" class="flex-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                Edit
              </button>
              <button @click="markAttendance(driver)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Transport Assignment -->
      <div v-if="activeTab === 'assignment'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🎫 Student Transport Assignment</h2>
          <div class="flex gap-2">
            <button @click="showAssignStudent = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              ➕ Assign Student
            </button>
            <button @click="generateTransportCards" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              🎫 Generate Cards
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input v-model="assignmentSearch" placeholder="🔍 Search student"
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="assignmentRouteFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Routes</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">{{ route.routeName }}</option>
          </select>
          <select v-model="assignmentShiftFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Shifts</option>
            <option value="morning">Morning Only</option>
            <option value="afternoon">Afternoon Only</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-left">Bus</th>
                <th class="border p-3 text-left">Route</th>
                <th class="border p-3 text-left">Stop</th>
                <th class="border p-3 text-center">Shift</th>
                <th class="border p-3 text-center">Monthly Fee</th>
                <th class="border p-3 text-center">Transport ID</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assignment in filteredAssignments" :key="assignment.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ assignment.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ assignment.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ assignment.class }}</td>
                <td class="border p-3">{{ assignment.busNumber }}</td>
                <td class="border p-3">{{ assignment.routeName }}</td>
                <td class="border p-3">{{ assignment.stopName }}</td>
                <td class="border p-3 text-center">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {{ assignment.shift }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-green-600">₹{{ assignment.monthlyFee }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span class="font-mono text-xs">{{ assignment.transportId }}</span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="editAssignment(assignment)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      ✏️
                    </button>
                    <button @click="printCard(assignment)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                      🎫
                    </button>
                    <button @click="generateQR(assignment)" class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                      📱
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transport Attendance -->
      <div v-if="activeTab === 'attendance'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">✅ Transport Attendance System</h2>
          <div class="flex gap-2">
            <button @click="showMarkAttendance = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              ✅ Mark Attendance
            </button>
            <button @click="scanQRAttendance" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              📱 Scan QR
            </button>
            <button @click="generateAttendanceReport" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📊 Report
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input type="date" v-model="attendanceDate" class="px-4 py-2 border rounded-lg" />
          <select v-model="attendanceRouteFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Routes</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">{{ route.routeName }}</option>
          </select>
          <select v-model="attendanceShiftFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>
          <select v-model="attendanceStatusFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">On Leave</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Present</h3>
            <p class="text-3xl font-bold text-green-600">{{ presentCount }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Absent</h3>
            <p class="text-3xl font-bold text-red-600">{{ absentCount }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">On Leave</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ leaveCount }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Attendance Rate</h3>
            <p class="text-3xl font-bold text-blue-600">{{ attendanceRate }}%</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Bus/Route</th>
                <th class="border p-3 text-center">Boarding Time</th>
                <th class="border p-3 text-center">Leaving Time</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Parent Notified</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ record.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ record.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ record.busNumber }} - {{ record.routeName }}</td>
                <td class="border p-3 text-center">{{ record.boardingTime || '-' }}</td>
                <td class="border p-3 text-center">{{ record.leavingTime || '-' }}</td>
                <td class="border p-3 text-center">
                  <span :class="getAttendanceStatusBadge(record.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ record.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span v-if="record.parentNotified" class="text-green-600">✅</span>
                  <span v-else class="text-gray-400">⏳</span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="notifyParent(record)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    📱 Notify
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transport Fee Management -->
      <div v-if="activeTab === 'fees'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💰 Transport Fee Management</h2>
          <div class="flex gap-2">
            <button @click="generateMonthlyFees" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              📄 Generate Monthly Fees
            </button>
            <button @click="sendFeeReminders" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              📱 Send Reminders
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Total Collected</h3>
            <p class="text-2xl font-bold text-green-600">₹{{ totalTransportFeeCollected.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Outstanding</h3>
            <p class="text-2xl font-bold text-red-600">₹{{ outstandingTransportFee.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Pending</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Collection Rate</h3>
            <p class="text-2xl font-bold text-blue-600">{{ transportFeeCollectionRate }}%</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Discounts Given</h3>
            <p class="text-2xl font-bold text-yellow-600">₹{{ transportDiscounts.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Total</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Route</th>
                <th class="border p-3 text-center">Monthly Fee</th>
                <th class="border p-3 text-center">Discount</th>
                <th class="border p-3 text-center">Net Amount</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Due Date</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in transportFees" :key="fee.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ fee.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ fee.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ fee.routeName }}</td>
                <td class="border p-3 text-center">₹{{ fee.monthlyFee }}</td>
                <td class="border p-3 text-center text-green-600">-₹{{ fee.discount }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-blue-600">₹{{ fee.netAmount }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getFeeStatusBadge(fee.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ fee.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">{{ fee.dueDate }}</td>
                <td class="border p-3 text-center">
                  <button @click="collectFee(fee)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                    💰 Collect
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Tracking -->
      <div v-if="activeTab === 'tracking'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📍 Live Bus Tracking & Safety</h2>
          <div class="flex gap-2">
            <button @click="refreshTracking" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              🔄 Refresh
            </button>
            <button @click="showTrackingSettings" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              ⚙️ Settings
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Buses On Route</h3>
            <p class="text-3xl font-bold text-green-600">{{ busesOnRoute }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Buses at School</h3>
            <p class="text-3xl font-bold text-blue-600">{{ busesAtSchool }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Delayed Buses</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ delayedBuses }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Alerts</h3>
            <p class="text-3xl font-bold text-red-600">{{ safetyAlerts }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="border-2 rounded-lg p-4">
            <h3 class="font-bold mb-4">🗺️ Live Map View</h3>
            <div class="bg-gray-200 h-96 rounded flex items-center justify-center">
              <p class="text-gray-500">GPS Map Integration (Coming Soon)</p>
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="font-bold">🚌 Bus Status</h3>
            <div v-for="bus in trackingBuses" :key="bus.id"
                 class="p-4 border-2 rounded-lg"
                 :class="getTrackingStatusBorder(bus.trackingStatus)">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-bold">{{ bus.busNumber }}</h4>
                  <p class="text-sm text-gray-600">{{ bus.routeName }}</p>
                </div>
                <span :class="getTrackingStatusBadge(bus.trackingStatus)" class="px-2 py-1 rounded-full text-xs">
                  {{ bus.trackingStatus }}
                </span>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span>Driver:</span>
                  <span class="font-semibold">{{ bus.driverName }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Current Location:</span>
                  <span class="font-semibold">{{ bus.currentLocation }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Speed:</span>
                  <span :class="bus.speed > 60 ? 'text-red-600 font-bold' : 'text-green-600'">
                    {{ bus.speed }} km/h
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>ETA to School:</span>
                  <span class="font-semibold">{{ bus.eta }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Students Onboard:</span>
                  <span class="font-semibold text-blue-600">{{ bus.studentsOnboard }}</span>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button @click="viewBusOnMap(bus)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                  🗺️ View on Map
                </button>
                <button @click="contactDriver(bus)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                  📞 Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports & Analytics -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📊 Transport Reports & Analytics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button @click="generateReport('daily')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">📅</span>
                <p class="font-semibold">Daily Report</p>
              </div>
            </button>
            <button @click="generateReport('route')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">🗺️</span>
                <p class="font-semibold">Route-wise Report</p>
              </div>
            </button>
            <button @click="generateReport('fuel')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">⛽</span>
                <p class="font-semibold">Fuel Usage</p>
              </div>
            </button>
            <button @click="generateReport('maintenance')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">🔧</span>
                <p class="font-semibold">Maintenance</p>
              </div>
            </button>
          </div>

          <!-- Fuel Consumption Chart -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">⛽ Monthly Fuel Consumption</h3>
            <div class="space-y-2">
              <div v-for="bus in fuelConsumption" :key="bus.busNumber" class="flex items-center gap-4">
                <span class="text-sm w-24 font-semibold">{{ bus.busNumber }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8">
                  <div class="bg-yellow-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${bus.percentage}%`">
                    {{ bus.liters }}L
                  </div>
                </div>
                <span class="text-sm font-bold w-24">₹{{ bus.cost }}</span>
              </div>
            </div>
          </div>

          <!-- Route Performance -->
          <div>
            <h3 class="font-bold text-lg mb-4">📈 Route Performance</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Route</th>
                    <th class="border p-2 text-center">Students</th>
                    <th class="border p-2 text-center">Avg Attendance</th>
                    <th class="border p-2 text-center">On-Time %</th>
                    <th class="border p-2 text-center">Fee Collection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="route in routePerformance" :key="route.id" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ route.routeName }}</td>
                    <td class="border p-2 text-center">{{ route.students }}</td>
                    <td class="border p-2 text-center">{{ route.avgAttendance }}%</td>
                    <td class="border p-2 text-center">
                      <span :class="route.onTimePercentage >= 90 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                        {{ route.onTimePercentage }}%
                      </span>
                    </td>
                    <td class="border p-2 text-center">{{ route.feeCollection }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Parent Notifications -->
      <div v-if="activeTab === 'notifications'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📱 Parent Notification System</h2>
          <button @click="sendBulkNotification" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            📤 Send Bulk Notification
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">SMS Sent Today</h3>
            <p class="text-3xl font-bold text-blue-600">{{ smsSentToday }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Boarding Alerts</h3>
            <p class="text-3xl font-bold text-green-600">{{ boardingAlerts }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Emergency Alerts</h3>
            <p class="text-3xl font-bold text-red-600">{{ emergencyAlerts }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="notification in recentNotifications" :key="notification.id"
               class="p-4 border-2 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-bold">{{ notification.title }}</h4>
                <p class="text-sm text-gray-600">{{ notification.message }}</p>
              </div>
              <span :class="getNotificationTypeBadge(notification.type)" class="px-2 py-1 rounded-full text-xs">
                {{ notification.type }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">{{ notification.timestamp }}</span>
              <span class="text-gray-600">Sent to: {{ notification.recipients }} parents</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Bus Modal -->
    <div v-if="showAddBus" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 class="text-2xl font-bold">🚌 Add New Bus</h3>
          <button @click="showAddBus = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Bus Number</label>
              <input v-model="newBus.busNumber" placeholder="e.g., BUS-001"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Vehicle Type</label>
              <select v-model="newBus.vehicleType" class="w-full px-4 py-2 border rounded-lg">
                <option value="hiace">Hiace</option>
                <option value="coaster">Coaster</option>
                <option value="van">School Van</option>
                <option value="bus">Bus</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Registration Number</label>
              <input v-model="newBus.registrationNumber" placeholder="ABC-123"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Engine Number</label>
              <input v-model="newBus.engineNumber" placeholder="Engine number"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Chassis Number</label>
              <input v-model="newBus.chassisNumber" placeholder="Chassis number"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Seating Capacity</label>
              <input type="number" v-model="newBus.seatingCapacity" placeholder="30"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Fitness Certificate Expiry</label>
              <input type="date" v-model="newBus.fitnessExpiry"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Insurance Expiry</label>
              <input type="date" v-model="newBus.insuranceExpiry"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button @click="saveBus" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Bus
            </button>
            <button @click="showAddBus = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'

// Active tab
const activeTab = ref('buses')

// Tabs
const tabs = [
  { id: 'buses', label: '🚌 Buses' },
  { id: 'routes', label: '🗺️ Routes' },
  { id: 'stops', label: '📍 Stops' },
  { id: 'drivers', label: '👨‍✈️ Drivers' },
  { id: 'assignment', label: '🎫 Assignment' },
  { id: 'attendance', label: '✅ Attendance' },
  { id: 'fees', label: '💰 Fees' },
  { id: 'tracking', label: '📍 Tracking' },
  { id: 'reports', label: '📊 Reports' },
  { id: 'notifications', label: '📱 Notifications' }
]

// Dashboard Stats
const totalBuses = ref(25)
const totalRoutes = ref(15)
const totalStudents = ref(450)
const totalDrivers = ref(28)
const maintenanceAlerts = ref(3)

// Buses Data
const buses = ref([
  { id: 1, busId: 'BUS-001', busNumber: 'ABC-123', vehicleType: 'Coaster', registrationNumber: 'ABC-123', engineNumber: 'ENG123', chassisNumber: 'CHS123', seatingCapacity: 30, fitnessExpiry: '2025-06-15', insuranceExpiry: '2025-08-20', lastMaintenance: '2024-10-15', status: 'active' },
  { id: 2, busId: 'BUS-002', busNumber: 'XYZ-456', vehicleType: 'Hiace', registrationNumber: 'XYZ-456', engineNumber: 'ENG456', chassisNumber: 'CHS456', seatingCapacity: 15, fitnessExpiry: '2025-03-10', insuranceExpiry: '2025-05-15', lastMaintenance: '2024-11-01', status: 'active' },
  { id: 3, busId: 'BUS-003', busNumber: 'LMN-789', vehicleType: 'Bus', registrationNumber: 'LMN-789', engineNumber: 'ENG789', chassisNumber: 'CHS789', seatingCapacity: 50, fitnessExpiry: '2024-12-25', insuranceExpiry: '2025-01-30', lastMaintenance: '2024-09-20', status: 'maintenance' }
])

// Search & Filters
const busSearch = ref('')
const busTypeFilter = ref('')
const busStatusFilter = ref('')

const filteredBuses = computed(() => {
  return buses.value.filter(bus => {
    const matchesSearch = !busSearch.value ||
      bus.busNumber.toLowerCase().includes(busSearch.value.toLowerCase())
    const matchesType = !busTypeFilter.value || bus.vehicleType.toLowerCase() === busTypeFilter.value
    const matchesStatus = !busStatusFilter.value || bus.status === busStatusFilter.value
    return matchesSearch && matchesType && matchesStatus
  })
})

// Add Bus Modal
const showAddBus = ref(false)
const newBus = ref({
  busNumber: '',
  vehicleType: 'hiace',
  registrationNumber: '',
  engineNumber: '',
  chassisNumber: '',
  seatingCapacity: 0,
  fitnessExpiry: '',
  insuranceExpiry: ''
})

const saveBus = () => {
  console.log('Saving bus:', newBus.value)
  showAddBus.value = false
}

const viewBusDetails = (bus: Record<string, unknown>) => {
  console.log('Viewing bus:', bus)
}

const editBus = (bus: Record<string, unknown>) => {
  console.log('Editing bus:', bus)
}

const showMaintenanceLog = (bus: Record<string, unknown>) => {
  console.log('Showing maintenance log:', bus)
}

const getBusStatusBorder = (status: string) => {
  const borders: Record<string, string> = {
    active: 'border-green-500',
    maintenance: 'border-yellow-500',
    inactive: 'border-red-500'
  }
  return borders[status] || 'border-gray-200'
}

const getBusStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const isExpiringSoon = (date: string) => {
  const expiryDate = new Date(date)
  const today = new Date()
  const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
  return diffDays < 30
}

// Routes Data
const routes = ref([
  { id: 1, routeId: 'RT-001', routeName: 'North Route', startPoint: 'School', destination: 'North Area', assignedBus: 'ABC-123', distance: 25, duration: 45, routeFee: 1500, morningTime: '7:00 AM', afternoonTime: '2:00 PM', stops: [
    { id: 1, name: 'Stop A', students: 15, eta: '7:15 AM', fee: 1500 },
    { id: 2, name: 'Stop B', students: 12, eta: '7:30 AM', fee: 1200 }
  ]},
  { id: 2, routeId: 'RT-002', routeName: 'South Route', startPoint: 'School', destination: 'South Area', assignedBus: 'XYZ-456', distance: 18, duration: 35, routeFee: 1200, morningTime: '7:15 AM', afternoonTime: '2:15 PM', stops: [
    { id: 3, name: 'Stop C', students: 10, eta: '7:25 AM', fee: 1200 },
    { id: 4, name: 'Stop D', students: 8, eta: '7:40 AM', fee: 1000 }
  ]}
])

const showAddRoute = ref(false)

const editRoute = (route: Record<string, unknown>) => {
  console.log('Editing route:', route)
}

const printRouteMap = (route: Record<string, unknown>) => {
  console.log('Printing route map:', route)
}

// Stops Data
const allStops = ref([
  { id: 1, name: 'Stop A - Main Square', routeName: 'North Route', studentCount: 15, morningETA: '7:15 AM', eveningETA: '2:45 PM', fee: 1500, gpsCoordinates: '24.8607° N, 67.0011° E', parentContact: '0300-1234567' },
  { id: 2, name: 'Stop B - Market Area', routeName: 'North Route', studentCount: 12, morningETA: '7:30 AM', eveningETA: '2:30 PM', fee: 1200, gpsCoordinates: '24.8707° N, 67.0111° E', parentContact: '0321-9876543' }
])

const showAddStop = ref(false)

const editStop = (stop: Record<string, unknown>) => {
  console.log('Editing stop:', stop)
}

// Drivers Data
const drivers = ref([
  { id: 1, driverId: 'DRV-001', name: 'Ahmed Khan', cnic: '42101-1234567-1', licenseNumber: 'LIC123456', licenseExpiry: '2025-12-31', phone: '0300-1234567', emergencyContact: '0321-7654321', assignedBus: 'ABC-123', rating: 4.5, status: 'active' },
  { id: 2, driverId: 'DRV-002', name: 'Hassan Ali', cnic: '42101-7654321-1', licenseNumber: 'LIC789012', licenseExpiry: '2024-12-15', phone: '0333-9876543', emergencyContact: '0300-1111111', assignedBus: 'XYZ-456', rating: 4.8, status: 'active' }
])

const showAddDriver = ref(false)

const viewDriverHistory = (driver: Record<string, unknown>) => {
  console.log('Viewing driver history:', driver)
}

const editDriver = (driver: Record<string, unknown>) => {
  console.log('Editing driver:', driver)
}

const markAttendance = (driver: Record<string, unknown>) => {
  console.log('Marking attendance:', driver)
}

// Student Assignment
const assignmentSearch = ref('')
const assignmentRouteFilter = ref('')
const assignmentShiftFilter = ref('')
const showAssignStudent = ref(false)

const studentAssignments = ref([
  { id: 1, studentName: 'Ali Ahmed', rollNumber: 'STD001', class: 'Class 10', busNumber: 'ABC-123', routeName: 'North Route', stopName: 'Stop A', shift: 'both', monthlyFee: 1500, transportId: 'TRP-001' },
  { id: 2, studentName: 'Fatima Khan', rollNumber: 'STD002', class: 'Class 9', busNumber: 'XYZ-456', routeName: 'South Route', stopName: 'Stop C', shift: 'morning', monthlyFee: 1200, transportId: 'TRP-002' }
])

const filteredAssignments = computed(() => {
  return studentAssignments.value
})

const editAssignment = (assignment: Record<string, unknown>) => {
  console.log('Editing assignment:', assignment)
}

const printCard = (assignment: Record<string, unknown>) => {
  console.log('Printing card:', assignment)
}

const generateQR = (assignment: Record<string, unknown>) => {
  console.log('Generating QR:', assignment)
}

const generateTransportCards = () => {
  console.log('Generating transport cards')
}

// Attendance
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceRouteFilter = ref('')
const attendanceShiftFilter = ref('')
const attendanceStatusFilter = ref('')
const showMarkAttendance = ref(false)
const presentCount = ref(380)
const absentCount = ref(45)
const leaveCount = ref(25)
const attendanceRate = computed(() => Math.round((presentCount.value / (presentCount.value + absentCount.value + leaveCount.value)) * 100))

const attendanceRecords = ref([
  { id: 1, studentName: 'Ali Ahmed', rollNumber: 'STD001', busNumber: 'ABC-123', routeName: 'North Route', boardingTime: '7:15 AM', leavingTime: '2:45 PM', status: 'present', parentNotified: true },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD003', busNumber: 'XYZ-456', routeName: 'South Route', boardingTime: null, leavingTime: null, status: 'absent', parentNotified: true }
])

const getAttendanceStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    leave: 'bg-yellow-100 text-yellow-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const notifyParent = (record: Record<string, unknown>) => {
  console.log('Notifying parent:', record)
}

const scanQRAttendance = () => {
  console.log('Scanning QR for attendance')
}

const generateAttendanceReport = () => {
  console.log('Generating attendance report')
}

// Transport Fees
const totalTransportFeeCollected = ref(540000)
const outstandingTransportFee = ref(135000)
const transportFeeCollectionRate = computed(() => Math.round((totalTransportFeeCollected.value / (totalTransportFeeCollected.value + outstandingTransportFee.value)) * 100))
const transportDiscounts = ref(45000)

const transportFees = ref([
  { id: 1, studentName: 'Ali Ahmed', rollNumber: 'STD001', routeName: 'North Route', monthlyFee: 1500, discount: 0, netAmount: 1500, status: 'paid', dueDate: '2024-12-05' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD003', routeName: 'South Route', monthlyFee: 1200, discount: 200, netAmount: 1000, status: 'pending', dueDate: '2024-12-05' }
])

const getFeeStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const collectFee = (fee: Record<string, unknown>) => {
  console.log('Collecting fee:', fee)
}

const generateMonthlyFees = () => {
  console.log('Generating monthly fees')
}

const sendFeeReminders = () => {
  console.log('Sending fee reminders')
}

// Live Tracking
const busesOnRoute = ref(18)
const busesAtSchool = ref(5)
const delayedBuses = ref(2)
const safetyAlerts = ref(1)

const trackingBuses = ref([
  { id: 1, busNumber: 'ABC-123', routeName: 'North Route', driverName: 'Ahmed Khan', currentLocation: 'Main Square', speed: 45, eta: '15 min', studentsOnboard: 28, trackingStatus: 'on-route' },
  { id: 2, busNumber: 'XYZ-456', routeName: 'South Route', driverName: 'Hassan Ali', currentLocation: 'Market Area', speed: 65, eta: '10 min', studentsOnboard: 15, trackingStatus: 'delayed' }
])

const getTrackingStatusBorder = (status: string) => {
  const borders: Record<string, string> = {
    'on-route': 'border-green-500',
    'delayed': 'border-yellow-500',
    'stopped': 'border-red-500',
    'at-school': 'border-blue-500'
  }
  return borders[status] || 'border-gray-200'
}

const getTrackingStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    'on-route': 'bg-green-100 text-green-700',
    'delayed': 'bg-yellow-100 text-yellow-700',
    'stopped': 'bg-red-100 text-red-700',
    'at-school': 'bg-blue-100 text-blue-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const refreshTracking = () => {
  console.log('Refreshing tracking')
}

const showTrackingSettings = () => {
  console.log('Showing tracking settings')
}

const viewBusOnMap = (bus: Record<string, unknown>) => {
  console.log('Viewing bus on map:', bus)
}

const contactDriver = (bus: Record<string, unknown>) => {
  console.log('Contacting driver:', bus)
}

// Reports
const fuelConsumption = ref([
  { busNumber: 'ABC-123', liters: 450, cost: 67500, percentage: 100 },
  { busNumber: 'XYZ-456', liters: 320, cost: 48000, percentage: 71 },
  { busNumber: 'LMN-789', liters: 580, cost: 87000, percentage: 129 }
])

const routePerformance = ref([
  { id: 1, routeName: 'North Route', students: 45, avgAttendance: 92, onTimePercentage: 95, feeCollection: 88 },
  { id: 2, routeName: 'South Route', students: 38, avgAttendance: 88, onTimePercentage: 85, feeCollection: 92 }
])

const generateReport = (type: string) => {
  console.log('Generating report:', type)
}

// Notifications
const smsSentToday = ref(125)
const boardingAlerts = ref(380)
const emergencyAlerts = ref(2)

const recentNotifications = ref([
  { id: 1, title: 'Bus Arrival Alert', message: 'Bus ABC-123 arriving at Stop A in 5 minutes', type: 'arrival', timestamp: '2024-11-20 7:10 AM', recipients: 15 },
  { id: 2, title: 'Child Boarded', message: 'Ali Ahmed has boarded bus ABC-123', type: 'boarding', timestamp: '2024-11-20 7:15 AM', recipients: 1 }
])

const getNotificationTypeBadge = (type: string) => {
  const badges: Record<string, string> = {
    arrival: 'bg-blue-100 text-blue-700',
    boarding: 'bg-green-100 text-green-700',
    leaving: 'bg-purple-100 text-purple-700',
    delay: 'bg-yellow-100 text-yellow-700',
    emergency: 'bg-red-100 text-red-700'
  }
  return badges[type] || 'bg-gray-100 text-gray-700'
}

const sendBulkNotification = () => {
  console.log('Sending bulk notification')
}

const showMaintenanceSchedule = ref(false)

onMounted(() => {
  console.log('Transport Management System loaded')
})
</script>
