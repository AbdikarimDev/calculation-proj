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
    
    <!-- User Profile Section -->
    <div class="p-4 border-t border-gray-100">
      <!-- User Info -->
      <div class="flex items-center gap-3 mb-4 p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
          {{ userInitials }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
          <p class="text-xs text-gray-500">{{ userEmail }}</p>
        </div>
      </div>
      
      <!-- Status Card -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-3">
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
      
      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 group"
      >
        <component :is="LogoutIcon" class="w-5 h-5" />
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import {
  CreditCardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CubeIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'Sidebar',
  components: {
    StoreIcon: CubeIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CubeIcon,
    ClockIcon,
    LogoutIcon: ArrowRightOnRectangleIcon
  },
  data() {
    return {
      menuItems: [
        { path: '/pos', name: 'Point of Sale', icon: 'CreditCardIcon' },
        { path: '/invoices', name: 'Invoices', icon: 'DocumentTextIcon' },
        { path: '/reports', name: 'Reports', icon: 'ChartBarIcon' },
        { path: '/products', name: 'Products', icon: 'CubeIcon' }
      ],
      currentTime: new Date(),
      userName: 'User',
      userEmail: 'Loading...',
      userInitials: 'U'
    }
  },
  computed: {
    currentDateTime() {
      const now = this.currentTime
      return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    }
  },
  mounted() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
    
    // Listen to auth state changes to get user info
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userEmail = user.email || 'No email'
        this.userName = user.displayName || this.getInitialNameFromEmail(user.email)
        this.userInitials = this.getInitials(this.userName)
      } else {
        this.userName = 'Guest'
        this.userEmail = 'Not logged in'
        this.userInitials = 'G'
      }
    })
  },
  methods: {
    async handleLogout() {
      try {
        await signOut(auth)
        // Router is accessed via this.$router in Vue 2/3 with options API
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    getInitialNameFromEmail(email) {
      if (!email) return 'User'
      const name = email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    },
    getInitials(name) {
      if (!name) return 'U'
      const words = name.split(' ')
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase()
      }
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
    }
  }
}
</script>

<style scoped>
.router-link-active {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md;
}
</style>