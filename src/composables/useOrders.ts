import { ref, onMounted } from 'vue';
import http from '@/api/http';

export function useOrders() {
  const orders = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadOrders() {
    loading.value = true;
    error.value = null;
    try {
      const res = await http.get('/orders'); // يفترض أن مسار الـ API هو /orders
      orders.value = res.data.data;
    } catch (err: any) {
      error.value = err.message || 'خطأ أثناء تحميل الطلبات';
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadOrders);

  return { orders, loading, error, loadOrders };
}
