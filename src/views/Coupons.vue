<template>
    <div>
      <Coupons />
    </div>
  </template>
  
  <script lang="ts">
  import Coupons from '@/components/CouponList.vue'; // تأكد من المسار الصحيح
  
  export default {
    components: {
        Coupons, // إضافة المكون إلى القائمة
    },
  };
  </script>
  