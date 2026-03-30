<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-white font-bold text-2xl flex items-center gap-2">
                <component :is="PackageIcon" class="w-7 h-7" />
                Products
              </h2>
              <p class="text-green-100">Manage your product catalog</p>
            </div>
            <div class="bg-white/20 rounded-lg px-4 py-2 text-center">
              <p class="text-white text-sm">Total Products</p>
              <p class="text-white font-bold text-xl">{{ products.length }}</p>
            </div>
          </div>
        </div>
        
        <!-- Add Product Form -->
        <div class="p-6 border-b bg-gray-50">
          <h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
            <component :is="PlusIcon" class="w-5 h-5 text-green-600" />
            Add New Product
          </h3>
          <div class="grid md:grid-cols-3 gap-3">
            <div class="relative">
              <component :is="ShoppingBagIcon" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input 
                v-model="newProductName" 
                type="text"
                placeholder="Product Name" 
                class="input pl-10"
                :disabled="isAdding"
                @keyup.enter="addProduct"
              />
            </div>
            <div class="relative">
              <component :is="CurrencyDollarIcon" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input 
                v-model.number="newProductPrice" 
                type="number" 
                placeholder="Price" 
                class="input pl-10"
                :disabled="isAdding"
                @keyup.enter="addProduct"
              />
            </div>
            <button 
              @click="addProduct" 
              class="btn-green py-2 font-semibold flex items-center justify-center gap-2"
              :disabled="isAdding || !canAddProduct">
              <component :is="isAdding ? 'ClockIcon' : 'PlusIcon'" :class="['w-5 h-5', isAdding ? 'animate-spin' : '']" />
              <span>{{ isAdding ? 'Adding...' : 'Add Product' }}</span>
            </button>
          </div>
          
          <!-- Success/Error Message -->
          <div v-if="message" class="mt-3 p-3 rounded-lg flex items-center gap-2" :class="messageType">
            <component :is="messageType === 'bg-green-100' ? 'CheckCircleIcon' : 'XCircleIcon'" class="w-5 h-5" />
            {{ message }}
          </div>
        </div>
        
        <!-- Products List -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <component :is="RefreshIcon" class="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
            <p class="text-gray-500">Loading products...</p>
          </div>
          
          <!-- Products Grid -->
          <div v-else-if="products.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(product, i) in products" 
              :key="product.id" 
              class="border rounded-lg p-4 hover:shadow-lg transition-all bg-white group">
              
              <!-- Product Info -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <component :is="PackageIcon" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">{{ product.name }}</h3>
                    <div class="flex items-center gap-1 mt-1">
                      <component :is="CurrencyDollarIcon" class="w-4 h-4 text-gray-500" />
                      <p class="text-2xl font-bold text-blue-600">{{ product.price }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="editProduct(i)" 
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Product">
                    <component :is="PencilIcon" class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteProduct(i)" 
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    :disabled="isDeleting === i"
                    :title="isDeleting === i ? 'Deleting...' : 'Delete Product'">
                    <component :is="isDeleting === i ? 'ClockIcon' : 'TrashIcon'" :class="['w-4 h-4', isDeleting === i ? 'animate-spin' : '']" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <component :is="PackageIcon" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-400 text-lg">No products yet</p>
            <p class="text-sm text-gray-400">Add your first product above to get started</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePOSStore } from '../stores/posStore'
import { mapState, mapActions } from 'pinia'

// Import Heroicons
import {
  PackageIcon,
  PlusIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ProductsView',
  components: {
    PackageIcon,
    PlusIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    RefreshIcon,
    ClockIcon
  },
  data() {
    return {
      newProductName: '',
      newProductPrice: null,
      isAdding: false,
      isLoading: false,
      isDeleting: null,
      message: '',
      messageType: ''
    }
  },
  computed: {
    ...mapState(usePOSStore, ['products']),
    
    canAddProduct() {
      return this.newProductName && this.newProductName.trim() !== '' && 
             this.newProductPrice && this.newProductPrice > 0
    }
  },
  mounted() {
    this.loadProducts()
  },
  methods: {
    ...mapActions(usePOSStore, {
      addProductToStore: 'addProduct',
      updateProductInStore: 'updateProduct',
      deleteProductFromStore: 'deleteProduct'
    }),
    
    showMessage(msg, type = 'success') {
      this.message = msg
      this.messageType = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      
      setTimeout(() => {
        this.message = ''
      }, 3000)
    },
    
    async loadProducts() {
      this.isLoading = true
      try {
        await this.$store?.loadProducts?.() || this.loadProductsFromStore()
      } catch (error) {
        console.error('Error loading products:', error)
        this.showMessage('Failed to load products', 'error')
      } finally {
        this.isLoading = false
      }
    },
    
    async loadProductsFromStore() {
      const saved = localStorage.getItem('products')
      if (saved) {
        const store = usePOSStore()
        store.products = JSON.parse(saved)
      }
    },
    
    async addProduct() {
      if (!this.canAddProduct) {
        this.showMessage('Please enter product name and price', 'error')
        return
      }
      
      this.isAdding = true
      this.message = ''
      
      try {
        const result = await this.addProductToStore({
          name: this.newProductName.trim(),
          price: parseFloat(this.newProductPrice),
          stock: 0
        })
        
        if (result) {
          this.showMessage(`${this.newProductName} added successfully!`, 'success')
          this.newProductName = ''
          this.newProductPrice = null
        } else {
          this.showMessage('Failed to add product', 'error')
        }
      } catch (error) {
        console.error('Error adding product:', error)
        this.showMessage('Error adding product. Please try again.', 'error')
      } finally {
        this.isAdding = false
      }
    },
    
    async editProduct(index) {
      const product = this.products[index]
      const name = prompt('Edit product name:', product.name)
      const price = prompt('Edit price:', product.price)
      
      if (name && price && !isNaN(price) && parseFloat(price) > 0) {
        try {
          await this.updateProductInStore(index, {
            ...product,
            name: name.trim(),
            price: parseFloat(price)
          })
          this.showMessage(`${name} updated successfully!`, 'success')
        } catch (error) {
          console.error('Error updating product:', error)
          this.showMessage('Failed to update product', 'error')
        }
      }
    },
    
    async deleteProduct(index) {
      const product = this.products[index]
      
      if (!confirm(`Delete "${product.name}"?`)) {
        return
      }
      
      this.isDeleting = index
      
      try {
        await this.deleteProductFromStore(index)
        this.showMessage(`${product.name} deleted successfully!`, 'success')
      } catch (error) {
        console.error('Error deleting product:', error)
        this.showMessage('Failed to delete product', 'error')
      } finally {
        this.isDeleting = null
      }
    }
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition;
}

.btn-green {
  @apply bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>