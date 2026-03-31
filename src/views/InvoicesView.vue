<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-white font-bold text-2xl flex items-center gap-2">
                <component :is="DocumentTextIcon" class="w-7 h-7" />
                Invoice History
              </h2>
              <p class="text-purple-100 mt-1">View and manage all transactions</p>
            </div>
            <div class="bg-white/20 rounded-lg px-4 py-2 text-center backdrop-blur-sm">
              <p class="text-white text-sm">Total Invoices</p>
              <p class="text-white font-bold text-2xl">{{ invoices.length }}</p>
            </div>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="p-4 border-b bg-gray-50">
          <div class="flex gap-4 flex-wrap">
            <div class="flex-1 min-w-[200px]">
              <div class="relative">
                <component :is="MagnifyingGlassIcon" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Search by product name or receipt #..." 
                  class="input pl-10"
                />
              </div>
            </div>
            <div>
              <select v-model="dateFilter" class="input">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <select v-model="statusFilter" class="input">
                <option value="all">All Status</option>
                <option value="exact">Paid in Full</option>
                <option value="overpaid">Overpaid</option>
                <option value="underpaid">Balance Due</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Invoices Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="p-4 text-left text-sm font-semibold text-gray-600">Receipt #</th>
                <th class="p-4 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                <th class="p-4 text-center text-sm font-semibold text-gray-600">Items</th>
                <th class="p-4 text-right text-sm font-semibold text-gray-600">Total</th>
                <th class="p-4 text-right text-sm font-semibold text-gray-600">Received</th>
                <th class="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
                <th class="p-4 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="border-b hover:bg-gray-50 transition">
                <td class="p-4">
                  <span class="font-mono text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                    #{{ invoice.id.slice(-8) }}
                  </span>
                </td>
                <td class="p-4 text-sm text-gray-600">{{ formatDateTime(invoice.date) }}</td>
                <td class="p-4 text-center text-sm">{{ invoice.items.length }} items</td>
                <td class="p-4 text-right font-bold text-blue-600">${{ invoice.total.toFixed(2) }}</td>
                <td class="p-4 text-right text-sm text-gray-600">
                  ${{ (invoice.amountReceived || invoice.paid || 0).toFixed(2) }}
                </td>
                <td class="p-4 text-center">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(invoice)">
                    <div 
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getStatusDotClass(invoice)">
                    </div>
                    {{ getStatusText(invoice) }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <button 
                    @click="viewInvoice(invoice)" 
                    class="btn-view flex items-center gap-1 mx-auto">
                    <component :is="EyeIcon" class="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="filteredInvoices.length === 0">
                <td colspan="7" class="p-12 text-center">
                  <component :is="DocumentTextIcon" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-400 text-lg">No invoices found</p>
                  <p class="text-sm text-gray-400">Start selling to see invoices here</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Invoice Modal -->
    <InvoiceModal 
      :show="showModal" 
      :invoice="selectedInvoice"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import { usePOSStore } from '../stores/posStore'
import { mapState } from 'pinia'
import InvoiceModal from '../components/InvoiceModal.vue'
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'InvoicesView',
  components: { InvoiceModal, DocumentTextIcon, MagnifyingGlassIcon, EyeIcon },
  data() {
    return {
      searchQuery: '',
      dateFilter: 'all',
      statusFilter: 'all',
      showModal: false,
      selectedInvoice: null
    }
  },
  computed: {
    ...mapState(usePOSStore, ['invoices']),
    
    filteredInvoices() {
      let filtered = [...this.invoices]
      
      // Date filter
      const now = new Date()
      if (this.dateFilter === 'today') {
        filtered = filtered.filter(inv => {
          const invDate = new Date(inv.date)
          return invDate.toDateString() === now.toDateString()
        })
      } else if (this.dateFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        filtered = filtered.filter(inv => new Date(inv.date) >= weekAgo)
      } else if (this.dateFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        filtered = filtered.filter(inv => new Date(inv.date) >= monthAgo)
      }
      
      // Status filter
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(inv => {
          const amountReceived = inv.amountReceived || inv.paid || 0
          if (this.statusFilter === 'exact') return amountReceived === inv.total
          if (this.statusFilter === 'overpaid') return amountReceived > inv.total
          if (this.statusFilter === 'underpaid') return amountReceived < inv.total
          return true
        })
      }
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(inv => 
          inv.id.toLowerCase().includes(query) ||
          inv.items.some(item => item.description.toLowerCase().includes(query))
        )
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  methods: {
    formatDateTime(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusText(invoice) {
      const amountReceived = invoice.amountReceived || invoice.paid || 0
      if (amountReceived > invoice.total) return 'Overpaid'
      if (amountReceived < invoice.total) return 'Balance Due'
      return 'Paid in Full'
    },
    
    getStatusClass(invoice) {
      const amountReceived = invoice.amountReceived || invoice.paid || 0
      if (amountReceived > invoice.total) return 'bg-green-100 text-green-700'
      if (amountReceived < invoice.total) return 'bg-red-100 text-red-700'
      return 'bg-blue-100 text-blue-700'
    },
    
    getStatusDotClass(invoice) {
      const amountReceived = invoice.amountReceived || invoice.paid || 0
      if (amountReceived > invoice.total) return 'bg-green-500'
      if (amountReceived < invoice.total) return 'bg-red-500'
      return 'bg-blue-500'
    },
    
    viewInvoice(invoice) {
      this.selectedInvoice = invoice
      this.showModal = true
    }
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition;
}

.btn-view {
  @apply bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition px-3 py-1.5 text-sm font-medium;
}
</style>