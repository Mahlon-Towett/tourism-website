import api from './api';

class DestinationsService {
  /**
   * Get all destinations with optional filters
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getDestinations(params = {}) {
    return api.get('/destinations', { params });
  }
  
  /**
   * Get a destination by ID
   * @param {string} id - Destination ID
   * @returns {Promise} - API response
   */
  async getDestinationById(id) {
    return api.get(`/destinations/${id}`);
  }
  
  /**
   * Search destinations by name/description
   * @param {string} query - Search query
   * @returns {Promise} - API response
   */
  async searchDestinations(query) {
    return api.get('/destinations', { 
      params: { 
        search: query 
      } 
    });
  }
  
  /**
   * Get reviews for a destination
   * @param {string} destinationId - Destination ID
   * @returns {Promise} - API response
   */
  async getDestinationReviews(destinationId) {
    return api.get(`/destinations/${destinationId}/reviews`);
  }
  
  /**
   * Add a review for a destination
   * @param {string} destinationId - Destination ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} - API response
   */
  async addReview(destinationId, reviewData) {
    return api.post(`/destinations/${destinationId}/reviews`, reviewData);
  }
}

export default new DestinationsService();