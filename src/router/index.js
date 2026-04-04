import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
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
    redirect: '/pos',
    meta: { requiresAuth: true }
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

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  const currentUser = auth.currentUser

  // Update page title
  document.title = `NovaPOS | ${to.meta.title || 'Sales System'}`

  if (requiresAuth && !currentUser) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (to.path === '/login' && currentUser) {
    // Redirect to POS if already logged in
    next('/pos')
  } else {
    next()
  }
})

export default router