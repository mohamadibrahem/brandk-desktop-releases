<template>
  <div>
    <div class="mb-3">
      <button class="btn btn-secondary" @click="goBack">← رجوع إلى الطلبات</button>
    </div>

    <div v-if="invoice">
      <InvoicePrinter :invoice="invoice" :invoiceItems="invoice.customer_requests" />
    </div>
    <div v-else class="text-center text-muted mt-4">
      <p>لا توجد بيانات لعرض الفاتورة.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import InvoicePrinter from '@/components/InvoicePrinter.vue';

const store = useStore();
const router = useRouter();

// الوصول إلى الفاتورة من Vuex
const invoice = computed(() => store.state.invoice.currentInvoice);

// دالة العودة
function goBack() {
  router.push({ name: 'Orders' }); // أو use router.back() إذا كان هذا المسار
}
</script>
