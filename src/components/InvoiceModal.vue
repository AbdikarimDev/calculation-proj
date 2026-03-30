<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="close">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <component :is="DocumentTextIcon" class="w-6 h-6 text-blue-600" />
          Invoice Details
        </h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition">
          <component :is="XMarkIcon" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Invoice Content (This is what gets printed) -->
      <div id="invoice-print-area" class="p-8">
        <div v-if="invoice" class="space-y-6">
          
          <!-- Header -->
          <div class="flex justify-between items-start border-b pb-6">
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                NovaPOS
              </h1>
              <p class="text-sm text-gray-500 mt-1">Professional Point of Sale System</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-gray-800">RECEIPT</p>
              <p class="text-sm text-gray-500 mt-1">#{{ invoice.id.slice(-8) }}</p>
            </div>
          </div>
          
          <!-- Store Info & Customer Info -->
          <div class="grid grid-cols-2 gap-6 text-sm">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-semibold text-gray-700 mb-2">Store Information</p>
              <p class="text-gray-600">NovaPOS System</p>
              <p class="text-gray-600">123 Business Street</p>
              <p class="text-gray-600">City, State 12345</p>
              <p class="text-gray-600">Phone: (555) 123-4567</p>
              <p class="text-gray-600">Email: support@novapos.com</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-semibold text-gray-700 mb-2">Customer Information</p>
              <p class="text-gray-600">Walk-in Customer</p>
              <p class="text-gray-600 mt-2">Date: {{ formatDateTime(invoice.date) }}</p>
              <p class="text-gray-600">Receipt #: {{ invoice.id.slice(-8) }}</p>
            </div>
          </div>
          
          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100 border-b">
                  <th class="p-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th class="p-3 text-left text-sm font-semibold text-gray-700">Item</th>
                  <th class="p-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                  <th class="p-3 text-right text-sm font-semibold text-gray-700">Price</th>
                  <th class="p-3 text-right text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in invoice.items" :key="idx" class="border-b hover:bg-gray-50">
                  <td class="p-3 text-sm">{{ idx + 1 }}</td>
                  <td class="p-3 text-sm font-medium">{{ item.description }}</td>
                  <td class="p-3 text-sm text-right">{{ item.quantity }}</td>
                  <td class="p-3 text-sm text-right">${{ item.price.toFixed(2) }}</td>
                  <td class="p-3 text-sm text-right font-semibold">${{ item.total.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Totals Section -->
          <div class="flex justify-end">
            <div class="w-80 space-y-2 border-t pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ (invoice.total + (invoice.discount || 0)).toFixed(2) }}</span>
              </div>
              <div v-if="invoice.discount > 0" class="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${{ invoice.discount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2">
                <span>Total:</span>
                <span class="text-blue-600">${{ invoice.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Amount Paid:</span>
                <span class="font-medium">${{ invoice.paid.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-semibold pt-2 border-t" 
                   :class="invoice.balance >= 0 ? 'text-red-600' : 'text-green-600'">
                <span>{{ invoice.balance >= 0 ? 'Balance Due:' : 'Change:' }}</span>
                <span>${{ Math.abs(invoice.balance).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="border-t pt-6 text-center">
            <p class="text-sm text-gray-500">Thank you for your business!</p>
            <p class="text-xs text-gray-400 mt-1">This is a computer-generated receipt - No signature required</p>
            <div class="mt-4">
              <div class="border-t-2 border-dashed border-gray-300 w-48 mx-auto"></div>
              <p class="text-xs text-gray-400 mt-2">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal Footer Buttons -->
      <div class="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
        <button @click="printInvoice" class="btn-print flex items-center gap-2 px-6 py-2">
          <component :is="PrinterIcon" class="w-5 h-5" />
          Print Receipt
        </button>
        <button @click="close" class="btn-secondary flex items-center gap-2 px-6 py-2">
          <component :is="XMarkIcon" class="w-5 h-5" />
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DocumentTextIcon,
  XMarkIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'InvoiceModal',
  components: {
    DocumentTextIcon,
    XMarkIcon,
    PrinterIcon
  },
  props: {
    show: Boolean,
    invoice: Object
  },
  methods: {
    close() {
      this.$emit('close')
    },
    
    formatDateTime(date) {
      const d = new Date(date)
      return d.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    printInvoice() {
      const printContent = document.getElementById('invoice-print-area')
      const originalTitle = document.title
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice #${this.invoice.id.slice(-8)}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              background: white;
              color: #1f2937;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .store-info, .customer-info {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .totals {
              text-align: right;
              margin-top: 20px;
            }
            .totals div {
              margin: 8px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            @media print {
              body {
                padding: 0;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContent.innerHTML}
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }
}
</script>

<style scoped>
.btn-print {
  @apply bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium;
}
</style>