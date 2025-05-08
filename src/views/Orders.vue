<template>
  <div class="container mt-4">
    <h2 class="mb-3">الطلبات</h2>

    <b-button variant="primary" @click="loadOrders" :disabled="loading">
      {{ loading ? 'جاري التحميل...' : 'جلب الطلبات' }}
    </b-button>

    <b-alert v-if="error" variant="danger" class="mt-3" dismissible>
      {{ error }}
    </b-alert>

    <b-table
      v-else
      :items="orders"
      :fields="fields"
      responsive
      striped
      hover
      class="mt-3"
    >
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
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '@/composables/useOrders';
import { ref } from 'vue';

const { orders, loading, error, loadOrders } = useOrders();

const fields = [
  { key: 'id', label: 'رقم الطلب' },
  { key: 'order_code', label: 'معرف الطلب' },
  { key: 'user', label: 'المستخدم' },
  { key: 'store', label: 'المتجر' },
  { key: 'branch', label: 'الفرع' },
  { key: 'status', label: 'الحالة' },
  { key: 'final_sum', label: 'الإجمالي النهائي' },
  { key: 'created_at', label: 'تاريخ الإنشاء' },
];

const statusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'قيد المعالجة';
    case 'COMPLETED':
      return 'تم التوصيل';
    case 'CANCELLED':
      return 'ملغي';
    default:
      return 'غير معروف';
  }
};

const statusClass = (status: string) => {
  return {
    'text-warning': status === 'PENDING',
    'text-success': status === 'COMPLETED',
    'text-danger': status === 'CANCELLED',
    'text-muted': !['PENDING', 'COMPLETED', 'CANCELLED'].includes(status),
  };
};

const formatDate = (dateString: string) => {
  const date = dateString;
  return date;
};

</script>
