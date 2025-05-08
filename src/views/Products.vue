<template>
  <div>
    <!-- مكون بيع المنتجات -->
    <SalePage />
    
    <!-- شريط تحميل -->
    <div v-if="loading" class="text-center my-4">
      <b-spinner label="Loading...">جارٍ التحميل...</b-spinner>
    </div>

    <!-- عرض رسالة الخطأ إذا كان هناك مشكلة -->
    <b-alert v-if="error" variant="danger" show>
      {{ error }}
    </b-alert>
    
    <!-- عرض المنتجات -->
    <b-row v-if="Array.isArray(products) && products.length" class="justify-content-start">
      <b-col
        v-for="product in products"
        :key="product.id"
        cols="12" md="6" lg="4" xl="3"
        class="mb-4"
      >
        <b-card :title="product.product_name" class="h-100">
          <b-row class="align-items-center">
            <b-col sm="4">
              <b-img
                v-if="product.photo && product.photo.length > 0"
                :src="product.photo[0].url"
                :alt="product.product_name"
                fluid
                class="mb-3"
                style="max-height: 150px; object-fit: cover;"
              ></b-img>
            </b-col>
            <b-col sm="8">
              <p class="product-info">
                <span class="original-price" v-if="product.discount_price > 0">{{ product.price }} - </span>
                <span class="discount-price">{{ (product.price - product.discount_price) }}</span> 
                <span class="sku" v-if="product.sku">SKU: {{ product.sku }}</span>
              </p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- زر تحديث المنتجات -->
    <div class="text-center mt-4">
      <b-button variant="primary" @click="updateProducts">
        تحديث المنتجات
      </b-button>
    </div>
  </div>
</template>

<script setup>
import SalePage from '@/components/Sales.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// جلب المنتجات وحالتها من Vuex
const products = computed(() => store.getters['products/getProducts']);
const loading = computed(() => store.getters['products/isLoading']);
const error = computed(() => store.getters['products/getError']);
const isOnline = computed(() => store.getters['products/isOnline']);

// تحديث حالة الاتصال بالإنترنت وتحديث المنتجات
const updateOnlineStatus = () => {
  const onlineStatus = navigator.onLine;
  store.dispatch('products/updateOnlineStatus', onlineStatus); // تحديث حالة الاتصال في Vuex
  if (onlineStatus) {
    store.dispatch('products/fetchProducts'); // جلب البيانات من الـ API
  } else {
    store.dispatch('products/fetchProducts'); // جلب البيانات من التخزين المحلي
    console.log('لا يوجد اتصال بالإنترنت');
  }
};

// التحقق من حالة الاتصال عند تحميل المكون
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus); // إضافة مستمع للحدث online
  window.addEventListener('offline', updateOnlineStatus); // إضافة مستمع للحدث offline

  updateOnlineStatus(); // تحقق من الحالة عند تحميل المكون
});

// تحديث المنتجات عند الضغط على زر التحديث
const updateProducts = () => {
  store.dispatch('products/fetchProducts'); // تحديث المنتجات عند الضغط على زر التحديث
};
</script>

<style scoped>

.original-price {
  font-weight: bold;
  color: #333;
  text-decoration: line-through; /* للسعر الأصلي مع خط */
}

.discount-price {
  font-weight: bold;
  color: #e74c3c; /* لون مميز للخصم */
}

.sku {
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>
