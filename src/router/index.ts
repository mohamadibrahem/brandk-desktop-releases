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
    const userRole = localStorage.getItem('user_role') || 'admin'; // دور المستخدم، مثل 'admin' أو 'user'
  
    if (to.meta.requiresAuth && !token) {
      next({ name: 'Login' });
    } else {
      next();
    }
  });
  
  export default router;