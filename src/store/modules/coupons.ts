// src/store/modules/coupons.ts
import http from '@/api/http';  // التأكد من أن لديك إعداد Axios
import { getOfflineCoupons, saveCouponOffline, clearOfflineCoupons } from '@/services/localDB';

// types
export interface Coupon {
  id: number;
  code: string;
  discount: number;
  expiry_date: string; // يمكن إضافة خصائص إضافية حسب الحاجة
}

export interface CouponsState {
  coupons: Coupon[];
  isOnline: boolean;
  loading: boolean;
  error: string | null;
}

const state: CouponsState = {
  coupons: [],
  isOnline: navigator.onLine,
  loading: false,
  error: null,
};

const mutations = {
  setCoupons(state: CouponsState, coupons: Coupon[]) {
    state.coupons = coupons;
  },
  setLoading(state: CouponsState, loading: boolean) {
    state.loading = loading;
  },
  setError(state: CouponsState, error: string | null) {
    state.error = error;
  },
  setOnlineStatus(state: CouponsState, status: boolean) {
    state.isOnline = status;
  },
};

const actions = {
  async fetchCoupons({ commit, state }: any) {
    commit('setLoading', true);
    commit('setError', null);
  
    try {
      if (state.isOnline) {
        // جلب الكوبونات من API
        const response = await http.get('/coupons');
        const coupons = response.data.data;
  
        commit('setCoupons', coupons);
  
        await clearOfflineCoupons(); // امسح التخزين القديم
        for (const coupon of coupons) {
          await saveCouponOffline(coupon); // خزّن كل كوبون
        }
      } else {
        // في حالة الأوفلاين، جلب الكوبونات من IndexedDB
        const offlineCoupons = await getOfflineCoupons();
        console.log('🎟️ تم تحميل الكوبونات من IndexedDB:', offlineCoupons);
        commit('setCoupons', offlineCoupons);
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
  getCoupons: (state: CouponsState) => state.coupons,
  isOnline: (state: CouponsState) => state.isOnline,
  isLoading: (state: CouponsState) => state.loading,
  getError: (state: CouponsState) => state.error,
};

// تصدير كـ module
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
