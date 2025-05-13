// src/store/modules/sales.ts
import http from '@/api/http';
import { Commit } from 'vuex';
import {
  saveSaleOffline,
  getOfflineSales,
  deleteOfflineSale,
} from '@/services/localDB';
import type { Product } from '@/store/modules/products'; // ✅ استخدم النوع الأصلي


interface SalePayload {
  items: Product[];
  coupon: string | null;
  totals: any;
}

interface SalesState {
  sales: Product[][];
}

const state: SalesState = {
  sales: [],
};

const mutations = {
  setSales(state: SalesState, sales: Product[]) {
    state.sales = [...state.sales, sales];
  },
};

const actions = {
  async submitSale({ commit }: { commit: Commit }, payload: SalePayload) {
    const { items, coupon, totals } = payload;

    try {
      if (navigator.onLine) {
        await http.post('/sales', { items, coupon, totals });
        commit('setSales', items);
      } else {
        await saveSaleOffline({
          items,
          coupon,
          totals,
          timestamp: Date.now(), // ✅ أضف timestamp عند الحفظ
        });
        commit('setSales', items);
        console.warn('🚫 أوفلاين: تم حفظ البيع محليًا');
      }
    } catch (e) {
      console.error('❌ خطأ في إتمام البيع:', e);
    }
  },

  async syncOfflineSales({ commit }: { commit: Commit }) {
    try {
      if (!navigator.onLine) return;

      const offlineSales = await getOfflineSales();

      for (const sale of offlineSales) {
        const cleanedSale = JSON.parse(JSON.stringify(sale));
        await http.post('/sales', {
          items: cleanedSale.items,
          coupon: cleanedSale.coupon,
          totals: cleanedSale.totals,
        });
        commit('setSales', sale.items);

        // ✅ حذف البيع من IndexedDB باستخدام معرفه
        if (sale.id !== undefined) {
          await deleteOfflineSale(sale.id);
        } else {
          console.warn('⚠️ لا يوجد معرف لهذا البيع، لم يتم حذفه:', sale);
        }
      }

      console.log('✅ تمت مزامنة جميع المبيعات المحفوظة محليًا.');
    } catch (e) {
      console.error('❌ فشل في إرسال المبيعات المحفوظة:', e);
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
