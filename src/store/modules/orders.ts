// store/modules/orders.ts
import http from '@/api/http';
import { getOfflineOrders, saveOrderOffline, clearOfflineOrders } from '@/services/localDB';

export interface Order {
  [key: string]: string | null;
}

// تحديد شكل حالة الموديل
interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const state = (): OrdersState => ({
  orders: [],
  loading: false,
  error: null,
});

const mutations = {
  setOrders(state: OrdersState, orders: Order[]) {
    state.orders = orders;
  },
  setLoading(state: OrdersState, loading: boolean) {
    state.loading = loading;
  },
  setError(state: OrdersState, error: string | null) {
    state.error = error;
  },
  addOrder(state: OrdersState, order: Order) {
    state.orders.push(order);
  },
};

const actions = {
  async loadOfflineOrders({ commit }: any) {
    commit('setLoading', true);
    try {
      const orders = await getOfflineOrders();
      commit('setOrders', orders);
    } catch {
      commit('setError', 'فشل تحميل الطلبات من التخزين المحلي');
    } finally {
      commit('setLoading', false);
    }
  },

  async loadOrdersFromAPI({ commit }: any) {
    commit('setLoading', true);
    try {
      const res = await http.get('/orders');
      commit('setOrders', res.data.data);
    } catch {
      commit('setError', 'فشل تحميل الطلبات من السيرفر');
    } finally {
      commit('setLoading', false);
    }
  },

  async saveOrderLocally({ commit }: any, order: Order) {
    await saveOrderOffline(order);
    commit('addOrder', order);
  },

  async clearLocalOrders({ commit }: any) {
    await clearOfflineOrders();
    commit('setOrders', []);
  },
};

const getters = {
  allOrders: (state: OrdersState): Order[] => state.orders,
  isLoading: (state: OrdersState): boolean => state.loading,
  hasError: (state: OrdersState): boolean => !!state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
