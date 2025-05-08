// main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';  // استيراد Vuex Store
import router from './router';  // استيراد Vue Router

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/css/style.css';
import '@/assets/css/rtl.css';

// استيراد BootstrapVue
import { BootstrapVue3 } from 'bootstrap-vue-3';

// 1️⃣ import the scanner components by name
import {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  } from 'vue-qrcode-reader';
  
const app = createApp(App);
// 2️⃣ register each one globally
app.component('QrcodeStream',    QrcodeStream)
app.component('QrcodeDropZone',  QrcodeDropZone)
app.component('QrcodeCapture',   QrcodeCapture)

app.use(store);   // ربط Vuex
app.use(router);  // ربط Vue Router
// إضافة BootstrapVue إلى التطبيق
app.use(BootstrapVue3);

app.mount('#app');
