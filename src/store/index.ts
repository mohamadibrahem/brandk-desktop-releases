// store/index.js
import { createStore } from 'vuex';
import http from '@/api/http';  // استيراد إعدادات axios الخاصة بك
import router from '@/router';
import products from './modules/products';

export default createStore({
    modules: {
        products,
    },
    state: {
      domain: localStorage.getItem('brandk_domain') || null,
      token: localStorage.getItem('brandk_token') || null,
      loading: false,
      error: null
    },
    mutations: {
      setAuth(state, { domain, token }) {
        state.domain = domain;
        state.token = token;
        localStorage.setItem('brandk_domain', domain);
        localStorage.setItem('brandk_token', token);
      },
      clearAuth(state) {
        state.domain = null;
        state.token = null;
        localStorage.removeItem('brandk_domain');
        localStorage.removeItem('brandk_token');
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
  
          const res = await http.post(fullUrl, { email, password });
  
          // تخزين التوكن والدومين في Vuex
          commit('setAuth', { domain, token: res.data.token });
  
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
      getError: (state) => state.error,
      isLoading: (state) => state.loading
    }
  });
  
