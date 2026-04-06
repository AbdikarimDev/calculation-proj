<template>
  <!-- Mobile overlay -->
  <div
    v-if="mobileOpen"
    class="fixed inset-0 bg-black/40 z-20 dden"
    @click="mobileOpen = false"
  />

  <!-- Hamburger button (mobile only) -->
  <button
    @click="mobileOpen = true"
    class="fixed top-4 left-4 z-30 lg:hidden bg-white shadow-lg rounded-xl p-2.5 text-gray-700 hover:bg-gray-50 transition"
  >
    <Bars3Icon class="w-5 h-5" />
  </button>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 bottom-0 z-30 bg-white shadow-2xl flex flex-col transition-all duration-300',
      // Mobile: slide in/out
      'lg:relative lg:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      // Collapsed on md, full on lg
      collapsed ? 'w-20' : 'w-72'
    ]"
  >
    <!-- Logo Area -->
    <div class="p-4 border-b border-gray-100 flex items-center" :class="collapsed ? 'justify-center' : 'gap-3 p-6'">
      <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shrink-0">
       <img src="../assets/logo.png" alt="">
      </div>
      <div v-if="!collapsed" class="overflow-hidden">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent whitespace-nowrap">
          NovaPOS
        </h1>
        <p class="text-xs text-gray-400">Professional Edition</p>
      </div>

      <!-- Collapse toggle (md+ only) -->
      <button
        @click="collapsed = !collapsed"
        class="hidden lg:flex ml-auto text-gray-400 hover:text-gray-600 transition"
      >
        <ChevronLeftIcon v-if="!collapsed" class="w-5 h-5" />
        <ChevronRightIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        @click="mobileOpen = false"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
        :class="[
          $route.path === item.path
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          collapsed ? 'justify-center' : ''
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed" class="font-medium">{{ item.name }}</span>
        <div v-if="$route.path === item.path && !collapsed" class="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>

        <!-- Tooltip when collapsed -->
        <div
          v-if="collapsed"
          class="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
        >
          {{ item.name }}
        </div>
      </router-link>
    </nav>

    <!-- User Profile Section -->
    <div class="p-3 border-t border-gray-100">
      <!-- User Info -->
      <div
        class="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100"
        :class="collapsed ? 'justify-center' : ''"
      >
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md shrink-0">
          {{ userInitials }}
        </div>
        <div v-if="!collapsed" class="flex-1 overflow-hidden">
          <p class="text-sm font-semibold text-gray-800 truncate">{{ userName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
        </div>
      </div>

      <!-- Status Card (hide when collapsed) -->
      <div v-if="!collapsed" class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 mb-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">System Status</span>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <ClockIcon class="w-4 h-4" />
          <span>{{ currentDateTime }}</span>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 group relative"
        :class="collapsed ? 'justify-center' : ''"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed" class="font-medium">Logout</span>

        <!-- Tooltip when collapsed -->
        <div
          v-if="collapsed"
          class="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
        >
          Logout
        </div>
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
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { auth } from '../firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'Sidebar',
  components: { Bars3Icon, ChevronLeftIcon, ChevronRightIcon },
  data() {
    return {
      collapsed: false,
      mobileOpen: false,
      menuItems: [
        { path: '/pos', name: 'Point of Sale', icon: CreditCardIcon },
        { path: '/invoices', name: 'Invoices', icon: DocumentTextIcon },
        { path: '/reports', name: 'Reports', icon: ChartBarIcon },
        { path: '/products', name: 'Products', icon: CubeIcon }
      ],
      currentTime: new Date(),
      userName: 'User',
      userEmail: 'Loading...',
      userInitials: 'U'
    }
  },
  computed: {
    currentDateTime() {
      return this.currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  },
  mounted() {
    this._timer = setInterval(() => { this.currentTime = new Date() }, 1000)

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

    // Auto-collapse on medium screens
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    clearInterval(this._timer)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      const w = window.innerWidth
      if (w >= 1024) {
        this.collapsed = false
        this.mobileOpen = false
      } else if (w >= 768) {
        this.collapsed = true
        this.mobileOpen = false
      }
    },
    async handleLogout() {
      try {
        await signOut(auth)
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
      if (words.length === 1) return words[0].charAt(0).toUpperCase()
      return (words[0].charAt(0) + words[words.length - 1].charAt(0).toUpperCase())
    }
  }
}
</script>