import authService from '@/services/auth.service';
import router from '@/router';

export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    authError: null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    isAdmin: state => state.user && state.user.role === 'admin',
    authError: state => state.authError
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      state.authError = null;
    }
  },
  actions: {
    async register({ commit, dispatch }, userData) {
      try {
        dispatch('setLoading', true, { root: true });
        const response = await authService.register(userData);
        
        commit('SET_TOKEN', response.token);
        await dispatch('getUserProfile');
        
        // Redirect to home page after successful registration
        router.push('/');
        
        dispatch('setNotification', {
          message: 'Registration successful! Welcome to our platform.',
          type: 'success'
        }, { root: true });
        
        return response;
      } catch (error) {
        commit('SET_AUTH_ERROR', error.response?.data?.error || 'Registration failed');
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Registration failed',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    async login({ commit, dispatch }, credentials) {
      try {
        dispatch('setLoading', true, { root: true });
        const response = await authService.login(credentials);
        
        commit('SET_TOKEN', response.token);
        await dispatch('getUserProfile');
        
        // Redirect to the originally requested page or home
        const redirectPath = router.currentRoute.value.query.redirect || '/';
        router.push(redirectPath);
        
        dispatch('setNotification', {
          message: 'Login successful!',
          type: 'success'
        }, { root: true });
        
        return response;
      } catch (error) {
        commit('SET_AUTH_ERROR', error.response?.data?.error || 'Login failed');
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Login failed. Please check your credentials.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    async getUserProfile({ commit, dispatch, state }) {
      if (!state.token) return;
      
      try {
        dispatch('setLoading', true, { root: true });
        const response = await authService.getUserProfile();
        commit('SET_USER', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        if (error.response?.status === 401) {
          // Token might be expired or invalid
          dispatch('logout');
        }
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    async logout({ commit, dispatch }) {
      try {
        // Call logout API if needed
        await authService.logout();
      } catch (error) {
        console.warn('Logout API call failed, continuing with local logout');
      } finally {
        // Clear auth state regardless of API call result
        commit('CLEAR_AUTH');
        
        // Clear auth sensitive data from localStorage
        localStorage.removeItem('vuex');
        
        // Redirect to login page
        router.push('/login');
        
        dispatch('setNotification', {
          message: 'You have been logged out successfully',
          type: 'info'
        }, { root: true });
      }
    },
    
    async forgotPassword({ dispatch }, email) {
      try {
        dispatch('setLoading', true, { root: true });
        await authService.forgotPassword(email);
        
        dispatch('setNotification', {
          message: 'Password reset instructions have been sent to your email',
          type: 'success'
        }, { root: true });
      } catch (error) {
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to send password reset email',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    async resetPassword({ dispatch }, { token, password }) {
      try {
        dispatch('setLoading', true, { root: true });
        await authService.resetPassword(token, password);
        
        dispatch('setNotification', {
          message: 'Password has been reset successfully. You can now login.',
          type: 'success'
        }, { root: true });
        
        router.push('/login');
      } catch (error) {
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to reset password',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    async updateUserProfile({ commit, dispatch }, userData) {
      try {
        dispatch('setLoading', true, { root: true });
        const response = await authService.updateProfile(userData);
        
        commit('SET_USER', response.data);
        
        dispatch('setNotification', {
          message: 'Profile updated successfully',
          type: 'success'
        }, { root: true });
        
        return response.data;
      } catch (error) {
        dispatch('setNotification', {
          message: error.response?.data?.error || 'Failed to update profile',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        dispatch('setLoading', false, { root: true });
      }
    },
    
    // Check auth state on app initialization
    checkAuthState({ dispatch, state }) {
      if (state.token) {
        dispatch('getUserProfile').catch(() => {
          dispatch('logout');
        });
      }
    }
  }
};