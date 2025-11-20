<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Library Management System" />
    <div class="p-6">
      <!-- Quick Actions Dashboard -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAddBook = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg">
            📚 Add Book
          </button>
          <button @click="activeTab = 'issue'" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📤 Issue Book
          </button>
          <button @click="activeTab = 'return'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📥 Return Book
          </button>
          <button @click="activeTab = 'fines'" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            💰 Fines
          </button>
          <button @click="activeTab = 'digital'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            💻 Digital Library
          </button>
          <button @click="activeTab = 'reports'" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            📊 Reports
          </button>
        </div>
      </div>

      <!-- Library Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📚</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ totalBooks }}</h3>
          <p class="text-sm opacity-80">Total Books</p>
        </div>

        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">✅</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ availableBooks }}</h3>
          <p class="text-sm opacity-80">Available</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📤</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ issuedBooks }}</h3>
          <p class="text-sm opacity-80">Issued</p>
        </div>

        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">⚠️</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">{{ overdueBooks }}</h3>
          <p class="text-sm opacity-80">Overdue</p>
        </div>

        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">💰</span>
            </div>
          </div>
          <h3 class="text-3xl font-bold">₹{{ totalFines }}</h3>
          <p class="text-sm opacity-80">Total Fines</p>
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

      <!-- Books Inventory -->
      <div v-if="activeTab === 'inventory'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📚 Books Inventory</h2>
          <div class="flex gap-2">
            <button @click="showAddBook = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              ➕ Add Book
            </button>
            <button @click="showBulkUpload = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              📤 Bulk Upload
            </button>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input v-model="searchQuery" placeholder="🔍 Search by title, author, ISBN..."
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="filterCategory" class="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="filterStatus" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="damaged">Damaged</option>
            <option value="lost">Lost</option>
          </select>
          <select v-model="filterCondition" class="px-4 py-2 border rounded-lg">
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="damaged">Damaged</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Book ID</th>
                <th class="border p-3 text-left">Title</th>
                <th class="border p-3 text-left">Author</th>
                <th class="border p-3 text-left">ISBN</th>
                <th class="border p-3 text-left">Category</th>
                <th class="border p-3 text-center">Total Copies</th>
                <th class="border p-3 text-center">Available</th>
                <th class="border p-3 text-left">Location</th>
                <th class="border p-3 text-center">Condition</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ book.bookId }}</td>
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ book.title }}</p>
                    <p class="text-sm text-gray-600">{{ book.edition }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ book.author }}</td>
                <td class="border p-3">{{ book.isbn }}</td>
                <td class="border p-3">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {{ book.category }}
                  </span>
                </td>
                <td class="border p-3 text-center">{{ book.totalCopies }}</td>
                <td class="border p-3 text-center">
                  <span :class="book.available > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                    {{ book.available }}
                  </span>
                </td>
                <td class="border p-3">{{ book.rackLocation }}</td>
                <td class="border p-3 text-center">
                  <span :class="getConditionBadge(book.condition)" class="px-2 py-1 rounded-full text-xs">
                    {{ book.condition }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewBook(book)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      👁️
                    </button>
                    <button @click="editBook(book)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                      ✏️
                    </button>
                    <button @click="generateQR(book)" class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                      📱
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Issue Book -->
      <div v-if="activeTab === 'issue'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📤 Issue Book</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2">User Type</label>
              <select v-model="issueForm.userType" class="w-full px-4 py-2 border rounded-lg">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Search User</label>
              <input v-model="issueForm.userSearch" @input="searchUser"
                     placeholder="Search by name or ID"
                     class="w-full px-4 py-2 border rounded-lg" />
              <div v-if="userSearchResults.length > 0" class="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                <div v-for="(user, index) in userSearchResults" :key="index"
                     @click="selectUser(user)"
                     class="p-3 hover:bg-gray-100 cursor-pointer border-b">
                  <p class="font-semibold">{{ user.name }}</p>
                  <p class="text-sm text-gray-600">{{ user.id }} - {{ user.class }}</p>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Search Book</label>
              <input v-model="issueForm.bookSearch" @input="searchBook"
                     placeholder="Search by title, ISBN, or scan barcode"
                     class="w-full px-4 py-2 border rounded-lg" />
              <div v-if="bookSearchResults.length > 0" class="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                <div v-for="(book, index) in bookSearchResults" :key="index"
                     @click="selectBook(book)"
                     class="p-3 hover:bg-gray-100 cursor-pointer border-b">
                  <p class="font-semibold">{{ book.title }}</p>
                  <p class="text-sm text-gray-600">{{ book.author }} - Available: {{ book.available }}</p>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Issue Duration (Days)</label>
              <select v-model="issueForm.duration" class="w-full px-4 py-2 border rounded-lg">
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-bold mb-3">Issue Summary</h3>
            <div v-if="selectedUser && selectedBook" class="space-y-3">
              <div class="p-3 bg-white rounded border">
                <p class="text-sm text-gray-600">User</p>
                <p class="font-semibold">{{ selectedUser.name }}</p>
                <p class="text-sm">{{ selectedUser.id }} - {{ selectedUser.class }}</p>
              </div>
              <div class="p-3 bg-white rounded border">
                <p class="text-sm text-gray-600">Book</p>
                <p class="font-semibold">{{ selectedBook.title }}</p>
                <p class="text-sm">{{ selectedBook.author }}</p>
              </div>
              <div class="p-3 bg-white rounded border">
                <p class="text-sm text-gray-600">Issue Date</p>
                <p class="font-semibold">{{ new Date().toLocaleDateString() }}</p>
              </div>
              <div class="p-3 bg-white rounded border">
                <p class="text-sm text-gray-600">Due Date</p>
                <p class="font-semibold">{{ calculateDueDate() }}</p>
              </div>
              <div class="p-3 bg-blue-50 rounded border border-blue-200">
                <p class="text-sm text-gray-600">Current Books Issued</p>
                <p class="font-semibold">{{ selectedUser.booksIssued || 0 }} / {{ selectedUser.maxLimit || 2 }}</p>
              </div>
              <button @click="processIssue"
                      :disabled="!canIssue"
                      class="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 font-semibold">
                📤 Issue Book
              </button>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              Select user and book to issue
            </div>
          </div>
        </div>
      </div>

      <!-- Return Book -->
      <div v-if="activeTab === 'return'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">📥 Return Book</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input v-model="returnSearch" placeholder="🔍 Search by user name or book title"
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="returnFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Issues</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
          </select>
          <button @click="scanReturn" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            📱 Scan QR/Barcode
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Issue ID</th>
                <th class="border p-3 text-left">User</th>
                <th class="border p-3 text-left">Book</th>
                <th class="border p-3 text-center">Issue Date</th>
                <th class="border p-3 text-center">Due Date</th>
                <th class="border p-3 text-center">Days Overdue</th>
                <th class="border p-3 text-center">Fine</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in filteredIssues" :key="issue.id"
                  :class="issue.daysOverdue > 0 ? 'bg-red-50' : 'hover:bg-gray-50'">
                <td class="border p-3">{{ issue.issueId }}</td>
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ issue.userName }}</p>
                    <p class="text-sm text-gray-600">{{ issue.userId }}</p>
                  </div>
                </td>
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ issue.bookTitle }}</p>
                    <p class="text-sm text-gray-600">{{ issue.bookId }}</p>
                  </div>
                </td>
                <td class="border p-3 text-center">{{ issue.issueDate }}</td>
                <td class="border p-3 text-center">{{ issue.dueDate }}</td>
                <td class="border p-3 text-center">
                  <span :class="issue.daysOverdue > 0 ? 'text-red-600 font-bold' : 'text-green-600'">
                    {{ issue.daysOverdue > 0 ? issue.daysOverdue : '-' }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-red-600">
                    {{ issue.fine > 0 ? `₹${issue.fine}` : '-' }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="showReturnModal(issue)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                    Return
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Profiles -->
      <div v-if="activeTab === 'users'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">👥 Library User Profiles</h2>
          <button @click="generateLibraryCards" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            🎫 Generate Library Cards
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input v-model="userProfileSearch" placeholder="🔍 Search users"
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="userTypeFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Users</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
          <select v-model="userStatusFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blacklisted">Blacklisted</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="user in filteredUserProfiles" :key="user.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition"
               :class="user.blacklisted ? 'border-red-500 bg-red-50' : 'border-gray-200'">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold">{{ user.name }}</h3>
                <p class="text-sm text-gray-600">{{ user.id }} - {{ user.class }}</p>
              </div>
              <span :class="user.blacklisted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                    class="px-2 py-1 rounded-full text-xs">
                {{ user.blacklisted ? 'Blacklisted' : 'Active' }}
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Books Issued:</span>
                <span class="font-semibold">{{ user.currentlyIssued }} / {{ user.maxLimit }}</span>
              </div>
              <div class="flex justify-between">
                <span>Total Borrowed:</span>
                <span class="font-semibold">{{ user.totalBorrowed }}</span>
              </div>
              <div class="flex justify-between">
                <span>Pending Fines:</span>
                <span class="font-semibold text-red-600">₹{{ user.pendingFines }}</span>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <button @click="viewUserHistory(user)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                History
              </button>
              <button @click="generateCard(user)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                Card
              </button>
              <button v-if="!user.blacklisted" @click="blacklistUser(user)" class="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                Block
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fines & Payments -->
      <div v-if="activeTab === 'fines'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💰 Fines & Payments</h2>
          <div class="flex gap-2">
            <button @click="sendFineReminders" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              📱 Send Reminders
            </button>
            <button @click="generateFineReport" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📊 Generate Report
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Overdue Fines</h3>
            <p class="text-3xl font-bold text-red-600">₹{{ overdueFinesTot }}</p>
            <p class="text-sm text-gray-600">{{ overdueCount }} users</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Lost Book Fines</h3>
            <p class="text-3xl font-bold text-yellow-600">₹{{ lostBookFines }}</p>
            <p class="text-sm text-gray-600">{{ lostBookCount }} books</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg">
            <h3 class="font-bold text-orange-700 mb-2">Damage Fines</h3>
            <p class="text-3xl font-bold text-orange-600">₹{{ damageFines }}</p>
            <p class="text-sm text-gray-600">{{ damageCount }} cases</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Collected Today</h3>
            <p class="text-3xl font-bold text-green-600">₹{{ todayCollection }}</p>
            <p class="text-sm text-gray-600">{{ todayPayments }} payments</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">User</th>
                <th class="border p-3 text-left">Fine Type</th>
                <th class="border p-3 text-left">Book</th>
                <th class="border p-3 text-center">Days Overdue</th>
                <th class="border p-3 text-center">Fine Amount</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fine in finesList" :key="fine.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ fine.userName }}</p>
                    <p class="text-sm text-gray-600">{{ fine.userId }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ fine.type }}</td>
                <td class="border p-3">{{ fine.bookTitle }}</td>
                <td class="border p-3 text-center">{{ fine.daysOverdue || '-' }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-red-600">₹{{ fine.amount }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getFineStatusBadge(fine.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ fine.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button v-if="fine.status === 'pending'" @click="collectFine(fine)"
                          class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mr-1">
                    Collect
                  </button>
                  <button @click="printReceipt(fine)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    Receipt
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Digital Library -->
      <div v-if="activeTab === 'digital'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💻 Digital Library</h2>
          <button @click="showUploadDigital = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ Upload Content
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input v-model="digitalSearch" placeholder="🔍 Search digital content"
                 class="px-4 py-2 border rounded-lg" />
          <select v-model="digitalTypeFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Types</option>
            <option value="pdf">PDF Books</option>
            <option value="video">Video Lectures</option>
            <option value="notes">Notes</option>
            <option value="assignment">Assignments</option>
          </select>
          <select v-model="digitalClassFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Classes</option>
            <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <select v-model="digitalSubjectFilter" class="px-4 py-2 border rounded-lg">
            <option value="">All Subjects</option>
            <option v-for="sub in subjects" :key="sub" :value="sub">{{ sub }}</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="content in filteredDigitalContent" :key="content.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-2xl">
                {{ getContentIcon(content.type) }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold">{{ content.title }}</h3>
                <p class="text-sm text-gray-600">{{ content.subject }} - {{ content.class }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm mb-3">
              <div class="flex justify-between">
                <span>Type:</span>
                <span class="font-semibold">{{ content.type }}</span>
              </div>
              <div class="flex justify-between">
                <span>Size:</span>
                <span class="font-semibold">{{ content.size }}</span>
              </div>
              <div class="flex justify-between">
                <span>Downloads:</span>
                <span class="font-semibold">{{ content.downloads }}</span>
              </div>
              <div class="flex justify-between">
                <span>Uploaded:</span>
                <span class="font-semibold">{{ content.uploadDate }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="viewContent(content)" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                👁️ View
              </button>
              <button @click="downloadContent(content)" class="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                ⬇️ Download
              </button>
              <button @click="shareContent(content)" class="flex-1 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservation System -->
      <div v-if="activeTab === 'reservations'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📌 Book Reservations</h2>
          <button @click="showAddReservation = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            ➕ New Reservation
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">User</th>
                <th class="border p-3 text-left">Book</th>
                <th class="border p-3 text-center">Reserved Date</th>
                <th class="border p-3 text-center">Priority</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reservation in reservations" :key="reservation.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ reservation.userName }}</p>
                    <p class="text-sm text-gray-600">{{ reservation.userId }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ reservation.bookTitle }}</td>
                <td class="border p-3 text-center">{{ reservation.reservedDate }}</td>
                <td class="border p-3 text-center">
                  <span :class="getPriorityBadge(reservation.priority)" class="px-2 py-1 rounded-full text-xs">
                    {{ reservation.priority }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getReservationStatusBadge(reservation.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ reservation.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button v-if="reservation.status === 'available'" @click="notifyUser(reservation)"
                          class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mr-1">
                    Notify
                  </button>
                  <button @click="cancelReservation(reservation)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports & Analytics -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📊 Library Reports & Analytics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button @click="generateReport('daily')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">📅</span>
                <p class="font-semibold">Daily Report</p>
              </div>
            </button>
            <button @click="generateReport('monthly')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">📊</span>
                <p class="font-semibold">Monthly Report</p>
              </div>
            </button>
            <button @click="generateReport('inventory')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">📚</span>
                <p class="font-semibold">Inventory Report</p>
              </div>
            </button>
            <button @click="generateReport('fines')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">💰</span>
                <p class="font-semibold">Fines Report</p>
              </div>
            </button>
          </div>

          <!-- Most Borrowed Books -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">📈 Top 10 Most Borrowed Books</h3>
            <div class="space-y-2">
              <div v-for="(book, index) in topBorrowedBooks" :key="book.id" class="flex items-center gap-4">
                <span class="text-2xl font-bold text-gray-400 w-8">{{ index + 1 }}</span>
                <div class="flex-1 flex items-center gap-3">
                  <div class="flex-1">
                    <p class="font-semibold">{{ book.title }}</p>
                    <p class="text-sm text-gray-600">{{ book.author }}</p>
                  </div>
                  <div class="w-64 bg-gray-200 rounded-full h-6">
                    <div class="bg-blue-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                         :style="`width: ${book.borrowPercentage}%`">
                      {{ book.borrowCount }} times
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category-wise Stock -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">📚 Category-wise Stock Distribution</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="cat in categoryStats" :key="cat.category" class="p-4 border rounded-lg">
                <p class="text-sm text-gray-600">{{ cat.category }}</p>
                <p class="text-2xl font-bold text-blue-600">{{ cat.count }}</p>
                <p class="text-xs text-gray-500">{{ cat.percentage }}% of total</p>
              </div>
            </div>
          </div>

          <!-- Lost/Damaged Books -->
          <div>
            <h3 class="font-bold text-lg mb-4">⚠️ Lost & Damaged Books Report</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Book</th>
                    <th class="border p-2 text-left">Status</th>
                    <th class="border p-2 text-left">Last Issued To</th>
                    <th class="border p-2 text-center">Date</th>
                    <th class="border p-2 text-center">Fine Collected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in lostDamagedBooks" :key="book.id" class="hover:bg-gray-50">
                    <td class="border p-2">{{ book.title }}</td>
                    <td class="border p-2">
                      <span :class="book.status === 'lost' ? 'text-red-600' : 'text-orange-600'" class="font-semibold">
                        {{ book.status }}
                      </span>
                    </td>
                    <td class="border p-2">{{ book.lastUser }}</td>
                    <td class="border p-2 text-center">{{ book.date }}</td>
                    <td class="border p-2 text-center">₹{{ book.fineCollected }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Logs -->
      <div v-if="activeTab === 'logs'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📋 Activity Logs</h2>
          <div class="flex gap-2">
            <input type="date" v-model="logDateFilter" class="px-4 py-2 border rounded-lg" />
            <select v-model="logActionFilter" class="px-4 py-2 border rounded-lg">
              <option value="">All Actions</option>
              <option value="issue">Issue</option>
              <option value="return">Return</option>
              <option value="add">Add Book</option>
              <option value="delete">Delete Book</option>
              <option value="fine">Fine Payment</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Timestamp</th>
                <th class="border p-3 text-left">Action</th>
                <th class="border p-3 text-left">User</th>
                <th class="border p-3 text-left">Book/Details</th>
                <th class="border p-3 text-left">Performed By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ log.timestamp }}</td>
                <td class="border p-3">
                  <span :class="getActionBadge(log.action)" class="px-2 py-1 rounded-full text-xs">
                    {{ log.action }}
                  </span>
                </td>
                <td class="border p-3">{{ log.userName }}</td>
                <td class="border p-3">{{ log.details }}</td>
                <td class="border p-3">{{ log.performedBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Settings -->
      <div v-if="activeTab === 'settings'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">⚙️ Library Settings</h2>
        <div class="space-y-6">
          <div class="p-4 border rounded-lg">
            <h3 class="font-bold mb-3">Issue Duration Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Student Issue Duration (Days)</label>
                <input type="number" v-model="settings.studentDuration" class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Teacher Issue Duration (Days)</label>
                <input type="number" v-model="settings.teacherDuration" class="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div class="p-4 border rounded-lg">
            <h3 class="font-bold mb-3">Fine Rate Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Overdue Fine (Per Day)</label>
                <input type="number" v-model="settings.overdueFineRate" class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Lost Book Fine</label>
                <input type="number" v-model="settings.lostBookFine" class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Damage Fine</label>
                <input type="number" v-model="settings.damageFine" class="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div class="p-4 border rounded-lg">
            <h3 class="font-bold mb-3">Book Limit Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Student Book Limit</label>
                <input type="number" v-model="settings.studentBookLimit" class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Teacher Book Limit</label>
                <input type="number" v-model="settings.teacherBookLimit" class="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <button @click="saveSettings" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 class="text-2xl font-bold">📚 Add New Book</h3>
          <button @click="showAddBook = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Book Title</label>
              <input v-model="newBook.title" placeholder="Enter book title"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Author</label>
              <input v-model="newBook.author" placeholder="Enter author name"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">ISBN</label>
              <input v-model="newBook.isbn" placeholder="Scan or enter ISBN"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Category</label>
              <select v-model="newBook.category" class="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Edition</label>
              <input v-model="newBook.edition" placeholder="e.g., 2nd Edition"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Publisher</label>
              <input v-model="newBook.publisher" placeholder="Publisher name"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Total Copies</label>
              <input type="number" v-model="newBook.totalCopies" placeholder="Number of copies"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Rack Location</label>
              <input v-model="newBook.rackLocation" placeholder="e.g., A-12"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Condition</label>
              <select v-model="newBook.condition" class="w-full px-4 py-2 border rounded-lg">
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Purchase Date</label>
              <input type="date" v-model="newBook.purchaseDate"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Vendor</label>
              <input v-model="newBook.vendor" placeholder="Vendor name"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Price</label>
              <input type="number" v-model="newBook.price" placeholder="Purchase price"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button @click="saveBook" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Book
            </button>
            <button @click="showAddBook = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Book Modal -->
    <div v-if="showReturnBookModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold">📥 Return Book</h3>
          <button @click="showReturnBookModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="selectedIssue" class="space-y-3">
            <div class="p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">User</p>
              <p class="font-semibold">{{ selectedIssue.userName }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">Book</p>
              <p class="font-semibold">{{ selectedIssue.bookTitle }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Issue Date</p>
                <p class="font-semibold">{{ selectedIssue.issueDate }}</p>
              </div>
              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Due Date</p>
                <p class="font-semibold">{{ selectedIssue.dueDate }}</p>
              </div>
            </div>
            <div class="p-3 bg-red-50 rounded border border-red-200">
              <p class="text-sm text-gray-600">Days Overdue</p>
              <p class="text-2xl font-bold text-red-600">{{ selectedIssue.daysOverdue }}</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p class="text-sm text-gray-600">Fine Amount</p>
              <p class="text-2xl font-bold text-yellow-600">₹{{ selectedIssue.fine }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Book Condition on Return</label>
              <select v-model="returnCondition" class="w-full px-4 py-2 border rounded-lg">
                <option value="good">Good</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="processReturn" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              ✅ Process Return
            </button>
            <button @click="showReturnBookModal = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
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
const activeTab = ref('inventory')

// Tabs
const tabs = [
  { id: 'inventory', label: '📚 Inventory' },
  { id: 'issue', label: '📤 Issue' },
  { id: 'return', label: '📥 Return' },
  { id: 'users', label: '👥 Users' },
  { id: 'fines', label: '💰 Fines' },
  { id: 'digital', label: '💻 Digital' },
  { id: 'reservations', label: '📌 Reservations' },
  { id: 'reports', label: '📊 Reports' },
  { id: 'logs', label: '📋 Logs' },
  { id: 'settings', label: '⚙️ Settings' }
]

// Dashboard Stats
const totalBooks = ref(2500)
const availableBooks = ref(1850)
const issuedBooks = ref(650)
const overdueBooks = ref(45)
const totalFines = ref(12500)

// Categories
const categories = ['Science', 'Mathematics', 'English', 'Urdu', 'Islamic Studies', 'History', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Novels', 'General Knowledge']

// Classes & Subjects
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
const subjects = ['Mathematics', 'Science', 'English', 'Urdu', 'Islamic Studies', 'Computer Science']

// Books Data
const books = ref([
  { id: 1, bookId: 'BK001', title: 'Advanced Mathematics', author: 'Dr. Ahmed Khan', isbn: '978-1234567890', category: 'Mathematics', edition: '5th Edition', publisher: 'Oxford', totalCopies: 25, available: 18, rackLocation: 'A-12', condition: 'good', vendor: 'Book Depot', price: 850, purchaseDate: '2024-01-15' },
  { id: 2, bookId: 'BK002', title: 'Physics Fundamentals', author: 'Prof. Sara Ali', isbn: '978-0987654321', category: 'Physics', edition: '3rd Edition', publisher: 'Cambridge', totalCopies: 20, available: 15, rackLocation: 'B-05', condition: 'new', vendor: 'Academic Books', price: 950, purchaseDate: '2024-02-10' },
  { id: 3, bookId: 'BK003', title: 'English Grammar', author: 'John Smith', isbn: '978-1122334455', category: 'English', edition: '2nd Edition', publisher: 'Pearson', totalCopies: 30, available: 22, rackLocation: 'C-08', condition: 'good', vendor: 'Book Depot', price: 650, purchaseDate: '2023-12-05' }
])

// Search & Filters
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterCondition = ref('')

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesSearch = !searchQuery.value ||
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.isbn.includes(searchQuery.value)
    const matchesCategory = !filterCategory.value || book.category === filterCategory.value
    const matchesCondition = !filterCondition.value || book.condition === filterCondition.value
    return matchesSearch && matchesCategory && matchesCondition
  })
})

// Add Book Modal
const showAddBook = ref(false)
const newBook = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  edition: '',
  publisher: '',
  totalCopies: 0,
  rackLocation: '',
  condition: 'new',
  purchaseDate: '',
  vendor: '',
  price: 0
})

const saveBook = () => {
  console.log('Saving book:', newBook.value)
  showAddBook.value = false
}

const viewBook = (book: Record<string, unknown>) => {
  console.log('Viewing book:', book)
}

const editBook = (book: Record<string, unknown>) => {
  console.log('Editing book:', book)
}

const generateQR = (book: Record<string, unknown>) => {
  console.log('Generating QR for book:', book)
}

const getConditionBadge = (condition: string) => {
  const badges: Record<string, string> = {
    new: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    damaged: 'bg-orange-100 text-orange-700',
    lost: 'bg-red-100 text-red-700'
  }
  return badges[condition] || 'bg-gray-100 text-gray-700'
}

// Issue Book
const issueForm = ref({
  userType: 'student',
  userSearch: '',
  bookSearch: '',
  duration: '14'
})

const userSearchResults = ref<Record<string, unknown>[]>([])
const bookSearchResults = ref<Record<string, unknown>[]>([])
const selectedUser = ref<Record<string, unknown> | null>(null)
const selectedBook = ref<Record<string, unknown> | null>(null)

const searchUser = () => {
  if (issueForm.value.userSearch.length > 2) {
    userSearchResults.value = [
      { id: 'STD001', name: 'Ahmed Ali', class: 'Class 10', booksIssued: 1, maxLimit: 2 },
      { id: 'STD002', name: 'Fatima Khan', class: 'Class 9', booksIssued: 0, maxLimit: 2 }
    ]
  } else {
    userSearchResults.value = []
  }
}

const searchBook = () => {
  if (issueForm.value.bookSearch.length > 2) {
    bookSearchResults.value = books.value.filter(b => b.available > 0)
  } else {
    bookSearchResults.value = []
  }
}

const selectUser = (user: Record<string, unknown>) => {
  selectedUser.value = user
  issueForm.value.userSearch = String(user.name || '')
  userSearchResults.value = []
}

const selectBook = (book: Record<string, unknown>) => {
  selectedBook.value = book
  issueForm.value.bookSearch = String(book.title || '')
  bookSearchResults.value = []
}

const calculateDueDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + parseInt(issueForm.value.duration))
  return date.toLocaleDateString()
}

const canIssue = computed(() => {
  return selectedUser.value && selectedBook.value
})

const processIssue = () => {
  console.log('Processing issue:', { user: selectedUser.value, book: selectedBook.value })
}

// Return Book
const returnSearch = ref('')
const returnFilter = ref('')
const showReturnBookModal = ref(false)
const selectedIssue = ref<Record<string, unknown> | null>(null)
const returnCondition = ref('good')

const issues = ref([
  { id: 1, issueId: 'ISS001', userName: 'Ahmed Ali', userId: 'STD001', bookTitle: 'Advanced Mathematics', bookId: 'BK001', issueDate: '2024-11-01', dueDate: '2024-11-15', daysOverdue: 5, fine: 50 },
  { id: 2, issueId: 'ISS002', userName: 'Fatima Khan', userId: 'STD002', bookTitle: 'Physics Fundamentals', bookId: 'BK002', issueDate: '2024-11-10', dueDate: '2024-11-24', daysOverdue: 0, fine: 0 }
])

const filteredIssues = computed(() => {
  return issues.value.filter(issue => {
    const matchesSearch = !returnSearch.value ||
      issue.userName.toLowerCase().includes(returnSearch.value.toLowerCase()) ||
      issue.bookTitle.toLowerCase().includes(returnSearch.value.toLowerCase())
    const matchesFilter = !returnFilter.value ||
      (returnFilter.value === 'overdue' && issue.daysOverdue > 0) ||
      (returnFilter.value === 'active' && issue.daysOverdue === 0)
    return matchesSearch && matchesFilter
  })
})

const showReturnModal = (issue: Record<string, unknown>) => {
  selectedIssue.value = issue
  showReturnBookModal.value = true
}

const processReturn = () => {
  console.log('Processing return:', { issue: selectedIssue.value, condition: returnCondition.value })
  showReturnBookModal.value = false
}

const scanReturn = () => {
  console.log('Scanning QR/Barcode for return')
}

// User Profiles
const userProfileSearch = ref('')
const userTypeFilter = ref('')
const userStatusFilter = ref('')

const userProfiles = ref([
  { id: 'STD001', name: 'Ahmed Ali', class: 'Class 10', currentlyIssued: 1, maxLimit: 2, totalBorrowed: 25, pendingFines: 50, blacklisted: false },
  { id: 'STD002', name: 'Fatima Khan', class: 'Class 9', currentlyIssued: 0, maxLimit: 2, totalBorrowed: 18, pendingFines: 0, blacklisted: false },
  { id: 'STD003', name: 'Hassan Raza', class: 'Class 8', currentlyIssued: 2, maxLimit: 2, totalBorrowed: 12, pendingFines: 200, blacklisted: true }
])

const filteredUserProfiles = computed(() => {
  return userProfiles.value
})

const viewUserHistory = (user: Record<string, unknown>) => {
  console.log('Viewing history for:', user)
}

const generateCard = (user: Record<string, unknown>) => {
  console.log('Generating card for:', user)
}

const blacklistUser = (user: Record<string, unknown>) => {
  console.log('Blacklisting user:', user)
}

const generateLibraryCards = () => {
  console.log('Generating library cards')
}

// Fines
const overdueFinesTot = ref(3500)
const lostBookFines = ref(2000)
const damageFines = ref(1500)
const todayCollection = ref(850)
const overdueCount = ref(15)
const lostBookCount = ref(4)
const damageCount = ref(3)
const todayPayments = ref(8)

const finesList = ref([
  { id: 1, userName: 'Ahmed Ali', userId: 'STD001', type: 'Overdue', bookTitle: 'Advanced Mathematics', daysOverdue: 5, amount: 50, status: 'pending' },
  { id: 2, userName: 'Hassan Raza', userId: 'STD003', type: 'Lost Book', bookTitle: 'Physics Fundamentals', daysOverdue: null, amount: 950, status: 'pending' }
])

const getFineStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    pending: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
    waived: 'bg-blue-100 text-blue-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const collectFine = (fine: Record<string, unknown>) => {
  console.log('Collecting fine:', fine)
}

const printReceipt = (fine: Record<string, unknown>) => {
  console.log('Printing receipt:', fine)
}

const sendFineReminders = () => {
  console.log('Sending fine reminders')
}

const generateFineReport = () => {
  console.log('Generating fine report')
}

// Digital Library
const digitalSearch = ref('')
const digitalTypeFilter = ref('')
const digitalClassFilter = ref('')
const digitalSubjectFilter = ref('')
const showUploadDigital = ref(false)

const digitalContent = ref([
  { id: 1, title: 'Calculus Notes', type: 'pdf', subject: 'Mathematics', class: 'Class 10', size: '2.5 MB', downloads: 45, uploadDate: '2024-11-01' },
  { id: 2, title: 'Physics Video Lecture', type: 'video', subject: 'Physics', class: 'Class 9', size: '125 MB', downloads: 32, uploadDate: '2024-11-05' }
])

const filteredDigitalContent = computed(() => {
  return digitalContent.value
})

const getContentIcon = (type: string) => {
  const icons: Record<string, string> = {
    pdf: '📄',
    video: '🎥',
    notes: '📝',
    assignment: '📋'
  }
  return icons[type] || '📁'
}

const viewContent = (content: Record<string, unknown>) => {
  console.log('Viewing content:', content)
}

const downloadContent = (content: Record<string, unknown>) => {
  console.log('Downloading content:', content)
}

const shareContent = (content: Record<string, unknown>) => {
  console.log('Sharing content:', content)
}

// Reservations
const showAddReservation = ref(false)
const reservations = ref([
  { id: 1, userName: 'Ali Hassan', userId: 'STD010', bookTitle: 'Advanced Mathematics', reservedDate: '2024-11-15', priority: 'high', status: 'waiting' },
  { id: 2, userName: 'Sara Ahmed', userId: 'TCH005', bookTitle: 'Physics Fundamentals', reservedDate: '2024-11-16', priority: 'medium', status: 'available' }
])

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  }
  return badges[priority] || 'bg-gray-100 text-gray-700'
}

const getReservationStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    waiting: 'bg-yellow-100 text-yellow-700',
    available: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const notifyUser = (reservation: Record<string, unknown>) => {
  console.log('Notifying user:', reservation)
}

const cancelReservation = (reservation: Record<string, unknown>) => {
  console.log('Cancelling reservation:', reservation)
}

// Reports
const topBorrowedBooks = ref([
  { id: 1, title: 'Advanced Mathematics', author: 'Dr. Ahmed Khan', borrowCount: 125, borrowPercentage: 100 },
  { id: 2, title: 'Physics Fundamentals', author: 'Prof. Sara Ali', borrowCount: 98, borrowPercentage: 78 },
  { id: 3, title: 'English Grammar', author: 'John Smith', borrowCount: 85, borrowPercentage: 68 }
])

const categoryStats = ref([
  { category: 'Science', count: 450, percentage: 18 },
  { category: 'Mathematics', count: 380, percentage: 15 },
  { category: 'English', count: 320, percentage: 13 },
  { category: 'Urdu', count: 280, percentage: 11 }
])

const lostDamagedBooks = ref([
  { id: 1, title: 'Physics Fundamentals', status: 'lost', lastUser: 'Hassan Raza', date: '2024-10-15', fineCollected: 950 },
  { id: 2, title: 'Chemistry Basics', status: 'damaged', lastUser: 'Ali Ahmed', date: '2024-11-01', fineCollected: 300 }
])

const generateReport = (type: string) => {
  console.log('Generating report:', type)
}

// Activity Logs
const logDateFilter = ref('')
const logActionFilter = ref('')

const activityLogs = ref([
  { id: 1, timestamp: '2024-11-20 10:30 AM', action: 'issue', userName: 'Ahmed Ali', details: 'Advanced Mathematics', performedBy: 'Librarian' },
  { id: 2, timestamp: '2024-11-20 11:15 AM', action: 'return', userName: 'Fatima Khan', details: 'Physics Fundamentals', performedBy: 'Librarian' }
])

const filteredLogs = computed(() => {
  return activityLogs.value
})

const getActionBadge = (action: string) => {
  const badges: Record<string, string> = {
    issue: 'bg-blue-100 text-blue-700',
    return: 'bg-green-100 text-green-700',
    add: 'bg-purple-100 text-purple-700',
    delete: 'bg-red-100 text-red-700',
    fine: 'bg-yellow-100 text-yellow-700'
  }
  return badges[action] || 'bg-gray-100 text-gray-700'
}

// Settings
const settings = ref({
  studentDuration: 14,
  teacherDuration: 30,
  overdueFineRate: 10,
  lostBookFine: 1000,
  damageFine: 300,
  studentBookLimit: 2,
  teacherBookLimit: 5
})

const saveSettings = () => {
  console.log('Saving settings:', settings.value)
}

const showBulkUpload = ref(false)

onMounted(() => {
  console.log('Library Management System loaded')
})
</script>
