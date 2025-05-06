// main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';  // استيراد Vuex Store
import router from './router';  // استيراد Vue Router

// استيراد Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// استيراد BootstrapVue
import { BootstrapVue3 } from 'bootstrap-vue-3';

const app = createApp(App);

app.use(store);   // ربط Vuex
app.use(router);  // ربط Vue Router
// إضافة BootstrapVue إلى التطبيق
app.use(BootstrapVue3);

app.mount('#app');
