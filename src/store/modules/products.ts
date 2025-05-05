import http from '@/api/http';

// types
export interface Product {
  id: number;
  product_name: string;
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
        // جلب البيانات من API باستخدام axios أو مكتبة http الخاصة بك
        const response = await http.get('/products');
        // إذا كانت البيانات موجودة في response.data (باستخدام axios)
        commit('setProducts', response.data.data); 
      } else {
        commit('setError', 'أنت غير متصل بالإنترنت');
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
