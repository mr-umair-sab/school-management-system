<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Fee & Finance Management" />
    <div class="p-6">
      <!-- Quick Actions Dashboard -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showCreateFeeStructure = true" class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg">
            💰 Create Fee Structure
          </button>
          <button @click="activeTab = 'vouchers'" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            🧾 Generate Vouchers
          </button>
          <button @click="activeTab = 'collection'" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            💵 Fee Collection
          </button>
          <button @click="activeTab = 'discounts'" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            🎯 Discounts
          </button>
          <button @click="activeTab = 'reminders'" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            📱 Reminders
          </button>
          <button @click="activeTab = 'reports'" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            📊 Reports
          </button>
        </div>
      </div>

      <!-- Financial Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">💰</span>
            </div>
            <span class="text-sm opacity-80">This Month</span>
          </div>
          <h3 class="text-3xl font-bold">₹{{ totalCollected.toLocaleString() }}</h3>
          <p class="text-sm opacity-80">Total Collected</p>
        </div>

        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">⏰</span>
            </div>
            <span class="text-sm opacity-80">Outstanding</span>
          </div>
          <h3 class="text-3xl font-bold">₹{{ totalPending.toLocaleString() }}</h3>
          <p class="text-sm opacity-80">Pending Amount</p>
        </div>

        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
            <span class="text-sm opacity-80">Collection Rate</span>
          </div>
          <h3 class="text-3xl font-bold">{{ collectionRate }}%</h3>
          <p class="text-sm opacity-80">This Month</p>
        </div>

        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🎯</span>
            </div>
            <span class="text-sm opacity-80">Discounts</span>
          </div>
          <h3 class="text-3xl font-bold">₹{{ totalDiscounts.toLocaleString() }}</h3>
          <p class="text-sm opacity-80">Total Given</p>
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

      <!-- Fee Structure Setup -->
      <div v-if="activeTab === 'structure'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💰 Fee Structure Management</h2>
          <button @click="showCreateFeeStructure = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            ➕ Create Structure
          </button>
        </div>
        <div class="space-y-6">
          <div v-for="structure in feeStructures" :key="structure.id"
               class="p-6 border-2 rounded-lg hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold">{{ structure.name }}</h3>
                <p class="text-gray-600">{{ structure.class }} - {{ structure.academicYear }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="editStructure(structure)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  ✏️ Edit
                </button>
                <button @click="applyToStudents(structure)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  👥 Apply
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="component in structure.components" :key="component.name"
                   class="p-3 bg-gray-50 rounded">
                <p class="text-sm font-semibold">{{ component.name }}</p>
                <p class="text-lg font-bold text-green-600">₹{{ component.amount }}</p>
                <p class="text-xs text-gray-500">{{ component.type }}</p>
              </div>
            </div>
            <div class="mt-4 p-3 bg-indigo-50 rounded flex justify-between items-center">
              <span class="font-semibold">Total Amount:</span>
              <span class="text-2xl font-bold text-indigo-600">₹{{ structure.totalAmount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fee Voucher Generation -->
      <div v-if="activeTab === 'vouchers'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🧾 Fee Voucher Generation</h2>
          <div class="flex gap-2">
            <button @click="bulkGenerateVouchers" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              📄 Bulk Generate
            </button>
            <button @click="emailAllVouchers" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📧 Email All
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select v-model="voucherFilters.class" class="px-4 py-2 border rounded-lg">
            <option value="">All Classes</option>
            <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <select v-model="voucherFilters.month" class="px-4 py-2 border rounded-lg">
            <option value="">Select Month</option>
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
          <select v-model="voucherFilters.status" class="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="generated">Generated</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">
                  <input type="checkbox" @change="toggleAllVouchers" class="w-4 h-4" />
                </th>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-center">Amount</th>
                <th class="border p-3 text-center">Due Date</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="voucher in filteredVouchers" :key="voucher.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <input type="checkbox" v-model="selectedVouchers" :value="voucher.id" class="w-4 h-4" />
                </td>
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ voucher.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ voucher.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ voucher.class }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-green-600">₹{{ voucher.amount }}</span>
                </td>
                <td class="border p-3 text-center">{{ voucher.dueDate }}</td>
                <td class="border p-3 text-center">
                  <span :class="getVoucherStatusBadge(voucher.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ voucher.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="printVoucher(voucher)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      🖨️
                    </button>
                    <button @click="emailVoucher(voucher)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                      📧
                    </button>
                    <button @click="viewVoucher(voucher)" class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fee Collection -->
      <div v-if="activeTab === 'collection'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">💵 Fee Collection Entry</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Student Search</label>
                <input v-model="studentSearch" @input="searchStudent" placeholder="Search by name or roll number"
                       class="w-full px-4 py-2 border rounded-lg" />
                <div v-if="searchResults.length > 0" class="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  <div v-for="student in searchResults" :key="student.id"
                       @click="selectStudent(student)"
                       class="p-3 hover:bg-gray-100 cursor-pointer border-b">
                    <p class="font-semibold">{{ student.name }}</p>
                    <p class="text-sm text-gray-600">{{ student.class }} - {{ student.rollNumber }}</p>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Payment Method</label>
                <select v-model="paymentMethod" class="w-full px-4 py-2 border rounded-lg">
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card Payment</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div v-if="paymentMethod === 'cheque'">
                <label class="block text-sm font-semibold mb-2">Cheque Number</label>
                <input v-model="chequeNumber" placeholder="Enter cheque number"
                       class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div v-if="paymentMethod === 'bank' || paymentMethod === 'upi'">
                <label class="block text-sm font-semibold mb-2">Transaction ID</label>
                <input v-model="transactionId" placeholder="Enter transaction ID"
                       class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Amount</label>
                <input type="number" v-model="paymentAmount" placeholder="Enter amount"
                       class="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Receipt Number</label>
                <input v-model="receiptNumber" placeholder="Auto-generated"
                       class="w-full px-4 py-2 border rounded-lg bg-gray-50" readonly />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-bold mb-3">Payment Summary</h3>
              <div v-if="selectedStudentForPayment" class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Monthly Fee:</span>
                  <span class="font-semibold">₹{{ selectedStudentForPayment.monthlyFee }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Transport Fee:</span>
                  <span class="font-semibold">₹{{ selectedStudentForPayment.transportFee }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Late Fee:</span>
                  <span class="font-semibold text-red-600">₹{{ selectedStudentForPayment.lateFee }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Discount:</span>
                  <span class="font-semibold text-green-600">-₹{{ selectedStudentForPayment.discount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Previous Dues:</span>
                  <span class="font-semibold text-red-600">₹{{ selectedStudentForPayment.previousDues }}</span>
                </div>
                <hr class="my-2" />
                <div class="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{{ calculateTotal() }}</span>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                Select a student to view payment details
              </div>
              <button @click="processPayment" :disabled="!selectedStudentForPayment"
                      class="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300">
                💰 Process Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Daily Collection Summary -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">📊 Today's Collection Summary</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-green-50 rounded-lg text-center">
              <p class="text-2xl font-bold text-green-600">₹{{ todayCollection.cash.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">Cash Collection</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <p class="text-2xl font-bold text-blue-600">₹{{ todayCollection.bank.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">Bank Transfer</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <p class="text-2xl font-bold text-purple-600">₹{{ todayCollection.online.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">Online Payment</p>
            </div>
            <div class="p-4 bg-indigo-50 rounded-lg text-center">
              <p class="text-2xl font-bold text-indigo-600">₹{{ todayCollection.total.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">Total Collection</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Discounts & Concessions -->
      <div v-if="activeTab === 'discounts'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🎯 Discounts & Concessions</h2>
          <button @click="showAddDiscount = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            ➕ Add Discount
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div v-for="category in discountCategories" :key="category.id"
               class="p-4 border-2 rounded-lg hover:shadow-md transition">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">{{ category.icon }}</span>
              <div>
                <h3 class="font-bold">{{ category.name }}</h3>
                <p class="text-sm text-gray-600">{{ category.description }}</p>
              </div>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ category.percentage }}%</p>
              <p class="text-sm text-gray-600">{{ category.studentsCount }} students</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-left">Discount Type</th>
                <th class="border p-3 text-center">Percentage</th>
                <th class="border p-3 text-center">Amount</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="discount in studentDiscounts" :key="discount.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ discount.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ discount.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ discount.class }}</td>
                <td class="border p-3">{{ discount.type }}</td>
                <td class="border p-3 text-center">{{ discount.percentage }}%</td>
                <td class="border p-3 text-center">₹{{ discount.amount }}</td>
                <td class="border p-3 text-center">
                  <span :class="getDiscountStatusBadge(discount.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ discount.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="approveDiscount(discount)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mr-1">
                    ✅
                  </button>
                  <button @click="editDiscount(discount)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    ✏️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fines & Penalties -->
      <div v-if="activeTab === 'fines'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">⚠️ Fines & Penalties</h2>
          <button @click="showAddFine = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            ➕ Add Fine
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Late Fee</h3>
            <p class="text-3xl font-bold text-red-600">₹{{ totalLateFee.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Library Fines</h3>
            <p class="text-3xl font-bold text-yellow-600">₹{{ totalLibraryFine.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Outstanding</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg">
            <h3 class="font-bold text-orange-700 mb-2">Other Fines</h3>
            <p class="text-3xl font-bold text-orange-600">₹{{ totalOtherFines.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Total</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Student</th>
                <th class="border p-3 text-left">Class</th>
                <th class="border p-3 text-left">Fine Type</th>
                <th class="border p-3 text-center">Amount</th>
                <th class="border p-3 text-left">Reason</th>
                <th class="border p-3 text-center">Date</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fine in finesList" :key="fine.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ fine.studentName }}</p>
                    <p class="text-sm text-gray-600">{{ fine.rollNumber }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ fine.class }}</td>
                <td class="border p-3">{{ fine.type }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-red-600">₹{{ fine.amount }}</span>
                </td>
                <td class="border p-3">{{ fine.reason }}</td>
                <td class="border p-3 text-center">{{ fine.date }}</td>
                <td class="border p-3 text-center">
                  <span :class="getFineStatusBadge(fine.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ fine.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="waiveFine(fine)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mr-1">
                    Waive
                  </button>
                  <button @click="editFine(fine)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    ✏️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Due Fee Reminders -->
      <div v-if="activeTab === 'reminders'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">📱 Due Fee Reminders</h2>
          <div class="flex gap-2">
            <button @click="sendBulkReminders" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              📱 Send Bulk SMS
            </button>
            <button @click="sendEmailReminders" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              📧 Send Emails
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Overdue (>30 days)</h3>
            <p class="text-3xl font-bold text-red-600">{{ overdueStudents.length }}</p>
            <p class="text-sm text-gray-600">Students</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Due Soon (5-30 days)</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ dueSoonStudents.length }}</p>
            <p class="text-sm text-gray-600">Students</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Reminders Sent</h3>
            <p class="text-3xl font-bold text-green-600">{{ remindersSent }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="student in dueStudents" :key="student.id"
               class="p-4 border-2 rounded-lg"
               :class="getDueBorderColor(student.daysOverdue)">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold">{{ student.name }}</h3>
                <p class="text-sm text-gray-600">{{ student.class }} - {{ student.rollNumber }}</p>
                <p class="text-sm text-gray-600">Parent: {{ student.parentPhone }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-red-600">₹{{ student.dueAmount }}</p>
                <p class="text-sm text-gray-600">{{ student.daysOverdue }} days overdue</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <button @click="sendSMSReminder(student)" class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                📱 Send SMS
              </button>
              <button @click="callParent(student)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                📞 Call
              </button>
              <button @click="markFollowUp(student)" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                ✅ Mark Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cashbook & Accounting -->
      <div v-if="activeTab === 'cashbook'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💰 Cashbook & Accounting</h2>
          <div class="flex gap-2">
            <button @click="showAddIncome = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              ➕ Add Income
            </button>
            <button @click="showAddExpense = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              ➖ Add Expense
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Total Income</h3>
            <p class="text-2xl font-bold text-green-600">₹{{ totalIncome.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Total Expense</h3>
            <p class="text-2xl font-bold text-red-600">₹{{ totalExpense.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Net Balance</h3>
            <p class="text-2xl font-bold text-blue-600">₹{{ (totalIncome - totalExpense).toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <h3 class="font-bold text-purple-700 mb-2">Bank Balance</h3>
            <p class="text-2xl font-bold text-purple-600">₹{{ bankBalance.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Current</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Date</th>
                <th class="border p-3 text-left">Type</th>
                <th class="border p-3 text-left">Category</th>
                <th class="border p-3 text-left">Description</th>
                <th class="border p-3 text-center">Income</th>
                <th class="border p-3 text-center">Expense</th>
                <th class="border p-3 text-center">Balance</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in cashbookEntries" :key="entry.id" class="hover:bg-gray-50">
                <td class="border p-3">{{ entry.date }}</td>
                <td class="border p-3">
                  <span :class="entry.type === 'income' ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                    {{ entry.type }}
                  </span>
                </td>
                <td class="border p-3">{{ entry.category }}</td>
                <td class="border p-3">{{ entry.description }}</td>
                <td class="border p-3 text-center">
                  <span v-if="entry.type === 'income'" class="font-bold text-green-600">₹{{ entry.amount }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span v-if="entry.type === 'expense'" class="font-bold text-red-600">₹{{ entry.amount }}</span>
                </td>
                <td class="border p-3 text-center font-bold">₹{{ entry.balance }}</td>
                <td class="border p-3 text-center">
                  <button @click="viewReceipt(entry)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs mr-1">
                    👁️
                  </button>
                  <button @click="editEntry(entry)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">
                    ✏️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Salary Management -->
      <div v-if="activeTab === 'salary'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">💼 Salary Management</h2>
          <div class="flex gap-2">
            <button @click="generateSalarySlips" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              📄 Generate Slips
            </button>
            <button @click="processSalaries" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              💰 Process Salaries
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-bold text-blue-700 mb-2">Total Staff</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalStaff }}</p>
            <p class="text-sm text-gray-600">Active</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-bold text-green-700 mb-2">Total Salary</h3>
            <p class="text-2xl font-bold text-green-600">₹{{ totalSalary.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">This Month</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-bold text-yellow-700 mb-2">Paid</h3>
            <p class="text-2xl font-bold text-yellow-600">₹{{ paidSalary.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">{{ paidStaffCount }} Staff</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-bold text-red-700 mb-2">Pending</h3>
            <p class="text-2xl font-bold text-red-600">₹{{ pendingSalary.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">{{ pendingStaffCount }} Staff</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-3 text-left">Staff Name</th>
                <th class="border p-3 text-left">Designation</th>
                <th class="border p-3 text-center">Basic Pay</th>
                <th class="border p-3 text-center">Allowances</th>
                <th class="border p-3 text-center">Deductions</th>
                <th class="border p-3 text-center">Net Salary</th>
                <th class="border p-3 text-center">Status</th>
                <th class="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in salaryList" :key="staff.id" class="hover:bg-gray-50">
                <td class="border p-3">
                  <div>
                    <p class="font-semibold">{{ staff.name }}</p>
                    <p class="text-sm text-gray-600">{{ staff.employeeId }}</p>
                  </div>
                </td>
                <td class="border p-3">{{ staff.designation }}</td>
                <td class="border p-3 text-center">₹{{ staff.basicPay }}</td>
                <td class="border p-3 text-center text-green-600">+₹{{ staff.allowances }}</td>
                <td class="border p-3 text-center text-red-600">-₹{{ staff.deductions }}</td>
                <td class="border p-3 text-center">
                  <span class="font-bold text-blue-600">₹{{ staff.netSalary }}</span>
                </td>
                <td class="border p-3 text-center">
                  <span :class="getSalaryStatusBadge(staff.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ staff.status }}
                  </span>
                </td>
                <td class="border p-3 text-center">
                  <button @click="viewSalarySlip(staff)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs mr-1">
                    👁️
                  </button>
                  <button @click="paySalary(staff)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                    💰
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Reports -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📊 Financial Reports & Analytics</h2>
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
            <button @click="generateReport('annual')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">📈</span>
                <p class="font-semibold">Annual Report</p>
              </div>
            </button>
            <button @click="generateReport('cashbook')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition">
              <div class="text-center">
                <span class="text-3xl block mb-2">💰</span>
                <p class="font-semibold">Cashbook</p>
              </div>
            </button>
          </div>

          <!-- Monthly Collection Chart -->
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-4">Monthly Collection Trend</h3>
            <div class="space-y-2">
              <div v-for="month in monthlyCollection" :key="month.month" class="flex items-center gap-4">
                <span class="text-sm w-20">{{ month.month }}</span>
                <div class="flex-1 flex gap-1">
                  <div class="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${month.collectedPercent}%`">
                    ₹{{ month.collected }}k
                  </div>
                  <div class="bg-red-500 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                       :style="`width: ${month.pendingPercent}%`">
                    ₹{{ month.pending }}k
                  </div>
                </div>
                <span class="text-sm font-bold w-16">{{ month.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Class-wise Collection -->
          <div>
            <h3 class="font-bold text-lg mb-4">Class-wise Fee Collection</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border p-2 text-left">Class</th>
                    <th class="border p-2 text-center">Students</th>
                    <th class="border p-2 text-center">Collected</th>
                    <th class="border p-2 text-center">Pending</th>
                    <th class="border p-2 text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cls in classWiseCollection" :key="cls.class" class="hover:bg-gray-50">
                    <td class="border p-2 font-semibold">{{ cls.class }}</td>
                    <td class="border p-2 text-center">{{ cls.students }}</td>
                    <td class="border p-2 text-center text-green-600 font-bold">₹{{ cls.collected }}</td>
                    <td class="border p-2 text-center text-red-600 font-bold">₹{{ cls.pending }}</td>
                    <td class="border p-2 text-center">
                      <span :class="getCollectionPercentageColor(cls.percentage)" class="font-bold">
                        {{ cls.percentage }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Fee Structure Modal -->
    <div v-if="showCreateFeeStructure" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 class="text-2xl font-bold">💰 Create Fee Structure</h3>
          <button @click="showCreateFeeStructure = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Structure Name</label>
              <input v-model="newFeeStructure.name" placeholder="e.g., Class 10 - Science"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Academic Year</label>
              <input v-model="newFeeStructure.academicYear" placeholder="2024-2025"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Class</label>
              <select v-model="newFeeStructure.class" class="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Class</option>
                <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Section (Optional)</label>
              <input v-model="newFeeStructure.section" placeholder="A, B, C or leave blank for all"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-bold mb-3">Fee Components</h4>
            <div class="space-y-3">
              <div v-for="(component, index) in newFeeStructure.components" :key="index"
                   class="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                <input v-model="component.name" placeholder="Component Name"
                       class="px-3 py-2 border rounded" />
                <input type="number" v-model="component.amount" placeholder="Amount"
                       class="px-3 py-2 border rounded" />
                <select v-model="component.type" class="px-3 py-2 border rounded">
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one-time">One-time</option>
                  <option value="optional">Optional</option>
                </select>
                <button @click="removeComponent(index)" class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Remove
                </button>
              </div>
            </div>
            <button @click="addComponent" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              ➕ Add Component
            </button>
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="saveFeeStructure" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Structure
            </button>
            <button @click="showCreateFeeStructure = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Discount Modal -->
    <div v-if="showAddDiscount" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold">🎯 Add Discount</h3>
          <button @click="showAddDiscount = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Student</label>
              <input v-model="newDiscount.studentSearch" placeholder="Search student"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Discount Type</label>
              <select v-model="newDiscount.type" class="w-full px-4 py-2 border rounded-lg">
                <option value="kinship">Kinship</option>
                <option value="staff-child">Staff Child</option>
                <option value="need-based">Need-based</option>
                <option value="merit-based">Merit-based</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Percentage</label>
              <input type="number" v-model="newDiscount.percentage" placeholder="10"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Duration</label>
              <select v-model="newDiscount.duration" class="w-full px-4 py-2 border rounded-lg">
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Reason</label>
            <textarea v-model="newDiscount.reason" placeholder="Reason for discount"
                      class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div class="flex gap-3">
            <button @click="saveDiscount" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Discount
            </button>
            <button @click="showAddDiscount = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Fine Modal -->
    <div v-if="showAddFine" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold">⚠️ Add Fine</h3>
          <button @click="showAddFine = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Student</label>
              <input v-model="newFine.studentSearch" placeholder="Search student"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Fine Type</label>
              <select v-model="newFine.type" class="w-full px-4 py-2 border rounded-lg">
                <option value="late-fee">Late Fee</option>
                <option value="library">Library Fine</option>
                <option value="damage">Damage Fine</option>
                <option value="disciplinary">Disciplinary Fine</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Amount</label>
              <input type="number" v-model="newFine.amount" placeholder="Enter amount"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Date</label>
              <input type="date" v-model="newFine.date"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Reason</label>
            <textarea v-model="newFine.reason" placeholder="Reason for fine"
                      class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div class="flex gap-3">
            <button @click="saveFine" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Fine
            </button>
            <button @click="showAddFine = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Income Modal -->
    <div v-if="showAddIncome" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold">➕ Add Income</h3>
          <button @click="showAddIncome = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Date</label>
              <input type="date" v-model="newIncome.date"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Category</label>
              <select v-model="newIncome.category" class="w-full px-4 py-2 border rounded-lg">
                <option value="fee">Fee Collection</option>
                <option value="admission">Admission Fee</option>
                <option value="donation">Donation</option>
                <option value="other">Other Income</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Amount</label>
              <input type="number" v-model="newIncome.amount" placeholder="Enter amount"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Payment Mode</label>
              <select v-model="newIncome.paymentMode" class="w-full px-4 py-2 border rounded-lg">
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Description</label>
            <textarea v-model="newIncome.description" placeholder="Description"
                      class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div class="flex gap-3">
            <button @click="saveIncome" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Income
            </button>
            <button @click="showAddIncome = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showAddExpense" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold">➖ Add Expense</h3>
          <button @click="showAddExpense = false" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Date</label>
              <input type="date" v-model="newExpense.date"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Category</label>
              <select v-model="newExpense.category" class="w-full px-4 py-2 border rounded-lg">
                <option value="salary">Salary</option>
                <option value="electricity">Electricity</option>
                <option value="internet">Internet</option>
                <option value="repairs">Repairs</option>
                <option value="printing">Printing</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Amount</label>
              <input type="number" v-model="newExpense.amount" placeholder="Enter amount"
                     class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Payment Mode</label>
              <select v-model="newExpense.paymentMode" class="w-full px-4 py-2 border rounded-lg">
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Description</label>
            <textarea v-model="newExpense.description" placeholder="Description"
                      class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Receipt Upload (Optional)</label>
            <input type="file" @change="handleReceiptUpload"
                   class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="flex gap-3">
            <button @click="saveExpense" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              💾 Save Expense
            </button>
            <button @click="showAddExpense = false" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
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

// Types
interface FeeComponent {
  name: string
  amount: number
  type: string
}

interface FeeStructure {
  id: number
  name: string
  class: string
  academicYear: string
  components: FeeComponent[]
  totalAmount: number
}

interface Student {
  id: number
  name: string
  class: string
  rollNumber: string
  monthlyFee?: number
  transportFee?: number
  lateFee?: number
  discount?: number
  previousDues?: number
}

// Active tab
const activeTab = ref('structure')

// Tabs
const tabs = [
  { id: 'structure', label: '💰 Fee Structure' },
  { id: 'vouchers', label: '🧾 Vouchers' },
  { id: 'collection', label: '💵 Collection' },
  { id: 'discounts', label: '🎯 Discounts' },
  { id: 'fines', label: '⚠️ Fines' },
  { id: 'reminders', label: '📱 Reminders' },
  { id: 'cashbook', label: '💰 Cashbook' },
  { id: 'salary', label: '💼 Salary' },
  { id: 'reports', label: '📊 Reports' }
]

// Financial Overview
const totalCollected = ref(450000)
const totalPending = ref(125000)
const collectionRate = computed(() => Math.round((totalCollected.value / (totalCollected.value + totalPending.value)) * 100))
const totalDiscounts = ref(35000)

// Classes
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

// Months
const months = [
  { value: 'jan', label: 'January' },
  { value: 'feb', label: 'February' },
  { value: 'mar', label: 'March' },
  { value: 'apr', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'jun', label: 'June' },
  { value: 'jul', label: 'July' },
  { value: 'aug', label: 'August' },
  { value: 'sep', label: 'September' },
  { value: 'oct', label: 'October' },
  { value: 'nov', label: 'November' },
  { value: 'dec', label: 'December' }
]

// Fee Structures
const feeStructures = ref([
  {
    id: 1,
    name: 'Class 10 - Science Stream',
    class: 'Class 10',
    academicYear: '2024-2025',
    components: [
      { name: 'Monthly Tuition', amount: 5000, type: 'monthly' },
      { name: 'Lab Fee', amount: 1500, type: 'monthly' },
      { name: 'Computer Fee', amount: 1000, type: 'monthly' },
      { name: 'Transport Fee', amount: 2000, type: 'monthly' }
    ],
    totalAmount: 9500
  },
  {
    id: 2,
    name: 'Class 5 - General',
    class: 'Class 5',
    academicYear: '2024-2025',
    components: [
      { name: 'Monthly Tuition', amount: 3000, type: 'monthly' },
      { name: 'Activity Fee', amount: 500, type: 'monthly' },
      { name: 'Transport Fee', amount: 1500, type: 'monthly' }
    ],
    totalAmount: 5000
  }
])

// Fee Structure Modal
const showCreateFeeStructure = ref(false)
const newFeeStructure = ref({
  name: '',
  academicYear: '',
  class: '',
  section: '',
  components: [
    { name: '', amount: 0, type: 'monthly' }
  ]
})

const addComponent = () => {
  newFeeStructure.value.components.push({ name: '', amount: 0, type: 'monthly' })
}

const removeComponent = (index: number) => {
  newFeeStructure.value.components.splice(index, 1)
}

const saveFeeStructure = () => {
  console.log('Saving fee structure:', newFeeStructure.value)
  showCreateFeeStructure.value = false
}

const editStructure = (structure: FeeStructure) => {
  console.log('Editing structure:', structure)
}

const applyToStudents = (structure: FeeStructure) => {
  console.log('Applying structure to students:', structure)
}

// Vouchers
const voucherFilters = ref({
  class: '',
  month: '',
  status: ''
})

const selectedVouchers = ref<number[]>([])

const filteredVouchers = computed(() => {
  return [
    { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', class: 'Class 10', amount: 9500, dueDate: '2024-12-05', status: 'generated' },
    { id: 2, studentName: 'Fatima Khan', rollNumber: 'STD002', class: 'Class 10', amount: 9500, dueDate: '2024-12-05', status: 'sent' },
    { id: 3, studentName: 'Hassan Raza', rollNumber: 'STD003', class: 'Class 5', amount: 5000, dueDate: '2024-12-05', status: 'paid' }
  ]
})

const toggleAllVouchers = () => {
  if (selectedVouchers.value.length === filteredVouchers.value.length) {
    selectedVouchers.value = []
  } else {
    selectedVouchers.value = filteredVouchers.value.map(v => v.id)
  }
}

const bulkGenerateVouchers = () => {
  console.log('Bulk generating vouchers')
}

const emailAllVouchers = () => {
  console.log('Emailing all vouchers')
}

const printVoucher = (voucher: Record<string, unknown>) => {
  console.log('Printing voucher:', voucher)
}

const emailVoucher = (voucher: Record<string, unknown>) => {
  console.log('Emailing voucher:', voucher)
}

const viewVoucher = (voucher: Record<string, unknown>) => {
  console.log('Viewing voucher:', voucher)
}

const getVoucherStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    generated: 'bg-blue-100 text-blue-700',
    sent: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Fee Collection
const studentSearch = ref('')
const searchResults = ref<Student[]>([])
const selectedStudentForPayment = ref<Student | null>(null)
const paymentMethod = ref('cash')
const paymentAmount = ref(0)
const receiptNumber = ref('RCP-' + Date.now())
const chequeNumber = ref('')
const transactionId = ref('')

const searchStudent = () => {
  // Simulate search
  if (studentSearch.value.length > 2) {
    searchResults.value = [
      { id: 1, name: 'Ahmed Ali', class: 'Class 10', rollNumber: 'STD001' },
      { id: 2, name: 'Fatima Khan', class: 'Class 10', rollNumber: 'STD002' }
    ]
  } else {
    searchResults.value = []
  }
}

const selectStudent = (student: Student) => {
  selectedStudentForPayment.value = {
    ...student,
    monthlyFee: 5000,
    transportFee: 1500,
    lateFee: 200,
    discount: 500,
    previousDues: 0
  }
  studentSearch.value = student.name
  searchResults.value = []
}

const calculateTotal = () => {
  if (!selectedStudentForPayment.value) return 0
  const s = selectedStudentForPayment.value
  return (s.monthlyFee || 0) + (s.transportFee || 0) + (s.lateFee || 0) - (s.discount || 0) + (s.previousDues || 0)
}

const processPayment = () => {
  console.log('Processing payment:', {
    student: selectedStudentForPayment.value,
    method: paymentMethod.value,
    amount: paymentAmount.value
  })
}

const todayCollection = ref({
  cash: 45000,
  bank: 25000,
  online: 15000,
  total: 85000
})

// Discounts
const showAddDiscount = ref(false)
const discountCategories = [
  { id: 1, name: 'Kinship', description: 'Sibling discount', icon: '👨‍👩‍👧‍👦', percentage: 10, studentsCount: 45 },
  { id: 2, name: 'Staff Child', description: 'Staff children', icon: '👨‍🏫', percentage: 50, studentsCount: 12 },
  { id: 3, name: 'Need-based', description: 'Financial need', icon: '🤝', percentage: 25, studentsCount: 28 },
  { id: 4, name: 'Merit-based', description: 'Academic merit', icon: '🏆', percentage: 20, studentsCount: 15 }
]

const studentDiscounts = ref([
  { id: 1, studentName: 'Ali Hassan', rollNumber: 'STD010', class: 'Class 8', type: 'Kinship', percentage: 10, amount: 500, status: 'approved' },
  { id: 2, studentName: 'Sara Ahmed', rollNumber: 'STD025', class: 'Class 6', type: 'Staff Child', percentage: 50, amount: 2500, status: 'approved' },
  { id: 3, studentName: 'Usman Khan', rollNumber: 'STD042', class: 'Class 9', type: 'Need-based', percentage: 25, amount: 1250, status: 'pending' }
])

const newDiscount = ref({
  studentSearch: '',
  type: '',
  percentage: 0,
  duration: 'permanent',
  reason: ''
})

const saveDiscount = () => {
  console.log('Saving discount:', newDiscount.value)
  showAddDiscount.value = false
}

const approveDiscount = (discount: Record<string, unknown>) => {
  console.log('Approving discount:', discount)
}

const editDiscount = (discount: Record<string, unknown>) => {
  console.log('Editing discount:', discount)
}

const getDiscountStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Fines
const showAddFine = ref(false)
const totalLateFee = ref(15000)
const totalLibraryFine = ref(3500)
const totalOtherFines = ref(2000)

const finesList = ref([
  { id: 1, studentName: 'Ahmed Ali', rollNumber: 'STD001', class: 'Class 10', type: 'Late Fee', amount: 200, reason: 'Fee paid after due date', date: '2024-11-25', status: 'unpaid' },
  { id: 2, studentName: 'Hassan Raza', rollNumber: 'STD003', class: 'Class 5', type: 'Library Fine', amount: 150, reason: 'Book returned late', date: '2024-11-20', status: 'paid' }
])

const newFine = ref({
  studentSearch: '',
  type: '',
  amount: 0,
  date: '',
  reason: ''
})

const saveFine = () => {
  console.log('Saving fine:', newFine.value)
  showAddFine.value = false
}

const waiveFine = (fine: Record<string, unknown>) => {
  console.log('Waiving fine:', fine)
}

const editFine = (fine: Record<string, unknown>) => {
  console.log('Editing fine:', fine)
}

const getFineStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-red-100 text-red-700',
    waived: 'bg-blue-100 text-blue-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Reminders
const overdueStudents = ref([
  { id: 1, name: 'Ahmed Ali', class: 'Class 10', rollNumber: 'STD001', parentPhone: '0300-1234567', dueAmount: 9500, daysOverdue: 45 },
  { id: 2, name: 'Hassan Raza', class: 'Class 5', rollNumber: 'STD003', parentPhone: '0321-9876543', dueAmount: 5000, daysOverdue: 35 }
])

const dueSoonStudents = ref([
  { id: 3, name: 'Fatima Khan', class: 'Class 10', rollNumber: 'STD002', parentPhone: '0333-5555555', dueAmount: 9500, daysOverdue: 10 }
])

const dueStudents = computed(() => [...overdueStudents.value, ...dueSoonStudents.value])
const remindersSent = ref(125)

const sendBulkReminders = () => {
  console.log('Sending bulk reminders')
}

const sendEmailReminders = () => {
  console.log('Sending email reminders')
}

const sendSMSReminder = (student: Record<string, unknown>) => {
  console.log('Sending SMS to:', student)
}

const callParent = (student: Record<string, unknown>) => {
  console.log('Calling parent:', student)
}

const markFollowUp = (student: Record<string, unknown>) => {
  console.log('Marking follow-up:', student)
}

const getDueBorderColor = (days: number) => {
  if (days > 30) return 'border-red-500'
  if (days > 5) return 'border-yellow-500'
  return 'border-green-500'
}

// Cashbook
const showAddIncome = ref(false)
const showAddExpense = ref(false)
const totalIncome = ref(450000)
const totalExpense = ref(320000)
const bankBalance = ref(850000)

const cashbookEntries = ref([
  { id: 1, date: '2024-11-20', type: 'income', category: 'Fee Collection', description: 'Monthly fee collection', amount: 85000, balance: 850000 },
  { id: 2, date: '2024-11-19', type: 'expense', category: 'Salary', description: 'Staff salaries', amount: 150000, balance: 765000 },
  { id: 3, date: '2024-11-18', type: 'expense', category: 'Electricity', description: 'Monthly electricity bill', amount: 25000, balance: 915000 }
])

const newIncome = ref({
  date: '',
  category: '',
  amount: 0,
  paymentMode: 'cash',
  description: ''
})

const newExpense = ref({
  date: '',
  category: '',
  amount: 0,
  paymentMode: 'cash',
  description: ''
})

const saveIncome = () => {
  console.log('Saving income:', newIncome.value)
  showAddIncome.value = false
}

const saveExpense = () => {
  console.log('Saving expense:', newExpense.value)
  showAddExpense.value = false
}

const handleReceiptUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  console.log('Receipt uploaded:', target.files?.[0])
}

const viewReceipt = (entry: Record<string, unknown>) => {
  console.log('Viewing receipt:', entry)
}

const editEntry = (entry: Record<string, unknown>) => {
  console.log('Editing entry:', entry)
}

// Salary
const totalStaff = ref(45)
const totalSalary = ref(675000)
const paidSalary = ref(450000)
const pendingSalary = ref(225000)
const paidStaffCount = ref(30)
const pendingStaffCount = ref(15)

const salaryList = ref([
  { id: 1, name: 'Mr. Ahmed Khan', employeeId: 'EMP001', designation: 'Principal', basicPay: 50000, allowances: 10000, deductions: 2000, netSalary: 58000, status: 'paid' },
  { id: 2, name: 'Ms. Fatima Ali', employeeId: 'EMP002', designation: 'Senior Teacher', basicPay: 35000, allowances: 5000, deductions: 1000, netSalary: 39000, status: 'pending' },
  { id: 3, name: 'Mr. Hassan Raza', employeeId: 'EMP003', designation: 'Teacher', basicPay: 25000, allowances: 3000, deductions: 500, netSalary: 27500, status: 'paid' }
])

const generateSalarySlips = () => {
  console.log('Generating salary slips')
}

const processSalaries = () => {
  console.log('Processing salaries')
}

const viewSalarySlip = (staff: Record<string, unknown>) => {
  console.log('Viewing salary slip:', staff)
}

const paySalary = (staff: Record<string, unknown>) => {
  console.log('Paying salary:', staff)
}

const getSalaryStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Reports
const monthlyCollection = ref([
  { month: 'Jan', collected: 420, pending: 80, collectedPercent: 84, pendingPercent: 16, percentage: 84 },
  { month: 'Feb', collected: 450, pending: 50, collectedPercent: 90, pendingPercent: 10, percentage: 90 },
  { month: 'Mar', collected: 380, pending: 120, collectedPercent: 76, pendingPercent: 24, percentage: 76 },
  { month: 'Apr', collected: 460, pending: 40, collectedPercent: 92, pendingPercent: 8, percentage: 92 }
])

const classWiseCollection = ref([
  { class: 'Class 10', students: 45, collected: 380000, pending: 47500, percentage: 89 },
  { class: 'Class 9', students: 50, collected: 400000, pending: 50000, percentage: 89 },
  { class: 'Class 8', students: 48, collected: 360000, pending: 72000, percentage: 83 },
  { class: 'Class 7', students: 52, collected: 390000, pending: 65000, percentage: 86 }
])

const generateReport = (type: string) => {
  console.log('Generating report:', type)
}

const getCollectionPercentageColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 75) return 'text-yellow-600'
  return 'text-red-600'
}

onMounted(() => {
  console.log('Fee & Finance Management loaded')
})
</script>
