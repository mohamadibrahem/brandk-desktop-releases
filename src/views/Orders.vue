<template>
  <div class="container mt-4">
    <h2 class="mb-3">الطلبات</h2>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button variant="primary" @click="loadFromAPI" :disabled="loading">
        {{ loading ? 'جاري التحميل...' : 'جلب الطلبات' }}
      </b-button>
      <b-form-input
        v-model="searchTerm"
        placeholder="ابحث في الطلبات..."
        class="w-25"
      />
    </div>

    <b-alert v-if="error" variant="danger" class="mt-3" dismissible>
      {{ error }}
    </b-alert>

    <b-table
      v-else
      :items="filteredOrders"
      :fields="fields"
      responsive
      striped
      hover
      class="mt-3">
      <template #cell(status)="data">
        <span :class="statusClass(data.item.status)">
          {{ statusLabel(data.item.status) }}
        </span>
      </template>

      <template #cell(created_at)="data">
        {{ formatDate(data.item.created_at) }}
      </template>

      <template #cell(final_sum)="data">
        {{ data.item.final_sum }}
      </template>

      <template #cell(action)="data">
        <b-button variant="primary" @click="viewInvoice(data.item)">
          عرض التفاصيل
        </b-button>
      </template>

    </b-table>

    <p v-if="!loading && filteredOrders.length === 0" class="text-center text-muted mt-3">
      لا توجد طلبات مطابقة للبحث.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '@/composables/useOrders';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();

const {
  orders,
  loading,
  error,
  loadFromAPI,
  loadOffline,
  saveLocally,
  clearLocal,
} = useOrders();

const router = useRouter();
const searchTerm = ref('');

// الحقول المعروضة في الجدول
const fields = [
  { key: 'id', label: 'رقم الطلب' },
  { key: 'order_code', label: 'معرف الطلب' },
  { key: 'user', label: 'المستخدم' },
  { key: 'store', label: 'المتجر' },
  { key: 'branch', label: 'الفرع' },
  { key: 'status', label: 'الحالة' },
  { key: 'final_sum', label: 'الإجمالي النهائي' },
  { key: 'created_at', label: 'تاريخ الإنشاء' },
  { key: 'action', label: 'الحدث' },
];

// تصفية الطلبات حسب البحث
const filteredOrders = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return orders.value;
  return orders.value.filter(o => {
    return [
      o.id?.toString(),
      o.order_code,
      o.user,
      o.store,
      o.branch,
      o.status
    ].some(field =>
      field?.toLowerCase().includes(term)
    );
  });
});

// عرض الفاتورة
function viewInvoice(order: any) {
  store.dispatch('invoice/setInvoice', order); // تخزين الفاتورة في Vuex
  router.push({ name: 'InvoicePage', params: { id: order.id } }); // التوجيه لصفحة الفاتورة
}

// التنسيقات
const statusLabel = (status: string) => {
  switch (status) {
    case 'PENDING': return 'قيد المعالجة';
    case 'COMPLETED': return 'تم التوصيل';
    case 'CANCELLED': return 'ملغي';
    default: return 'غير معروف';
  }
};

const statusClass = (status: string) => ({
  'text-warning': status === 'PENDING',
  'text-success': status === 'COMPLETED',
  'text-danger': status === 'CANCELLED',
  'text-muted': !['PENDING', 'COMPLETED', 'CANCELLED'].includes(status),
});

const formatDate = (dateString: string) => dateString;
</script>
