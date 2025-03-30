<template>
    <div class="payment-page">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="currentBooking" class="payment-container">
        <div class="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Final step to confirm your booking for {{ currentBooking.destination.name }}</p>
        </div>
        
        <div class="payment-content">
          <div class="payment-details">
            <div class="booking-summary-card">
              <h3>Booking Summary</h3>
              
              <div class="booking-info">
                <div class="info-row">
                  <div class="info-label">Destination</div>
                  <div class="info-value">{{ currentBooking.destination.name }}</div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Check-in</div>
                  <div class="info-value">{{ formatDate(currentBooking.startDate) }}</div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Check-out</div>
                  <div class="info-value">{{ formatDate(currentBooking.endDate) }}</div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Duration</div>
                  <div class="info-value">{{ calculateNights }} nights</div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Guests</div>
                  <div class="info-value">
                    {{ currentBooking.guests.adults }} Adults, {{ currentBooking.guests.children }} Children
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Booking Status</div>
                  <div class="info-value booking-status">
                    <span :class="bookingStatusClass">{{ currentBooking.bookingStatus }}</span>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Payment Status</div>
                  <div class="info-value payment-status">
                    <span :class="paymentStatusClass">{{ currentBooking.paymentStatus }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="payment-methods-card">
              <h3>Payment Options</h3>
              
              <div class="payment-methods">
                <div class="payment-method active">
                  <div class="method-header">
                    <div class="method-icon">
                      <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="method-name">M-Pesa Payment</div>
                  </div>
                  <div class="method-content">
                    <p class="method-description">
                      Complete your payment using M-Pesa. You will receive a payment prompt on your phone.
                    </p>
                    
                    <form @submit.prevent="initiatePayment" class="mpesa-form">
                      <div class="form-group" :class="{ 'has-error': errors.phoneNumber }">
                        <label for="phone-number">M-Pesa Phone Number</label>
                        <div class="input-with-icon">
                          <i class="fas fa-phone"></i>
                          <input 
                            type="tel" 
                            id="phone-number" 
                            v-model="paymentForm.phoneNumber" 
                            placeholder="Enter your M-Pesa number (e.g., 254XXXXXXXXX)" 
                            required
                            @input="clearFieldError('phoneNumber')"
                          />
                        </div>
                        <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
                        <span class="input-hint">Format: 254XXXXXXXXX (e.g., 254712345678)</span>
                      </div>
                      
                      <button 
                        type="submit" 
                        class="pay-button" 
                        :disabled="isSubmitting || paymentInitiated"
                      >
                        <span v-if="isSubmitting">
                          <i class="fas fa-spinner fa-spin"></i> Processing...
                        </span>
                        <span v-else-if="paymentInitiated">
                          <i class="fas fa-check-circle"></i> Payment Initiated
                        </span>
                        <span v-else>
                          Pay KES {{ formatPrice(currentBooking.totalPrice) }}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
                
                <div class="payment-method disabled">
                  <div class="method-header">
                    <div class="method-icon">
                      <i class="far fa-credit-card"></i>
                    </div>
                    <div class="method-name">Card Payment</div>
                  </div>
                  <div class="method-content">
                    <p class="method-description">
                      Card payments will be available soon.
                    </p>
                  </div>
                </div>
                
                <div class="payment-method disabled">
                  <div class="method-header">
                    <div class="method-icon">
                      <i class="fas fa-university"></i>
                    </div>
                    <div class="method-name">Bank Transfer</div>
                  </div>
                  <div class="method-content">
                    <p class="method-description">
                      Bank transfers will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="payment-summary">
            <div class="summary-card">
              <h3>Price Details</h3>
              
              <div class="price-details">
                <div class="price-row">
                  <span>Room Rate ({{ calculateNights }} nights)</span>
                  <span>KES {{ formatPrice(currentBooking.totalPrice) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                
                <div class="price-row total">
                  <span>Total Amount</span>
                  <span>KES {{ formatPrice(currentBooking.totalPrice) }}</span>
                </div>
              </div>
              
              <div v-if="paymentInitiated" class="payment-status-box" :class="statusClass">
                <div class="status-icon">
                  <i v-if="isCheckingStatus" class="fas fa-spinner fa-spin"></i>
                  <i v-else-if="paymentStatus === 'completed'" class="fas fa-check-circle"></i>
                  <i v-else-if="paymentStatus === 'failed'" class="fas fa-times-circle"></i>
                  <i v-else class="fas fa-clock"></i>
                </div>
                <div class="status-text">
                  <h4>{{ statusText }}</h4>
                  <p>{{ statusMessage }}</p>
                </div>
                <div class="status-actions" v-if="paymentStatus === 'pending'">
                  <button 
                    @click="checkPaymentStatus" 
                    class="check-status-btn" 
                    :disabled="isCheckingStatus"
                  >
                    <i v-if="isCheckingStatus" class="fas fa-spinner fa-spin"></i>
                    <span v-else>Check Status</span>
                  </button>
                </div>
              </div>
              
              <div class="payment-instructions">
                <h4><i class="fas fa-info-circle"></i> Important Information</h4>
                <ul>
                  <li>Please keep your phone nearby to respond to the M-Pesa prompt.</li>
                  <li>Your booking will be confirmed immediately after successful payment.</li>
                  <li>If you don't receive a prompt, click "Check Status" to verify.</li>
                  <li>For assistance, contact our support team at support@adventuretours.com.</li>
                </ul>
              </div>
              
              <router-link v-if="!paymentInitiated" :to="`/destinations/${currentBooking.destination._id}`" class="back-link">
                <i class="fas fa-arrow-left"></i> Back to Destination
              </router-link>
              
              <router-link v-else-if="paymentStatus === 'completed'" to="/profile/bookings" class="view-bookings-btn">
                <i class="fas fa-list-alt"></i> View My Bookings
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="not-found">
        <h2>Booking not found</h2>
        <p>The booking you're trying to pay for doesn't exist or has been removed.</p>
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
    name: 'PaymentPage',
    components: {
      LoadingSpinner
    },
    props: {
      bookingId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const router = useRouter();
      
      const loading = ref(true);
      const isSubmitting = ref(false);
      const isCheckingStatus = ref(false);
      const paymentInitiated = ref(false);
      const paymentStatus = ref('pending');
      const checkoutRequestId = ref('');
      
      // Payment form
      const paymentForm = reactive({
        phoneNumber: ''
      });
      
      // Form validation errors
      const errors = reactive({
        phoneNumber: ''
      });
      
      // Get current booking from store
      const currentBooking = computed(() => {
        const booking = store.getters['bookings/currentBooking'];
        return booking;
      });
      
      // Get user data from store
      const user = computed(() => store.getters['auth/currentUser']);
      
      // Computed properties
      const calculateNights = computed(() => {
        if (!currentBooking.value) return 0;
        
        const start = new Date(currentBooking.value.startDate);
        const end = new Date(currentBooking.value.endDate);
        
        if (start >= end) return 0;
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
      });
      
      const bookingStatusClass = computed(() => {
        if (!currentBooking.value) return '';
        
        const status = currentBooking.value.bookingStatus;
        
        switch (status) {
          case 'confirmed':
            return 'status-success';
          case 'cancelled':
            return 'status-danger';
          case 'completed':
            return 'status-success';
          default:
            return 'status-warning';
        }
      });
      
      const paymentStatusClass = computed(() => {
        if (!currentBooking.value) return '';
        
        const status = currentBooking.value.paymentStatus;
        
        switch (status) {
          case 'paid':
            return 'status-success';
          case 'failed':
            return 'status-danger';
          case 'refunded':
            return 'status-info';
          default:
            return 'status-warning';
        }
      });
      
      const statusClass = computed(() => {
        switch (paymentStatus.value) {
          case 'completed':
            return 'status-success';
          case 'failed':
            return 'status-error';
          default:
            return 'status-pending';
        }
      });
      
      const statusText = computed(() => {
        switch (paymentStatus.value) {
          case 'completed':
            return 'Payment Successful';
          case 'failed':
            return 'Payment Failed';
          default:
            return 'Payment Pending';
        }
      });
      
      const statusMessage = computed(() => {
        switch (paymentStatus.value) {
          case 'completed':
            return 'Your payment has been processed successfully and your booking is confirmed.';
          case 'failed':
            return 'Your payment could not be processed. Please try again or choose another payment method.';
          default:
            return 'Please check your phone and respond to the M-Pesa prompt to complete payment.';
        }
      });
      
      // Methods
      const fetchBooking = async () => {
        loading.value = true;
        try {
          await store.dispatch('bookings/fetchBookingById', props.bookingId);
          
          // Pre-fill phone number if user has one
          if (user.value && user.value.phone) {
            paymentForm.phoneNumber = user.value.phone;
          }
        } catch (error) {
          console.error('Failed to fetch booking:', error);
          store.dispatch('setNotification', {
            message: 'Failed to load booking details. Please try again.',
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
        
        // Phone number validation
        if (!paymentForm.phoneNumber) {
          errors.phoneNumber = 'Phone number is required';
          isValid = false;
        } else if (!/^254\d{9}$/.test(paymentForm.phoneNumber)) {
          errors.phoneNumber = 'Please enter a valid M-Pesa number in the format 254XXXXXXXXX';
          isValid = false;
        }
        
        return isValid;
      };
      
      const initiatePayment = async () => {
        if (!validateForm()) return;
        
        isSubmitting.value = true;
        try {
          const response = await store.dispatch('payments/initiatePayment', {
            bookingId: props.bookingId,
            phoneNumber: paymentForm.phoneNumber
          });
          
          paymentInitiated.value = true;
          checkoutRequestId.value = response.requestId;
          
          // Set a timer to check payment status after 10 seconds
          setTimeout(() => {
            checkPaymentStatus();
          }, 10000);
        } catch (error) {
          console.error('Failed to initiate payment:', error);
        } finally {
          isSubmitting.value = false;
        }
      };
      
      const checkPaymentStatus = async () => {
        if (!checkoutRequestId.value) return;
        
        isCheckingStatus.value = true;
        try {
          const response = await store.dispatch('payments/checkPaymentStatus', checkoutRequestId.value);
          
          paymentStatus.value = response.payment.status;
          
          // If payment is still pending, set timer to check again
          if (paymentStatus.value === 'pending') {
            setTimeout(() => {
              checkPaymentStatus();
            }, 5000);
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        } finally {
          isCheckingStatus.value = false;
        }
      };
      
      // Initialization
      onMounted(() => {
        fetchBooking();
      });
      
      return {
        loading,
        isSubmitting,
        isCheckingStatus,
        paymentInitiated,
        paymentStatus,
        currentBooking,
        paymentForm,
        errors,
        calculateNights,
        bookingStatusClass,
        paymentStatusClass,
        statusClass,
        statusText,
        statusMessage,
        formatDate,
        formatPrice,
        clearFieldError,
        initiatePayment,
        checkPaymentStatus
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .payment-page {
    padding-bottom: 60px;
  }
  
  .payment-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .payment-header {
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
  
  .payment-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
  
  .payment-details {
    .booking-summary-card, .payment-methods-card {
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
    
    .booking-summary-card {
      .booking-info {
        .info-row {
          display: flex;
          margin-bottom: 15px;
          
          .info-label {
            width: 120px;
            font-weight: 500;
            color: #555;
          }
          
          .info-value {
            flex: 1;
            color: #333;
            
            &.booking-status,
            &.payment-status {
              span {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.85rem;
                text-transform: capitalize;
                
                &.status-success {
                  background-color: #e6f7ee;
                  color: #10b981;
                }
                
                &.status-warning {
                  background-color: #fff7e6;
                  color: #f59e0b;
                }
                
                &.status-danger {
                  background-color: #fee2e2;
                  color: #ef4444;
                }
                
                &.status-info {
                  background-color: #e6f1fe;
                  color: #3b82f6;
                }
              }
            }
          }
        }
      }
    }
    
    .payment-methods-card {
      .payment-methods {
        .payment-method {
          border: 1px solid #eee;
          border-radius: 6px;
          margin-bottom: 15px;
          transition: all 0.3s;
          
          &.active {
            border-color: $primary-color;
            box-shadow: 0 0 0 1px rgba($primary-color, 0.2);
          }
          
          &.disabled {
            opacity: 0.6;
            pointer-events: none;
          }
          
          .method-header {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            
            .method-icon {
              width: 40px;
              height: 40px;
              background-color: #f5f5f5;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              
              i {
                font-size: 1.2rem;
                color: $primary-color;
              }
            }
            
            .method-name {
              font-weight: 600;
              color: #333;
            }
          }
          
          .method-content {
            padding: 15px;
            
            .method-description {
              margin-bottom: 20px;
              color: #666;
            }
            
            .mpesa-form {
              .form-group {
                margin-bottom: 20px;
                
                label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: 500;
                  color: #555;
                }
                
                .input-with-icon {
                  position: relative;
                  
                  i {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                  }
                  
                  input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    
                    &:focus {
                      border-color: $primary-color;
                      outline: none;
                    }
                  }
                }
                
                .input-hint {
                  display: block;
                  font-size: 0.8rem;
                  color: #666;
                  margin-top: 5px;
                }
                
                &.has-error {
                  input {
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
              
              .pay-button {
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
        }
      }
    }
  }
  
  .payment-summary {
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
      
      .payment-status-box {
        display: flex;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
        
        &.status-pending {
          background-color: #fff7e6;
          
          .status-icon {
            color: #f59e0b;
          }
        }
        
        &.status-success {
          background-color: #e6f7ee;
          
          .status-icon {
            color: #10b981;
          }
        }
        
        &.status-error {
          background-color: #fee2e2;
          
          .status-icon {
            color: #ef4444;
          }
        }
        
        .status-icon {
          font-size: 2rem;
          margin-right: 15px;
          display: flex;
          align-items: center;
        }
        
        .status-text {
          flex: 1;
          
          h4 {
            margin: 0 0 5px;
            font-size: 1.1rem;
          }
          
          p {
            margin: 0;
            font-size: 0.9rem;
            color: #555;
          }
        }
        
        .status-actions {
          margin-top: 10px;
          
          .check-status-btn {
            padding: 8px 15px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover:not(:disabled) {
              background-color: #f5f5f5;
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
      
      .payment-instructions {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
        
        h4 {
          margin: 0 0 10px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 8px;
            color: $primary-color;
          }
        }
        
        ul {
          margin: 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 5px;
            font-size: 0.9rem;
            color: #555;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      
      .back-link {
        display: inline-flex;
        align-items: center;
        color: $primary-color;
        font-size: 0.9rem;
        
        i {
          margin-right: 5px;
        }
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .view-bookings-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
        text-decoration: none;
        
        &:hover {
          background-color: darken($primary-color, 10%);
        }
        
        i {
          margin-right: 8px;
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
    .payment-summary {
      .summary-card {
        position: static;
      }
    }
  }
  </style>