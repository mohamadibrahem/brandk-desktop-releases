<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <b-sidebar
      id="sidebar"
      :visible="sidebarVisible"
      :backdrop="isMobile"
      shadow
      title="القائمة الجانبية"
      class="bg-light"
      :right="false"
      :width="isMobile ? '250px' : '200px'"
      static
    >
      <b-nav vertical class="p-0">
        <b-nav-item to="/" router>الرئيسية</b-nav-item>
        <b-nav-item to="/orders" router>الطلبات</b-nav-item>
        <b-nav-item to="/products" router>المنتجات</b-nav-item>
        <b-nav-item to="/sales" router>بيع</b-nav-item>
        <b-nav-item to="/coupons" router>كوبونات الخصم</b-nav-item>
      </b-nav>
    </b-sidebar>

    <!-- Main Content -->
    <div class="flex-grow-1">
      <!-- زر يظهر فقط في الشاشات الصغيرة -->
      <b-button v-if="isMobile" variant="secondary" @click="toggleSidebar" class="m-2">
        القائمة
      </b-button>

      <section class="p-3">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import router from './router'

const sidebarVisible = ref(false)
const isMobile = ref(window.innerWidth < 768)

// دالة لتحديث حالة الشاشة إذا كانت موبايل أو لا
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768
  sidebarVisible.value = !isMobile.value // افتراضيًا مفتوح على الشاشات الكبيرة
}

// دالة لتبديل حالة الـ Sidebar
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// التحقق من حالة التوكن عند التفعيل
const checkAuth = () => {
  const token = localStorage.getItem('brandk_token')
  if (!token && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
}

onMounted(() => {
  checkAuth() // التحقق من التوكن عند تحميل الصفحة
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile) // إضافة مستمع لحجم الشاشة
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile) // إزالة المستمع عند مغادرة الصفحة
})
</script>

<style scoped>
/* إضافة تنسيق لجعل العناصر في ترتيب صحيح */
.d-flex {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

/* التأكد من أن الشريط الجانبي لا يتداخل مع المحتوى */
.b-sidebar {
  z-index: 1050;
}

/* إضافة المسافة بين المحتوى والشريط الجانبي في الشاشات الصغيرة */
@media (max-width: 767px) {
  .b-sidebar {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
