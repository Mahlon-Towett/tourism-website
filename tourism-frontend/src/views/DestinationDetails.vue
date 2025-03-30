<template>
    <div class="destination-details-page">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="destination" class="destination-container">
        <!-- Image Gallery -->
        <section class="gallery-section">
          <div class="main-image">
            <img :src="mainImage" :alt="destination.name" />
          </div>
          
          <div class="thumbnail-gallery">
            <div 
              v-for="(image, index) in destination.images" 
              :key="index" 
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="setMainImage(index)"
            >
              <img :src="image.url" :alt="image.alt || destination.name" />
            </div>
          </div>
        </section>
        
        <div class="content-container">
          <!-- Main Info -->
          <main class="main-content">
            <div class="destination-header">
              <h1>{{ destination.name }}</h1>
              <div class="destination-rating">
                <div class="stars">
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    :class="[
                      'fas', 
                      { 
                        'fa-star': star <= Math.round(destination.rating), 
                        'fa-star-half-alt': star === Math.ceil(destination.rating) && destination.rating % 1 !== 0,
                        'far fa-star': star > Math.round(destination.rating)
                      }
                    ]"
                  ></i>
                </div>
                <span>{{ destination.rating.toFixed(1) }} ({{ destination.reviews?.length || 0 }} reviews)</span>
              </div>
              
              <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ locationText }}</span>
              </div>
            </div>
            
            <div class="category-badge">
              <i :class="getCategoryIcon(destination.category)"></i>
              {{ destination.category }}
            </div>
            
            <section class="description-section">
              <h2>About This Destination</h2>
              <p>{{ destination.description }}</p>
            </section>
            
            <section class="amenities-section">
              <h2>Amenities</h2>
              <div class="amenities-grid">
                <div v-for="(amenity, index) in destination.amenities" :key="index" class="amenity-item">
                  <i :class="getAmenityIcon(amenity)"></i>
                  <span>{{ amenity }}</span>
                </div>
              </div>
            </section>
            
            <section v-if="destination.features && destination.features.length" class="features-section">
              <h2>Features</h2>
              <ul class="features-list">
                <li v-for="(feature, index) in destination.features" :key="index">
                  <i class="fas fa-check-circle"></i>
                  {{ feature }}
                </li>
              </ul>
            </section>
            
            <section class="map-section">
              <h2>Location</h2>
              <div class="map-container">
                <!-- Map would be implemented here with Mapbox or Google Maps -->
                <div class="map-placeholder">
                  <i class="fas fa-map-marked-alt"></i>
                  <p>Map is loading...</p>
                </div>
              </div>
              
              <div class="address-details">
                <p><i class="fas fa-map-marker-alt"></i> {{ destination.location?.address || 'Address not available' }}</p>
                <p><i class="fas fa-city"></i> {{ destination.location?.city || 'City not specified' }}</p>
                <p><i class="fas fa-globe-africa"></i> {{ destination.location?.country || 'Country not specified' }}</p>
              </div>
            </section>
            
            <section class="reviews-section">
              <h2>Reviews</h2>
              
              <div v-if="destination.reviews && destination.reviews.length > 0" class="reviews-list">
                <div v-for="(review, index) in destination.reviews" :key="index" class="review-card">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="avatar">{{ getInitials(review.user?.name || 'Anonymous') }}</div>
                      <div class="reviewer-name">{{ review.user?.name || 'Anonymous' }}</div>
                    </div>
                    
                    <div class="review-rating">
                      <div class="stars">
                        <i 
                          v-for="star in 5" 
                          :key="star" 
                          class="fas fa-star"
                          :class="{ active: star <= review.rating }"
                        ></i>
                      </div>
                      <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <h3 class="review-title">{{ review.title }}</h3>
                  <p class="review-text">{{ review.text }}</p>
                </div>
              </div>
              
              <div v-else class="no-reviews">
                <p>No reviews yet. Be the first to review this destination!</p>
              </div>
              
              <div v-if="isAuthenticated" class="add-review">
                <h3>Add Your Review</h3>
                <form @submit.prevent="submitReview" class="review-form">
                  <div class="form-group">
                    <label for="review-title">Title</label>
                    <input 
                      type="text" 
                      id="review-title" 
                      v-model="reviewForm.title" 
                      placeholder="Give your review a title" 
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label>Rating</label>
                    <div class="rating-select">
                      <div 
                        v-for="rating in 5" 
                        :key="rating" 
                        class="rating-star"
                        :class="{ active: rating <= reviewForm.rating }"
                        @click="reviewForm.rating = rating"
                      >
                        <i class="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="review-text">Review</label>
                    <textarea 
                      id="review-text" 
                      v-model="reviewForm.text" 
                      placeholder="Share your experience" 
                      rows="4" 
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" class="submit-review-btn" :disabled="reviewSubmitting">
                    {{ reviewSubmitting ? 'Submitting...' : 'Submit Review' }}
                  </button>
                </form>
              </div>
              
              <div v-else class="login-to-review">
                <p>Please <router-link to="/login">login</router-link> to leave a review.</p>
              </div>
            </section>
          </main>
          
          <!-- Booking Sidebar -->
          <aside class="booking-sidebar">
            <div class="booking-card">
              <div class="price-section">
                <div class="price-display">
                  <span v-if="destination.specialPrice" class="original-price">KES {{ formatPrice(destination.pricePerNight) }}</span>
                  <span class="current-price">KES {{ formatPrice(destination.specialPrice || destination.pricePerNight) }}</span>
                  <span class="per-night">per night</span>
                </div>
                
                <div v-if="destination.specialPrice" class="special-price-note">
                  <i class="fas fa-tag"></i> Special offer available
                </div>
              </div>
              
              <form @submit.prevent="checkAvailability" class="booking-form">
                <div class="form-group date-range">
                  <div class="date-input">
                    <label for="check-in">Check-in</label>
                    <input 
                      type="date" 
                      id="check-in" 
                      v-model="bookingForm.startDate" 
                      :min="today" 
                      required
                    />
                  </div>
                  
                  <div class="date-input">
                    <label for="check-out">Check-out</label>
                    <input 
                      type="date" 
                      id="check-out" 
                      v-model="bookingForm.endDate" 
                      :min="minEndDate" 
                      required
                    />
                  </div>
                </div>
                
                <div class="form-group guests">
                  <div class="guest-input">
                    <label for="adults">Adults</label>
                    <div class="number-input">
                      <button type="button" @click="decrementAdults" :disabled="bookingForm.adults <= 1">-</button>
                      <input type="number" id="adults" v-model.number="bookingForm.adults" min="1" max="10" readonly />
                      <button type="button" @click="incrementAdults" :disabled="bookingForm.adults >= 10">+</button>
                    </div>
                  </div>
                  
                  <div class="guest-input">
                    <label for="children">Children</label>
                    <div class="number-input">
                      <button type="button" @click="decrementChildren" :disabled="bookingForm.children <= 0">-</button>
                      <input type="number" id="children" v-model.number="bookingForm.children" min="0" max="10" readonly />
                      <button type="button" @click="incrementChildren" :disabled="bookingForm.children >= 10">+</button>
                    </div>
                  </div>
                </div>
                
                <div v-if="calculateNights > 0" class="price-calculation">
                  <div class="calculation-row">
                    <span>{{ formatPrice(currentPrice) }} x {{ calculateNights }} nights</span>
                    <span>KES {{ formatPrice(currentPrice * calculateNights) }}</span>
                  </div>
                  <div class="calculation-row total">
                    <span>Total</span>
                    <span>KES {{ formatPrice(currentPrice * calculateNights) }}</span>
                  </div>
                </div>
                
                <button type="submit" class="availability-btn" :disabled="!isFormValid">
                  Check Availability
                </button>
              </form>
              
              <div class="booking-info">
                <p><i class="fas fa-info-circle"></i> No payment will be charged until booking is confirmed</p>
              </div>
            </div>
            
            <div class="capacity-info">
              <i class="fas fa-users"></i>
              <span>Maximum capacity: {{ destination.capacity }} guests</span>
            </div>
            
            <div class="share-buttons">
              <span>Share:</span>
              <button class="share-btn facebook"><i class="fab fa-facebook-f"></i></button>
              <button class="share-btn twitter"><i class="fab fa-twitter"></i></button>
              <button class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></button>
              <button class="share-btn email"><i class="fas fa-envelope"></i></button>
            </div>
          </aside>
        </div>
      </div>
      
      <div v-else class="not-found">
        <h2>Destination not found</h2>
        <p>The destination you're looking for doesn't exist or has been removed.</p>
        <router-link to="/destinations" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to Destinations
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import { format } from 'date-fns';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  
  export default {
    name: 'DestinationDetails',
    components: {
      LoadingSpinner
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      
      // State
      const loading = ref(true);
      const currentImageIndex = ref(0);
      const reviewSubmitting = ref(false);
      
      // Review form
      const reviewForm = ref({
        title: '',
        text: '',
        rating: 5
      });
      
      // Booking form
      const bookingForm = ref({
        startDate: formatDateForInput(new Date()),
        endDate: formatDateForInput(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // Default to 2 days
        adults: 2,
        children: 0
      });
      
      // Get destination from store
      const destination = computed(() => store.getters['destinations/destinationById'](props.id));
      
      // Auth state
      const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
      
      // Computed properties
      const mainImage = computed(() => {
        if (!destination.value || !destination.value.images || destination.value.images.length === 0) {
          return 'https://via.placeholder.com/800x500?text=No+Image+Available';
        }
        return destination.value.images[currentImageIndex.value].url;
      });
      
      const locationText = computed(() => {
        if (!destination.value || !destination.value.location) return 'Location not specified';
        
        const location = destination.value.location;
        if (location.city && location.country) {
          return `${location.city}, ${location.country}`;
        } else if (location.city) {
          return location.city;
        } else if (location.country) {
          return location.country;
        }
        return 'Location not specified';
      });
      
      const today = computed(() => formatDateForInput(new Date()));
      
      const minEndDate = computed(() => {
        if (!bookingForm.value.startDate) return today.value;
        return bookingForm.value.startDate;
      });
      
      const currentPrice = computed(() => {
        if (!destination.value) return 0;
        return destination.value.specialPrice || destination.value.pricePerNight;
      });
      
      const calculateNights = computed(() => {
        if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 0;
        
        const start = new Date(bookingForm.value.startDate);
        const end = new Date(bookingForm.value.endDate);
        
        if (start >= end) return 0;
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
      });
      
      const isFormValid = computed(() => {
        return (
          bookingForm.value.startDate && 
          bookingForm.value.endDate && 
          new Date(bookingForm.value.startDate) < new Date(bookingForm.value.endDate) &&
          bookingForm.value.adults > 0 &&
          (bookingForm.value.adults + bookingForm.value.children) <= (destination.value?.capacity || 1)
        );
      });
      
      // Methods
      const fetchDestination = async () => {
        loading.value = true;
        try {
          await store.dispatch('destinations/fetchDestinationById', props.id);
        } catch (error) {
          console.error('Failed to fetch destination:', error);
        } finally {
          loading.value = false;
        }
      };
      
      const setMainImage = (index) => {
        currentImageIndex.value = index;
      };
      
      const getInitials = (name) => {
        if (!name) return '?';
        return name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase()
          .substring(0, 2);
      };
      
      const formatDate = (dateString) => {
        try {
          return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
          return 'Invalid date';
        }
      };
      
      const formatDateForInput = (date) => {
        return format(date, 'yyyy-MM-dd');
      };
      
      const formatPrice = (price) => {
        return price ? price.toLocaleString() : '0';
      };
      
      const getCategoryIcon = (category) => {
        const iconMap = {
          'beach': 'fas fa-umbrella-beach',
          'mountain': 'fas fa-mountain',
          'forest': 'fas fa-tree',
          'desert': 'fas fa-sun',
          'urban': 'fas fa-city',
          'rural': 'fas fa-home',
          'historical': 'fas fa-landmark',
          'cultural': 'fas fa-theater-masks',
          'adventure': 'fas fa-hiking',
          'relaxation': 'fas fa-hot-tub'
        };
        
        return iconMap[category] || 'fas fa-map-marker-alt';
      };
      
      const getAmenityIcon = (amenity) => {
        const iconMap = {
          'wifi': 'fas fa-wifi',
          'pool': 'fas fa-swimming-pool',
          'parking': 'fas fa-parking',
          'restaurant': 'fas fa-utensils',
          'gym': 'fas fa-dumbbell',
          'spa': 'fas fa-spa',
          'bar': 'fas fa-glass-martini-alt',
          'beach': 'fas fa-umbrella-beach',
          'ac': 'fas fa-snowflake',
          'breakfast': 'fas fa-coffee'
        };
        
        const amenityLower = amenity.toLowerCase();
        for (const [key, value] of Object.entries(iconMap)) {
          if (amenityLower.includes(key)) {
            return value;
          }
        }
        
        return 'fas fa-check-circle';
      };
      
      const submitReview = async () => {
        if (!isAuthenticated.value) {
          router.push('/login');
          return;
        }
        
        reviewSubmitting.value = true;
        try {
          await store.dispatch('destinations/addReview', {
            destinationId: props.id,
            review: { ...reviewForm.value }
          });
          
          // Reset form
          reviewForm.value = {
            title: '',
            text: '',
            rating: 5
          };
          
          // Refresh destination to get updated reviews
          await fetchDestination();
          
          store.dispatch('setNotification', {
            message: 'Your review has been submitted successfully!',
            type: 'success'
          });
        } catch (error) {
          store.dispatch('setNotification', {
            message: error.response?.data?.error || 'Failed to submit review',
            type: 'error'
          });
        } finally {
          reviewSubmitting.value = false;
        }
      };
      
      const incrementAdults = () => {
        if (bookingForm.value.adults < 10) {
          bookingForm.value.adults++;
        }
      };
      
      const decrementAdults = () => {
        if (bookingForm.value.adults > 1) {
          bookingForm.value.adults--;
        }
      };
      
      const incrementChildren = () => {
        if (bookingForm.value.children < 10) {
          bookingForm.value.children++;
        }
      };
      
      const decrementChildren = () => {
        if (bookingForm.value.children > 0) {
          bookingForm.value.children--;
        }
      };
      
      const checkAvailability = () => {
        if (!isAuthenticated.value) {
          router.push('/login');
          return;
        }
        
        // Set booking details in store
        store.dispatch('bookings/setBookingDates', {
          startDate: bookingForm.value.startDate,
          endDate: bookingForm.value.endDate
        });
        
        store.dispatch('bookings/setGuestCounts', {
          adults: bookingForm.value.adults,
          children: bookingForm.value.children
        });
        
        // Redirect to booking page
        router.push(`/destinations/${props.id}/book`);
      };
      
      // Lifecycle
      onMounted(() => {
        fetchDestination();
      });
      
      // Watch for route changes
      watch(
        () => props.id,
        (newId) => {
          if (newId) {
            fetchDestination();
            currentImageIndex.value = 0; // Reset image index
          }
        }
      );
      
      return {
        loading,
        destination,
        currentImageIndex,
        mainImage,
        locationText,
        reviewForm,
        reviewSubmitting,
        bookingForm,
        today,
        minEndDate,
        currentPrice,
        calculateNights,
        isFormValid,
        isAuthenticated,
        setMainImage,
        getInitials,
        formatDate,
        formatPrice,
        getCategoryIcon,
        getAmenityIcon,
        submitReview,
        incrementAdults,
        decrementAdults,
        incrementChildren,
        decrementChildren,
        checkAvailability
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .destination-details-page {
    padding-bottom: 60px;
  }
  
  .destination-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  // Gallery Section
  .gallery-section {
    margin-bottom: 30px;
    
    .main-image {
      width: 100%;
      height: 500px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 15px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .thumbnail-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;
      
      .thumbnail {
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
        
        &:hover {
          opacity: 0.9;
        }
        
        &.active {
          border-color: $primary-color;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  
  .content-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  // Main Content
  .main-content {
    section {
      margin-bottom: 40px;
    }
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #333;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background-color: $primary-color;
      }
    }
  }
  
  .destination-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 2.2rem;
      margin-bottom: 15px;
      color: #333;
    }
    
    .destination-rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .stars {
        color: #ffc107;
        margin-right: 10px;
        
        i {
          margin-right: 2px;
        }
      }
      
      span {
        color: #666;
        font-size: 0.9rem;
      }
    }
    
    .location {
      display: flex;
      align-items: center;
      color: #666;
      
      i {
        color: $primary-color;
        margin-right: 8px;
      }
    }
  }
  
  .category-badge {
    display: inline-flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 20px;
    text-transform: capitalize;
    
    i {
      margin-right: 6px;
      color: $primary-color;
    }
  }
  
  .description-section {
    p {
      line-height: 1.7;
      color: #555;
    }
  }
  
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
    
    .amenity-item {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      padding: 12px 15px;
      border-radius: 6px;
      
      i {
        color: $primary-color;
        margin-right: 10px;
        font-size: 1.1rem;
      }
    }
  }
  
  .features-list {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      
      i {
        color: $primary-color;
        margin-right: 10px;
      }
    }
  }
  
  .map-section {
    .map-container {
      height: 300px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 15px;
      overflow: hidden;
      
      .map-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        
        i {
          font-size: 3rem;
          margin-bottom: 15px;
        }
      }
    }
    
    .address-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      
      p {
        margin: 0;
        display: flex;
        align-items: center;
        color: #555;
        
        i {
          color: $primary-color;
          margin-right: 8px;
        }
      }
    }
  }
  
  .reviews-section {
    .reviews-list {
      margin-bottom: 30px;
      
      .review-card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          .reviewer-info {
            display: flex;
            align-items: center;
            
            .avatar {
              width: 40px;
              height: 40px;
              background-color: $primary-color;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              margin-right: 10px;
            }
          }
          
          .review-rating {
            text-align: right;
            
            .stars {
              margin-bottom: 5px;
              
              i {
                color: #ddd;
                margin-left: 2px;
                
                &.active {
                  color: #ffc107;
                }
              }
            }
            
            .review-date {
              font-size: 0.8rem;
              color: #999;
            }
          }
        }
        
        .review-title {
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        
        .review-text {
          color: #555;
          line-height: 1.6;
        }
      }
    }
    
    .no-reviews {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      color: #666;
    }
    
    .add-review {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.2rem;
      }
      
      .review-form {
        .form-group {
          margin-bottom: 15px;
          
          label {
            display: block;
            margin-bottom: 5px;
            color: #555;
          }
          
          input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            
            &:focus {
              border-color: $primary-color;
              outline: none;
            }
          }
          
          .rating-select {
            display: flex;
            
            .rating-star {
              cursor: pointer;
              padding: 5px;
              
              i {
                color: #ddd;
                font-size: 1.5rem;
              }
              
              &.active i {
                color: #ffc107;
              }
            }
          }
        }
        
        .submit-review-btn {
          background-color: $primary-color;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          
          &:hover:not(:disabled) {
            background-color: darken($primary-color, 10%);
          }
          
          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .login-to-review {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      
      p {
        margin: 0;
        
        a {
          color: $primary-color;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  // Booking Sidebar
  .booking-sidebar {
    .booking-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 20px;
      position: sticky;
      top: 20px;
      
      .price-section {
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 15px;
        
        .price-display {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          
          .original-price {
            color: #999;
            text-decoration: line-through;
            margin-right: 8px;
            font-size: 1rem;
          }
          
          .current-price {
            font-size: 1.8rem;
            font-weight: 700;
            color: $primary-color;
          }
          
          .per-night {
            margin-left: 5px;
            color: #666;
            font-size: 0.9rem;
          }
        }
        
        .special-price-note {
          margin-top: 10px;
          display: flex;
          align-items: center;
          color: $primary-color;
          font-size: 0.9rem;
          
          i {
            margin-right: 5px;
          }
        }
      }
      
      .booking-form {
        .form-group {
          margin-bottom: 15px;
        }
        
        .date-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          
          .date-input {
            label {
              display: block;
              font-size: 0.9rem;
              color: #555;
              margin-bottom: 5px;
            }
            
            input {
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              
              &:focus {
                border-color: $primary-color;
                outline: none;
              }
            }
          }
        }
        
        .guests {
          .guest-input {
            margin-bottom: 10px;
            
            label {
              display: block;
              font-size: 0.9rem;
              color: #555;
              margin-bottom: 5px;
            }
            
            .number-input {
              display: flex;
              align-items: center;
              
              button {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                font-size: 1.2rem;
                cursor: pointer;
                
                &:hover:not(:disabled) {
                  background-color: #eee;
                }
                
                &:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                }
                
                &:first-child {
                  border-radius: 4px 0 0 4px;
                }
                
                &:last-child {
                  border-radius: 0 4px 4px 0;
                }
              }
              
              input {
                width: 50px;
                height: 36px;
                border: 1px solid #ddd;
                border-left: none;
                border-right: none;
                text-align: center;
                font-size: 1rem;
              }
            }
          }
        }
        
        .price-calculation {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          
          .calculation-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 0.9rem;
            color: #666;
            
            &.total {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #eee;
              color: #333;
              font-weight: 600;
            }
          }
        }
        
        .availability-btn {
          width: 100%;
          padding: 12px;
          background-color: $primary-color;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          
          &:hover:not(:disabled) {
            background-color: darken($primary-color, 10%);
          }
          
          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
      
      .booking-info {
        margin-top: 15px;
        font-size: 0.8rem;
        color: #666;
        
        p {
          display: flex;
          align-items: center;
          
          i {
            margin-right: 5px;
            color: $primary-color;
          }
        }
      }
    }
    
    .capacity-info {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      padding: 12px 15px;
      border-radius: 4px;
      margin-top: 15px;
      color: #555;
      font-size: 0.9rem;
      
      i {
        margin-right: 8px;
        color: $primary-color;
      }
    }
    
    .share-buttons {
      display: flex;
      align-items: center;
      margin-top: 15px;
      
      span {
        margin-right: 10px;
        font-size: 0.9rem;
        color: #666;
      }
      
      .share-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: white;
        margin-right: 8px;
        cursor: pointer;
        
        &.facebook {
          background-color: #3b5998;
        }
        
        &.twitter {
          background-color: #1da1f2;
        }
        
        &.whatsapp {
          background-color: #25d366;
        }
        
        &.email {
          background-color: #ea4335;
        }
        
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
  
  .not-found {
    text-align: center;
    padding: 60px 20px;
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 15px;
      color: #333;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
    }
    
    .back-btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      background-color: $primary-color;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      
      i {
        margin-right: 8px;
      }
      
      &:hover {
        background-color: darken($primary-color, 10%);
      }
    }
  }
  
  @media (max-width: 768px) {
    .gallery-section {
      .main-image {
        height: 300px;
      }
    }
    
    .booking-sidebar {
      order: -1;
      
      .booking-card {
        position: static;
      }
    }
  }
  </style>