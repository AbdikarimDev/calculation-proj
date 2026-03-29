<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <!-- DASHBOARD -->
    <div v-if="!showResult" class="max-w-6xl mx-auto space-y-6">

      <!-- HEADER -->
      <div>
        <h1 class="text-3xl font-bold text-gray-800">NovaPOS</h1>
        <p class="text-gray-500">Sales & Inventory System</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">

        <!-- PRODUCTS -->
        <div class="bg-white p-6 rounded-2xl shadow">
          <h2 class="text-xl font-semibold mb-4">Products</h2>

          <div class="flex gap-2 mb-4">
            <input v-model="newProductName" placeholder="Name"
              class="input" />
            <input v-model.number="newProductPrice" type="number" placeholder="Price"
              class="input" />
            <button @click="addProduct" class="btn-green">Add</button>
          </div>

          <div class="space-y-2">
            <div v-for="(p,i) in products" :key="i"
              class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">

              <div>
                <p class="font-medium">{{ p.name }}</p>
                <p class="text-sm text-gray-500">${{ p.price }}</p>
              </div>

              <div class="flex gap-2">
                <button @click="startEdit(i)" class="btn-gray">Edit</button>
                <button @click="deleteProduct(i)" class="btn-red">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- SALE -->
        <div class="bg-white p-6 rounded-2xl shadow">
          <h2 class="text-xl font-semibold mb-4">Create Sale</h2>

          <div class="grid grid-cols-2 gap-3 mb-3">
            <select v-model="selectedItemName" @change="onSelectItem" class="input">
              <option disabled value="">Select product</option>
              <option v-for="p in products" :key="p.name">{{ p.name }}</option>
            </select>

            <input v-model.number="price" readonly class="input bg-gray-100" />
            <input v-model.number="quantity" type="number" placeholder="Qty" class="input" />
            <input v-model.number="discount" type="number" placeholder="Discount" class="input" />
          </div>

          <input v-model.number="paid" type="number" placeholder="Amount Paid"
            class="input w-full mb-3" />

          <div class="flex gap-3">
            <button @click="addItem" class="btn-green py-2 flex-1">Add Item</button>
            <button @click="submitForm"
              :disabled="!items.length"
              class="btn-blue flex-1 disabled:bg-gray-300">
              Generate
            </button>
          </div>

          <!-- PREVIEW -->
          <div v-if="items.length" class="mt-4 border-t pt-3">
            <p class="text-sm text-gray-500 mb-2">Items</p>
            <ul class="space-y-1 text-sm">
              <li v-for="(item,i) in items" :key="i">
                {{ item.description }} × {{ item.quantity }} = ${{ item.total }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- INVOICE -->
    <div v-else class="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

      <div class="flex justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">NovaPOS</h1>
          <p class="text-gray-500 text-sm">Invoice</p>
        </div>
        <div class="text-right text-sm">
          <p class="font-semibold">#{{ invoiceId }}</p>
          <p>{{ data.month }} {{ data.day }}, {{ data.year }}</p>
        </div>
      </div>

      <table class="w-full text-sm border-b">
        <thead class="text-left text-gray-500">
          <tr>
            <th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,i) in items" :key="i" class="border-t">
            <td>{{ i+1 }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ item.price }}</td>
            <td class="font-medium">${{ item.total }}</td>
          </tr>
        </tbody>
      </table>

      <div class="ml-auto w-64 mt-6 space-y-2 text-sm">
        <div class="flex justify-between"><span>Subtotal</span><span>${{ totalPrice }}</span></div>
        <div class="flex justify-between"><span>Discount</span><span>${{ totalDiscount }}</span></div>
        <div class="flex justify-between"><span>Paid</span><span>${{ paid }}</span></div>
        <div class="flex justify-between font-bold text-lg"><span>Balance</span><span>${{ balance }}</span></div>
      </div>

      <div class="mt-6 flex gap-3">
        <button @click="printReceipt" class="btn-gray">Print</button>
        <button @click="resetAll" class="btn-blue">New</button>
      </div>
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
      invoiceId: Math.floor(Math.random() * 9999),

      products: [
        { name: "Product A", price: 50 },
        { name: "Product B", price: 30 },
      ],

      newProductName: "",
      newProductPrice: null,

      selectedItemName: "",
      price: 0,
      quantity: null,
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
      this.balance = this.totalPrice - val;
    },
  },

  methods: {
    onSelectItem() {
      const p = this.products.find(x => x.name === this.selectedItemName);
      this.price = p ? p.price : 0;
    },

    addProduct() {
      if (!this.newProductName || !this.newProductPrice) return;
      this.products.push({
        name: this.newProductName,
        price: this.newProductPrice,
      });
      this.newProductName = "";
      this.newProductPrice = null;
    },

    startEdit(i) {
      const name = prompt("Edit name", this.products[i].name);
      const price = prompt("Edit price", this.products[i].price);
      if (name && price) this.products[i] = { name, price: Number(price) };
    },

    deleteProduct(i) {
      this.products.splice(i, 1);
    },

    addItem() {
      if (!this.selectedItemName || !this.quantity) return;

      const total = this.quantity * this.price - (this.discount || 0);

      this.items.push({
        description: this.selectedItemName,
        quantity: this.quantity,
        price: this.price,
        discount: this.discount || 0,
        total: total > 0 ? total : 0,
      });

      this.selectedItemName = "";
      this.quantity = null;
      this.discount = 0;
    },

    submitForm() {
      if (!this.items.length) return;
      this.balance = this.totalPrice - this.paid;
      this.showResult = true;
    },

    resetAll() {
      this.items = [];
      this.showResult = false;
      this.paid = 0;
      this.balance = 0;
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
.btn-red {
  @apply bg-red-500 text-white px-3 rounded-lg hover:bg-red-600;
}
.btn-gray {
  @apply bg-gray-200 px-3 rounded-lg hover:bg-gray-300;
}
</style>