// src/store/modules/products.ts
import http from '@/api/http';
import { getOfflineProducts, saveProductOffline, clearOfflineProducts } from '@/services/localDB';

// types
export interface Product {
  id: number;
  product_name: string;
  sku: string;
  price: number;
}

export interface ProductsState {
  products: Product[];
  isOnline: boolean;
  loading: boolean;
  error: string | null;
}

const state: ProductsState = {
  products: [],
  isOnline: navigator.onLine,
  loading: false,
  error: null,
};

const mutations = {
  setProducts(state: ProductsState, products: Product[]) {
    state.products = products;
  },
  setLoading(state: ProductsState, loading: boolean) {
    state.loading = loading;
  },
  setError(state: ProductsState, error: string | null) {
    state.error = error;
  },
  setOnlineStatus(state: ProductsState, status: boolean) {
    state.isOnline = status;
  },
};

const actions = {
  async fetchProducts({ commit, state }: any) {
    commit('setLoading', true);
    commit('setError', null);
  
    try {
      if (state.isOnline) {
        const response = await http.get('/products');
        const products = response.data.data;
  
        commit('setProducts', products);
  
        await clearOfflineProducts(); // امسح التخزين القديم
        for (const product of products) {
          await saveProductOffline(product); // خزّن كل منتج
        }
      } else {
        const offlineProducts = await getOfflineProducts();
        console.log('📦 تم تحميل المنتجات من IndexedDB:', offlineProducts);
        commit('setProducts', offlineProducts);
        commit('setError', 'تم عرض البيانات من التخزين المحلي');
      }
    } catch (e: any) {
      commit('setError', e.message || 'خطأ في جلب البيانات');
    } finally {
      commit('setLoading', false);
    }
  },
  updateOnlineStatus({ commit }: any, status: boolean) {
    commit('setOnlineStatus', status);
  },
};

const getters = {
  getProducts: (state: ProductsState) => state.products,
  isOnline: (state: ProductsState) => state.isOnline,
  isLoading: (state: ProductsState) => state.loading,
  getError: (state: ProductsState) => state.error,
};

// تصدير كـ module
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
