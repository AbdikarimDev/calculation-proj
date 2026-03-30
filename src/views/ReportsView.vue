<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header with Date Range Picker -->
      <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <component :is="ChartBarIcon" class="w-8 h-8 text-purple-600" />
            Analytics & Reports
          </h2>
          <p class="text-gray-500 mt-1">Comprehensive sales insights and performance metrics</p>
        </div>
        
        <!-- Date Range Selector -->
        <div class="flex gap-2">
          <select v-model="reportPeriod" class="input-date">
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
          <button @click="exportReport" class="btn-export flex items-center gap-2">
            <component :is="ArrowDownTrayIcon" class="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>
      
      <!-- KPI Cards Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Revenue Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
              <component :is="CurrencyDollarIcon" class="w-6 h-6 text-green-600" />
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p class="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p class="text-3xl font-bold text-gray-800">${{ stats.totalRevenue.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-2">from {{ stats.totalTransactions }} transactions</p>
        </div>
        
        <!-- Total Transactions Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <component :is="DocumentTextIcon" class="w-6 h-6 text-blue-600" />
          </div>
          <p class="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.totalTransactions }}</p>
          <p class="text-xs text-gray-400 mt-2">Avg. ${{ stats.averageTransaction.toFixed(2) }} per sale</p>
        </div>
        
        <!-- Items Sold Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <component :is="ShoppingBagIcon" class="w-6 h-6 text-purple-600" />
          </div>
          <p class="text-sm text-gray-500 mb-1">Total Items Sold</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.totalItemsSold }}</p>
          <p class="text-xs text-gray-400 mt-2">units sold</p>
        </div>
        
        <!-- Total Discount Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <component :is="GiftIcon" class="w-6 h-6 text-orange-600" />
          </div>
          <p class="text-sm text-gray-500 mb-1">Total Discounts</p>
          <p class="text-3xl font-bold text-green-600">${{ stats.totalDiscount.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-2">savings given</p>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="grid lg:grid-cols-2 gap-6">
        
        <!-- Daily Sales Chart -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-semibold text-lg flex items-center gap-2">
                <component :is="ChartBarIcon" class="w-5 h-5 text-blue-600" />
                Daily Sales Trend
              </h3>
              <p class="text-xs text-gray-500 mt-1">Last {{ dailySales.length }} days performance</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">Peak: ${{ maxDailySale.toFixed(2) }}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="day in dailySales" :key="day.date" class="flex items-center gap-3 group">
              <span class="text-xs font-medium w-20 text-gray-600">{{ day.date }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden">
                <div 
                  class="h-10 rounded-full flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  :style="{ width: (day.total / maxDailySale * 100) + '%' }"
                  :class="day.total === maxDailySale ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'">
                  <span v-if="day.total > 0" class="text-white">${{ day.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Top Products Chart -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-semibold text-lg flex items-center gap-2">
                <component :is="FireIcon" class="w-5 h-5 text-orange-600" />
                Top Selling Products
              </h3>
              <p class="text-xs text-gray-500 mt-1">Best performing items</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">Top: {{ topProducts[0]?.quantity || 0 }} units</p>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="product in topProducts" :key="product.name" class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <component :is="PackageIcon" class="w-5 h-5 text-gray-600" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ product.name }}</span>
                  <span class="text-sm font-semibold text-blue-600">{{ product.quantity }} sold</span>
                </div>
                <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :style="{ width: (product.quantity / maxProductSales * 100) + '%' }"
                    :class="product.quantity === maxProductSales ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'">
                  </div>
                </div>
              </div>
            </div>
            <div v-if="topProducts.length === 0" class="text-center py-8 text-gray-400">
              <component :is="ChartBarIcon" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sales data yet</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional Stats Grid -->
      <div class="grid md:grid-cols-3 gap-6">
        
        <!-- Best Day Card -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <component :is="CalendarIcon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="font-semibold text-gray-700">Best Performing Day</h3>
          </div>
          <p class="text-2xl font-bold text-gray-800">{{ bestDay.date || 'No data' }}</p>
          <p class="text-sm text-blue-600 mt-2">${{ bestDay.total?.toFixed(2) || 0 }} in sales</p>
        </div>
        
        <!-- Average Order Value Card -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <component :is="CalculatorIcon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="font-semibold text-gray-700">Average Order Value</h3>
          </div>
          <p class="text-2xl font-bold text-gray-800">${{ stats.averageTransaction.toFixed(2) }}</p>
          <p class="text-sm text-green-600 mt-2">per transaction</p>
        </div>
        
        <!-- Conversion Rate Card -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <component :is="TrendingUpIcon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="font-semibold text-gray-700">Growth Rate</h3>
          </div>
          <p class="text-2xl font-bold text-gray-800">{{ growthRate }}%</p>
          <p class="text-sm text-purple-600 mt-2">vs previous period</p>
        </div>
      </div>
      
      <!-- Recent Transactions Table -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <component :is="ClockIcon" class="w-5 h-5 text-gray-600" />
            Recent Transactions
          </h3>
          <p class="text-xs text-gray-500 mt-1">Latest sales activity</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-4 text-left text-sm font-semibold text-gray-600">Receipt #</th>
                <th class="p-4 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                <th class="p-4 text-center text-sm font-semibold text-gray-600">Items</th>
                <th class="p-4 text-right text-sm font-semibold text-gray-600">Amount</th>
                <th class="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in recentTransactions" :key="invoice.id" class="border-t hover:bg-gray-50 transition">
                <td class="p-4">
                  <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    #{{ invoice.id.slice(-8) }}
                  </span>
                </td>
                <td class="p-4 text-sm text-gray-600">{{ formatDateTime(invoice.date) }}</td>
                <td class="p-4 text-center text-sm">{{ invoice.items.length }} items</td>
                <td class="p-4 text-right font-bold text-blue-600">${{ invoice.total.toFixed(2) }}</td>
                <td class="p-4 text-center">
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Completed
                  </span>
                </td>
              </tr>
              <tr v-if="recentTransactions.length === 0">
                <td colspan="5" class="p-12 text-center">
                  <component :is="DocumentTextIcon" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-400">No transactions yet</p>
                  <p class="text-sm text-gray-400">Start selling to see data here</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { usePOSStore } from '../stores/posStore'
import { mapState } from 'pinia'

// Import Heroicons
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  GiftIcon,
  FireIcon,
  PackageIcon,
  CalendarIcon,
  CalculatorIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ReportsView',
  components: {
    ChartBarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    GiftIcon,
    FireIcon,
    PackageIcon,
    CalendarIcon,
    CalculatorIcon,
    TrendingUpIcon,
    ClockIcon,
    ArrowDownTrayIcon
  },
  data() {
    return {
      reportPeriod: 'week',
      stats: {
        totalRevenue: 0,
        totalTransactions: 0,
        totalItemsSold: 0,
        totalDiscount: 0,
        averageTransaction: 0
      },
      dailySales: [],
      topProducts: [],
      recentTransactions: [],
      maxDailySale: 0,
      maxProductSales: 0,
      bestDay: { date: '', total: 0 },
      previousPeriodRevenue: 0
    }
  },
  computed: {
    ...mapState(usePOSStore, ['invoices', 'products']),
    
    growthRate() {
      if (this.previousPeriodRevenue === 0) return 0
      const growth = ((this.stats.totalRevenue - this.previousPeriodRevenue) / this.previousPeriodRevenue) * 100
      return growth.toFixed(1)
    }
  },
  mounted() {
    this.loadReports()
  },
  watch: {
    reportPeriod() {
      this.loadReports()
    }
  },
  methods: {
    loadReports() {
      // Filter invoices based on period
      let filteredInvoices = [...this.invoices]
      const now = new Date()
      let previousPeriodInvoices = []
      
      if (this.reportPeriod === 'today') {
        filteredInvoices = filteredInvoices.filter(inv => {
          const invDate = new Date(inv.date)
          return invDate.toDateString() === now.toDateString()
        })
      } else if (this.reportPeriod === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        filteredInvoices = filteredInvoices.filter(inv => new Date(inv.date) >= weekAgo)
        
        // Calculate previous period for growth
        const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14))
        previousPeriodInvoices = this.invoices.filter(inv => {
          const invDate = new Date(inv.date)
          return invDate >= twoWeeksAgo && invDate < weekAgo
        })
      } else if (this.reportPeriod === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        filteredInvoices = filteredInvoices.filter(inv => new Date(inv.date) >= monthAgo)
        
        const twoMonthsAgo = new Date(now.setMonth(now.getMonth() - 2))
        previousPeriodInvoices = this.invoices.filter(inv => {
          const invDate = new Date(inv.date)
          return invDate >= twoMonthsAgo && invDate < monthAgo
        })
      } else if (this.reportPeriod === 'year') {
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1))
        filteredInvoices = filteredInvoices.filter(inv => new Date(inv.date) >= yearAgo)
        
        const twoYearsAgo = new Date(now.setFullYear(now.getFullYear() - 2))
        previousPeriodInvoices = this.invoices.filter(inv => {
          const invDate = new Date(inv.date)
          return invDate >= twoYearsAgo && invDate < yearAgo
        })
      }
      
      // Calculate previous period revenue
      this.previousPeriodRevenue = previousPeriodInvoices.reduce((sum, inv) => sum + inv.total, 0)
      
      // Calculate stats
      this.stats.totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0)
      this.stats.totalTransactions = filteredInvoices.length
      this.stats.totalItemsSold = filteredInvoices.reduce((sum, inv) => 
        sum + inv.items.reduce((s, i) => s + i.quantity, 0), 0)
      this.stats.totalDiscount = filteredInvoices.reduce((sum, inv) => sum + (inv.discount || 0), 0)
      this.stats.averageTransaction = this.stats.totalTransactions > 0 
        ? this.stats.totalRevenue / this.stats.totalTransactions : 0
      
      // Daily sales (last 7 days)
      const last7Days = this.getLast7Days()
      this.dailySales = last7Days.map(day => {
        const total = filteredInvoices
          .filter(inv => this.formatDate(inv.date) === day)
          .reduce((sum, inv) => sum + inv.total, 0)
        return { date: day, total }
      })
      this.maxDailySale = Math.max(...this.dailySales.map(d => d.total), 1)
      
      // Find best day
      this.bestDay = this.dailySales.reduce((best, current) => 
        current.total > best.total ? current : best, 
        { date: 'No data', total: 0 }
      )
      
      // Top products
      const productSales = {}
      filteredInvoices.forEach(inv => {
        inv.items.forEach(item => {
          if (!productSales[item.description]) {
            productSales[item.description] = 0
          }
          productSales[item.description] += item.quantity
        })
      })
      this.topProducts = Object.entries(productSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
      this.maxProductSales = Math.max(...this.topProducts.map(p => p.quantity), 1)
      
      // Recent transactions (last 5)
      this.recentTransactions = [...filteredInvoices]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    },
    
    getLast7Days() {
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(this.formatDate(date))
      }
      return days
    },
    
    formatDate(date) {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    
    formatDateTime(date) {
      const d = new Date(date)
      return d.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    exportReport() {
      const reportData = {
        generatedAt: new Date().toISOString(),
        period: this.reportPeriod,
        stats: this.stats,
        dailySales: this.dailySales,
        topProducts: this.topProducts,
        bestDay: this.bestDay,
        growthRate: this.growthRate
      }
      
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `novapos-report-${new Date().toISOString().slice(0,19)}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }
}
</script>

<style scoped>
.input-date {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white;
}

.btn-export {
  @apply bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-sm;
}

/* Custom animations for charts */
@keyframes slideIn {
  from {
    width: 0%;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-gradient-to-r {
  animation: slideIn 0.6s ease-out;
}
</style>