<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <component :is="CreditCardIcon" class="w-7 h-7 text-blue-600" />
            Point of Sale
          </h2>
          <p class="text-gray-500">Process new transactions</p>
        </div>
        <div class="bg-white rounded-lg shadow px-4 py-2 text-right">
          <p class="text-sm text-gray-500">Today's Sales</p>
          <p class="text-xl font-bold text-green-600">${{ todaySales.toFixed(2) }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        
        <!-- Product Selection Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 class="text-white font-semibold text-lg flex items-center gap-2">
              <component :is="ShoppingBagIcon" class="w-5 h-5" />
              Add Items
            </h3>
            <p class="text-blue-100 text-sm">Select products and add to cart</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-2">
                Select Product
              </label>
              <select 
                v-model="selectedItemName" 
                @change="onSelectItem" 
                class="input w-full">
                <option disabled value="">Choose a product...</option>
                <option v-for="p in products" :key="p.id" :value="p.name">
                  {{ p.name }} - ${{ p.price }}
                </option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Price ($)</label>
                <div class="relative">
                  <component :is="CurrencyDollarIcon" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    v-model.number="price" 
                    type="number"
                    readonly 
                    class="input pl-8 bg-gray-50" />
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
                <input 
                  v-model.number="quantity" 
                  type="number" 
                  min="1" 
                  class="input" 
                  @keyup.enter="addItem" />
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-2">Amount Paid ($)</label>
              <div class="relative">
                <component :is="CurrencyDollarIcon" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  v-model.number="paid" 
                  type="number" 
                  min="0" 
                  class="input pl-8" 
                  placeholder="0" />
              </div>
            </div>
            
            <button 
              @click="addItem" 
              :disabled="!canAddItem" 
              class="btn-green w-full py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <component :is="PlusIcon" class="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
        
        <!-- Shopping Cart Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h3 class="text-white font-semibold text-lg flex items-center gap-2">
              <component :is="ShoppingCartIcon" class="w-5 h-5" />
              Shopping Cart
            </h3>
            <p class="text-green-100 text-sm">{{ items.length }} item(s) in cart</p>
          </div>
          
          <div class="p-6">
            <!-- Empty Cart -->
            <div v-if="items.length === 0" class="text-center py-12">
              <component :is="ShoppingCartIcon" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-400">Cart is empty</p>
              <p class="text-sm text-gray-400">Add items to start selling</p>
            </div>
            
            <!-- Cart Items -->
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="(item, i) in items" 
                :key="i" 
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="flex-1">
                  <p class="font-semibold text-gray-800">{{ item.description }}</p>
                  <p class="text-sm text-gray-500">
                    {{ item.quantity }} × ${{ item.price }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg">${{ item.total.toFixed(2) }}</p>
                  <button 
                    @click="removeItem(i)" 
                    class="text-red-500 text-sm hover:text-red-700 flex items-center gap-1">
                    <component :is="TrashIcon" class="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Cart Summary -->
            <div v-if="items.length > 0" class="border-t mt-4 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span class="text-blue-600">${{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm" :class="balance >= 0 ? 'text-red-600' : 'text-green-600'">
                <span>Balance / Change:</span>
                <span class="font-semibold">
                  ${{ Math.abs(balance).toFixed(2) }}
                  <span v-if="balance < 0" class="text-xs">(Change)</span>
                  <span v-else class="text-xs">(Due)</span>
                </span>
              </div>
            </div>
            
            <button 
              @click="submitForm" 
              :disabled="!items.length"
              class="btn-blue w-full py-3 mt-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <component :is="CheckCircleIcon" class="w-5 h-5" />
              Complete Sale
            </button>
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
  CreditCardIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'POSView',
  components: {
    CreditCardIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    PlusIcon,
    ShoppingCartIcon,
    TrashIcon,
    CheckCircleIcon
  },
  data() {
    return {
      selectedItemName: '',
      price: 0,
      quantity: 1,
      paid: 0,
      balance: 0
    }
  },
  computed: {
    ...mapState(usePOSStore, ['products', 'items', 'invoices']),
    
    totalPrice() {
      return this.items.reduce((s, i) => s + i.total, 0)
    },
    
    canAddItem() {
      console.log('Checking canAddItem:', {
        selectedItemName: this.selectedItemName,
        quantity: this.quantity,
        price: this.price
      })
      return this.selectedItemName && this.selectedItemName !== '' && 
             this.quantity && this.quantity > 0 &&
             this.price && this.price > 0
    },
    
    todaySales() {
      const today = new Date().toDateString()
      return this.invoices
        .filter(inv => new Date(inv.date).toDateString() === today)
        .reduce((sum, inv) => sum + inv.total, 0)
    }
  },
  watch: {
    paid(val) {
      this.balance = this.totalPrice - (val || 0)
    },
    
    // Watch for changes in selectedItemName to debug
    selectedItemName(newVal) {
      console.log('Selected product changed to:', newVal)
    }
  },
  methods: {
    ...mapActions(usePOSStore, ['addToCart', 'removeFromCart', 'completeSale']),
    
    onSelectItem() {
      console.log('onSelectItem called, selected:', this.selectedItemName)
      const p = this.products.find(x => x.name === this.selectedItemName)
      console.log('Found product:', p)
      if (p) {
        this.price = p.price
        this.quantity = 1
        console.log('Price set to:', this.price)
      } else {
        this.price = 0
      }
    },
    
    addItem() {
      console.log('addItem called')
      console.log('Current values:', {
        selectedItemName: this.selectedItemName,
        quantity: this.quantity,
        price: this.price
      })
      
      if (!this.canAddItem) {
        alert('Please select a product and enter valid quantity')
        return
      }
      
      const total = this.quantity * this.price
      if (total <= 0) {
        alert('Total must be greater than 0')
        return
      }
      
      console.log('Adding item:', {
        description: this.selectedItemName,
        quantity: this.quantity,
        price: this.price,
        total: total
      })
      
      // Add to cart
      this.addToCart({
        description: this.selectedItemName,
        quantity: this.quantity,
        price: this.price,
        discount: 0,
        total: total
      })
      
      // Reset form
      this.selectedItemName = ''
      this.price = 0
      this.quantity = 1
      
      console.log('Item added, cart now has:', this.items.length, 'items')
    },
    
    removeItem(index) {
      this.removeFromCart(index)
    },
    
    async submitForm() {
      if (!this.items.length) {
        alert('Please add items to cart')
        return
      }
      
      if (this.paid < 0) {
        alert('Amount paid cannot be negative')
        return
      }
      
      if (this.paid < this.totalPrice) {
        const continueAnyway = confirm(`Amount paid ($${this.paid.toFixed(2)}) is less than total ($${this.totalPrice.toFixed(2)}). Balance due: $${(this.totalPrice - this.paid).toFixed(2)}. Continue?`)
        if (!continueAnyway) return
      }
      
      this.balance = this.totalPrice - this.paid
      
      const success = await this.completeSale({
        items: [...this.items],
        total: this.totalPrice,
        paid: this.paid,
        balance: this.balance,
        discount: 0
      })
      
      if (success) {
        alert('✅ Sale completed successfully!')
        this.paid = 0
        this.balance = 0
        this.$router.push('/invoices')
      } else {
        alert('❌ Error completing sale. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition;
}

.btn-green {
  @apply bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-blue {
  @apply bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>