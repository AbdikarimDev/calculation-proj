<template>
  <div v-if="!isAuthenticated" class="flex min-h-screen">
    <LoginPage @login-success="handleLoginSuccess" />
  </div>
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
  async mounted() {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (user) => {
      this.isAuthenticated = !!user
      
      if (user) {
        try {
          const store = usePOSStore()
          
          // Load both products and invoices
          await Promise.all([
            store.loadProducts(),
            store.loadInvoices()
          ])
          
          console.log('Data loaded successfully for user:', user.email)
        } catch (error) {
          console.error('Error loading data:', error)
        }
      }
      
      this.isLoading = false
    })
  },
  methods: {
    handleLoginSuccess() {
      // This will trigger re-render due to isAuthenticated change
      console.log('Login successful')
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