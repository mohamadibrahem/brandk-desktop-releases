// src/components/CouponList.vue
<template>
  <div>
    <div v-for="coupon in coupons" :key="coupon.id">
      <p>كود الكوبون: {{ coupon.code }}</p>
      <p>الخصم: {{ coupon.discount }}%</p>
      <p>تاريخ الانتهاء: {{ coupon.expiry_date }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const coupons = computed(() => store.getters['coupons/getCoupons'])

        const fetchData = async () => {
            await store.dispatch('coupons/fetchCoupons')
        }

        onMounted(fetchData);

        return {
            coupons
        }
    }

});
</script>
