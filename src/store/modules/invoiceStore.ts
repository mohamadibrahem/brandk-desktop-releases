// src/store/modules/invoiceStore.ts
import { MutationTree, ActionTree, GetterTree } from 'vuex';

interface InvoiceState {
  currentInvoice: Record<string, any> | null;
}

const mutations: MutationTree<InvoiceState> = {
  setInvoice(state, invoice) {
    state.currentInvoice = invoice;
  },
  clearInvoice(state) {
    state.currentInvoice = null;
  },
};

const actions: ActionTree<InvoiceState, any> = {
  setInvoice({ commit }, invoice: Record<string, any>) {
    commit('setInvoice', invoice);
  },
  clearInvoice({ commit }) {
    commit('clearInvoice');
  },
};

const getters: GetterTree<InvoiceState, any> = {
  currentInvoice: (state) => state.currentInvoice,
};

export default {
  namespaced: true,
  state: (): InvoiceState => ({
    currentInvoice: null,
  }),
  mutations,
  actions,
  getters,
};
