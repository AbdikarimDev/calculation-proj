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
              <!-- Subtotal -->
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ totalPrice.toFixed(2) }}</span>
              </div>
              
              <!-- Total -->
              <div class="flex justify-between text-lg font-bold pt-1">
                <span>Total Amount:</span>
                <span class="text-blue-600">${{ totalPrice.toFixed(2) }}</span>
              </div>
              
              <!-- Payment Section - Only show when ready to checkout -->
              <div class="mt-4 pt-2">
                <label class="text-sm font-medium text-gray-700 block mb-2">
                  Amount Received ($)
                </label>
                <div class="relative">
                  <component :is="CurrencyDollarIcon" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    v-model.number="amountReceived" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="input pl-8" 
                    placeholder="Enter amount customer pays" />
                </div>
                <p class="text-xs text-gray-500 mt-1">Enter payment amount to see change/balance</p>
              </div>
              
              <!-- Payment Status - CLEAR LOGIC -->
              <div class="pt-2 mt-1">
                <!-- Case 1: Customer paid MORE than total -->
                <div v-if="amountReceived > totalPrice && amountReceived > 0" class="bg-green-50 rounded-lg p-3">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <component :is="CashIcon" class="w-5 h-5 text-green-600" />
                      <span class="text-sm font-medium text-green-700">Change to Return:</span>
                    </div>
                    <span class="text-xl font-bold text-green-600">${{ (amountReceived - totalPrice).toFixed(2) }}</span>
                  </div>
                  <p class="text-xs text-green-600 mt-1">✅ Customer overpaid - Give this amount as change</p>
                </div>
                
                <!-- Case 2: Customer paid LESS than total -->
                <div v-else-if="amountReceived < totalPrice && amountReceived > 0" class="bg-red-50 rounded-lg p-3">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <component :is="ExclamationCircleIcon" class="w-5 h-5 text-red-600" />
                      <span class="text-sm font-medium text-red-700">Balance Due:</span>
                    </div>
                    <span class="text-xl font-bold text-red-600">${{ (totalPrice - amountReceived).toFixed(2) }}</span>
                  </div>
                  <p class="text-xs text-red-600 mt-1">⚠️ Customer still owes this amount</p>
                </div>
                
                <!-- Case 3: Customer paid EXACT amount -->
                <div v-else-if="amountReceived === totalPrice && amountReceived > 0" class="bg-blue-50 rounded-lg p-3">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <component :is="CheckCircleIcon" class="w-5 h-5 text-blue-600" />
                      <span class="text-sm font-medium text-blue-700">Payment Status:</span>
                    </div>
                    <span class="text-xl font-bold text-blue-600">PAID IN FULL</span>
                  </div>
                  <p class="text-xs text-blue-600 mt-1">✅ Exact amount received - No change needed</p>
                </div>
                
                <!-- Case 4: No amount entered yet -->
                <div v-else class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center gap-2">
                    <component :is="InformationCircleIcon" class="w-5 h-5 text-gray-500" />
                    <span class="text-sm text-gray-600">Enter amount received to see payment status</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              @click="submitForm" 
              :disabled="!canCompleteSale"
              class="btn-blue w-full py-3 mt-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <component :is="CheckCircleIcon" class="w-5 h-5" />
              Complete Sale
            </button>
            
            <!-- Clear Cart Button -->
            <button 
              v-if="items.length > 0"
              @click="clearCart" 
              class="btn-gray w-full py-2 mt-2 text-sm flex items-center justify-center gap-2">
              <component :is="TrashIcon" class="w-4 h-4" />
              Clear Cart
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
  CheckCircleIcon,
  CashIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
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
    CheckCircleIcon,
    CashIcon,
    ExclamationCircleIcon,
    InformationCircleIcon
  },
  data() {
    return {
      selectedItemName: '',
      price: 0,
      quantity: 1,
      amountReceived: 0
    }
  },
  computed: {
    ...mapState(usePOSStore, ['products', 'items', 'invoices']),
    
    totalPrice() {
      return this.items.reduce((s, i) => s + i.total, 0)
    },
    
    canAddItem() {
      return this.selectedItemName && this.selectedItemName !== '' && 
             this.quantity && this.quantity > 0 &&
             this.price && this.price > 0
    },
    
    canCompleteSale() {
      if (this.items.length === 0) return false
      if (this.amountReceived <= 0) return false
      return true
    },
    
    todaySales() {
      const today = new Date().toDateString()
      return this.invoices
        .filter(inv => new Date(inv.date).toDateString() === today)
        .reduce((sum, inv) => sum + inv.total, 0)
    }
  },
  methods: {
    ...mapActions(usePOSStore, ['addToCart', 'removeFromCart', 'completeSale', 'clearCart']),
    
    onSelectItem() {
      const p = this.products.find(x => x.name === this.selectedItemName)
      if (p) {
        this.price = p.price
        this.quantity = 1
      } else {
        this.price = 0
      }
    },
    
    addItem() {
      if (!this.canAddItem) {
        alert('Please select a product and enter valid quantity')
        return
      }
      
      const total = this.quantity * this.price
      if (total <= 0) {
        alert('Total must be greater than 0')
        return
      }
      
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(
        item => item.description === this.selectedItemName
      )
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = this.items[existingItemIndex]
        const newQuantity = existingItem.quantity + this.quantity
        const newTotal = newQuantity * this.price
        
        this.items[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: newTotal
        }
      } else {
        this.items.push({
          description: this.selectedItemName,
          quantity: this.quantity,
          price: this.price,
          discount: 0,
          total: total,
        })
      }
      
      // Reset product selection form
      this.selectedItemName = ''
      this.price = 0
      this.quantity = 1
      
      // Reset amount received when cart changes to prevent confusion
      this.amountReceived = 0
    },
    
    removeItem(index) {
      this.removeFromCart(index)
      // Reset amount received when cart changes
      this.amountReceived = 0
    },
    
    clearCart() {
      if (confirm('Clear all items from cart?')) {
        this.clearCart()
        this.amountReceived = 0
      }
    },
    
    async submitForm() {
      if (!this.items.length) {
        alert('Please add items to cart')
        return
      }
      
      if (this.amountReceived <= 0) {
        alert('Please enter amount received from customer')
        return
      }
      
      let changeDue = 0
      let balanceDue = 0
      let paymentStatus = ''
      
      // Calculate payment status
      if (this.amountReceived > this.totalPrice) {
        changeDue = this.amountReceived - this.totalPrice
        paymentStatus = 'overpaid'
      } else if (this.amountReceived < this.totalPrice) {
        balanceDue = this.totalPrice - this.amountReceived
        paymentStatus = 'underpaid'
      } else {
        paymentStatus = 'exact'
      }
      
      // Confirm with user if payment is insufficient
      if (paymentStatus === 'underpaid') {
        const confirmUnderpaid = confirm(
          `⚠️ WARNING: Customer still owes $${balanceDue.toFixed(2)}.\n\n` +
          `Total: $${this.totalPrice.toFixed(2)}\n` +
          `Received: $${this.amountReceived.toFixed(2)}\n` +
          `Balance Due: $${balanceDue.toFixed(2)}\n\n` +
          `Continue with this transaction?`
        )
        if (!confirmUnderpaid) return
      } else if (paymentStatus === 'overpaid') {
        alert(`✅ Customer overpaid by $${changeDue.toFixed(2)}. Give this amount as change.`)
      } else if (paymentStatus === 'exact') {
        alert(`✅ Payment received in full. No change needed.`)
      }
      
      // Prepare invoice data
      const invoiceData = {
        items: [...this.items],
        total: this.totalPrice,
        amountReceived: this.amountReceived,
        changeDue: changeDue,
        balanceDue: balanceDue,
        paymentStatus: paymentStatus,
        discount: 0
      }
      
      const success = await this.completeSale(invoiceData)
      
      if (success) {
        // Show appropriate success message
        if (paymentStatus === 'overpaid') {
          alert(`✅ Sale completed!\n\nChange to return: $${changeDue.toFixed(2)}`)
        } else if (paymentStatus === 'underpaid') {
          alert(`⚠️ Sale completed with balance due: $${balanceDue.toFixed(2)}`)
        } else {
          alert(`✅ Sale completed successfully!`)
        }
        
        // Reset all fields for next transaction
        this.amountReceived = 0
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

.btn-gray {
  @apply bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition;
}
</style>