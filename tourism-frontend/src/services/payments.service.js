import api from './api';

class PaymentsService {
  /**
   * Get all payments for current user
   * @returns {Promise} - API response
   */
  async getUserPayments() {
    return api.get('/payments');
  }
  
  /**
   * Initiate payment for a booking
   * @param {Object} paymentData - Payment data with bookingId and phoneNumber
   * @returns {Promise} - API response
   */
  async initiatePayment(paymentData) {
    return api.post('/payments/initiate', paymentData);
  }
  
  /**
   * Check payment status
   * @param {string} requestId - Checkout request ID
   * @returns {Promise} - API response
   */
  async checkPaymentStatus(requestId) {
    return api.get(`/payments/status/${requestId}`);
  }
}

export default new PaymentsService();