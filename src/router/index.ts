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
      meta: { requiresAuth: false, role: 'user'} // لا حاجة لتوثيق الدخول لهذه الصفحة
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
    } else if (to.meta.role && to.meta.role !== userRole) {
      // التحقق من الدور المناسب للوصول إلى الصفحة
      next({ name: 'Home' }); // إعادة توجيه إذا كان الدور غير مناسب
    } else {
      next();
    }
  });
  
  export default router;