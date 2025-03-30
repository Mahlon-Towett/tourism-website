import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// Import modules
import auth from './modules/auth';
import destinations from './modules/destinations';
import bookings from './modules/bookings';
import payments from './modules/payments';

export default createStore({
  state: {
    notification: null,
    loading: false
  },
  getters: {
    notification: state => state.notification,
    isLoading: state => state.loading
  },
  mutations: {
    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
    },
    CLEAR_NOTIFICATION(state) {
      state.notification = null;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    }
  },
  actions: {
    setNotification({ commit }, notification) {
      commit('SET_NOTIFICATION', notification);
      // Auto-clear notification after timeout
      setTimeout(() => {
        commit('CLEAR_NOTIFICATION');
      }, notification.timeout || 5000);
    },
    clearNotification({ commit }) {
      commit('CLEAR_NOTIFICATION');
    },
    setLoading({ commit }, status) {
      commit('SET_LOADING', status);
    }
  },
  modules: {
    auth,
    destinations,
    bookings,
    payments
  },
  plugins: [
    createPersistedState({
      paths: ['auth.token', 'auth.user']
    })
  ]
});