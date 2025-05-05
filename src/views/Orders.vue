<template>
    <div>
      <h2>صفحة الطلبات</h2>
      <button @click="loadOrders" :disabled="loading">
        {{ loading ? 'جاري التحميل...' : 'جلب الطلبات' }}
      </button>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      <ul v-else class="mt-4">
        <li v-for="o in orders" :key="o.id">{{ o.id }}</li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useOrders } from '@/composables/useOrders';
  
  const { orders, loading, error, loadOrders } = useOrders();
  </script>
  