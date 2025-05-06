<template>
    <div id="app">
      <nav style="padding:1rem; background:#eee;">
        <router-link to="/">الرئيسية</router-link> |
        <router-link to="/orders">الطلبات</router-link> |
        <router-link to="/products">المنتجات</router-link>
      </nav>
      <section style="padding:1rem;">
        <router-view />
      </section>
    </div>
  </template>
  <script setup>
  import { onMounted } from 'vue'
  import router from './router'
  
  onMounted(() => {
    const token = localStorage.getItem('brandk_token')
    if (!token && router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  })
  </script>