import { createRouter, createWebHistory } from 'vue-router';
import Login  from '@/views/Login.vue';
import Dashboard   from '@/views/Dashboard.vue';
import Orders from '@/views/Orders.vue';
import Products from '@/views/Products.vue';
import Sales from '@/views/Sales.vue';
import Coupons from '@/views/Coupons.vue';
import NotFound from '@/components/NotFound.vue';

const routes = [
    { 
      path: '/login',  
      name: 'Login',  
      component: Login,
      meta: { requiresAuth: false, role: 'admin'} // لا حاجة لتوثيق الدخول لهذه الصفحة
    },
    { 
      path: '/',       
      name: 'Dashboard',   
      component: Dashboard,
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
    { 
      path: '/sales', 
      name: 'Sales', 
      component: Sales,
      meta: { requiresAuth: true, role: 'admin' }
    },
    { 
      path: '/coupons', 
      name: 'Coupons', 
      component: Coupons,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ];

const router = createRouter({
    history: createWebHistory('/'),
    routes
  });

  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('brandk_token')
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
    if (requiresAuth && !token) {
      console.log('🚫 محاولة دخول بدون توكن، تحويل إلى /login')
      next({ name: 'Login' })
    } else if (to.path === '/login' && token) {
      console.log('🔁 المستخدم موثق ويحاول الدخول لصفحة تسجيل الدخول، إعادة توجيه إلى /')
      next({ name: 'Dashboard' }) // أو 'Home' حسب ما تسمي صفحتك
    } else {
      console.log(`✅ المرور إلى ${to.name}`)
      next()
    }
  })   
  
  export default router;