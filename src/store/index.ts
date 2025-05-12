// store/index.js
import { createStore } from 'vuex';
import http from '@/api/http';  // استيراد إعدادات axios الخاصة بك
import router from '@/router';
import products from './modules/products';
import coupons from './modules/coupons';
import sales from './modules/sales';
import invoiceStore from './modules/invoiceStore';

export default createStore({
    modules: {
        products,
        coupons,
        sales,
        invoice: invoiceStore,
    },
    state: {
      domain: localStorage.getItem('brandk_domain') || null,
      token: localStorage.getItem('brandk_token') || null,
      tenant: localStorage.getItem('brandk_tenant') || null,
      loading: false,
      error: null
    },
    mutations: {
      setAuth(state, { domain, token, tenant}) {
        state.domain = domain;
        state.token = token;
        state.tenant = tenant;
        localStorage.setItem('brandk_domain', domain);
        localStorage.setItem('brandk_token', token);
        localStorage.setItem('brandk_tenant', tenant);
      },
      clearAuth(state) {
        state.domain = null;
        state.token = null;
        state.tenant = null;
        localStorage.removeItem('brandk_domain');
        localStorage.removeItem('brandk_token');
        localStorage.removeItem('brandk_tenant');
      },
      setLoading(state, loading) {
        state.loading = loading;
      },
      setError(state, error) {
        state.error = error;
      }
    },
    actions: {
      async login({ commit }, { domain, email, password }) {
        commit('setLoading', true);
        commit('setError', null);
  
        try {
          // إعداد `baseURL` الصحيح بناءً على الدومين
          const fullUrl = `https://${domain.replace(/\/$/, '')}/api/auth/login`; // التأكد من إضافة https:// في الدومين
          const res = await http.post(fullUrl, { email, password },{
            headers: {
              'X-Tenant-Domain': domain,  // إضافة النطاق في الهيدر
            }
          });
  
          // تخزين التوكن والدومين في Vuex
          commit('setAuth', { domain, token: res.data.token, tenant: res.data.tenant });
  
          // إعادة توجيه إلى الصفحة الرئيسية
          router.push('/');
        } catch (err: any) {
          commit('setError', err.response?.data?.message || err.message || 'خطأ في تسجيل الدخول');
        } finally {
          commit('setLoading', false);
        }
      },
      logout({ commit }) {
        commit('clearAuth');
        router.push('/login');
      }
    },
    getters: {
      isAuthenticated: (state) => !!state.token,
      getDomain: (state) => state.domain,
      getToken: (state) => state.token,
      getTenant: (state) => state.tenant,
      getError: (state) => state.error,
      isLoading: (state) => state.loading
    }
  });
  
