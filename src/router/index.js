import { createRouter, createWebHistory } from 'vue-router'
import POSView from '../views/POSView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import ReportsView from '../views/ReportsView.vue'
import ProductsView from '../views/ProductsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/pos'
  },
  {
    path: '/pos',
    name: 'POS',
    component: POSView,
    meta: { title: 'Point of Sale' }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoicesView,
    meta: { title: 'Invoices' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { title: 'Reports & Analytics' }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { title: 'Product Management' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  document.title = `NovaPOS | ${to.meta.title || 'Sales System'}`
  next()
})

export default router