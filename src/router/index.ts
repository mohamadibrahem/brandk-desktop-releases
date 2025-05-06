import { createRouter, createWebHistory } from 'vue-router';
import Login  from '@/views/Login.vue';
import Home   from '@/views/Home.vue';
import Orders from '@/views/Orders.vue';
import Products from '@/views/Products.vue';

const routes = [
    { 
      path: '/login',  
      name: 'Login',  
      component: Login,
      meta: { requiresAuth: false, role: 'admin'} // لا حاجة لتوثيق الدخول لهذه الصفحة
    },
    { 
      path: '/',       
      name: 'Home',   
      component: Home,
      meta: { requiresAuth: true, role: 'admin' } // هذه الصفحة تتطلب توثيق الدخول
    },
    { 
      path: '/orders', 
      name: 'Orders', 
      component: Orders,
      meta: { requiresAuth: true, role: 'admin' } // هذه الصفحة تتطلب توثيق الدخول
    },
    { 
        path: '/products', 
        name: 'Products', 
        component: Products,
        meta: { requiresAuth: true, role: 'admin' } // هذه الصفحة تتطلب توثيق الدخول
    },
  ];

const router = createRouter({
    history: createWebHistory('/'),
    routes
  });

  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('brandk_token');

    if (to.meta.requiresAuth && !token) {
      // المستخدم يحاول الدخول إلى صفحة تتطلب توثيق بدون وجود توكن
      console.log('🚫 محاولة دخول بدون توكن، تحويل إلى /login');
      next({ name: 'Login' });
    } else if (!to.meta.requiresAuth && token && to.name === 'Login') {
      // إذا كان المستخدم موثق بالفعل ويحاول فتح صفحة تسجيل الدخول
      console.log('🔁 المستخدم موثق ويحاول الدخول لصفحة تسجيل الدخول، إعادة توجيه إلى /');
      next({ name: 'Home' });
    } else {
      // حالة المرور العادي
      console.log(`✅ المرور إلى ${to.name}`);
      next();
    }
  });  
  
  export default router;