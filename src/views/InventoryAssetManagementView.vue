<template>
  <div class="bg-gray-100 min-h-screen">
    <Navbar page-title="Inventory & Asset Management - Advanced System" />
    
    <div class="p-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div class="flex gap-3 flex-wrap">
          <button @click="showAddAsset = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg">
            ➕ Add Asset
          </button>
          <button @click="showIssueAsset = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            📤 Issue Asset
          </button>
          <button @click="showReturnAsset = true" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            📥 Return Asset
          </button>
          <button @click="showPurchaseRequest = true" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            🛒 Purchase Request
          </button>
          <button @click="showMaintenanceSchedule = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            🔧 Schedule Maintenance
          </button>
          <button @click="activeTab = 'reports'" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            📊 Reports
          </button>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📦</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalAssets }}</h3>
          <p class="text-xs opacity-80">Total Assets</p>
        </div>
        <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">✅</span>
          <h3 class="text-2xl font-bold mt-2">{{ availableAssets }}</h3>
          <p class="text-xs opacity-80">Available</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">📤</span>
          <h3 class="text-2xl font-bold mt-2">{{ issuedAssets }}</h3>
          <p class="text-xs opacity-80">Issued</p>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">⚠️</span>
          <h3 class="text-2xl font-bold mt-2">{{ lowStockItems }}</h3>
          <p class="text-xs opacity-80">Low Stock</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">🔧</span>
          <h3 class="text-2xl font-bold mt-2">{{ maintenanceDue }}</h3>
          <p class="text-xs opacity-80">Maintenance Due</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
          <span class="text-3xl">💰</span>
          <h3 class="text-2xl font-bold mt-2">{{ totalValue }}</h3>
          <p class="text-xs opacity-80">Total Value (RS)</p>
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

      <!-- 1. Asset Categories Tab -->
      <div v-if="activeTab === 'categories'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">📂 Asset Categories</h3>
          <button @click="showAddCategory = true" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg">
            ➕ Add Category
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="category in assetCategories" :key="category.id"
               class="p-4 border-2 rounded-lg hover:shadow-lg transition relative group"
               :class="selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
            <button @click.stop="handleDeleteCategory(category.id)" 
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    title="Delete Category">
              🗑️
            </button>
            <div @click="filterByCategory(category.id)" class="text-center cursor-pointer">
              <span class="text-4xl block mb-2">{{ category.icon }}</span>
              <p class="font-bold">{{ category.name }}</p>
              <p class="text-2xl font-bold text-blue-600 mt-2">{{ category.count }}</p>
              <p class="text-xs text-gray-600">Total Items</p>
              <div class="mt-2 text-xs">
                <span class="text-green-600">{{ category.available }} Available</span>
                <span class="mx-1">•</span>
                <span class="text-yellow-600">{{ category.issued }} Issued</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Asset Registry Tab -->
      <div v-if="activeTab === 'registry'" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">📋 Asset Registry</h3>
          <div class="flex gap-2">
            <input v-model="searchQuery" type="text" placeholder="Search assets..." 
                   class=" py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500">
            <button @click="scanBarcode" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              📷 Scan QR
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2 text-left">Asset ID</th>
                <th class="border p-2 text-left">Name</th>
                <th class="border p-2 text-left">Category</th>
                <th class="border p-2 text-left">Serial No</th>
                <th class="border p-2 text-center">Status</th>
                <th class="border p-2 text-center">Condition</th>
                <th class="border p-2 text-center">Value (RS)</th>
                <th class="border p-2 text-center">Warranty</th>
                <th class="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in filteredAssets" :key="asset.id" class="hover:bg-gray-50">
                <td class="border p-2 font-mono text-xs">{{ asset.assetId }}</td>
                <td class="border p-2 font-semibold">{{ asset.name }}</td>
                <td class="border p-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {{ asset.category }}
                  </span>
                </td>
                <td class="border p-2 font-mono text-xs">{{ asset.serialNo }}</td>
                <td class="border p-2 text-center">
                  <span :class="getStatusBadge(asset.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ asset.status }}
                  </span>
                </td>
                <td class="border p-2 text-center">
                  <span :class="getConditionBadge(asset.condition)" class="px-2 py-1 rounded-full text-xs">
                    {{ asset.condition }}
                  </span>
                </td>
                <td class="border p-2 text-center font-bold">{{ asset.value }}</td>
                <td class="border p-2 text-center">
                  <span :class="asset.warrantyActive ? 'text-green-600' : 'text-red-600'" class="text-xs">
                    {{ asset.warrantyExpiry }}
                  </span>
                </td>
                <td class="border p-2 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewAssetDetails(asset)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs" title="View Details">
                      👁️
                    </button>
                    <button @click="editAsset(asset)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs" title="Edit">
                      ✏️
                    </button>
                    <button @click="printQR(asset)" class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs" title="Print QR">
                      📷
                    </button>
                    <button @click="handleDeleteAsset(asset.id)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. Issue/Return Management Tab -->
      <div v-if="activeTab === 'issue-return'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📤📥 Issue / Return Management</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Total Issued</p>
            <p class="text-3xl font-bold text-blue-600">{{ totalIssued }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-600">Overdue Returns</p>
            <p class="text-3xl font-bold text-yellow-600">{{ overdueReturns }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Returned Today</p>
            <p class="text-3xl font-bold text-green-600">{{ returnedToday }}</p>
          </div>
        </div>

        <!-- Issue History -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2 text-left">Asset</th>
                <th class="border p-2 text-left">Issued To</th>
                <th class="border p-2 text-left">Type</th>
                <th class="border p-2 text-center">Issue Date</th>
                <th class="border p-2 text-center">Return Date</th>
                <th class="border p-2 text-center">Status</th>
                <th class="border p-2 text-center">Condition</th>
                <th class="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in issueHistory" :key="issue.id" class="hover:bg-gray-50">
                <td class="border p-2 font-semibold">{{ issue.assetName }}</td>
                <td class="border p-2">{{ issue.issuedTo }}</td>
                <td class="border p-2">
                  <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {{ issue.type }}
                  </span>
                </td>
                <td class="border p-2 text-center">{{ issue.issueDate }}</td>
                <td class="border p-2 text-center">{{ issue.returnDate || 'Not Returned' }}</td>
                <td class="border p-2 text-center">
                  <span :class="getIssueStatusBadge(issue.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ issue.status }}
                  </span>
                </td>
                <td class="border p-2 text-center">{{ issue.returnCondition || '-' }}</td>
                <td class="border p-2 text-center">
                  <button v-if="issue.status === 'Issued'" @click="returnAsset(issue)" 
                          class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                    Return
                  </button>
                  <button v-else @click="viewIssueDetails(issue)" 
                          class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. Stock Management Tab -->
      <div v-if="activeTab === 'stock'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📊 Stock Management</h3>
        
        <!-- Low Stock Alerts -->
        <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <h4 class="font-bold text-red-700 mb-2">⚠️ Low Stock Alerts</h4>
          <div class="space-y-2">
            <div v-for="item in lowStockAlerts" :key="item.id" class="flex justify-between items-center">
              <span class="text-sm">{{ item.name }}</span>
              <span class="text-sm font-bold text-red-600">{{ item.current }}/{{ item.minimum }} ({{ item.unit }})</span>
            </div>
          </div>
        </div>

        <!-- Stock Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="stock in stockItems" :key="stock.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ stock.name }}</h4>
                <p class="text-sm text-gray-600">{{ stock.category }}</p>
              </div>
              <span :class="stock.current < stock.minimum ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                    class="px-2 py-1 rounded-full text-xs">
                {{ stock.current < stock.minimum ? 'Low Stock' : 'In Stock' }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-3">
              <div class="p-2 bg-blue-50 rounded text-center">
                <p class="text-xs text-gray-600">Current</p>
                <p class="font-bold text-blue-600">{{ stock.current }}</p>
              </div>
              <div class="p-2 bg-yellow-50 rounded text-center">
                <p class="text-xs text-gray-600">Minimum</p>
                <p class="font-bold text-yellow-600">{{ stock.minimum }}</p>
              </div>
              <div class="p-2 bg-green-50 rounded text-center">
                <p class="text-xs text-gray-600">Maximum</p>
                <p class="font-bold text-green-600">{{ stock.maximum }}</p>
              </div>
            </div>

            <div class="mb-3">
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div :class="stock.current < stock.minimum ? 'bg-red-500' : 'bg-green-500'"
                     class="h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     :style="`width: ${(stock.current / stock.maximum) * 100}%`">
                  {{ Math.round((stock.current / stock.maximum) * 100) }}%
                </div>
              </div>
            </div>

            <div v-if="stock.expiryDate" class="text-xs text-gray-600 mb-2">
              <span>⏰ Expiry: {{ stock.expiryDate }}</span>
            </div>

            <button @click="reorderStock(stock)" class="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              🛒 Re-order
            </button>
          </div>
        </div>
      </div>

      <!-- 5. Purchase & Procurement Tab -->
      <div v-if="activeTab === 'purchase'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🛒 Purchase & Procurement</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Pending Requests</p>
            <p class="text-3xl font-bold text-blue-600">{{ pendingRequests }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-600">Awaiting Approval</p>
            <p class="text-3xl font-bold text-yellow-600">{{ awaitingApproval }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Approved</p>
            <p class="text-3xl font-bold text-green-600">{{ approvedRequests }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">Total Vendors</p>
            <p class="text-3xl font-bold text-purple-600">{{ totalVendors }}</p>
          </div>
        </div>

        <!-- Purchase Requests -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2 text-left">Request ID</th>
                <th class="border p-2 text-left">Department</th>
                <th class="border p-2 text-left">Items</th>
                <th class="border p-2 text-center">Quantity</th>
                <th class="border p-2 text-center">Est. Cost</th>
                <th class="border p-2 text-center">Status</th>
                <th class="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in purchaseRequests" :key="request.id" class="hover:bg-gray-50">
                <td class="border p-2 font-mono text-xs">{{ request.requestId }}</td>
                <td class="border p-2 font-semibold">{{ request.department }}</td>
                <td class="border p-2">{{ request.items }}</td>
                <td class="border p-2 text-center">{{ request.quantity }}</td>
                <td class="border p-2 text-center font-bold">RS {{ request.estimatedCost }}</td>
                <td class="border p-2 text-center">
                  <span :class="getPurchaseStatusBadge(request.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ request.status }}
                  </span>
                </td>
                <td class="border p-2 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewRequest(request)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                      View
                    </button>
                    <button v-if="request.status === 'Pending'" @click="approveRequest(request)" 
                            class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 6. Maintenance Tab -->
      <div v-if="activeTab === 'maintenance'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🔧 Asset Maintenance</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <p class="text-sm text-gray-600">Due This Week</p>
            <p class="text-3xl font-bold text-red-600">{{ maintenanceDueWeek }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-600">In Progress</p>
            <p class="text-3xl font-bold text-yellow-600">{{ maintenanceInProgress }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Completed This Month</p>
            <p class="text-3xl font-bold text-green-600">{{ maintenanceCompleted }}</p>
          </div>
        </div>

        <!-- Maintenance Schedule -->
        <div class="space-y-4">
          <div v-for="maintenance in maintenanceSchedule" :key="maintenance.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ maintenance.assetName }}</h4>
                <p class="text-sm text-gray-600">{{ maintenance.type }}</p>
              </div>
              <span :class="getMaintenanceStatusBadge(maintenance.status)" class="px-2 py-1 rounded-full text-xs">
                {{ maintenance.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <p class="text-xs text-gray-600">Scheduled Date</p>
                <p class="font-semibold">{{ maintenance.scheduledDate }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Last Service</p>
                <p class="font-semibold">{{ maintenance.lastService }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Cost</p>
                <p class="font-semibold">RS {{ maintenance.cost }}</p>
              </div>
            </div>

            <div v-if="maintenance.vendor" class="text-sm text-gray-600 mb-3">
              <span>🏢 Vendor: {{ maintenance.vendor }}</span>
            </div>

            <div class="flex gap-2">
              <button @click="viewMaintenanceHistory(maintenance)" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                History
              </button>
              <button @click="updateMaintenance(maintenance)" class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Depreciation Tab -->
      <div v-if="activeTab === 'depreciation'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">💰 Depreciation & Financial Tracking</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Original Value</p>
            <p class="text-2xl font-bold text-blue-600">RS {{ originalValue }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Current Value</p>
            <p class="text-2xl font-bold text-green-600">RS {{ currentValue }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <p class="text-sm text-gray-600">Depreciation</p>
            <p class="text-2xl font-bold text-red-600">RS {{ depreciationAmount }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">Write-offs</p>
            <p class="text-2xl font-bold text-purple-600">{{ writeOffs }}</p>
          </div>
        </div>

        <!-- Depreciation Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2 text-left">Asset</th>
                <th class="border p-2 text-center">Purchase Date</th>
                <th class="border p-2 text-center">Original Value</th>
                <th class="border p-2 text-center">Age (Years)</th>
                <th class="border p-2 text-center">Depreciation Rate</th>
                <th class="border p-2 text-center">Current Value</th>
                <th class="border p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in depreciationData" :key="asset.id" class="hover:bg-gray-50">
                <td class="border p-2 font-semibold">{{ asset.name }}</td>
                <td class="border p-2 text-center">{{ asset.purchaseDate }}</td>
                <td class="border p-2 text-center font-bold">RS {{ asset.originalValue }}</td>
                <td class="border p-2 text-center">{{ asset.age }}</td>
                <td class="border p-2 text-center">{{ asset.depreciationRate }}%</td>
                <td class="border p-2 text-center font-bold text-green-600">RS {{ asset.currentValue }}</td>
                <td class="border p-2 text-center">
                  <span :class="asset.writeOff ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                        class="px-2 py-1 rounded-full text-xs">
                    {{ asset.writeOff ? 'Written Off' : 'Active' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 8. Department Allocation Tab -->
      <div v-if="activeTab === 'departments'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">🏢 Department-Wise Asset Allocation</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="dept in departments" :key="dept.id"
               class="border-2 rounded-lg p-4 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">{{ dept.name }}</h4>
                <p class="text-sm text-gray-600">{{ dept.head }}</p>
              </div>
              <span class="text-2xl">{{ dept.icon }}</span>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="p-2 bg-blue-50 rounded text-center">
                <p class="text-xs text-gray-600">Total Assets</p>
                <p class="font-bold text-blue-600">{{ dept.totalAssets }}</p>
              </div>
              <div class="p-2 bg-green-50 rounded text-center">
                <p class="text-xs text-gray-600">Value</p>
                <p class="font-bold text-green-600">{{ dept.value }}K</p>
              </div>
            </div>

            <button @click="viewDepartmentAssets(dept)" class="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              View Assets
            </button>
          </div>
        </div>
      </div>

      <!-- 9. Reports Tab -->
      <div v-if="activeTab === 'reports'" class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">📊 Reports & Analytics</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button v-for="report in reportTypes" :key="report.id"
                  @click="generateReport(report.id)"
                  class="p-4 border-2 rounded-lg hover:shadow-lg transition text-left">
            <span class="text-3xl block mb-2">{{ report.icon }}</span>
            <p class="font-bold">{{ report.name }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ report.description }}</p>
          </button>
        </div>

        <!-- AI Insights -->
        <div class="p-4 bg-purple-50 border-l-4 border-purple-500 rounded mb-6">
          <p class="font-semibold text-purple-700 mb-2">🤖 AI-Powered Insights</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Asset utilization rate: 78% (Good)</li>
            <li>• Predicted maintenance cost next quarter: RS 45,000</li>
            <li>• Recommended: Replace 5 outdated computers</li>
            <li>• Optimal reorder time for lab chemicals: Next week</li>
          </ul>
        </div>

        <!-- RFID & IoT Future Features -->
        <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="font-semibold text-blue-700 mb-2">🔮 Smart Monitoring (Coming Soon)</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• RFID tracking for automatic asset movement detection</li>
            <li>• IoT-based asset usage monitoring</li>
            <li>• AI-based asset lifetime prediction</li>
            <li>• Automated inventory counting via mobile scanning</li>
            <li>• Asset health detection using sensors</li>
          </ul>
        </div>
      </div>
    </div>
      <!-- Modals -->
      <!-- Add Asset Modal -->
      <div v-if="showAddAsset" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-2xl">
          <h3 class="text-xl font-bold mb-4">Add New Asset</h3>
          <form @submit.prevent="handleAddAsset" class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Asset Name</label>
              <input v-model="newAsset.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Asset ID</label>
              <input v-model="newAsset.assetId" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select v-model="newAsset.category" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option v-for="cat in assetCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Serial No</label>
              <input v-model="newAsset.serialNo" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Value (RS)</label>
              <input v-model="newAsset.value" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input v-model="newAsset.purchaseDate" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Condition</label>
              <select v-model="newAsset.condition" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
            <div class="col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" @click="showAddAsset = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Asset</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Issue Asset Modal -->
      <div v-if="showIssueAsset" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Issue Asset</h3>
          <form @submit.prevent="handleIssueAsset" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Asset ID</label>
              <input v-model="newIssue.assetId" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Issued To (Name)</label>
              <input v-model="newIssue.issuedTo" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <select v-model="newIssue.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option>Teacher</option>
                <option>Student</option>
                <option>Department</option>
                <option>Staff</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Due Date</label>
              <input v-model="newIssue.dueDate" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="showIssueAsset = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Issue</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Return Asset Modal -->
      <div v-if="showReturnAsset" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Return Asset</h3>
          <form @submit.prevent="handleReturnAsset" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Return Date</label>
              <input v-model="returnData.returnDate" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Condition</label>
              <select v-model="returnData.condition" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>Damaged</option>
              </select>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="showReturnAsset = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Return</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Category Modal -->
      <div v-if="showAddCategory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Add New Category</h3>
          <form @submit.prevent="handleAddCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Category Name</label>
              <input v-model="newCategory.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="e.g., IT Equipment">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Icon (Emoji)</label>
              <input v-model="newCategory.icon" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="e.g., 💻">
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="showAddCategory = false" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Category</button>
            </div>
          </form>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/stores/inventory'
import Navbar from '@/components/Navbar.vue'
import type { Asset, AssetIssue, StockItem, PurchaseRequest, MaintenanceRecord } from '@/types'

const inventoryStore = useInventoryStore()
const { 
  assets, 
  categories: assetCategories, 
  issues: issueHistory, 
  stockItems, 
  purchaseRequests, 
  maintenanceRecords: maintenanceSchedule, 
  departments,
  totalAssets,
  availableAssets,
  issuedAssets,
  maintenanceDue,
  totalValue,
  lowStockAssets,
  depreciationData
} = storeToRefs(inventoryStore)

const activeTab = ref('categories')
const selectedCategory = ref<string | number>('all')
const searchQuery = ref('')

const tabs = [
  { id: 'categories', label: '📂 Categories' },
  { id: 'registry', label: '📋 Registry' },
  { id: 'issue-return', label: '📤📥 Issue/Return' },
  { id: 'stock', label: '📊 Stock' },
  { id: 'purchase', label: '🛒 Purchase' },
  { id: 'maintenance', label: '🔧 Maintenance' },
  { id: 'depreciation', label: '💰 Depreciation' },
  { id: 'departments', label: '🏢 Departments' },
  { id: 'reports', label: '📊 Reports' }
]

// Modal States
const showAddAsset = ref(false)
const showIssueAsset = ref(false)
const showReturnAsset = ref(false)
const showPurchaseRequest = ref(false)
const showMaintenanceSchedule = ref(false)
const showAddCategory = ref(false)

// Forms Data
const newCategory = ref<any>({
  name: '',
  icon: '',
  count: 0,
  available: 0,
  issued: 0
})
const newAsset = ref<any>({
  name: '',
  category: '',
  assetId: '',
  serialNo: '',
  value: 0,
  originalValue: 0,
  purchaseDate: '',
  status: 'Available',
  condition: 'Good',
  location: '',
  warrantyActive: false,
  warrantyExpiry: ''
})

const newIssue = ref<any>({
  assetId: '',
  issuedTo: '',
  type: 'Teacher',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: ''
})

const returnData = ref<any>({
  issueId: '',
  returnDate: new Date().toISOString().split('T')[0],
  condition: 'Good'
})

// Computed
const filteredAssets = computed(() => {
  let filtered = assets.value
  if (selectedCategory.value !== 'all') {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    if (category) {
      filtered = filtered.filter(a => a.category === category.name)
    }
  }
  if (searchQuery.value) {
    filtered = filtered.filter(a => 
      a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.assetId.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return filtered
})

const lowStockAlerts = computed(() => lowStockAssets.value)

const pendingRequests = computed(() => purchaseRequests.value.filter(r => r.status === 'Pending').length)
const awaitingApproval = computed(() => purchaseRequests.value.filter(r => r.status === 'Pending').length) // Same for now
const approvedRequests = computed(() => purchaseRequests.value.filter(r => r.status === 'Approved').length)
const totalVendors = ref(25) // Placeholder or fetch from vendors collection if exists

const maintenanceDueWeek = computed(() => maintenanceSchedule.value.filter(m => m.status === 'Scheduled').length)
const maintenanceInProgress = computed(() => maintenanceSchedule.value.filter(m => m.status === 'In Progress').length)
const maintenanceCompleted = computed(() => maintenanceSchedule.value.filter(m => m.status === 'Completed').length)

const originalValueTotal = computed(() => assets.value.reduce((sum, a) => sum + (a.originalValue || 0), 0))
const currentValueTotal = computed(() => assets.value.reduce((sum, a) => sum + (a.value || 0), 0))
const depreciationAmountTotal = computed(() => originalValueTotal.value - currentValueTotal.value)
const writeOffs = computed(() => assets.value.filter(a => a.writeOff).length)

const reportTypes = ref([
  { id: 1, name: 'Full Asset List', icon: '📋', description: 'Complete inventory report' },
  { id: 2, name: 'Damaged Assets', icon: '⚠️', description: 'Assets needing repair' },
  { id: 3, name: 'Monthly Purchase', icon: '🛒', description: 'Purchase summary' },
  { id: 4, name: 'Department Usage', icon: '🏢', description: 'Usage analytics' },
  { id: 5, name: 'Stock Consumption', icon: '📊', description: 'Consumption trends' },
  { id: 6, name: 'Depreciation Report', icon: '💰', description: 'Annual depreciation' }
])

// Lifecycle
onMounted(() => {
  inventoryStore.initialize()
})

onUnmounted(() => {
  inventoryStore.cleanup()
})

// Helper Functions
function getStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'Available': 'bg-green-100 text-green-700',
    'Issued': 'bg-yellow-100 text-yellow-700',
    'Maintenance': 'bg-red-100 text-red-700',
    'Damaged': 'bg-red-100 text-red-700',
    'In Use': 'bg-blue-100 text-blue-700',
    'Disposed': 'bg-gray-100 text-gray-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getConditionBadge(condition: string) {
  const badges: Record<string, string> = {
    'Excellent': 'bg-green-100 text-green-700',
    'Good': 'bg-blue-100 text-blue-700',
    'Fair': 'bg-yellow-100 text-yellow-700',
    'Poor': 'bg-red-100 text-red-700',
    'Damaged': 'bg-red-100 text-red-700'
  }
  return badges[condition] || 'bg-gray-100 text-gray-700'
}

function getIssueStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'Issued': 'bg-yellow-100 text-yellow-700',
    'Returned': 'bg-green-100 text-green-700',
    'Overdue': 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getPurchaseStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

function getMaintenanceStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'Scheduled': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

// Action Functions
function filterByCategory(categoryId: number | string) {
  selectedCategory.value = categoryId
}

async function handleAddAsset() {
  try {
    await inventoryStore.addAsset(newAsset.value)
    showAddAsset.value = false
    // Reset form
    newAsset.value = {
      name: '',
      category: '',
      assetId: '',
      serialNo: '',
      value: 0,
      originalValue: 0,
      purchaseDate: '',
      status: 'Available',
      condition: 'Good',
      location: '',
      warrantyActive: false,
      warrantyExpiry: ''
    }
  } catch (err) {
    alert('Failed to add asset')
  }
}

async function handleIssueAsset() {
  try {
    const asset = assets.value.find(a => a.assetId === newIssue.value.assetId)
    if (!asset) {
      alert('Asset not found')
      return
    }
    if (asset.status !== 'Available') {
      alert('Asset is not available')
      return
    }
    
    await inventoryStore.issueAsset({
      ...newIssue.value,
      assetName: asset.name,
      status: 'Issued'
    })
    showIssueAsset.value = false
    newIssue.value = {
      assetId: '',
      issuedTo: '',
      type: 'Teacher',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: ''
    }
  } catch (err) {
    alert('Failed to issue asset')
  }
}

async function handleReturnAsset() {
  try {
    await inventoryStore.returnAsset(returnData.value.issueId, returnData.value.returnDate, returnData.value.condition)
    showReturnAsset.value = false
    returnData.value = {
      issueId: '',
      returnDate: new Date().toISOString().split('T')[0],
      condition: 'Good'
    }
  } catch (err) {
    alert('Failed to return asset')
  }
}

async function handleAddCategory() {
  try {
    await inventoryStore.addCategory(newCategory.value)
    showAddCategory.value = false
    // Reset form
    newCategory.value = {
      name: '',
      icon: '',
      count: 0,
      available: 0,
      issued: 0
    }
  } catch (err) {
    alert('Failed to add category')
  }
}

async function handleDeleteCategory(categoryId: string | number) {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    try {
      await inventoryStore.deleteCategory(categoryId.toString())
    } catch (err) {
      alert('Failed to delete category')
    }
  }
}

async function handleDeleteAsset(assetId: string | number) {
  if (confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
    try {
      await inventoryStore.deleteAsset(assetId.toString())
    } catch (err) {
      alert('Failed to delete asset')
    }
  }
}

function scanBarcode() {
  console.log('Scanning barcode...')
  alert('Barcode scanning feature coming soon!')
}

function viewAssetDetails(asset: any) {
  console.log('Viewing asset:', asset)
}

function editAsset(asset: any) {
  console.log('Editing asset:', asset)
}

function printQR(asset: any) {
  console.log('Printing QR code:', asset)
}

function returnAsset(issue: any) {
  returnData.value.issueId = issue.id
  showReturnAsset.value = true
}

function viewIssueDetails(issue: any) {
  console.log('Viewing issue:', issue)
}

function reorderStock(stock: any) {
  console.log('Reordering stock:', stock)
  alert(`Reorder request sent for ${stock.name}`)
}

function viewRequest(request: any) {
  console.log('Viewing request:', request)
}

async function approveRequest(request: any) {
  if (confirm('Are you sure you want to approve this request?')) {
    await inventoryStore.updatePurchaseRequest(request.id, { status: 'Approved' })
  }
}

function viewMaintenanceHistory(maintenance: any) {
  console.log('Viewing maintenance history:', maintenance)
}

function updateMaintenance(maintenance: any) {
  console.log('Updating maintenance:', maintenance)
}

function viewDepartmentAssets(dept: any) {
  console.log('Viewing department assets:', dept)
}

function generateReport(reportId: number) {
  console.log('Generating report:', reportId)
  alert('Report generation started...')
}
</script>
