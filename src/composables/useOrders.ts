// src/composables/useOrders.ts
import { computed } from 'vue';
import { useStore } from 'vuex';

export function useOrders() {
  const store = useStore();

  const orders = computed(() => store.state.orders.orders); // access from module
  const loading = computed(() => store.state.orders.loading);
  const error = computed(() => store.state.orders.error);

  const loadFromAPI = () => store.dispatch('orders/loadOrdersFromAPI');
  const loadOffline = () => store.dispatch('orders/loadOfflineOrders');
  const saveLocally = (order: any) => store.dispatch('orders/saveOrderLocally', order);
  const clearLocal = () => store.dispatch('orders/clearLocalOrders');

  return {
    orders,
    loading,
    error,
    loadFromAPI,
    loadOffline,
    saveLocally,
    clearLocal,
  };
}
