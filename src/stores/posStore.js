import { defineStore } from 'pinia'

export const usePOSStore = defineStore('posStore', {
  state: () => ({
    products: [],
    items: [],
    invoices: []
  }),
  
  actions: {
    async loadProducts() {
      // Load from localStorage
      const saved = localStorage.getItem('products')
      if (saved) {
        this.products = JSON.parse(saved)
      } else {
        // Default products
        this.products = [
          { id: '1', name: 'Laptop', price: 999, stock: 10 },
          { id: '2', name: 'Mouse', price: 25, stock: 50 },
          { id: '3', name: 'Keyboard', price: 75, stock: 30 },
          { id: '4', name: 'Monitor', price: 299, stock: 15 }
        ]
        this.saveProducts()
      }
    },
    
    async loadInvoices() {
      // Load invoices from localStorage
      const saved = localStorage.getItem('invoices')
      if (saved) {
        this.invoices = JSON.parse(saved)
      } else {
        this.invoices = []
      }
    },
    
    saveProducts() {
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    
    saveInvoices() {
      localStorage.setItem('invoices', JSON.stringify(this.invoices))
    },
    
    async addProduct(product) {
      try {
        const newProduct = {
          id: Date.now().toString(),
          name: product.name,
          price: product.price,
          stock: product.stock || 0,
          createdAt: new Date().toISOString()
        }
        
        this.products.push(newProduct)
        this.saveProducts()
        return true
      } catch (error) {
        console.error('Error adding product:', error)
        return false
      }
    },
    
    async updateProduct(index, product) {
      try {
        this.products[index] = product
        this.saveProducts()
        return true
      } catch (error) {
        console.error('Error updating product:', error)
        return false
      }
    },
    
    async deleteProduct(index) {
      try {
        this.products.splice(index, 1)
        this.saveProducts()
        return true
      } catch (error) {
        console.error('Error deleting product:', error)
        return false
      }
    },
    
    addToCart(item) {
      // Check if item already exists
      const existingIndex = this.items.findIndex(i => i.description === item.description)
      
      if (existingIndex !== -1) {
        const existing = this.items[existingIndex]
        const newQuantity = existing.quantity + item.quantity
        const newTotal = (newQuantity * item.price) - (existing.discount + item.discount)
        
        this.items[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          discount: existing.discount + item.discount,
          total: newTotal
        }
      } else {
        this.items.push(item)
      }
      
      // Update stock
      const product = this.products.find(p => p.name === item.description)
      if (product) {
        product.stock -= item.quantity
        this.saveProducts()
      }
    },
    
    removeFromCart(index) {
      const item = this.items[index]
      const product = this.products.find(p => p.name === item.description)
      if (product) {
        product.stock += item.quantity
        this.saveProducts()
      }
      this.items.splice(index, 1)
    },
    
    async completeSale(saleData) {
      const invoice = {
        ...saleData,
        date: new Date().toISOString(),
        id: 'INV-' + Date.now()
      }
      
      // Save invoice
      this.invoices.unshift(invoice)
      this.saveInvoices()
      
      // Clear cart
      this.items = []
      
      return true
    },
    
    clearCart() {
      this.items = []
    }
  }
})