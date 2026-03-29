<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">

    <!-- FORM -->
    <div v-if="!showResult" class="w-full max-w-xl bg-white p-6 rounded-2xl shadow space-y-4">

      <div>
        <h1 class="text-2xl font-bold text-gray-800">Create Invoice</h1>
        <p class="text-gray-500 text-sm">Simple invoice generator</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <input v-model="itemDescription" placeholder="Item name" class="input" />
        <input v-model.number="quantity" type="number" placeholder="Qty" class="input" />
        <input v-model.number="price" type="number" placeholder="Price" class="input" />
        <input v-model.number="discount" type="number" placeholder="Discount" class="input" />
      </div>

      <input
        v-model.number="paid"
        type="number"
        placeholder="Amount Paid"
        class="input w-full"
      />

      <div class="flex gap-3">
        <button @click="addItem" class="btn-green flex-1">Add Item</button>
        <button
          @click="submitForm"
          :disabled="!items.length"
          class="btn-blue flex-1 disabled:bg-gray-300"
        >
          Generate
        </button>
      </div>

      <!-- PREVIEW -->
      <div v-if="items.length" class="border-t pt-3">
        <p class="text-sm text-gray-500 mb-2">Items</p>
        <ul class="space-y-1 text-sm">
          <li v-for="(item,i) in items" :key="i">
            {{ item.description }} × {{ item.quantity }} = ${{ item.total }}
          </li>
        </ul>
      </div>
    </div>

    <!-- INVOICE -->
    <div v-else class="w-full max-w-3xl bg-white p-8 rounded-2xl shadow">

      <div class="flex justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">NovaDesk</h1>
          <p class="text-gray-500 text-sm">Invoice System</p>
        </div>

        <div class="text-right text-sm">
          <p class="font-semibold">#INV-{{ invoiceId }}</p>
          <p>{{ data.month }} {{ data.day }}, {{ data.year }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 mb-6 text-sm">
        <div>
          <p class="text-gray-500">Bill To</p>
          <p class="font-medium">Demo Client</p>
          <p class="text-gray-400 text-xs">client@example.com</p>
        </div>

        <div class="text-right">
          <p class="text-gray-500">Issued By</p>
          <p class="font-medium">NovaDesk</p>
          <p class="text-gray-400 text-xs">system@demo.dev</p>
        </div>
      </div>

      <table class="w-full text-sm border-b">
        <thead class="text-left text-gray-500">
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item,i) in items" :key="i" class="border-t">
            <td>{{ i+1 }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ item.price.toFixed(2) }}</td>
            <td class="font-medium">${{ item.total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="ml-auto w-64 mt-6 space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ totalPrice.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Discount</span>
          <span>- ${{ totalDiscount.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Paid</span>
          <span>${{ paid.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between font-bold text-lg">
          <span>Balance</span>
          <span>${{ balance.toFixed(2) }}</span>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button @click="printReceipt" class="btn-gray">Print</button>
        <button @click="resetAll" class="btn-blue">New</button>
      </div>

      <p class="text-center text-gray-400 text-xs mt-6">
        Demo project – portfolio ready
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const today = new Date();

    return {
      data: {
        month: today.toLocaleString("default", { month: "long" }),
        day: today.getDate(),
        year: today.getFullYear(),
      },

      invoiceId: Math.floor(Math.random() * 9000 + 1000),

      itemDescription: "",
      quantity: null,
      price: null,
      discount: 0,

      paid: 0,
      balance: 0,

      items: [],
      showResult: false,
    };
  },

  computed: {
    totalPrice() {
      return this.items.reduce((s, i) => s + i.total, 0);
    },
    totalDiscount() {
      return this.items.reduce((s, i) => s + i.discount, 0);
    },
  },

  watch: {
    paid(val) {
      this.balance = this.totalPrice - (val || 0);
    },
  },

  methods: {
    addItem() {
      if (!this.itemDescription || this.quantity <= 0 || this.price <= 0) return;

      const total =
        this.quantity * this.price - (this.discount || 0);

      this.items.push({
        description: this.itemDescription,
        quantity: this.quantity,
        price: this.price,
        discount: this.discount || 0,
        total: total > 0 ? total : 0,
      });

      this.itemDescription = "";
      this.quantity = null;
      this.price = null;
      this.discount = 0;
    },

    submitForm() {
      if (!this.items.length) return;

      this.balance = this.totalPrice - (this.paid || 0);
      this.showResult = true;
    },

    resetAll() {
      this.items = [];
      this.showResult = false;
      this.paid = 0;
      this.balance = 0;
      this.invoiceId = Math.floor(Math.random() * 9000 + 1000);
    },

    printReceipt() {
      window.print();
    },
  },
};
</script>

<style>
.input {
  @apply border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none;
}
.btn-green {
  @apply bg-green-500 text-white px-3 rounded-lg hover:bg-green-600;
}
.btn-blue {
  @apply bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700;
}
.btn-gray {
  @apply bg-gray-200 px-3 rounded-lg hover:bg-gray-300;
}
</style>