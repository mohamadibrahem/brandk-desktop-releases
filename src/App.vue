<template>
  <div id="app">
    <!-- Header -->
    <Header />

    <!-- محتوى الصفحة الرئيسي -->
    <div class="d-flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content area -->
      <main id="main" class="main flex-grow-1">
        <RouterView />
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Layouts/Header.vue'
import Sidebar from '@/components/Layouts/Sidebar.vue'
import Footer from '@/components/Layouts/Footer.vue'
import { onMounted } from 'vue'
import {
  initSidebarToggle,
  initSearchBarToggle,
  initTooltips,
  initScrollTop,
  initGLightbox,
} from '@/utils/initUi.js'

onMounted(() => {
  initSidebarToggle()
  initSearchBarToggle()
  initTooltips()
  initScrollTop()
  //initGLightbox()
})
</script>

<style>

</style>