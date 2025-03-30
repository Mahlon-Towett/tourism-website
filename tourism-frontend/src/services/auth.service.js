import api from './api';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  async register(userData) {
    return api.post('/auth/register', userData);
  }
  
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise} - API response
   */
  async login(credentials) {
    return api.post('/auth/login', credentials);
  }
  
  /**
   * Logout user
   * @returns {Promise} - API response
   */
  async logout() {
    return api.get('/auth/logout');
  }
  
  /**
   * Get current user profile
   * @returns {Promise} - API response
   */
  async getUserProfile() {
    return api.get('/auth/me');
  }
  
  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise} - API response
   */
  async updateProfile(userData) {
    return api.put('/auth/updatedetails', userData);
  }
  
  /**
   * Update user password
   * @param {Object} passwordData - Password data
   * @returns {Promise} - API response
   */
  async updatePassword(passwordData) {
    return api.put('/auth/updatepassword', passwordData);
  }
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} - API response
   */
  async forgotPassword(email) {
    return api.post('/auth/forgotpassword', { email });
  }
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} - API response
   */
  async resetPassword(token, password) {
    return api.put(`/auth/resetpassword/${token}`, { password });
  }
}

export default new AuthService();