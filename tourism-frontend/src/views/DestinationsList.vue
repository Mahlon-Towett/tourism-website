<template>
    <div class="destinations-page">
      <div class="page-header">
        <h1>Explore Destinations</h1>
        <p>Discover amazing places to visit in Kenya</p>
      </div>
      
      <div class="destinations-container">
        <aside class="filters-sidebar">
          <DestinationFilters />
        </aside>
        
        <main class="destinations-content">
          <div class="toolbar">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search destinations..." 
                @input="debouncedSearch"
              />
              <button @click="clearSearch" v-if="searchQuery" class="clear-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="sort-options">
              <label for="sort-select">Sort by:</label>
              <select id="sort-select" v-model="sortOption" @change="updateSort">
                <option value="rating">Rating</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          
          <div class="active-filters" v-if="hasActiveFilters">
            <div class="filters-summary">
              <span class="filter-label">Active filters:</span>
              <div class="filter-tags">
                <div v-if="activeCategory" class="filter-tag">
                  Category: {{ getCategoryLabel(activeCategory) }}
                  <button @click="removeFilter('category')" class="remove-filter">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div v-if="activePriceRange.min > 0 || activePriceRange.max" class="filter-tag">
                  Price: 
                  {{ activePriceRange.min ? `KES ${activePriceRange.min.toLocaleString()}` : 'KES 0' }} 
                  - 
                  {{ activePriceRange.max ? `KES ${activePriceRange.max.toLocaleString()}` : 'Any' }}
                  <button @click="removeFilter('priceRange')" class="remove-filter">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div v-if="activeRating" class="filter-tag">
                  Rating: {{ activeRating }}+ stars
                  <button @click="removeFilter('rating')" class="remove-filter">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div v-if="activeAmenities.length > 0" class="filter-tag">
                  Amenities: {{ activeAmenities.join(', ') }}
                  <button @click="removeFilter('amenities')" class="remove-filter">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <button @click="clearAllFilters" class="clear-all-btn">
                Clear All
              </button>
            </div>
          </div>
          
          <!-- Search Results Summary -->
          <div class="results-summary">
            <p v-if="searchQuery">
              Search results for "{{ searchQuery }}"
            </p>
            <p>{{ totalDestinations }} destinations found</p>
          </div>
          
          <!-- Destinations Grid -->
          <div class="destinations-grid">
            <LoadingSpinner v-if="loading" />
            
            <template v-else-if="destinations.length > 0">
              <DestinationCard 
                v-for="destination in destinations" 
                :key="destination._id" 
                :destination="destination"
              />
            </template>
            
            <div v-else class="no-results">
              <i class="fas fa-search"></i>
              <h3>No destinations found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button @click="clearAllFilters" class="reset-search-btn">
                Reset Search
              </button>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              :disabled="currentPage === 1" 
              @click="changePage(currentPage - 1)" 
              class="page-btn prev-btn"
            >
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            
            <div class="page-numbers">
              <template v-for="pageNum in displayedPages" :key="pageNum">
                <span v-if="pageNum === '...'" class="page-ellipsis">...</span>
                <button 
                  v-else 
                  :class="['page-num', { active: pageNum === currentPage }]" 
                  @click="changePage(pageNum)"
                >
                  {{ pageNum }}
                </button>
              </template>
            </div>
            
            <button 
              :disabled="currentPage === totalPages" 
              @click="changePage(currentPage + 1)" 
              class="page-btn next-btn"
            >
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import DestinationCard from '@/components/destinations/DestinationCard.vue';
  import DestinationFilters from '@/components/destinations/DestinationFilters.vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import debounce from 'lodash/debounce';
  
  export default {
    name: 'DestinationsList',
    components: {
      DestinationCard,
      DestinationFilters,
      LoadingSpinner
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      
      const searchQuery = ref('');
      const sortOption = ref('rating');
      
      // Get data from store
      const destinations = computed(() => store.getters['destinations/allDestinations']);
      const totalDestinations = computed(() => store.getters['destinations/totalDestinations']);
      const loading = computed(() => store.getters['destinations/isLoading']);
      const currentPage = computed(() => store.getters['destinations/pagination'].page);
      const totalPages = computed(() => store.getters['destinations/pagination'].totalPages);
      
      // Active filters
      const activeFilters = computed(() => store.getters['destinations/currentFilters']);
      const activeCategory = computed(() => activeFilters.value.category);
      const activePriceRange = computed(() => activeFilters.value.priceRange);
      const activeRating = computed(() => activeFilters.value.rating);
      const activeAmenities = computed(() => activeFilters.value.amenities);
      
      const hasActiveFilters = computed(() => {
        return (
          activeCategory.value || 
          activePriceRange.value.min > 0 || 
          activePriceRange.value.max || 
          activeRating.value || 
          activeAmenities.value.length > 0
        );
      });
      
      // Pagination
      const displayedPages = computed(() => {
        const pages = [];
        const maxDisplayed = 5;
        
        if (totalPages.value <= maxDisplayed) {
          // Show all pages
          for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
          }
        } else {
          // Show limited pages with ellipsis
          pages.push(1); // Always show first page
          
          if (currentPage.value <= 3) {
            // Near the start
            for (let i = 2; i <= 4; i++) {
              if (i <= totalPages.value) pages.push(i);
            }
            pages.push('...');
          } else if (currentPage.value >= totalPages.value - 2) {
            // Near the end
            pages.push('...');
            for (let i = totalPages.value - 3; i < totalPages.value; i++) {
              if (i > 1) pages.push(i);
            }
          } else {
            // In the middle
            pages.push('...');
            pages.push(currentPage.value - 1);
            pages.push(currentPage.value);
            pages.push(currentPage.value + 1);
            pages.push('...');
          }
          
          if (totalPages.value > 1) {
            pages.push(totalPages.value); // Always show last page
          }
        }
        
        return pages;
      });
      
      // Category mapping
      const categories = [
        { label: 'Beach', value: 'beach' },
        { label: 'Mountain', value: 'mountain' },
        { label: 'Forest', value: 'forest' },
        { label: 'Desert', value: 'desert' },
        { label: 'Urban', value: 'urban' },
        { label: 'Rural', value: 'rural' },
        { label: 'Historical', value: 'historical' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Relaxation', value: 'relaxation' }
      ];
      
      const getCategoryLabel = (value) => {
        const category = categories.find(cat => cat.value === value);
        return category ? category.label : value;
      };
      
      // Methods
      const fetchDestinations = () => {
        store.dispatch('destinations/fetchDestinations');
      };
      
      const debouncedSearch = debounce(() => {
        if (searchQuery.value.trim()) {
          store.dispatch('destinations/searchDestinations', searchQuery.value);
        } else {
          fetchDestinations();
        }
      }, 500);
      
      const clearSearch = () => {
        searchQuery.value = '';
        fetchDestinations();
      };
      
      const updateSort = () => {
        store.dispatch('destinations/setSortOption', sortOption.value);
      };
      
      const removeFilter = (filterType) => {
        switch (filterType) {
          case 'category':
            store.dispatch('destinations/updateFilters', { category: null });
            break;
          case 'priceRange':
            store.dispatch('destinations/updateFilters', { 
              priceRange: { min: 0, max: null } 
            });
            break;
          case 'rating':
            store.dispatch('destinations/updateFilters', { rating: null });
            break;
          case 'amenities':
            store.dispatch('destinations/updateFilters', { amenities: [] });
            break;
        }
      };
      
      const clearAllFilters = () => {
        searchQuery.value = '';
        store.dispatch('destinations/resetFilters');
      };
      
      const changePage = (page) => {
        store.dispatch('destinations/setPage', page);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      
      // Handle route query params
      const handleRouteParams = () => {
        const params = route.query;
        
        // Handle search query from route
        if (params.search) {
          searchQuery.value = params.search;
          store.dispatch('destinations/searchDestinations', params.search);
        }
        
        // Handle category filter from route
        if (params.category) {
          store.dispatch('destinations/updateFilters', { 
            category: params.category 
          });
        }
        
        // Handle page param
        if (params.page) {
          store.dispatch('destinations/setPage', parseInt(params.page));
        }
        
        // For other filters, we can add support here
      };
      
      // Watch for route changes
      watch(
        () => route.query,
        () => {
          handleRouteParams();
        }
      );
      
      // Initialize
      onMounted(() => {
        sortOption.value = store.getters['destinations/currentSort'];
        
        // Handle initial route params
        handleRouteParams();
        
        // Fallback: if no specific search or filters, fetch all destinations
        if (!route.query.search && !route.query.category) {
          fetchDestinations();
        }
      });
      
      return {
        searchQuery,
        sortOption,
        destinations,
        totalDestinations,
        loading,
        currentPage,
        totalPages,
        displayedPages,
        activeCategory,
        activePriceRange,
        activeRating,
        activeAmenities,
        hasActiveFilters,
        debouncedSearch,
        clearSearch,
        updateSort,
        removeFilter,
        clearAllFilters,
        changePage,
        getCategoryLabel
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .destinations-page {
    padding-bottom: 40px;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: #333;
    }
    
    p {
      font-size: 1.1rem;
      color: #666;
    }
  }
  
  .destinations-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .filters-sidebar {
    @media (max-width: 768px) {
      display: none; // Hide on mobile (we'd implement a mobile filter drawer)
    }
  }
  
  .destinations-content {
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .search-box {
        position: relative;
        flex: 1;
        max-width: 300px;
        
        input {
          width: 100%;
          padding: 10px 35px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
        
        .clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          
          &:hover {
            color: #666;
          }
        }
      }
      
      .sort-options {
        display: flex;
        align-items: center;
        
        label {
          margin-right: 10px;
          color: #666;
        }
        
        select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
      }
    }
    
    .active-filters {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
      
      .filters-summary {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        
        .filter-label {
          margin-right: 10px;
          color: #666;
          font-weight: 500;
        }
        
        .filter-tags {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          
          .filter-tag {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 5px 10px;
            margin: 5px;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            
            .remove-filter {
              background: none;
              border: none;
              color: #999;
              margin-left: 5px;
              cursor: pointer;
              
              &:hover {
                color: #f44336;
              }
            }
          }
        }
        
        .clear-all-btn {
          background: none;
          border: none;
          color: $primary-color;
          cursor: pointer;
          font-size: 0.9rem;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .results-summary {
      display: flex;
      justify-content: space-between;
      color: #666;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
    
    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
      
      .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        
        i {
          font-size: 3rem;
          color: #ccc;
          margin-bottom: 15px;
        }
        
        h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #666;
        }
        
        p {
          color: #999;
          margin-bottom: 20px;
        }
        
        .reset-search-btn {
          padding: 10px 20px;
          background-color: $primary-color;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          
          &:hover {
            background-color: darken($primary-color, 10%);
          }
        }
      }
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      
      .page-btn {
        padding: 8px 15px;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        color: #666;
        cursor: pointer;
        
        &:hover:not(:disabled) {
          background-color: #eee;
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        &.prev-btn {
          border-radius: 4px 0 0 4px;
          
          i {
            margin-right: 5px;
          }
        }
        
        &.next-btn {
          border-radius: 0 4px 4px 0;
          
          i {
            margin-left: 5px;
          }
        }
      }
      
      .page-numbers {
        display: flex;
        
        .page-num, .page-ellipsis {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          border-left: none;
          font-size: 0.9rem;
        }
        
        .page-num {
          background-color: #fff;
          color: #666;
          cursor: pointer;
          
          &:hover {
            background-color: #f5f5f5;
          }
          
          &.active {
            background-color: $primary-color;
            color: white;
            border-color: $primary-color;
            position: relative;
            z-index: 1;
          }
        }
        
        .page-ellipsis {
          color: #999;
          background-color: #f5f5f5;
        }
      }
    }
  }
  </style>