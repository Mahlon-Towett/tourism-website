import paymentsService from '@/services/payments.service';
import router from '@/router';

export default {
  namespaced: true,
  state: {
    payments: [],
    currentPayment: null,
    paymentStatus: null,
    loading: false,
    error: null
  },
  getters: {
    allPayments: state => state.payments,
    currentPayment: state => state.currentPayment,
    paymentStatus: state => state.paymentStatus,
    isLoading: state => state.loading
  },
  mutations: {
    SET_PAYMENTS(state, payments) {
      state.payments = payments;
    },
    SET_CURRENT_PAYMENT(state, payment) {
      state.currentPayment = payment;
    },
    SET_PAYMENT_STATUS(state, status) {
      state.paymentStatus = status;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_PAYMENT_DATA(state) {
      state.currentPayment = null;
      state.paymentStatus = null;
    }
  },
  actions: {
    async fetchUserPayments({ commit, dispatch }) {
      try {
        commit('SET_LOADING', true);
        const response = await paymentsService.getUserPayments();
        commit('SET_PAYMENTS', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Failed to load payment history. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async initiatePayment({ commit, dispatch }, { bookingId, phoneNumber }) {
      try {
        commit('SET_LOADING', true);
        
        const paymentData = {
          bookingId,
          phoneNumber
        };
        
        const response = await paymentsService.initiatePayment(paymentData);
        commit('SET_CURRENT_PAYMENT', response.data.payment);
        
        dispatch('setNotification', {
          message: 'Payment initiated. Please check your phone to complete the transaction.',
          type: 'info'
        }, { root: true });
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || error.message);
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to initiate payment. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async checkPaymentStatus({ commit, dispatch }, requestId) {
      try {
        commit('SET_LOADING', true);
        const response = await paymentsService.checkPaymentStatus(requestId);
        
        commit('SET_PAYMENT_STATUS', response.data.payment.status);
        
        if (response.data.payment.status === 'completed') {
          dispatch('setNotification', {
            message: 'Payment completed successfully!',
            type: 'success'
          }, { root: true });
          
          // Update bookings list after successful payment
          dispatch('bookings/fetchUserBookings', null, { root: true });
          
          // Redirect to bookings page after short delay
          setTimeout(() => {
            router.push('/profile/bookings');
          }, 3000);
        } else if (response.data.payment.status === 'failed') {
          dispatch('setNotification', {
            message: 'Payment failed. Please try again.',
            type: 'error'
          }, { root: true });
        }
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || error.message);
        dispatch('setNotification', {
          message: 'Failed to check payment status. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    clearPaymentData({ commit }) {
      commit('CLEAR_PAYMENT_DATA');
    }
  }
};