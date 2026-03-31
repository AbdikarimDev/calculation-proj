<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="close">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
      <!-- Modal Header (No Print) -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center no-print">
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
        <div v-if="invoice" class="invoice-receipt">
          
          <!-- Header -->
          <div class="text-center border-b pb-6 mb-6">
            <h1 class="text-3xl font-bold text-gray-800">NovaPOS</h1>
            <p class="text-sm text-gray-500 mt-1">Professional Point of Sale System</p>
            <p class="text-xs text-gray-400 mt-2">123 Business Street • City, State 12345</p>
            <p class="text-xs text-gray-400">Phone: (555) 123-4567 • Email: support@novapos.com</p>
          </div>
          
          <!-- Receipt Info -->
          <div class="flex justify-between mb-6 text-sm">
            <div>
              <p class="text-gray-600">Receipt #: <span class="font-semibold">#{{ invoice.id.slice(-8) }}</span></p>
              <p class="text-gray-600 mt-1">Date: {{ formatDateTime(invoice.date) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Cashier: NovaPOS System</p>
              <p class="text-gray-600 mt-1">Customer: Walk-in Customer</p>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="w-full mb-6">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="py-2 text-left text-sm font-semibold text-gray-700">Item</th>
                <th class="py-2 text-center text-sm font-semibold text-gray-700">Qty</th>
                <th class="py-2 text-right text-sm font-semibold text-gray-700">Price</th>
                <th class="py-2 text-right text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in invoice.items" :key="idx" class="border-b border-gray-100">
                <td class="py-2 text-sm">{{ item.description }}</td>
                <td class="py-2 text-center text-sm">{{ item.quantity }}</td>
                <td class="py-2 text-right text-sm">${{ item.price.toFixed(2) }}</td>
                <td class="py-2 text-right text-sm font-semibold">${{ item.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Totals Section -->
          <div class="flex justify-end mb-6">
            <div class="w-64">
              <div class="flex justify-between py-1">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ invoice.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                <span class="font-bold">Total:</span>
                <span class="font-bold text-lg">${{ invoice.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-gray-600">Amount Received:</span>
                <span class="font-medium">${{ (invoice.amountReceived || invoice.paid || 0).toFixed(2) }}</span>
              </div>
              
              <!-- Payment Status -->
              <div class="mt-2 pt-2 border-t border-gray-200">
                <div v-if="(invoice.amountReceived || invoice.paid || 0) > invoice.total" 
                     class="flex justify-between text-green-600 font-semibold">
                  <span>Change:</span>
                  <span>${{ ((invoice.amountReceived || invoice.paid || 0) - invoice.total).toFixed(2) }}</span>
                </div>
                <div v-else-if="(invoice.amountReceived || invoice.paid || 0) < invoice.total" 
                     class="flex justify-between text-red-600 font-semibold">
                  <span>Balance Due:</span>
                  <span>${{ (invoice.total - (invoice.amountReceived || invoice.paid || 0)).toFixed(2) }}</span>
                </div>
                <div v-else class="flex justify-between text-blue-600 font-semibold">
                  <span>Status:</span>
                  <span>PAID IN FULL</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="text-center pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600">Thank you for your business!</p>
            <p class="text-xs text-gray-400 mt-2">This is a computer-generated receipt - No signature required</p>
            <div class="mt-4">
              <div class="border-t border-dashed border-gray-300 w-32 mx-auto"></div>
              <p class="text-xs text-gray-400 mt-2">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal Footer Buttons (No Print) -->
      <div class="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end no-print">
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
      if (!date) return 'N/A'
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
      // Get the print area content
      const printContent = document.getElementById('invoice-print-area')
      if (!printContent) return
      
      // Clone the content to avoid modifying the original
      const printClone = printContent.cloneNode(true)
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      
      // Write the print-friendly HTML
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt #${this.invoice.id.slice(-8)}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: white;
              color: #1f2937;
              font-size: 14px;
              line-height: 1.5;
              padding: 20px;
            }
            
            .invoice-receipt {
              max-width: 600px;
              margin: 0 auto;
              background: white;
            }
            
            /* Header Styles */
            .text-center {
              text-align: center;
            }
            
            .border-b {
              border-bottom: 1px solid #e5e7eb;
            }
            
            .border-t {
              border-top: 1px solid #e5e7eb;
            }
            
            .border-dashed {
              border-style: dashed;
            }
            
            .mb-6 {
              margin-bottom: 24px;
            }
            
            .mt-1 {
              margin-top: 4px;
            }
            
            .mt-2 {
              margin-top: 8px;
            }
            
            .mt-4 {
              margin-top: 16px;
            }
            
            .pt-6 {
              padding-top: 24px;
            }
            
            .pb-6 {
              padding-bottom: 24px;
            }
            
            .py-1 {
              padding-top: 4px;
              padding-bottom: 4px;
            }
            
            .py-2 {
              padding-top: 8px;
              padding-bottom: 8px;
            }
            
            .px-2 {
              padding-left: 8px;
              padding-right: 8px;
            }
            
            .flex {
              display: flex;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .justify-end {
              justify-content: flex-end;
            }
            
            .text-left {
              text-align: left;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-sm {
              font-size: 13px;
            }
            
            .text-xs {
              font-size: 11px;
            }
            
            .text-lg {
              font-size: 18px;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .font-bold {
              font-weight: 700;
            }
            
            .text-gray-400 {
              color: #9ca3af;
            }
            
            .text-gray-500 {
              color: #6b7280;
            }
            
            .text-gray-600 {
              color: #4b5563;
            }
            
            .text-gray-700 {
              color: #374151;
            }
            
            .text-gray-800 {
              color: #1f2937;
            }
            
            .text-blue-600 {
              color: #2563eb;
            }
            
            .text-green-600 {
              color: #16a34a;
            }
            
            .text-red-600 {
              color: #dc2626;
            }
            
            .bg-white {
              background: white;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            th, td {
              padding: 8px 0;
            }
            
            .border-b-2 {
              border-bottom: 2px solid #e5e7eb;
            }
            
            .border-b {
              border-bottom: 1px solid #e5e7eb;
            }
            
            .border-t {
              border-top: 1px solid #e5e7eb;
            }
            
            .border-gray-100 {
              border-color: #f3f4f6;
            }
            
            .border-gray-200 {
              border-color: #e5e7eb;
            }
            
            .border-gray-300 {
              border-color: #d1d5db;
            }
            
            .w-32 {
              width: 128px;
            }
            
            .w-64 {
              width: 256px;
            }
            
            .mx-auto {
              margin-left: auto;
              margin-right: auto;
            }
            
            .ml-auto {
              margin-left: auto;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              
              .invoice-receipt {
                max-width: 100%;
                padding: 0;
              }
              
              /* Ensure borders print properly */
              .border-b, .border-t, .border-dashed {
                border-color: #000 !important;
              }
            }
          </style>
        </head>
        <body>
          ${printClone.outerHTML}
        </body>
        </html>
      `)
      
      printWindow.document.close()
      printWindow.focus()
      
      // Print and close
      printWindow.print()
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }
  }
}
</script>

<style scoped>
.btn-print {
  @apply bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium px-6 py-2;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium px-6 py-2;
}

/* Hide print buttons and header when printing */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>