<template>
    <div class="booking-page">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="destination" class="booking-container">
        <div class="booking-header">
          <h1>Confirm Your Booking</h1>
          <p>Complete your reservation for {{ destination.name }}</p>
        </div>
        
        <div class="booking-content">
          <div class="booking-details">
            <div class="destination-summary">
              <img 
                :src="destinationImage" 
                :alt="destination.name" 
                class="destination-image"
              />
              <div class="summary-content">
                <h2>{{ destination.name }}</h2>
                <div class="location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ locationText }}</span>
                </div>
                <div class="rating">
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
                  <span>{{ destination.rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
            
            <div class="booking-info-card">
              <h3>Booking Details</h3>
              
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-calendar-check"></i>
                  <span>Check-in</span>
                </div>
                <div class="info-value">{{ formatDate(bookingDates.startDate) }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-calendar-times"></i>
                  <span>Check-out</span>
                </div>
                <div class="info-value">{{ formatDate(bookingDates.endDate) }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-moon"></i>
                  <span>Duration</span>
                </div>
                <div class="info-value">{{ calculateNights }} nights</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-users"></i>
                  <span>Guests</span>
                </div>
                <div class="info-value">
                  {{ guestCounts.adults }} Adults, {{ guestCounts.children }} Children
                </div>
              </div>
              
              <a 
                href="#" 
                class="modify-booking" 
                @click.prevent="goBackToDestination"
              >
                <i class="fas fa-edit"></i> Modify booking
              </a>
            </div>
            
            <div class="guest-details">
              <h3>Guest Details</h3>
              
              <form @submit.prevent="submitBooking">
                <div class="form-group" :class="{ 'has-error': errors.name }">
                  <label for="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="bookingForm.name" 
                    placeholder="Enter your full name" 
                    required
                    @input="clearFieldError('name')"
                  />
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>
                
                <div class="form-group" :class="{ 'has-error': errors.email }">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="bookingForm.email" 
                    placeholder="Enter your email" 
                    required
                    @input="clearFieldError('email')"
                  />
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>
                
                <div class="form-group" :class="{ 'has-error': errors.phone }">
                  <label for="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="bookingForm.phone" 
                    placeholder="Enter your phone number" 
                    required
                    @input="clearFieldError('phone')"
                  />
                  <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </div>
                
                <div class="form-group">
                  <label for="special-requests">Special Requests (optional)</label>
                  <textarea 
                    id="special-requests" 
                    v-model="bookingForm.specialRequests" 
                    placeholder="Any special requests or requirements?" 
                    rows="3"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
          
          <div class="booking-summary">
            <div class="summary-card">
              <h3>Price Summary</h3>
              
              <div class="price-details">
                <div class="price-row">
                  <span>{{ formatPrice(currentPrice) }} x {{ calculateNights }} nights</span>
                  <span>KES {{ formatPrice(currentPrice * calculateNights) }}</span>
                </div>
                
                <div class="price-row total">
                  <span>Total Price</span>
                  <span>KES {{ formatPrice(currentPrice * calculateNights) }}</span>
                </div>
              </div>
              
              <div class="booking-terms">
                <p><i class="fas fa-info-circle"></i> No payment will be charged yet</p>
                <p><i class="fas fa-shield-alt"></i> Free cancellation up to 24 hours before check-in</p>
              </div>
              
              <button 
                type="button" 
                class="confirm-booking-btn" 
                @click="submitBooking" 
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Processing...
                </span>
                <span v-else>Confirm Booking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="not-found">
        <h2>Destination not found</h2>
        <p>The destination you're trying to book doesn't exist or has been removed.</p>
        <router-link to="/destinations" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to Destinations
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { format } from 'date-fns';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  
  export default {
    name: 'BookingPage',
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
      const router = useRouter();
      
      const loading = ref(true);
      const isSubmitting = ref(false);
      
      // Get user data from store
      const user = computed(() => store.getters['auth/currentUser']);
      
      // Get destination data
      const destination = computed(() => store.getters['destinations/destinationById'](props.id));
      
      // Get booking data from store
      const bookingDates = computed(() => store.getters['bookings/bookingDates']);
      const guestCounts = computed(() => store.getters['bookings/guestCounts']);
      
      // Initialize booking form with user data
      const bookingForm = reactive({
        name: user.value ? user.value.name : '',
        email: user.value ? user.value.email : '',
        phone: user.value ? user.value.phone : '',
        specialRequests: ''
      });
      
      // Form validation errors
      const errors = reactive({
        name: '',
        email: '',
        phone: ''
      });
      
      // Computed properties
      const destinationImage = computed(() => {
        if (!destination.value || !destination.value.images || destination.value.images.length === 0) {
          return 'https://via.placeholder.com/400x300?text=No+Image+Available';
        }
        const mainImage = destination.value.images.find(img => img.isMain) || destination.value.images[0];
        return mainImage.url;
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
      
      const currentPrice = computed(() => {
        if (!destination.value) return 0;
        return destination.value.specialPrice || destination.value.pricePerNight;
      });
      
      const calculateNights = computed(() => {
        if (!bookingDates.value.startDate || !bookingDates.value.endDate) return 0;
        
        const start = new Date(bookingDates.value.startDate);
        const end = new Date(bookingDates.value.endDate);
        
        if (start >= end) return 0;
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
      });
      
      // Methods
      const fetchDestination = async () => {
        loading.value = true;
        try {
          if (!destination.value) {
            await store.dispatch('destinations/fetchDestinationById', props.id);
          }
        } catch (error) {
          console.error('Failed to fetch destination:', error);
          store.dispatch('setNotification', {
            message: 'Failed to load destination details. Please try again.',
            type: 'error'
          });
        } finally {
          loading.value = false;
        }
      };
      
      const formatDate = (dateString) => {
        try {
          return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
          return 'Invalid date';
        }
      };
      
      const formatPrice = (price) => {
        return price ? price.toLocaleString() : '0';
      };
      
      const clearFieldError = (field) => {
        errors[field] = '';
      };
      
      const validateForm = () => {
        let isValid = true;
        
        // Name validation
        if (!bookingForm.name.trim()) {
          errors.name = 'Name is required';
          isValid = false;
        }
        
        // Email validation
        if (!bookingForm.email) {
          errors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Phone validation
        if (!bookingForm.phone) {
          errors.phone = 'Phone number is required';
          isValid = false;
        } else if (!/^(?:\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(bookingForm.phone)) {
          errors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
        
        return isValid;
      };
      
      const submitBooking = async () => {
        if (!validateForm()) {
          // Scroll to first error
          const firstError = document.querySelector('.has-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
        
        isSubmitting.value = true;
        try {
          const bookingData = {
            startDate: bookingDates.value.startDate,
            endDate: bookingDates.value.endDate,
            guests: {
              adults: guestCounts.value.adults,
              children: guestCounts.value.children
            },
            specialRequests: bookingForm.specialRequests
          };
          
          const response = await store.dispatch('bookings/createBooking', props.id);
          
          // Redirect to payment page
          router.push(`/payment/${response._id}`);
        } catch (error) {
          console.error('Failed to create booking:', error);
          store.dispatch('setNotification', {
            message: 'Failed to create booking. Please try again.',
            type: 'error'
          });
        } finally {
          isSubmitting.value = false;
        }
      };
      
      const goBackToDestination = () => {
        router.push(`/destinations/${props.id}`);
      };
      
      // Initialization
      onMounted(() => {
        // Check if booking dates are set
        if (!bookingDates.value.startDate || !bookingDates.value.endDate) {
          // Redirect back to destination page if no dates selected
          store.dispatch('setNotification', {
            message: 'Please select check-in and check-out dates first',
            type: 'warning'
          });
          router.push(`/destinations/${props.id}`);
          return;
        }
        
        fetchDestination();
      });
      
      return {
        loading,
        isSubmitting,
        destination,
        bookingDates,
        guestCounts,
        bookingForm,
        errors,
        destinationImage,
        locationText,
        currentPrice,
        calculateNights,
        formatDate,
        formatPrice,
        clearFieldError,
        submitBooking,
        goBackToDestination
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .booking-page {
    padding-bottom: 60px;
  }
  
  .booking-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .booking-header {
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
  
  .booking-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
  
  .booking-details {
    .destination-summary {
      display: flex;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 30px;
      
      .destination-image {
        width: 180px;
        height: 120px;
        object-fit: cover;
        
        @media (max-width: 576px) {
          width: 120px;
          height: 100px;
        }
      }
      
      .summary-content {
        padding: 15px;
        
        h2 {
          margin: 0 0 10px;
          font-size: 1.3rem;
        }
        
        .location {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          color: #666;
          font-size: 0.9rem;
          
          i {
            color: $primary-color;
            margin-right: 5px;
          }
        }
        
        .rating {
          display: flex;
          align-items: center;
          
          .stars {
            color: #ffc107;
            margin-right: 8px;
            
            i {
              margin-right: 2px;
            }
          }
          
          span {
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    }
    
    .booking-info-card, .guest-details {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 30px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.2rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
    }
    
    .booking-info-card {
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        color: #555;
        
        .info-label {
          display: flex;
          align-items: center;
          
          i {
            margin-right: 8px;
            color: $primary-color;
            width: 20px;
            text-align: center;
          }
        }
        
        .info-value {
          font-weight: 500;
        }
      }
      
      .modify-booking {
        display: inline-flex;
        align-items: center;
        color: $primary-color;
        font-size: 0.9rem;
        margin-top: 15px;
        
        i {
          margin-right: 5px;
        }
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .guest-details {
      form {
        .form-group {
          margin-bottom: 20px;
          
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
          }
          
          input, textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            
            &:focus {
              border-color: $primary-color;
              outline: none;
            }
          }
          
          &.has-error {
            input, textarea {
              border-color: #f44336;
            }
            
            .error-message {
              display: block;
              color: #f44336;
              font-size: 0.8rem;
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
  
  .booking-summary {
    .summary-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      position: sticky;
      top: 20px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.2rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      
      .price-details {
        margin-bottom: 20px;
        
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #555;
          
          &.total {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-weight: 600;
            font-size: 1.1rem;
            color: #333;
          }
        }
      }
      
      .booking-terms {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        
        p {
          margin: 0 0 10px;
          font-size: 0.9rem;
          color: #666;
          display: flex;
          align-items: center;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          i {
            margin-right: 8px;
            color: $primary-color;
          }
        }
      }
      
      .confirm-booking-btn {
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
        
        i {
          margin-right: 5px;
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
  </style>