<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Events & Activities Management - Advanced" />
    
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-20 right-4 z-50 transition-all duration-300">
      <div :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'" class="text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
        <span class="text-2xl">{{ toastType === 'success' ? '✅' : '❌' }}</span>
        <span class="font-semibold">{{ toastMessage }}</span>
      </div>
    </div>
    
    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showCreateEvent = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg">
            🎉 Create Event
          </button>
          <button @click="showCreateCompetition = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            🏆 Create Competition
          </button>
          <button @click="showCreateTrip = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            🚌 Create Trip
          </button>
          <button @click="showSchedulePTM = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            👥 Schedule PTM
          </button>
          <button @click="activeTab = 'gallery'" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            📸 Photo Gallery
          </button>
          <button @click="activeTab = 'certificates'" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            🏅 Certificates
          </button>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🎉</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalEvents }}</h3>
          <p class="text-xs opacity-80">Total Events</p>
        </div>
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🏆</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalCompetitions }}</h3>
          <p class="text-xs opacity-80">Competitions</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🚌</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalTrips }}</h3>
          <p class="text-xs opacity-80">Trips & Tours</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">👥</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalPTMs }}</h3>
          <p class="text-xs opacity-80">PTM Scheduled</p>
        </div>
        <div class="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📸</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalPhotos }}</h3>
          <p class="text-xs opacity-80">Photos</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🏅</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalCertificates }}</h3>
          <p class="text-xs opacity-80">Certificates</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-2 border-b overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'"
                  class=" py-2 font-semibold whitespace-nowrap text-sm">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 1. Events Calendar Tab -->
      <div v-if="activeTab === 'calendar'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">📅 School Events Calendar</h3>
          <div class="flex gap-2">
            <button @click="calendarView = 'month'" :class="calendarView === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'" class="px-3 py-1 rounded">
              Month
            </button>
            <button @click="calendarView = 'week'" :class="calendarView === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'" class="px-3 py-1 rounded">
              Week
            </button>
          </div>
        </div>

        <!-- Today's Events Widget -->
        <div class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 class="font-bold mb-2">📌 Today's Events</h4>
          <div class="space-y-2">
            <div v-for="event in todaysEvents" :key="event.id" class="flex items-center gap-3">
              <span class="text-2xl">{{ event.icon }}</span>
              <div>
                <p class="font-semibold">{{ event.title }}</p>
                <p class="text-sm text-gray-600">{{ event.time }} • {{ event.venue }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="border-2 rounded-lg p-4">
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                 class="text-center font-bold text-gray-600 p-2">
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="day in calendarDays" :key="day.date"
                 :class="day.hasEvent ? 'bg-blue-50 border-blue-300' : 'bg-white'"
                 class="aspect-square border-2 rounded p-2 hover:shadow-md cursor-pointer transition">
              <div class="text-sm font-semibold">{{ day.day }}</div>
              <div v-if="day.hasEvent" class="mt-1">
                <span v-for="event in day.events" :key="event.id" 
                      :class="getEventColorClass(event.category)"
                      class="block text-xs px-1 py-0.5 rounded mb-1 truncate">
                  {{ event.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Events List Tab -->
      <div v-if="activeTab === 'events'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🎉 All Events</h3>
        
        <!-- Event Categories Filter -->
        <div class="flex gap-2 mb-6 overflow-x-auto">
          <button v-for="cat in eventCategories" :key="cat.id"
                  @click="selectedCategory = cat.id"
                  :class="selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                  class="px-4 py-2 rounded-lg whitespace-nowrap">
            {{ cat.icon }} {{ cat.name }}
          </button>
        </div>

        <!-- Events Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="event in filteredEvents" :key="event.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <span class="text-3xl">{{ event.icon || '🎉' }}</span>
              <span :class="getEventStatusBadge(event.status)" class="px-2 py-1 rounded-full text-xs">
                {{ event.status }}
              </span>
            </div>
            <h4 class="font-bold text-lg mb-2">{{ event.title }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ event.description }}</p>
            <div class="space-y-1 text-sm text-gray-700 mb-3">
              <p>📅 {{ event.date }}</p>
              <p>🕐 {{ event.time }}</p>
              <p>📍 {{ event.venue }}</p>
              <p>👥 {{ event.organizer }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="viewEventDetails(event)" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                View Details
              </button>
              <button @click="editEvent(event)" class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                ✏️
              </button>
              <button @click="handleDeleteEvent(event.id)" class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Competitions Tab -->
      <div v-if="activeTab === 'competitions'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🏆 Competitions Management</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="comp in competitions" :key="comp.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ comp.title }}</h4>
                <p class="text-sm text-gray-600">{{ comp.type }}</p>
              </div>
              <span :class="getCompetitionStatusBadge(comp.status)" class="px-2 py-1 rounded-full text-xs">
                {{ comp.status }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="p-2 bg-blue-50 rounded">
                <p class="text-xs text-gray-600">Participants</p>
                <p class="font-bold text-blue-600">{{ comp.participants }}</p>
              </div>
              <div class="p-2 bg-green-50 rounded">
                <p class="text-xs text-gray-600">Teams</p>
                <p class="font-bold text-green-600">{{ comp.teams }}</p>
              </div>
              <div class="p-2 bg-yellow-50 rounded">
                <p class="text-xs text-gray-600">Judges</p>
                <p class="font-bold text-yellow-600">{{ comp.judges }}</p>
              </div>
              <div class="p-2 bg-purple-50 rounded">
                <p class="text-xs text-gray-600">Winner</p>
                <p class="font-bold text-purple-600">{{ comp.winner || 'TBD' }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <button @click="viewLeaderboard(comp)" class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                📊 Leaderboard
              </button>
              <button @click="manageScoring(comp)" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                ✏️ Scoring
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Trips & Tours Tab -->
      <div v-if="activeTab === 'trips'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🚌 Trips & Tours Management</h3>
        
        <div class="space-y-4">
          <div v-for="trip in trips" :key="trip.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ trip.title }}</h4>
                <p class="text-sm text-gray-600">{{ trip.destination }}</p>
              </div>
              <span :class="getTripStatusBadge(trip.status)" class="px-2 py-1 rounded-full text-xs">
                {{ trip.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">📅 Date</p>
                <p class="font-semibold">{{ trip.date }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">👥 Students</p>
                <p class="font-semibold">{{ trip.students }} / {{ trip.capacity }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">💰 Fee</p>
                <p class="font-semibold">RS {{ trip.fee }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="p-3 bg-blue-50 rounded">
                <p class="text-sm font-semibold mb-2">🚌 Transport</p>
                <p class="text-sm">Bus: {{ trip.busNumber }}</p>
                <p class="text-sm">Driver: {{ trip.driver }}</p>
              </div>
              <div class="p-3 bg-green-50 rounded">
                <p class="text-sm font-semibold mb-2">📋 Status</p>
                <p class="text-sm">Permission Slips: {{ trip.permissionSlips }}/{{ trip.students }}</p>
                <p class="text-sm">Fee Collected: RS {{ trip.feeCollected }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <button @click="viewTripDetails(trip)" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                View Details
              </button>
              <button @click="manageAttendance(trip)" class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                Attendance
              </button>
              <button @click="viewSafetyChecklist(trip)" class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                ✓ Safety
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. PTM Scheduler Tab -->
      <div v-if="activeTab === 'ptm'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">👥 Parent-Teacher Meeting Scheduler</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Scheduled PTMs</p>
            <p class="text-3xl font-bold text-blue-600">{{ scheduledPTMs }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Booked Slots</p>
            <p class="text-3xl font-bold text-green-600">{{ bookedSlots }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-600">Available Slots</p>
            <p class="text-3xl font-bold text-yellow-600">{{ availableSlots }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="ptm in ptmSchedules" :key="ptm.id"
               class="border-2 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ ptm.title }}</h4>
                <p class="text-sm text-gray-600">{{ ptm.class }}</p>
              </div>
              <span :class="getPTMStatusBadge(ptm.status)" class="px-2 py-1 rounded-full text-xs">
                {{ ptm.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">📅 Date & Time</p>
                <p class="font-semibold">{{ ptm.date }} • {{ ptm.time }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">📍 Venue</p>
                <p class="font-semibold">{{ ptm.venue }}</p>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-sm font-semibold mb-2">Slot Booking Progress</p>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${(ptm.bookedSlots / ptm.totalSlots) * 100}%`">
                  {{ ptm.bookedSlots }}/{{ ptm.totalSlots }}
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button @click="viewPTMSlots(ptm)" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                View Slots
              </button>
              <button @click="sendReminders(ptm)" class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                Send Reminders
              </button>
              <button @click="viewAttendanceReport(ptm)" class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Photo Gallery Tab -->
      <div v-if="activeTab === 'gallery'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">📸 Event Photo & Video Gallery</h3>
          <button @click="showUploadMedia = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Upload Media
          </button>
        </div>

        <!-- Gallery Filters -->
        <div class="flex gap-2 mb-6 overflow-x-auto">
          <button v-for="filter in galleryFilters" :key="filter.id"
                  @click="selectedGalleryFilter = filter.id"
                  :class="selectedGalleryFilter === filter.id ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                  class="px-4 py-2 rounded-lg whitespace-nowrap">
            {{ filter.name }}
          </button>
        </div>

        <!-- Photo Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="photo in galleryPhotos" :key="photo.id"
               @click="viewPhoto(photo)"
               class="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition">
            <div class="w-full h-full flex items-center justify-center text-4xl">
              {{ photo.icon }}
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Certificates Tab -->
      <div v-if="activeTab === 'certificates'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">🏅 Certificates & Rewards</h3>
          <button @click="showGenerateCertificate = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Generate Certificate
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="border-2 rounded-lg p-4">
            <h4 class="font-bold mb-3">Award Categories</h4>
            <div class="space-y-2">
              <div v-for="award in awardCategories" :key="award.id"
                   class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{{ award.icon }} {{ award.name }}</span>
                <span class="font-bold text-blue-600">{{ award.count }}</span>
              </div>
            </div>
          </div>

          <div class="border-2 rounded-lg p-4">
            <h4 class="font-bold mb-3">Trophy & Medal List</h4>
            <div class="space-y-2">
              <div v-for="trophy in trophyList" :key="trophy.id"
                   class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{{ trophy.icon }} {{ trophy.name }}</span>
                <span class="font-bold text-green-600">{{ trophy.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Certificates -->
        <div>
          <h4 class="font-bold mb-3">Recent Certificates</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2 text-left">Student Name</th>
                  <th class="border p-2 text-left">Award</th>
                  <th class="border p-2 text-left">Event</th>
                  <th class="border p-2 text-center">Date</th>
                  <th class="border p-2 text-center">Status</th>
                  <th class="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cert in certificates" :key="cert.id" class="hover:bg-gray-50">
                  <td class="border p-2 font-semibold">{{ cert.studentName }}</td>
                  <td class="border p-2">{{ cert.award }}</td>
                  <td class="border p-2">{{ cert.event }}</td>
                  <td class="border p-2 text-center">{{ cert.date }}</td>
                  <td class="border p-2 text-center">
                    <span :class="cert.delivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                          class="px-2 py-1 rounded-full text-xs">
                      {{ cert.delivered ? 'Delivered' : 'Pending' }}
                    </span>
                  </td>
                  <td class="border p-2 text-center">
                    <button @click="downloadCertificate(cert)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      📥 Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 8. Budget & Expenses Tab -->
      <div v-if="activeTab === 'budget'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">💰 Budget & Expense Tracking</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Total Budget</p>
            <p class="text-2xl font-bold text-blue-600">RS {{ totalBudget }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Spent</p>
            <p class="text-2xl font-bold text-green-600">RS {{ totalSpent }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-600">Remaining</p>
            <p class="text-2xl font-bold text-yellow-600">RS {{ totalBudget - totalSpent }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">Vendors</p>
            <p class="text-2xl font-bold text-purple-600">{{ totalVendors }}</p>
          </div>
        </div>

        <!-- Expense Categories -->
        <div class="mb-6">
          <h4 class="font-bold mb-3">Expense Categories</h4>
          <div class="space-y-2">
            <div v-for="expense in expenseCategories" :key="expense.id"
                 class="flex items-center gap-4">
              <span class="text-sm w-32 font-semibold">{{ expense.category }}</span>
              <div class="flex-1 flex gap-1">
                <div class="bg-blue-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${(expense.amount / totalBudget) * 100}%`">
                  RS {{ expense.amount }}
                </div>
              </div>
              <span class="text-sm font-bold w-16">{{ Math.round((expense.amount / totalBudget) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 9. Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📊 Event Analytics & AI Insights</h3>
        
        <!-- AI Insights -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p class="font-semibold text-purple-700 mb-2">🤖 AI Event Suggestions</p>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>• Sports Day participation increased by 25% this year</li>
              <li>• Cultural events show highest parent engagement</li>
              <li>• Suggested: Schedule Science Fair in March</li>
              <li>• Best time for outdoor events: October-November</li>
            </ul>
          </div>

          <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p class="font-semibold text-blue-700 mb-2">📈 Participation Prediction</p>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>• Expected participation in next event: 85%</li>
              <li>• High engagement students: 120</li>
              <li>• Low engagement students: 30 (need motivation)</li>
              <li>• Parent attendance prediction: 70%</li>
            </ul>
          </div>
        </div>

        <!-- Event Success Rating -->
        <div class="mb-6">
          <h4 class="font-bold mb-3">Event Success Rating</h4>
          <div class="space-y-3">
            <div v-for="rating in eventRatings" :key="rating.id"
                 class="flex items-center gap-4">
              <span class="text-sm w-40 font-semibold">{{ rating.event }}</span>
              <div class="flex-1 flex gap-1">
                <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${rating.rating}%`">
                  {{ rating.rating }}%
                </div>
              </div>
              <span class="text-sm font-bold w-16">{{ rating.rating }}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Create Event Modal -->
    <div v-if="showCreateEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Create New Event</h3>
        <form @submit.prevent="handleCreateEvent" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Event Title</label>
              <input v-model="newEvent.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="newEvent.description" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" rows="3"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="newEvent.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Time</label>
              <input v-model="newEvent.time" type="time" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <input v-model="newEvent.venue" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Organizer</label>
              <input v-model="newEvent.organizer" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select v-model="newEvent.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="admin">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Icon</label>
              <input v-model="newEvent.icon" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="🎉">
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showCreateEvent = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Event</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Competition Modal -->
    <div v-if="showCreateCompetition" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-xl">
        <h3 class="text-xl font-bold mb-4">Create Competition</h3>
        <form @submit.prevent="handleCreateCompetition" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Competition Title</label>
              <input v-model="newCompetition.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <input v-model="newCompetition.type" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="Academic/Sports">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="newCompetition.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Participants</label>
              <input v-model.number="newCompetition.participants" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teams</label>
              <input v-model.number="newCompetition.teams" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Judges</label>
              <input v-model.number="newCompetition.judges" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <input v-model="newCompetition.venue" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showCreateCompetition = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create Competition</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Trip Modal -->
    <div v-if="showCreateTrip" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Create Trip</h3>
        <form @submit.prevent="handleCreateTrip" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Trip Title</label>
              <input v-model="newTrip.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Destination</label>
              <input v-model="newTrip.destination" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="newTrip.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fee (RS)</label>
              <input v-model.number="newTrip.fee" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Capacity</label>
              <input v-model.number="newTrip.capacity" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Bus Number</label>
              <input v-model="newTrip.busNumber" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Driver Name</label>
              <input v-model="newTrip.driver" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showCreateTrip = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Create Trip</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Schedule PTM Modal -->
    <div v-if="showSchedulePTM" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-xl">
        <h3 class="text-xl font-bold mb-4">Schedule PTM</h3>
        <form @submit.prevent="handleSchedulePTM" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">PTM Title</label>
              <input v-model="newPTM.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Class</label>
              <input v-model="newPTM.class" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="newPTM.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Time</label>
              <input v-model="newPTM.time" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="9:00 AM - 5:00 PM">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Total Slots</label>
              <input v-model.number="newPTM.totalSlots" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <input v-model="newPTM.venue" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showSchedulePTM = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Schedule PTM</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Upload Media Modal -->
    <div v-if="showUploadMedia" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Upload Media</h3>
        <form @submit.prevent="handleUploadMedia" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="newMedia.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Event Name</label>
            <input v-model="newMedia.event" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input v-model="newMedia.category" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select v-model="newMedia.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showUploadMedia = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Upload</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Generate Certificate Modal -->
    <div v-if="showGenerateCertificate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Generate Certificate</h3>
        <form @submit.prevent="handleGenerateCertificate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Student Name</label>
            <input v-model="newCertificate.studentName" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Award</label>
            <input v-model="newCertificate.award" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Event</label>
            <input v-model="newCertificate.event" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="newCertificate.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showGenerateCertificate = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Event Details Modal -->
    <div v-if="showEventDetails && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">{{ selectedEvent.icon || '🎉' }} Event Details</h3>
          <button @click="showEventDetails = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-gray-600">Title</label>
            <p class="text-lg font-bold">{{ selectedEvent.title }}</p>
          </div>
          
          <div>
            <label class="text-sm font-semibold text-gray-600">Description</label>
            <p class="text-gray-700">{{ selectedEvent.description }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-600">Date</label>
              <p class="text-gray-700">📅 {{ selectedEvent.date }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Time</label>
              <p class="text-gray-700">🕐 {{ selectedEvent.time }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-600">Venue</label>
              <p class="text-gray-700">📍 {{ selectedEvent.venue }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Organizer</label>
              <p class="text-gray-700">👥 {{ selectedEvent.organizer }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-600">Category</label>
              <p class="text-gray-700 capitalize">{{ selectedEvent.category }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <span :class="getEventStatusBadge(selectedEvent.status)" class="px-3 py-1 rounded-full text-sm">
                {{ selectedEvent.status }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showEventDetails = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
          <button @click="editEvent(selectedEvent); showEventDetails = false" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Event</button>
        </div>
      </div>
    </div>

    <!-- Edit Event Modal -->
    <div v-if="showEditEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Edit Event</h3>
        <form @submit.prevent="handleUpdateEvent" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Event Title</label>
              <input v-model="editingEvent.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="editingEvent.description" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" rows="3"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="editingEvent.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Time</label>
              <input v-model="editingEvent.time" type="time" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <input v-model="editingEvent.venue" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Organizer</label>
              <input v-model="editingEvent.organizer" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select v-model="editingEvent.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="admin">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select v-model="editingEvent.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showEditEvent = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Event</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '@/stores/events'
import Navbar from '@/components/Navbar.vue'

const eventsStore = useEventsStore()
const {
  events,
  competitions,
  trips,
  ptmSchedules,
  galleryMedia,
  certificates,
  budgets,
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
  todaysEvents
} = storeToRefs(eventsStore)

// Active Tab
const activeTab = ref('calendar')

// Tabs
const tabs = [
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'events', label: '🎉 Events' },
  { id: 'competitions', label: '🏆 Competitions' },
  { id: 'trips', label: '🚌 Trips & Tours' },
  { id: 'ptm', label: '👥 PTM' },
  { id: 'gallery', label: '📸 Gallery' },
  { id: 'certificates', label: '🏅 Certificates' },
  { id: 'budget', label: '💰 Budget' },
  { id: 'analytics', label: '📊 Analytics' }
]

// Modal States
const showCreateEvent = ref(false)
const showCreateCompetition = ref(false)
const showCreateTrip = ref(false)
const showSchedulePTM = ref(false)
const showUploadMedia = ref(false)
const showGenerateCertificate = ref(false)

// View/Edit Modals
const showEventDetails = ref(false)
const showEditEvent = ref(false)
const selectedEvent = ref<Event | null>(null)
const editingEvent = ref({
  id: '',
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  organizer: '',
  category: 'academic' as 'academic' | 'sports' | 'cultural' | 'admin' | 'other',
  status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  icon: '🎉'
})

// Toast Notification
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

function showToastMessage(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Form Data
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  organizer: '',
  category: 'academic' as 'academic' | 'sports' | 'cultural' | 'admin' | 'other',
  status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  icon: '🎉'
})

const newCompetition = ref({
  title: '',
  type: '',
  participants: 0,
  teams: 0,
  judges: 0,
  status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
  date: '',
  venue: ''
})

const newTrip = ref({
  title: '',
  destination: '',
  date: '',
  students: 0,
  capacity: 0,
  fee: 0,
  busNumber: '',
  driver: '',
  permissionSlips: 0,
  feeCollected: 0,
  status: 'pending' as 'confirmed' | 'pending' | 'cancelled'
})

const newPTM = ref({
  title: '',
  class: '',
  date: '',
  time: '',
  venue: '',
  bookedSlots: 0,
  totalSlots: 0,
  status: 'scheduled' as 'scheduled' | 'ongoing' | 'completed'
})

const newMedia = ref({
  title: '',
  event: '',
  type: 'photo' as 'photo' | 'video',
  icon: '📸',
  category: '',
  uploadDate: ''
})

const newCertificate = ref({
  studentName: '',
  award: '',
  event: '',
  date: '',
  delivered: false
})

// Calendar
const calendarView = ref('month')
const selectedCategory = ref('all')

const calendarDays = ref([
  { date: '2024-11-01', day: 1, hasEvent: false, events: [] },
  // ... more days would be generated dynamically
])

// Event Categories
const eventCategories = ref([
  { id: 'all', name: 'All Events', icon: '🎉' },
  { id: 'academic', name: 'Academic', icon: '📚' },
  { id: 'sports', name: 'Sports', icon: '🏆' },
  { id: 'cultural', name: 'Cultural', icon: '🎭' },
  { id: 'admin', name: 'Administrative', icon: '📋' }
])

const filteredEvents = computed(() => {
  if (selectedCategory.value === 'all') return events.value
  return events.value.filter(e => e.category === selectedCategory.value)
})

// Gallery
const selectedGalleryFilter = ref('all')
const galleryFilters = ref([
  { id: 'all', name: 'All Media' },
  { id: 'sports', name: 'Sports Day' },
  { id: 'cultural', name: 'Cultural Events' },
  { id: 'academic', name: 'Academic Events' }
])

// Certificates
const awardCategories = ref([
  { id: 1, name: 'Best Player', icon: '🏆', count: 0 },
  { id: 2, name: 'Best Performance', icon: '⭐', count: 0 },
  { id: 3, name: 'Participation', icon: '🎖️', count: 0 },
  { id: 4, name: 'Winner', icon: '🥇', count: 0 }
])

const trophyList = ref([
  { id: 1, name: 'Gold Trophy', icon: '🥇', count: 0 },
  { id: 2, name: 'Silver Trophy', icon: '🥈', count: 0 },
  { id: 3, name: 'Bronze Trophy', icon: '🥉', count: 0 },
  { id: 4, name: 'Medals', icon: '🏅', count: 0 }
])

// Analytics
const eventRatings = ref([
  { id: 1, event: 'Sports Day 2024', rating: 95 },
  { id: 2, event: 'Cultural Festival', rating: 88 },
  { id: 3, event: 'Science Fair', rating: 92 },
  { id: 4, event: 'Annual Function', rating: 90 }
])

const expenseCategories = computed(() => budgets.value)

// Lifecycle
onMounted(() => {
  eventsStore.initialize()
})

onUnmounted(() => {
  eventsStore.cleanup()
})

// Helper Functions
function getEventColorClass(category: string) {
  const colors: Record<string, string> = {
    academic: 'bg-blue-500 text-white',
    sports: 'bg-green-500 text-white',
    cultural: 'bg-purple-500 text-white',
    admin: 'bg-yellow-500 text-white'
  }
  return colors[category] || 'bg-gray-500 text-white'
}

function getEventStatusBadge(status: string) {
  const badges: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getCompetitionStatusBadge(status: string) {
  const badges: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getTripStatusBadge(status: string) {
  const badges: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getPTMStatusBadge(status: string) {
  const badges: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Action Functions
async function handleCreateEvent() {
  try {
    await eventsStore.addEvent(newEvent.value)
    showCreateEvent.value = false
    showToastMessage('Event created successfully!', 'success')
    newEvent.value = {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      organizer: '',
      category: 'academic',
      status: 'upcoming',
      icon: '🎉'
    }
  } catch (err) {
    showToastMessage('Failed to create event', 'error')
  }
}

async function handleDeleteEvent(id: string | number) {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await eventsStore.deleteEvent(id.toString())
      showToastMessage('Event deleted successfully!', 'success')
    } catch (err) {
      showToastMessage('Failed to delete event', 'error')
    }
  }
}

async function handleCreateCompetition() {
  try {
    await eventsStore.addCompetition(newCompetition.value)
    showCreateCompetition.value = false
    showToastMessage('Competition created successfully!', 'success')
    newCompetition.value = {
      title: '',
      type: '',
      participants: 0,
      teams: 0,
      judges: 0,
      status: 'upcoming',
      date: '',
      venue: ''
    }
  } catch (err) {
    showToastMessage('Failed to create competition', 'error')
  }
}

async function handleCreateTrip() {
  try {
    await eventsStore.addTrip(newTrip.value)
    showCreateTrip.value = false
    showToastMessage('Trip created successfully!', 'success')
    newTrip.value = {
      title: '',
      destination: '',
      date: '',
      students: 0,
      capacity: 0,
      fee: 0,
      busNumber: '',
      driver: '',
      permissionSlips: 0,
      feeCollected: 0,
      status: 'pending'
    }
  } catch (err) {
    showToastMessage('Failed to create trip', 'error')
  }
}

async function handleSchedulePTM() {
  try {
    await eventsStore.addPTM(newPTM.value)
    showSchedulePTM.value = false
    showToastMessage('PTM scheduled successfully!', 'success')
    newPTM.value = {
      title: '',
      class: '',
      date: '',
      time: '',
      venue: '',
      bookedSlots: 0,
      totalSlots: 0,
      status: 'scheduled'
    }
  } catch (err) {
    showToastMessage('Failed to schedule PTM', 'error')
  }
}

async function handleUploadMedia() {
  try {
    await eventsStore.addGalleryMedia(newMedia.value)
    showUploadMedia.value = false
    showToastMessage('Media uploaded successfully!', 'success')
    newMedia.value = {
      title: '',
      event: '',
      type: 'photo',
      icon: '📸',
      category: '',
      uploadDate: ''
    }
  } catch (err) {
    showToastMessage('Failed to upload media', 'error')
  }
}

async function handleGenerateCertificate() {
  try {
    await eventsStore.addCertificate(newCertificate.value)
    showGenerateCertificate.value = false
    showToastMessage('Certificate generated successfully!', 'success')
    newCertificate.value = {
      studentName: '',
      award: '',
      event: '',
      date: '',
      delivered: false
    }
  } catch (err) {
    showToastMessage('Failed to generate certificate', 'error')
  }
}

function viewEventDetails(event: any) {
  selectedEvent.value = event
  showEventDetails.value = true
}

function editEvent(event: any) {
  editingEvent.value = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    venue: event.venue,
    organizer: event.organizer,
    category: event.category,
    status: event.status,
    icon: event.icon || '🎉'
  }
  showEditEvent.value = true
}

async function handleUpdateEvent() {
  try {
    await eventsStore.updateEvent(editingEvent.value.id, editingEvent.value)
    showEditEvent.value = false
    showToastMessage('Event updated successfully!', 'success')
  } catch (err) {
    showToastMessage('Failed to update event', 'error')
  }
}

function viewLeaderboard(comp: any) {
  console.log('Viewing leaderboard:', comp)
}

function manageScoring(comp: any) {
  console.log('Managing scoring:', comp)
}

function viewTripDetails(trip: any) {
  console.log('Viewing trip:', trip)
}

function manageAttendance(trip: any) {
  console.log('Managing attendance:', trip)
}

function viewSafetyChecklist(trip: any) {
  console.log('Viewing safety checklist:', trip)
}

function viewPTMSlots(ptm: any) {
  console.log('Viewing PTM slots:', ptm)
}

function sendReminders(ptm: any) {
  console.log('Sending reminders:', ptm)
  alert('Reminders sent successfully!')
}

function viewAttendanceReport(ptm: any) {
  console.log('Viewing attendance report:', ptm)
}

function viewPhoto(photo: any) {
  console.log('Viewing photo:', photo)
}

function downloadCertificate(cert: any) {
  console.log('Downloading certificate:', cert)
  alert('Certificate downloaded!')
}
</script>
