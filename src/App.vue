<template>
  <!-- Show loading spinner while checking auth -->
  <div v-if="isLoading" class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
  
  <!-- Show login page if not authenticated (and not loading) -->
  <LoginPage v-else-if="!isAuthenticated" @login-success="handleLoginSuccess" />
  
  <!-- Show main app if authenticated (and not loading) -->
  <div v-else class="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import LoginPage from './views/LoginPage.vue'
import { usePOSStore } from './stores/posStore'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'App',
  components: { Sidebar, LoginPage },
  data() {
    return {
      isLoading: true,
      isAuthenticated: false
    }
  },
  mounted() {
    console.log('1. App mounted, setting up auth listener...')
    console.log('2. Current auth.currentUser BEFORE listener:', auth.currentUser)
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('3. Auth state changed callback fired')
      console.log('4. User object:', user)
      console.log('5. User email:', user?.email)
      console.log('6. Is user logged in?', !!user)
      
      // Update authentication state
      this.isAuthenticated = !!user
      
      if (user) {
        console.log('7. User is authenticated, loading data...')
        try {
          const store = usePOSStore()
          await Promise.all([
            store.loadProducts(),
            store.loadInvoices()
          ])
          console.log('8. Data loaded successfully')
        } catch (error) {
          console.error('Error loading data:', error)
        }
      } else {
        console.log('7. No user found, showing login page')
      }
      
      // Hide loading spinner
      this.isLoading = false
      console.log('9. Loading complete. isAuthenticated =', this.isAuthenticated)
    })
    
    this.unsubscribe = unsubscribe
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    handleLoginSuccess() {
      console.log('Login success handler called')
      // No need to set anything here as onAuthStateChanged will handle it
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>