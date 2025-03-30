<template>
    <div class="filters-container">
      <div class="filters-header">
        <h3>Filter Destinations</h3>
        <button @click="resetAllFilters" class="reset-btn">Reset All</button>
      </div>
      
      <!-- Category Filter -->
      <div class="filter-section">
        <h4>Category</h4>
        <div class="filter-options">
          <div 
            v-for="category in categories" 
            :key="category.value" 
            :class="['filter-option', { active: filters.category === category.value }]"
            @click="updateCategoryFilter(category.value)"
          >
            <i :class="category.icon"></i>
            <span>{{ category.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- Price Range Filter -->
      <div class="filter-section">
        <h4>Price Range</h4>
        <div class="price-range">
          <div class="price-inputs">
            <div class="price-input">
              <label for="min-price">Min</label>
              <input 
                type="number" 
                id="min-price" 
                v-model.number="priceRange.min" 
                min="0" 
                @change="updatePriceFilter"
              />
            </div>
            <span class="price-separator">-</span>
            <div class="price-input">
              <label for="max-price">Max</label>
              <input 
                type="number" 
                id="max-price" 
                v-model.number="priceRange.max" 
                min="0" 
                @change="updatePriceFilter"
              />
            </div>
          </div>
          <div class="price-slider">
            <input 
              type="range" 
              min="0" 
              :max="maxPriceLimit" 
              step="500" 
              v-model.number="priceRange.min" 
              @input="updatePriceFilter"
            />
            <input 
              type="range" 
              min="0" 
              :max="maxPriceLimit" 
              step="500" 
              v-model.number="priceRange.max" 
              @input="updatePriceFilter"
            />
          </div>
        </div>
      </div>
      
      <!-- Rating Filter -->
      <div class="filter-section">
        <h4>Rating</h4>
        <div class="rating-options">
          <div 
            v-for="rating in [5, 4, 3, 2, 1]" 
            :key="rating" 
            :class="['rating-option', { active: filters.rating === rating }]"
            @click="updateRatingFilter(rating)"
          >
            <div class="stars">
              <i 
                v-for="star in 5" 
                :key="star" 
                class="fas fa-star"
                :class="{ 'active': star <= rating }"
              ></i>
            </div>
            <span>{{ rating }}+ <span class="rating-text">stars</span></span>
          </div>
        </div>
      </div>
      
      <!-- Amenities Filter -->
      <div class="filter-section">
        <h4>Amenities</h4>
        <div class="amenities-list">
          <div 
            v-for="amenity in amenities" 
            :key="amenity.value" 
            class="amenity-checkbox"
          >
            <label>
              <input 
                type="checkbox" 
                :value="amenity.value" 
                v-model="selectedAmenities" 
                @change="updateAmenitiesFilter"
              />
              <span class="checkbox-label">
                <i :class="amenity.icon"></i>
                {{ amenity.label }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'DestinationFilters',
    setup() {
      const store = useStore();
      
      // Get initial filters from store
      const storeFilters = computed(() => store.getters['destinations/currentFilters']);
      
      // Local filters state
      const filters = reactive({
        category: storeFilters.value.category,
        priceRange: { ...storeFilters.value.priceRange },
        rating: storeFilters.value.rating,
        amenities: [...storeFilters.value.amenities]
      });
      
      // Separate reactive ref for price range to handle slider UI
      const priceRange = reactive({
        min: storeFilters.value.priceRange.min || 0,
        max: storeFilters.value.priceRange.max || 50000
      });
      
      const selectedAmenities = ref([...storeFilters.value.amenities]);
      
      // Maximum price for slider
      const maxPriceLimit = 50000;
      
      // Watch for store filter changes
      watch(() => storeFilters.value, (newFilters) => {
        filters.category = newFilters.category;
        filters.priceRange = { ...newFilters.priceRange };
        filters.rating = newFilters.rating;
        filters.amenities = [...newFilters.amenities];
        
        priceRange.min = newFilters.priceRange.min || 0;
        priceRange.max = newFilters.priceRange.max || maxPriceLimit;
        
        selectedAmenities.value = [...newFilters.amenities];
      });
      
      // Categories with icons
      const categories = [
        { label: 'Beach', value: 'beach', icon: 'fas fa-umbrella-beach' },
        { label: 'Mountain', value: 'mountain', icon: 'fas fa-mountain' },
        { label: 'Forest', value: 'forest', icon: 'fas fa-tree' },
        { label: 'Desert', value: 'desert', icon: 'fas fa-sun' },
        { label: 'Urban', value: 'urban', icon: 'fas fa-city' },
        { label: 'Rural', value: 'rural', icon: 'fas fa-home' },
        { label: 'Historical', value: 'historical', icon: 'fas fa-landmark' },
        { label: 'Cultural', value: 'cultural', icon: 'fas fa-theater-masks' },
        { label: 'Adventure', value: 'adventure', icon: 'fas fa-hiking' },
        { label: 'Relaxation', value: 'relaxation', icon: 'fas fa-hot-tub' }
      ];
      
      // Amenities with icons
      const amenities = [
        { label: 'WiFi', value: 'wifi', icon: 'fas fa-wifi' },
        { label: 'Swimming Pool', value: 'pool', icon: 'fas fa-swimming-pool' },
        { label: 'Parking', value: 'parking', icon: 'fas fa-parking' },
        { label: 'Restaurant', value: 'restaurant', icon: 'fas fa-utensils' },
        { label: 'Gym', value: 'gym', icon: 'fas fa-dumbbell' },
        { label: 'Spa', value: 'spa', icon: 'fas fa-spa' },
        { label: 'Bar', value: 'bar', icon: 'fas fa-glass-martini-alt' },
        { label: 'Beach Access', value: 'beach', icon: 'fas fa-umbrella-beach' },
        { label: 'Air Conditioning', value: 'ac', icon: 'fas fa-snowflake' },
        { label: 'Breakfast', value: 'breakfast', icon: 'fas fa-coffee' }
      ];
      
      // Update filters in store
      const updateFilters = () => {
        store.dispatch('destinations/updateFilters', {
          category: filters.category,
          priceRange: {
            min: priceRange.min,
            max: priceRange.max === maxPriceLimit ? null : priceRange.max
          },
          rating: filters.rating,
          amenities: selectedAmenities.value
        });
      };
      
      // Filter update handlers
      const updateCategoryFilter = (category) => {
        filters.category = filters.category === category ? null : category;
        updateFilters();
      };
      
      const updatePriceFilter = () => {
        // Ensure min <= max
        if (priceRange.min > priceRange.max) {
          priceRange.min = priceRange.max;
        }
        updateFilters();
      };
      
      const updateRatingFilter = (rating) => {
        filters.rating = filters.rating === rating ? null : rating;
        updateFilters();
      };
      
      const updateAmenitiesFilter = () => {
        updateFilters();
      };
      
      const resetAllFilters = () => {
        store.dispatch('destinations/resetFilters');
      };
      
      return {
        filters,
        priceRange,
        selectedAmenities,
        categories,
        amenities,
        maxPriceLimit,
        updateCategoryFilter,
        updatePriceFilter,
        updateRatingFilter,
        updateAmenitiesFilter,
        resetAllFilters
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .filters-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }
    
    .reset-btn {
      background: none;
      border: none;
      color: $primary-color;
      font-size: 0.9rem;
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .filter-section {
    margin-bottom: 25px;
    
    h4 {
      margin: 0 0 12px;
      font-size: 1rem;
      color: #555;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
  }
  
  .filter-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
    
    .filter-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border-radius: 6px;
      background-color: #f5f5f5;
      cursor: pointer;
      transition: all 0.2s;
      
      i {
        font-size: 1.2rem;
        margin-bottom: 5px;
        color: #666;
      }
      
      span {
        font-size: 0.8rem;
        color: #555;
        text-align: center;
      }
      
      &:hover {
        background-color: #eee;
      }
      
      &.active {
        background-color: rgba($primary-color, 0.1);
        border: 1px solid $primary-color;
        
        i, span {
          color: $primary-color;
        }
      }
    }
  }
  
  .price-range {
    .price-inputs {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      
      .price-input {
        flex: 1;
        
        label {
          display: block;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
      }
      
      .price-separator {
        margin: 0 10px;
        color: #666;
        margin-top: 20px;
      }
    }
    
    .price-slider {
      position: relative;
      height: 5px;
      background-color: #eee;
      border-radius: 3px;
      margin: 30px 0 10px;
      
      input[type="range"] {
        position: absolute;
        width: 100%;
        height: 5px;
        background: none;
        pointer-events: none;
        -webkit-appearance: none;
        
        &::-webkit-slider-thumb {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          background: $primary-color;
          pointer-events: auto;
          -webkit-appearance: none;
          cursor: pointer;
        }
        
        &::-moz-range-thumb {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          background: $primary-color;
          pointer-events: auto;
          -moz-appearance: none;
          cursor: pointer;
        }
      }
    }
  }
  
  .rating-options {
    .rating-option {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      
      .stars {
        margin-right: 10px;
        
        i {
          color: #ddd;
          margin-right: 2px;
          
          &.active {
            color: #ffc107;
          }
        }
      }
      
      .rating-text {
        color: #999;
        font-size: 0.8rem;
      }
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &.active {
        background-color: rgba($primary-color, 0.1);
        border: 1px solid rgba($primary-color, 0.3);
      }
    }
  }
  
  .amenities-list {
    max-height: 200px;
    overflow-y: auto;
    
    .amenity-checkbox {
      margin-bottom: 10px;
      
      label {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        input[type="checkbox"] {
          margin-right: 10px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          
          i {
            margin-right: 8px;
            color: $primary-color;
          }
        }
      }
    }
  }
  
  @media (max-width: 576px) {
    .filter-options {
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    }
  }
  </style>