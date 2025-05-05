// main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';  // استيراد Vuex Store
import router from './router';  // استيراد Vue Router

const app = createApp(App);

app.use(store);   // ربط Vuex
app.use(router);  // ربط Vue Router

app.mount('#app');
