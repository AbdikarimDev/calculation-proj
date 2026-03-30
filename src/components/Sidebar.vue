<template>
  <aside class="w-72 bg-white shadow-2xl flex flex-col">
    <!-- Logo Area -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <component :is="StoreIcon" class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            NovaPOS
          </h1>
          <p class="text-xs text-gray-400">Professional Edition</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
        :class="$route.path === item.path ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.name }}</span>
        <div v-if="$route.path === item.path" class="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
      </router-link>
    </nav>
    
    <!-- Status Card -->
    <div class="p-4 border-t border-gray-100">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700">System Status</span>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <component :is="ClockIcon" class="w-4 h-4" />
          <span>{{ currentDateTime }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import {
  CreditCardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CubeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Sidebar',
  components: {
    StoreIcon: CubeIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CubeIcon,
    ClockIcon
  },
  data() {
    return {
      menuItems: [
        { path: '/pos', name: 'Point of Sale', icon: 'CreditCardIcon' },
        { path: '/invoices', name: 'Invoices', icon: 'DocumentTextIcon' },
        { path: '/reports', name: 'Reports', icon: 'ChartBarIcon' },
        { path: '/products', name: 'Products', icon: 'CubeIcon' }
      ],
      currentTime: new Date()
    }
  },
  computed: {
    currentDateTime() {
      const now = this.currentTime
      return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    }
  },
  mounted() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  }
}
</script>

<style scoped>
.router-link-active {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md;
}
</style>