<template>
    <div>
      <div v-if="loading" class="text-center">جارٍ التحميل...</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>
  
      <div v-if="Array.isArray(products) && products.length">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img width="100px" v-if="product.photo && product.photo.length > 0" :src="product.photo[0].url" :alt="product.product_name" />
          <h3>{{ product.product_name }}</h3>
          <p>{{ product.price }}</p>
        </div>
      </div>
      <button @click="updateProducts" class="btn">تحديث المنتجات</button>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const products = computed(() => store.getters['products/getProducts']);
  const loading = computed(() => store.getters['products/isLoading']);
  const error = computed(() => store.getters['products/getError']);
  const isOnline = computed(() => store.getters['products/isOnline']);
  
  const updateOnlineStatus = () => {
    const onlineStatus = navigator.onLine;
    store.dispatch('products/updateOnlineStatus', onlineStatus); // تحديث حالة الاتصال في Vuex
    if (onlineStatus) {
      store.dispatch('products/fetchProducts'); // جلب البيانات من الـ API
    } else {
      console.log('لا يوجد اتصال بالإنترنت');
    }
  };
  
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus); // إضافة مستمع للحدث online
    window.addEventListener('offline', updateOnlineStatus); // إضافة مستمع للحدث offline
  
    // التحقق من حالة الاتصال عند تحميل المكون
    updateOnlineStatus();
  });
  
  const updateProducts = () => {
    store.dispatch('products/fetchProducts'); // تحديث المنتجات عند الضغط على زر التحديث
  };
  </script>
  