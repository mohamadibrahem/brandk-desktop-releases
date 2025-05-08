<template>
    <div class="container">
      <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1>404</h1>
        <h2>
          الصفحة التي تبحث عنها غير موجودة.
        </h2>
        <button class="btn" @click="goBack">
          العودة إلى الصفحة السابقة
        </button>
        <img alt="الصفحة غير موجودة" class="img-fluid py-5" src="@/assets/img/not-found.svg"/>
        <div class="credits">
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
    methods: {
      goBack() {
        window.history.back();
      }
    }
  }
  </script>