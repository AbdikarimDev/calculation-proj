import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import POSView from '../views/POSView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import ReportsView from '../views/ReportsView.vue'
import ProductsView from '../views/ProductsView.vue'
import LoginPage from '../views/LoginPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Login', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/pos'
  },
  {
    path: '/pos',
    name: 'POS',
    component: POSView,
    meta: { title: 'Point of Sale', requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoicesView,
    meta: { title: 'Invoices', requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { title: 'Reports & Analytics', requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { title: 'Product Management', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Wait for Firebase to initialize before checking auth
const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

router.beforeEach(async (to) => {
  document.title = `NovaPOS | ${to.meta.title || 'Sales System'}`

  const requiresAuth = to.meta.requiresAuth !== false
  const user = await getCurrentUser() // ✅ Waits for Firebase, not just currentUser

  if (requiresAuth && !user) return '/login'
  if (to.path === '/login' && user) return '/pos'
})

export default router