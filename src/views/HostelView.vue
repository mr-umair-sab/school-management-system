<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Hostel / Boarding Management" />
    <div class="p-6">
      <!-- Quick Actions Dashboard -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAddBuilding = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg">
            🏢 Add Building
          </button>
          <button @click="showAddRoom = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🚪 Add Room
          </button>
          <button @click="activeTab = 'allotment'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            🎯 Room Allotment
          </button>
          <button @click="activeTab = 'attendance'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ✅ Attendance
          </button>
          <button @click="activeTab = 'fees'" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            💰 Hostel Fees
          </button>
          <button @click="activeTab = 'mess'" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            🍽️ Mess Management
          </button>
        </div>
      </div>

      <!-- Hostel Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🏢</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalBuildings }}</h3>
          <p class="text-sm opacity-80">Hostel Buildings</p>
        </div>

        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🚪</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalRooms }}</h3>
          <p class="text-sm opacity-80">Total Rooms</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👨‍🎓</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalResidents }}</h3>
          <p class="text-sm opacity-80">Hostel Residents</p>
        </div>

        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ occupancyRate }}%</h3>
          <p class="text-sm opacity-80">Occupancy Rate</p>
        </div>

        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👨‍🏫</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalWardens }}</h3>
          <p class="text-sm opacity-80">Wardens & Staff</p>
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

      <!-- Buildings & Blocks -->
      <div v-if="activeTab === 'buildings'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🏢 Hostel Buildings & Blocks</h2>
          <button @click="showAddBuilding = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Add Building
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="building in buildings" :key="building.id"
               class="p-6 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold">{{ building.name }}</h3>
                <p class="text-gray-600">{{ building.type }}</p>
              </div>
              <span :class="getBuildingStatusBadge(building.status)" class="px-2 py-1 rounded-full text-xs">
                {{ building.status }}
              </span>
            </div>
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Blocks:</span>
                <span class="font-semibold">{{ building.blocks.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Rooms:</span>
                <span class="font-semibold">{{ building.totalRooms }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Capacity:</span>
                <span class="font-semibold">{{ building.capacity }} students</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Occupied:</span>
                <span class="font-semibold text-blue-600">{{ building.occupied }} students</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Warden:</span>
                <span class="font-semibold">{{ building.warden }}</span>
              </div>
            </div>
            <div class="border-t pt-3">
              <p class="text-sm font-semibold mb-2">Blocks:</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="block in building.blocks" :key="block"
                      class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {{ block }}
                </span>
              </div>
            </div>
            <div class="mt-4 flex gap-2">
              <button @click="viewBuilding(building)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                👁️ View
              </button>
              <button @click="editBuilding(building)" class="flex-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rooms Management -->
      <div v-if="activeTab === 'rooms'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🚪 Hostel Rooms Management</h2>
          <button @click="showAddRoom = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Add Room
          </button>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select v-model="roomBuildingFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Buildings</option>
            <option v-for="building in buildings" :key="building.id" :value="building.name">{{ building.name }}</option>
          </select>
          <select v-model="roomTypeFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Types</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="shared">Shared</option>
            <option value="dormitory">Dormitory</option>
          </select>
          <select v-model="roomStatusFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="full">Full</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
          <input v-model="roomSearch" placeholder="🔍 Search room..."
                 class="px-4 py-2 border rounded-lg" />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Room ID</th>
                <th class="border p-3 text-left">Building/Block</th>
                <th class="border p-3 text-left">Floor</th>
                <th class="border p-3 text-center">Type</th>
                <th class="border p-3 text-center">Capacity</th>
                <th class="border p-3 text-center">Occupied</th>
                <th class="border p-3 text-left">Facilities</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <span class="font-bold">{{ room.roomId }}</span>
                </td>
                <td class="border p-3">{{ room.building }} - {{ room.block }}</td>
                <td class="border p-3">Floor {{ room.floor }}</td>
                <td class="border p-3 text-center">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {{ room.type }}
                  </span>
                </td>
                <td class="border p-3 text-center">{{ room.capacity }}</td>
                <td class="border p-3 text-center">
                  <span :class="room.occupied >= room.capacity ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
                    {{ room.occupied }}
                  </span>
                </td>
                <td class="border p-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="facility in room.facilities" :key="facility"
                          class="px-1 py-0.5 bg-gray-100 rounded text-xs">
                      {{ facility }}
                    </span>
                  </div>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getRoomStatusBadge(room.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ room.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewRoom(room)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      👁️
                    </button>
                    <button @click="editRoom(room)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Room Allotment -->
      <div v-if="activeTab === 'allotment'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🎯 Room Allotment System</h2>
          <div class="flex gap-2">
            <button @click="showAllocateRoom = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              ➕ Allocate Room
            </button>
            <button @click="autoSuggestRooms" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              🤖 Auto Suggest
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-left">Room</th>
                <th class="border p-3 text-left">Building/Block</th>
                <th class="border p-3 text-center">Allotment Date</th>
                <th class="border p-3 text-center">Monthly Fee</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="allotment in roomAllotments" :key="allotment.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ allotment.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ allotment.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ allotment.class }}</td>
                <td class="border p-3">
                  <span class="font-bold text-blue-600">{{ allotment.roomId }}</span>
                </td>
                <td class="border p-3">{{ allotment.building }} - {{ allotment.block }}</td>
                <td class="border p-3 text-center">{{ allotment.allotmentDate }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-green-600">₹{{ allotment.monthlyFee }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getAllotmentStatusBadge(allotment.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ allotment.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="changeRoom(allotment)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      🔄 Change
                    </button>
                    <button @click="vacateRoom(allotment)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                      🚪 Vacate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Student Hostel Profiles -->
      <div v-if="activeTab === 'profiles'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👨‍🎓 Student Hostel Profiles</h2>
          <input v-model="profileSearch" placeholder="🔍 Search student..."
                 class="px-4 py-2 border rounded-lg" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="profile in hostelProfiles" :key="profile.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👨‍🎓
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ profile.studentName }}</h3>
                <p class="text-sm text-gray-600">{{ profile.rollNumber }} - {{ profile.class }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Room:</span>
                <span class="font-semibold text-blue-600">{{ profile.roomId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Building:</span>
                <span class="font-semibold">{{ profile.building }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Monthly Fee:</span>
                <span class="font-semibold text-green-600">₹{{ profile.monthlyFee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Guardian:</span>
                <span class="font-semibold">{{ profile.guardianName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Contact:</span>
                <span class="font-semibold">{{ profile.guardianPhone }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewProfile(profile)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                View Profile
              </button>
              <button @click="issueOutPass(profile)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                Out-Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hostel Attendance -->
      <div v-if="activeTab === 'attendance'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">✅ Hostel Attendance System</h2>
          <div class="flex gap-2">
            <button @click="showMarkHostelAttendance = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              ✅ Mark Attendance
            </button>
            <button @click="scanRFID" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              📱 Scan RFID
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Present</h3>
            <p class="text-3xl font-bold text-green-600">{{ hostelPresentCount }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Absent</h3>
            <p class="text-3xl font-bold text-red-600">{{ hostelAbsentCount }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Out-Pass</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ outPassCount }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Attendance Rate</h3>
            <p class="text-3xl font-bold text-blue-600">{{ hostelAttendanceRate }}%</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Room</th>
                <th class="border p-3 text-center">Entry Time</th>
                <th class="border p-3 text-center">Exit Time</th>
                <th class="border p-3 text-center">Night Attendance</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in hostelAttendanceRecords" :key="record.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ record.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ record.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ record.roomId }}</td>
                <td class="border p-3 text-center">{{ record.entryTime || '-' }}</td>
                <td class="border p-3 text-center">{{ record.exitTime || '-' }}</td>
                <td class="border p-3 text-center">
                  <span v-if="record.nightAttendance" class="text-green-600">✅</span>
                  <span v-else class="text-red-600">❌</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getHostelAttendanceStatusBadge(record.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ record.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="notifyGuardian(record)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    📱 Notify
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hostel Fees -->
      <div v-if="activeTab === 'fees'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💰 Hostel Fee Management</h2>
          <button @click="generateHostelFees" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📄 Generate Monthly Fees
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Collected</h3>
            <p class="text-2xl font-bold text-green-600">₹{{ hostelFeeCollected.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Pending</h3>
            <p class="text-2xl font-bold text-red-600">₹{{ hostelFeePending.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Collection Rate</h3>
            <p class="text-2xl font-bold text-blue-600">{{ hostelFeeCollectionRate }}%</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Fines</h3>
            <p class="text-2xl font-bold text-yellow-600">₹{{ hostelFines.toLocaleString() }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Room</th>
                <th class="border p-3 text-center">Room Fee</th>
                <th class="border p-3 text-center">Meal Charges</th>
                <th class="border p-3 text-center">Laundry</th>
                <th class="border p-3 text-center">Total</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in hostelFees" :key="fee.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ fee.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ fee.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ fee.roomId }}</td>
                <td class="border p-3 text-center">₹{{ fee.roomFee }}</td>
                <td class="border p-3 text-center">₹{{ fee.mealCharges }}</td>
                <td class="border p-3 text-center">₹{{ fee.laundryCharges }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-blue-600">₹{{ fee.total }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getHostelFeeStatusBadge(fee.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ fee.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="collectHostelFee(fee)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                    💰 Collect
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Wardens & Staff -->
      <div v-if="activeTab === 'wardens'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👨‍🏫 Warden & Staff Management</h2>
          <button @click="showAddWarden = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            ➕ Add Warden
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="warden in wardens" :key="warden.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ warden.name }}</h3>
                <p class="text-sm text-gray-600">{{ warden.designation }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Assigned Block:</span>
                <span class="font-semibold text-blue-600">{{ warden.assignedBlock }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phone:</span>
                <span class="font-semibold">{{ warden.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Duty Shift:</span>
                <span class="font-semibold">{{ warden.dutyShift }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span :class="warden.status === 'active' ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                  {{ warden.status }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewWardenDuty(warden)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                Duty Roster
              </button>
              <button @click="editWarden(warden)" class="flex-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mess Management -->
      <div v-if="activeTab === 'mess'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🍽️ Mess / Canteen Management</h2>
          <button @click="showAddMealPlan = true" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            ➕ Add Meal Plan
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="border-2 rounded-lg p-4">
            <h3 class="font-bold mb-4">📅 Weekly Meal Plan</h3>
            <div class="space-y-3">
              <div v-for="day in weeklyMealPlan" :key="day.day" class="p-3 bg-gray-50 rounded">
                <p class="font-semibold text-blue-600">{{ day.day }}</p>
                <div class="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <p class="text-gray-600">Breakfast:</p>
                    <p class="font-semibold">{{ day.breakfast }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Lunch:</p>
                    <p class="font-semibold">{{ day.lunch }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Dinner:</p>
                    <p class="font-semibold">{{ day.dinner }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="border-2 rounded-lg p-4">
              <h3 class="font-bold mb-4">📊 Mess Statistics</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span>Daily Meal Count:</span>
                  <span class="font-bold text-blue-600">{{ dailyMealCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Monthly Expense:</span>
                  <span class="font-bold text-red-600">₹{{ messExpense.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Monthly Collection:</span>
                  <span class="font-bold text-green-600">₹{{ messCollection.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="border-2 rounded-lg p-4">
              <h3 class="font-bold mb-4">🍚 Mess Inventory</h3>
              <div class="space-y-2 text-sm">
                <div v-for="item in messInventory" :key="item.name" class="flex justify-between">
                  <span>{{ item.name }}:</span>
                  <span :class="item.quantity < item.minStock ? 'text-red-600 font-bold' : 'font-semibold'">
                    {{ item.quantity }} {{ item.unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visitor Management -->
      <div v-if="activeTab === 'visitors'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👥 Visitor Management</h2>
          <button @click="showAddVisitor = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Register Visitor
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Visitor Name</th>
                <th class="border p-3 text-left">Visiting Student</th>
                <th class="border p-3 text-left">Purpose</th>
                <th class="border p-3 text-center">Time In</th>
                <th class="border p-3 text-center">Time Out</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visitor in visitors" :key="visitor.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ visitor.name }}</p>
                    <p class="text-sm text-gray-600">{{ visitor.relation }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ visitor.studentName }}</td>
                <td class="border p-3">{{ visitor.purpose }}</td>
                <td class="border p-3 text-center">{{ visitor.timeIn }}</td>
                <td class="border p-3 text-center">{{ visitor.timeOut || '-' }}</td>
                <td class="border p-3 text-center">
                  <span :class="getVisitorStatusBadge(visitor.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ visitor.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button v-if="visitor.status === 'inside'" @click="checkOutVisitor(visitor)"
                          class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                    Check Out
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inventory & Assets -->
      <div v-if="activeTab === 'inventory'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📦 Hostel Inventory & Assets</h2>
          <button @click="showAddAsset = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Add Asset
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Total Assets</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalAssets }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Good Condition</h3>
            <p class="text-3xl font-bold text-green-600">{{ goodAssets }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Under Repair</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ repairAssets }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Damaged</h3>
            <p class="text-3xl font-bold text-red-600">{{ damagedAssets }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Asset Type</th>
                <th class="border p-3 text-left">Location</th>
                <th class="border p-3 text-center">Quantity</th>
                <th class="border p-3 text-center">Good</th>
                <th class="border p-3 text-center">Damaged</th>
                <th class="border p-3 text-center">Last Maintenance</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in hostelAssets" :key="asset.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ asset.type }}</td>
                <td class="border p-3">{{ asset.location }}</td>
                <td class="border p-3 text-center">{{ asset.quantity }}</td>
                <td class="border p-3 text-center text-green-600 font-bold">{{ asset.good }}</td>
                <td class="border p-3 text-center text-red-600 font-bold">{{ asset.damaged }}</td>
                <td class="border p-3 text-center">{{ asset.lastMaintenance }}</td>
                <td class="border p-3 text-center">
                  <button @click="requestRepair(asset)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                    🔧 Repair
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports -->
      <div v-if="activeTab === 'reports'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📊 Hostel Reports & Analytics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button @click="generateHostelReport('occupancy')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <div class="text-center">
              <span class="text-3xl block mb-2">📊</span>
              <p class="font-semibold">Occupancy Report</p>
            </div>
          </button>
          <button @click="generateHostelReport('fees')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <div class="text-center">
              <span class="text-3xl block mb-2">💰</span>
              <p class="font-semibold">Fee Collection</p>
            </div>
          </button>
          <button @click="generateHostelReport('attendance')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition">
            <div class="text-center">
              <span class="text-3xl block mb-2">✅</span>
              <p class="font-semibold">Attendance Report</p>
            </div>
          </button>
          <button @click="generateHostelReport('mess')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition">
            <div class="text-center">
              <span class="text-3xl block mb-2">🍽️</span>
              <p class="font-semibold">Mess Expenses</p>
            </div>
          </button>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-lg mb-4">📈 Room Occupancy Trend</h3>
          <div class="space-y-2">
            <div v-for="building in buildings" :key="building.id" class="flex items-center gap-4">
              <span class="text-sm w-32 font-semibold">{{ building.name }}</span>
              <div class="flex-1 bg-gray-200 rounded-full h-8">
                <div class="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${(building.occupied / building.capacity) * 100}%`">
                  {{ building.occupied }}/{{ building.capacity }}
                </div>
              </div>
              <span class="text-sm font-bold w-16">{{ Math.round((building.occupied / building.capacity) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals will be added here -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'

// Active tab
const activeTab = ref('buildings')

// Tabs
const tabs = [
  { id: 'buildings', label: '🏢 Buildings' },
  { id: 'rooms', label: '🚪 Rooms' },
  { id: 'allotment', label: '🎯 Allotment' },
  { id: 'profiles', label: '👨‍🎓 Profiles' },
  { id: 'attendance', label: '✅ Attendance' },
  { id: 'fees', label: '💰 Fees' },
  { id: 'wardens', label: '👨‍🏫 Wardens' },
  { id: 'mess', label: '🍽️ Mess' },
  { id: 'visitors', label: '👥 Visitors' },
  { id: 'inventory', label: '📦 Inventory' },
  { id: 'reports', label: '📊 Reports' }
]

// Dashboard Stats
const totalBuildings = ref(4)
const totalRooms = ref(120)
const totalResidents = ref(380)
const occupancyRate = computed(() => Math.round((totalResidents.value / (totalRooms.value * 3)) * 100))
const totalWardens = ref(12)

// Buildings Data
const buildings = ref([
  { id: 1, name: 'Boys Hostel A', type: 'Boys Hostel', blocks: ['A-Block', 'B-Block', 'C-Block'], totalRooms: 40, capacity: 120, occupied: 95, warden: 'Mr. Ahmed Khan', status: 'active' },
  { id: 2, name: 'Boys Hostel B', type: 'Boys Hostel', blocks: ['D-Block', 'E-Block'], totalRooms: 30, capacity: 90, occupied: 78, warden: 'Mr. Hassan Ali', status: 'active' },
  { id: 3, name: 'Girls Hostel A', type: 'Girls Hostel', blocks: ['A-Block', 'B-Block'], totalRooms: 30, capacity: 90, occupied: 82, warden: 'Ms. Fatima Khan', status: 'active' },
  { id: 4, name: 'Executive Block', type: 'Executive', blocks: ['Executive'], totalRooms: 20, capacity: 40, occupied: 35, warden: 'Mr. Ali Raza', status: 'active' }
])

const showAddBuilding = ref(false)

const getBuildingStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const viewBuilding = (building: Record<string, unknown>) => {
  console.log('Viewing building:', building)
}

const editBuilding = (building: Record<string, unknown>) => {
  console.log('Editing building:', building)
}

// Rooms Data
const rooms = ref([
  { id: 1, roomId: 'BHA-101', building: 'Boys Hostel A', block: 'A-Block', floor: 1, type: 'double', capacity: 2, occupied: 2, facilities: ['Fan', 'Bathroom', 'Cupboard'], status: 'full' },
  { id: 2, roomId: 'BHA-102', building: 'Boys Hostel A', block: 'A-Block', floor: 1, type: 'shared', capacity: 4, occupied: 3, facilities: ['Fan', 'Bathroom', 'WiFi'], status: 'available' },
  { id: 3, roomId: 'GHA-201', building: 'Girls Hostel A', block: 'A-Block', floor: 2, type: 'single', capacity: 1, occupied: 1, facilities: ['AC', 'Bathroom', 'Cupboard', 'WiFi'], status: 'full' }
])

const roomBuildingFilter = ref('')
const roomTypeFilter = ref('')
const roomStatusFilter = ref('')
const roomSearch = ref('')
const showAddRoom = ref(false)

const filteredRooms = computed(() => {
  return rooms.value.filter(room => {
    const matchesBuilding = !roomBuildingFilter.value || room.building === roomBuildingFilter.value
    const matchesType = !roomTypeFilter.value || room.type === roomTypeFilter.value
    const matchesStatus = !roomStatusFilter.value || room.status === roomStatusFilter.value
    const matchesSearch = !roomSearch.value || room.roomId.toLowerCase().includes(roomSearch.value.toLowerCase())
    return matchesBuilding && matchesType && matchesStatus && matchesSearch
  })
})

const getRoomStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    full: 'bg-red-100 text-red-700',
    maintenance: 'bg-yellow-100 text-yellow-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const viewRoom = (room: Record<string, unknown>) => {
  console.log('Viewing room:', room)
}

const editRoom = (room: Record<string, unknown>) => {
  console.log('Editing room:', room)
}

// Room Allotment
const showAllocateRoom = ref(false)
const roomAllotments = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', class: 'Class 10', roomId: 'BHA-101', building: 'Boys Hostel A', block: 'A-Block', allotmentDate: '2024-01-15', monthlyFee: 3000, status: 'active' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD002', class: 'Class 9', roomId: 'BHA-102', building: 'Boys Hostel A', block: 'A-Block', allotmentDate: '2024-01-20', monthlyFee: 2500, status: 'active' }
])

const getAllotmentStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    vacated: 'bg-gray-100 text-gray-700',
    transferred: 'bg-blue-100 text-blue-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const autoSuggestRooms = () => {
  console.log('Auto suggesting rooms')
}

const changeRoom = (allotment: Record<string, unknown>) => {
  console.log('Changing room:', allotment)
}

const vacateRoom = (allotment: Record<string, unknown>) => {
  console.log('Vacating room:', allotment)
}

// Hostel Profiles
const profileSearch = ref('')
const hostelProfiles = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', class: 'Class 10', roomId: 'BHA-101', building: 'Boys Hostel A', monthlyFee: 3000, guardianName: 'Mr. Ali Khan', guardianPhone: '0300-1234567' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD002', class: 'Class 9', roomId: 'BHA-102', building: 'Boys Hostel A', monthlyFee: 2500, guardianName: 'Mr. Raza Ahmed', guardianPhone: '0321-9876543' }
])

const viewProfile = (profile: Record<string, unknown>) => {
  console.log('Viewing profile:', profile)
}

const issueOutPass = (profile: Record<string, unknown>) => {
  console.log('Issuing out-pass:', profile)
}

// Hostel Attendance
const showMarkHostelAttendance = ref(false)
const hostelPresentCount = ref(350)
const hostelAbsentCount = ref(20)
const outPassCount = ref(10)
const hostelAttendanceRate = computed(() => Math.round((hostelPresentCount.value / (hostelPresentCount.value + hostelAbsentCount.value)) * 100))

const hostelAttendanceRecords = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', roomId: 'BHA-101', entryTime: '6:00 PM', exitTime: null, nightAttendance: true, status: 'present' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD002', roomId: 'BHA-102', entryTime: null, exitTime: null, nightAttendance: false, status: 'absent' }
])

const getHostelAttendanceStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    'out-pass': 'bg-yellow-100 text-yellow-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const scanRFID = () => {
  console.log('Scanning RFID')
}

const notifyGuardian = (record: Record<string, unknown>) => {
  console.log('Notifying guardian:', record)
}

// Hostel Fees
const hostelFeeCollected = ref(950000)
const hostelFeePending = ref(190000)
const hostelFeeCollectionRate = computed(() => Math.round((hostelFeeCollected.value / (hostelFeeCollected.value + hostelFeePending.value)) * 100))
const hostelFines = ref(15000)

const hostelFees = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', roomId: 'BHA-101', roomFee: 3000, mealCharges: 2000, laundryCharges: 500, total: 5500, status: 'paid' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD002', roomId: 'BHA-102', roomFee: 2500, mealCharges: 2000, laundryCharges: 500, total: 5000, status: 'pending' }
])

const getHostelFeeStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const generateHostelFees = () => {
  console.log('Generating hostel fees')
}

const collectHostelFee = (fee: Record<string, unknown>) => {
  console.log('Collecting hostel fee:', fee)
}

// Wardens
const showAddWarden = ref(false)
const wardens = ref([
  { id: 1, name: 'Mr. Ahmed Khan', designation: 'Chief Warden', assignedBlock: 'Boys Hostel A', phone: '0300-1234567', dutyShift: 'Morning', status: 'active' },
  { id: 2, name: 'Ms. Fatima Khan', designation: 'Warden', assignedBlock: 'Girls Hostel A', phone: '0321-9876543', dutyShift: 'Evening', status: 'active' }
])

const viewWardenDuty = (warden: Record<string, unknown>) => {
  console.log('Viewing warden duty:', warden)
}

const editWarden = (warden: Record<string, unknown>) => {
  console.log('Editing warden:', warden)
}

// Mess Management
const showAddMealPlan = ref(false)
const dailyMealCount = ref(380)
const messExpense = ref(285000)
const messCollection = ref(760000)

const weeklyMealPlan = ref([
  { day: 'Monday', breakfast: 'Paratha, Tea', lunch: 'Rice, Chicken Curry', dinner: 'Roti, Dal' },
  { day: 'Tuesday', breakfast: 'Bread, Omelette', lunch: 'Biryani', dinner: 'Rice, Vegetables' },
  { day: 'Wednesday', breakfast: 'Halwa Puri', lunch: 'Rice, Fish Curry', dinner: 'Roti, Chicken' }
])

const messInventory = ref([
  { name: 'Rice', quantity: 150, unit: 'kg', minStock: 100 },
  { name: 'Oil', quantity: 45, unit: 'liters', minStock: 50 },
  { name: 'Vegetables', quantity: 80, unit: 'kg', minStock: 60 }
])

// Visitors
const showAddVisitor = ref(false)
const visitors = ref([
  { id: 1, name: 'Mr. Ali Khan', relation: 'Father', studentName: 'Ahmed Ali', purpose: 'Meeting', timeIn: '2:00 PM', timeOut: '4:00 PM', status: 'checked-out' },
  { id: 2, name: 'Mrs. Sara Ahmed', relation: 'Mother', studentName: 'Hassan Raza', purpose: 'Visit', timeIn: '3:00 PM', timeOut: null, status: 'inside' }
])

const getVisitorStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    inside: 'bg-yellow-100 text-yellow-700',
    'checked-out': 'bg-green-100 text-green-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const checkOutVisitor = (visitor: Record<string, unknown>) => {
  console.log('Checking out visitor:', visitor)
}

// Inventory & Assets
const showAddAsset = ref(false)
const totalAssets = ref(850)
const goodAssets = ref(720)
const repairAssets = ref(85)
const damagedAssets = ref(45)

const hostelAssets = ref([
  { id: 1, type: 'Bed', location: 'Boys Hostel A', quantity: 120, good: 110, damaged: 10, lastMaintenance: '2024-10-15' },
  { id: 2, type: 'Mattress', location: 'Boys Hostel A', quantity: 120, good: 105, damaged: 15, lastMaintenance: '2024-09-20' },
  { id: 3, type: 'Table', location: 'Girls Hostel A', quantity: 90, good: 85, damaged: 5, lastMaintenance: '2024-11-01' }
])

const requestRepair = (asset: Record<string, unknown>) => {
  console.log('Requesting repair:', asset)
}

// Reports
const generateHostelReport = (type: string) => {
  console.log('Generating hostel report:', type)
}

onMounted(() => {
  console.log('Hostel Management System loaded')
})
</script>
