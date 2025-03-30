import destinationsService from '@/services/destinations.service';

export default {
  namespaced: true,
  state: {
    destinations: [],
    destination: null,
    totalDestinations: 0,
    loading: false,
    error: null,
    filters: {
      category: null,
      priceRange: { min: 0, max: null },
      location: null,
      amenities: [],
      rating: null
    },
    sortBy: 'rating', // rating, priceAsc, priceDesc, name
    pagination: {
      page: 1,
      limit: 12,
      totalPages: 0
    }
  },
  getters: {
    allDestinations: state => state.destinations,
    featuredDestinations: state => state.destinations.filter(d => d.rating >= 4).slice(0, 4),
    currentDestination: state => state.destination,
    destinationById: state => id => 
      state.destinations.find(d => d._id === id) || state.destination,
    isLoading: state => state.loading,
    totalDestinations: state => state.totalDestinations,
    currentFilters: state => state.filters,
    currentSort: state => state.sortBy,
    pagination: state => state.pagination
  },
  mutations: {
    SET_DESTINATIONS(state, { destinations, totalDestinations, totalPages }) {
      state.destinations = destinations;
      state.totalDestinations = totalDestinations || destinations.length;
      state.pagination.totalPages = totalPages || Math.ceil(state.totalDestinations / state.pagination.limit);
    },
    SET_DESTINATION(state, destination) {
      state.destination = destination;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    RESET_FILTERS(state) {
      state.filters = {
        category: null,
        priceRange: { min: 0, max: null },
        location: null,
        amenities: [],
        rating: null
      };
    },
    SET_SORT(state, sortOption) {
      state.sortBy = sortOption;
    },
    SET_PAGE(state, page) {
      state.pagination.page = page;
    },
    SET_LIMIT(state, limit) {
      state.pagination.limit = limit;
    }
  },
  actions: {
    async fetchDestinations({ commit, state, dispatch }) {
      try {
        commit('SET_LOADING', true);
        
        // Build query params from filters and pagination
        const params = {
          page: state.pagination.page,
          limit: state.pagination.limit,
          sort: state.sortBy,
          ...buildFilterParams(state.filters)
        };
        
        const response = await destinationsService.getDestinations(params);
        
        commit('SET_DESTINATIONS', {
          destinations: response.data,
          totalDestinations: response.count,
          totalPages: Math.ceil(response.count / state.pagination.limit)
        });
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Failed to load destinations. Please try again later.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchDestinationById({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        const response = await destinationsService.getDestinationById(id);
        commit('SET_DESTINATION', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Failed to load destination details. Please try again later.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async searchDestinations({ commit, dispatch }, searchTerm) {
      try {
        commit('SET_LOADING', true);
        const response = await destinationsService.searchDestinations(searchTerm);
        commit('SET_DESTINATIONS', {
          destinations: response.data,
          totalDestinations: response.count
        });
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        dispatch('setNotification', {
          message: 'Search failed. Please try again.',
          type: 'error'
        }, { root: true });
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    updateFilters({ commit, dispatch }, filters) {
      commit('SET_FILTERS', filters);
      // Reset to first page when filters change
      commit('SET_PAGE', 1);
      // Fetch destinations with new filters
      dispatch('fetchDestinations');
    },
    
    resetFilters({ commit, dispatch }) {
      commit('RESET_FILTERS');
      commit('SET_PAGE', 1);
      dispatch('fetchDestinations');
    },
    
    setSortOption({ commit, dispatch }, sortOption) {
      commit('SET_SORT', sortOption);
      dispatch('fetchDestinations');
    },
    
    setPage({ commit, dispatch }, page) {
      commit('SET_PAGE', page);
      dispatch('fetchDestinations');
    },
    
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit);
      commit('SET_PAGE', 1); // Reset to first page when changing limit
      dispatch('fetchDestinations');
    }
  }
};

// Helper function to build filter params for API
function buildFilterParams(filters) {
  const params = {};
  
  if (filters.category) {
    params.category = filters.category;
  }
  
  if (filters.priceRange.min > 0) {
    params['pricePerNight[gte]'] = filters.priceRange.min;
  }
  
  if (filters.priceRange.max) {
    params['pricePerNight[lte]'] = filters.priceRange.max;
  }
  
  if (filters.location) {
    params['location.city'] = filters.location;
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    params.amenities = filters.amenities.join(',');
  }
  
  if (filters.rating) {
    params['rating[gte]'] = filters.rating;
  }
  
  return params;
}