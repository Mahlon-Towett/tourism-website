import api from './api';

class BookingsService {
  /**
   * Get all bookings for current user
   * @returns {Promise} - API response
   */
  async getUserBookings() {
    return api.get('/bookings');
  }
  
  /**
   * Get booking by ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise} - API response
   */
  async getBookingById(bookingId) {
    return api.get(`/bookings/${bookingId}`);
  }
  
  /**
   * Create a new booking
   * @param {string} destinationId - Destination ID
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - API response
   */
  async createBooking(destinationId, bookingData) {
    return api.post(`/destinations/${destinationId}/bookings`, bookingData);
  }
  
  /**
   * Update booking
   * @param {string} bookingId - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - API response
   */
  async updateBooking(bookingId, bookingData) {
    return api.put(`/bookings/${bookingId}`, bookingData);
  }
  
  /**
   * Cancel booking
   * @param {string} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} - API response
   */
  async cancelBooking(bookingId, reason) {
    return api.put(`/bookings/${bookingId}/cancel`, { reason });
  }
}

export default new BookingsService();