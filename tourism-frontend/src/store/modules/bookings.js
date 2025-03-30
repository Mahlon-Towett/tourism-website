import bookingsService from '@/services/bookings.service';
import router from '@/router';

export default {
  namespaced: true,
  state: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    bookingDates: {
      startDate: null,
      endDate: null
    },
    guestCounts: {
      adults: 1,
      children: 0
    }
  },
  getters: {
    allBookings: state => state.bookings,
    currentBooking: state => state.currentBooking,
    isLoading: state => state.loading,
    bookingDates: state => state.bookingDates,
    guestCounts: state => state.guestCounts,
    totalGuests: state => state.guestCounts.adults + state.guestCounts.children,
    hasBookingDetails: state => 
      state.bookingDates.startDate && 
      state.bookingDates.endDate && 
      state.guestCounts.adults > 0
  },
  mutations: {
    SET_BOOKINGS(state, bookings) {
      state.bookings = bookings;
    },
    SET_CURRENT_BOOKING(state, booking) {
      state.currentBooking = booking;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_BOOKING_DATES(state, { startDate, endDate }) {
      state.bookingDates = { startDate, endDate };
    },
    SET_GUEST_COUNTS(state, { adults, children }) {
      state.guestCounts = { 
        adults: parseInt(adults, 10) || 1, 
        children: parseInt(children, 10) || 0 
      };
    },
    CLEAR_BOOKING_FORM(state) {
      state.bookingDates = { startDate: null, endDate: null };
      state.guestCounts = { adults: 1, children: 0 };
    }
  },
  actions: {
    async fetchUserBookings({ commit, dispatch }) {
      try {
        commit('SET_LOADING', true);
        const response = await bookingsService.getUserBookings();
        commit('SET_BOOKINGS', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Failed to load your bookings. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchBookingById({ commit, dispatch }, bookingId) {
      try {
        commit('SET_LOADING', true);
        const response = await bookingsService.getBookingById(bookingId);
        commit('SET_CURRENT_BOOKING', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Failed to load booking details. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createBooking({ commit, state, dispatch }, destinationId) {
      try {
        commit('SET_LOADING', true);
        
        // Create booking payload
        const bookingData = {
          startDate: state.bookingDates.startDate,
          endDate: state.bookingDates.endDate,
          guests: state.guestCounts
        };
        
        const response = await bookingsService.createBooking(destinationId, bookingData);
        commit('SET_CURRENT_BOOKING', response.data);
        
        // Clear booking form after successful booking
        commit('CLEAR_BOOKING_FORM');
        
        dispatch('setNotification', {
          message: 'Booking created successfully!',
          type: 'success'
        }, { root: true });
        
        // Redirect to payment page
        router.push(`/payment/${response.data._id}`);
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || error.message);
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to create booking. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async cancelBooking({ commit, dispatch }, { bookingId, reason }) {
      try {
        commit('SET_LOADING', true);
        const response = await bookingsService.cancelBooking(bookingId, reason);
        
        // Update booking in the list
        dispatch('fetchUserBookings');
        
        dispatch('setNotification', {
          message: 'Booking cancelled successfully.',
          type: 'success'
        }, { root: true });
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || error.message);
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to cancel booking. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    setBookingDates({ commit }, { startDate, endDate }) {
      commit('SET_BOOKING_DATES', { startDate, endDate });
    },
    
    setGuestCounts({ commit }, { adults, children }) {
      commit('SET_GUEST_COUNTS', { adults, children });
    },
    
    clearBookingForm({ commit }) {
      commit('CLEAR_BOOKING_FORM');
    }
  }
};