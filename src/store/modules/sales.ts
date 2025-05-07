// src/store/modules/sales.ts
import http from '@/api/http';
import { Commit } from 'vuex';

// تعريف أنواع البيانات
interface Product {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
}

interface SalesState {
  sales: Product[][];
}

const state: SalesState = {
  sales: [],
};

const mutations = {
  setSales(state: SalesState, sales: Product[]) {
    state.sales = [...state.sales, sales]; // أضف المبيعات الجديدة إلى المبيعات القديمة
  },
};

const actions = {
  async submitSale({ commit }: { commit: Commit }, cart: Product[]) {
    try {
      // إرسال المبيعات إلى API
      await http.post('/sales', { items: cart });
      commit('setSales', cart);
    } catch (e) {
      console.error('خطأ في إتمام البيع:', e);
    }
  },
};

const getters = {
  getSales: (state: SalesState) => state.sales,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
