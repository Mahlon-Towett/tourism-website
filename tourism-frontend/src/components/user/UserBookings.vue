<template>
    <div class="user-bookings">
      <div class="content-header">
        <h2>My Bookings</h2>
        <p>View and manage your travel bookings</p>
      </div>
      
      <div v-if="loading" class="loading-container">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="bookings.length > 0" class="bookings-list">
        <div class="booking-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value" 
            :class="['tab-button', { active: activeTab === tab.value }]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="booking-cards">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking._id" 
            class="booking-card"
          >
            <div class="booking-image">
              <img :src="getDestinationImage(booking)" :alt="booking.destination.name" />
              <div class="booking-status" :class="getStatusClass(booking.bookingStatus)">
                {{ booking.bookingStatus }}
              </div>
            </div>
            
            <div class="booking-content">
              <h3>{{ booking.destination.name }}</h3>
              
              <div class="booking-info">
                <div class="info-item">
                  <i class="fas fa-calendar-check"></i>
                  <span>{{ formatDate(booking.startDate) }}</span>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-calendar-times"></i>
                  <span>{{ formatDate(booking.endDate) }}</span>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-users"></i>
                  <span>{{ booking.guests.adults }} Adults, {{ booking.guests.children }} Children</span>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-money-bill-wave"></i>
                  <span>KES {{ formatPrice(booking.totalPrice) }}</span>
                </div>
                
                <div class="info-item payment-status">
                  <i class="fas fa-credit-card"></i>
                  <span :class="getPaymentStatusClass(booking.paymentStatus)">
                    {{ booking.paymentStatus }}
                  </span>
                </div>
              </div>
              
              <div class="booking-actions">
                <router-link 
                  :to="`/destinations/${booking.destination._id}`" 
                  class="action-btn view-btn"
                >
                  <i class="fas fa-eye"></i> View Destination
                </router-link>
                
                <button 
                  v-if="booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed'" 
                  @click="showCancelModal(booking)" 
                  class="action-btn cancel-btn"
                >
                  <i class="fas fa-times"></i> Cancel
                </button>
                
                <button 
                  v-if="booking.paymentStatus === 'pending'" 
                  @click="continuePayment(booking)" 
                  class="action-btn pay-btn"
                >
                  <i class="fas fa-dollar-sign"></i> Pay Now
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredBookings.length === 0" class="no-bookings-filtered">
            <p>No {{ activeTab }} bookings found.</p>
          </div>
        </div>
      </div>
      
      <div v-else class="no-bookings">
        <div class="empty-state">
          <i class="fas fa-suitcase-rolling"></i>
          <h3>No Bookings Yet</h3>
          <p>You haven't made any bookings yet. Start exploring our destinations!</p>
          <router-link to="/destinations" class="explore-btn">
            <i class="fas fa-globe-africa"></i> Explore Destinations
          </router-link>
        </div>
      </div>
      
      <!-- Cancellation Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Cancel Booking</h3>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <p>Are you sure you want to cancel your booking for <strong>{{ selectedBooking?.destination?.name }}</strong>?</p>
            
            <div class="cancellation-details">
              <div class="detail-item">
                <span class="detail-label">Check-in:</span>
                <span>{{ formatDate(selectedBooking?.startDate) }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Check-out:</span>
                <span>{{ formatDate(selectedBooking?.endDate) }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Total Amount:</span>
                <span>KES {{ formatPrice(selectedBooking?.totalPrice) }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="cancellation-reason">Reason for cancellation (optional)</label>
              <textarea 
                id="cancellation-reason" 
                v-model="cancellationReason" 
                placeholder="Please tell us why you're cancelling..." 
                rows="3"
              ></textarea>
            </div>
            
            <div class="cancellation-policy">
              <p><i class="fas fa-info-circle"></i> Cancellation Policy:</p>
              <ul>
                <li>Free cancellation up to 24 hours before check-in.</li>
                <li>Cancellations made later may incur a fee.</li>
                <li>Refunds will be processed within 7-10 business days.</li>
              </ul>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="closeModal" class="btn-secondary">
              Keep Booking
            </button>
            <button 
              @click="confirmCancellation" 
              :disabled="isProcessing" 
              class="btn-danger"
            >
              <span v-if="isProcessing">
                <i class="fas fa-spinner fa-spin"></i> Processing...
              </span>
              <span v-else>
                Confirm Cancellation
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { format } from 'date-fns';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  
  export default {
    name: 'UserBookings',
    components: {
      LoadingSpinner
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const loading = ref(false);
      const activeTab = ref('all');
      const showModal = ref(false);
      const selectedBooking = ref(null);
      const cancellationReason = ref('');
      const isProcessing = ref(false);
      
      // Tabs for filtering bookings
      const tabs = [
        { label: 'All Bookings', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
      ];
      
      // Get bookings from store
      const bookings = computed(() => store.getters['bookings/allBookings']);
      
      // Filter bookings based on active tab
      const filteredBookings = computed(() => {
        if (activeTab.value === 'all') {
          return bookings.value;
        }
        
        const today = new Date();
        
        switch (activeTab.value) {
          case 'upcoming':
            return bookings.value.filter(booking => 
              (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending') && 
              new Date(booking.startDate) >= today
            );
          case 'completed':
            return bookings.value.filter(booking => 
              booking.bookingStatus === 'completed' || 
              (booking.bookingStatus === 'confirmed' && new Date(booking.endDate) < today)
            );
          case 'cancelled':
            return bookings.value.filter(booking => booking.bookingStatus === 'cancelled');
          default:
            return bookings.value;
        }
      });
      
      // Methods
      const fetchBookings = async () => {
        loading.value = true;
        try {
          await store.dispatch('bookings/fetchUserBookings');
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
          store.dispatch('setNotification', {
            message: 'Failed to load bookings. Please try again.',
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
      
      const getDestinationImage = (booking) => {
        if (!booking.destination.images || booking.destination.images.length === 0) {
          return 'https://via.placeholder.com/300x200?text=No+Image+Available';
        }
        
        const mainImage = booking.destination.images.find(img => img.isMain) || booking.destination.images[0];
        return mainImage.url;
      };
      
      const getStatusClass = (status) => {
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
      };
      
      const getPaymentStatusClass = (status) => {
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
      };
      
      const showCancelModal = (booking) => {
        selectedBooking.value = booking;
        cancellationReason.value = '';
        showModal.value = true;
      };
      
      const closeModal = () => {
        showModal.value = false;
        setTimeout(() => {
          selectedBooking.value = null;
        }, 300);
      };
      
      const confirmCancellation = async () => {
        if (!selectedBooking.value) return;
        
        isProcessing.value = true;
        try {
          await store.dispatch('bookings/cancelBooking', {
            bookingId: selectedBooking.value._id,
            reason: cancellationReason.value
          });
          
          store.dispatch('setNotification', {
            message: 'Booking cancelled successfully',
            type: 'success'
          });
          
          closeModal();
        } catch (error) {
          console.error('Failed to cancel booking:', error);
          store.dispatch('setNotification', {
            message: 'Failed to cancel booking. Please try again.',
            type: 'error'
          });
        } finally {
          isProcessing.value = false;
        }
      };
      
      const continuePayment = (booking) => {
        router.push(`/payment/${booking._id}`);
      };
      
      // Initialization
      onMounted(() => {
        fetchBookings();
      });
      
      return {
        loading,
        bookings,
        activeTab,
        tabs,
        filteredBookings,
        showModal,
        selectedBooking,
        cancellationReason,
        isProcessing,
        formatDate,
        formatPrice,
        getDestinationImage,
        getStatusClass,
        getPaymentStatusClass,
        showCancelModal,
        closeModal,
        confirmCancellation,
        continuePayment
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .user-bookings {
    .content-header {
      margin-bottom: 30px;
      
      h2 {
        margin: 0 0 10px;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
    
    .loading-container {
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .booking-tabs {
      display: flex;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
      overflow-x: auto;
      
      .tab-button {
        padding: 10px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: #666;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        
        &.active {
          color: $primary-color;
          border-bottom-color: $primary-color;
        }
        
        &:hover:not(.active) {
          color: darken(#666, 15%);
        }
      }
    }
    
    .booking-cards {
      .booking-card {
        display: flex;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-bottom: 20px;
        transition: transform 0.3s;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .booking-image {
          position: relative;
          width: 200px;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .booking-status {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            text-transform: capitalize;
            font-weight: 500;
            
            &.status-success {
              background-color: #10b981;
              color: white;
            }
            
            &.status-warning {
              background-color: #f59e0b;
              color: white;
            }
            
            &.status-danger {
              background-color: #ef4444;
              color: white;
            }
          }
          
          @media (max-width: 576px) {
            width: 120px;
          }
        }
        
        .booking-content {
          flex: 1;
          padding: 15px;
          display: flex;
          flex-direction: column;
          
          h3 {
            margin: 0 0 15px;
            font-size: 1.2rem;
            color: #333;
          }
          
          .booking-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
            
            .info-item {
              display: flex;
              align-items: center;
              font-size: 0.9rem;
              color: #555;
              
              i {
                margin-right: 8px;
                color: $primary-color;
                width: 16px;
                text-align: center;
              }
              
              &.payment-status {
                span {
                  &.status-success {
                    color: #10b981;
                    font-weight: 500;
                  }
                  
                  &.status-warning {
                    color: #f59e0b;
                    font-weight: 500;
                  }
                  
                  &.status-danger {
                    color: #ef4444;
                    font-weight: 500;
                  }
                  
                  &.status-info {
                    color: #3b82f6;
                    font-weight: 500;
                  }
                }
              }
            }
          }
          
          .booking-actions {
            display: flex;
            margin-top: auto;
            flex-wrap: wrap;
            gap: 10px;
            
            .action-btn {
              display: inline-flex;
              align-items: center;
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 0.9rem;
              cursor: pointer;
              text-decoration: none;
              transition: all 0.3s;
              
              i {
                margin-right: 5px;
              }
              
              &.view-btn {
                background-color: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
                
                &:hover {
                  background-color: #eee;
                }
              }
              
              &.cancel-btn {
                background-color: transparent;
                color: #ef4444;
                border: 1px solid #ef4444;
                
                &:hover {
                  background-color: #fee2e2;
                }
              }
              
              &.pay-btn {
                background-color: $primary-color;
                color: white;
                border: none;
                
                &:hover {
                  background-color: darken($primary-color, 10%);
                }
              }
            }
          }
        }
        
        @media (max-width: 768px) {
          flex-direction: column;
          
          .booking-image {
            width: 100%;
            height: 200px;
          }
        }
      }
      
      .no-bookings-filtered {
        text-align: center;
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 8px;
        
        p {
          color: #666;
          margin: 0;
        }
      }
    }
    
    .no-bookings {
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        text-align: center;
        
        i {
          font-size: 3rem;
          color: #ccc;
          margin-bottom: 20px;
        }
        
        h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #333;
        }
        
        p {
          color: #666;
          margin-bottom: 20px;
          max-width: 500px;
        }
        
        .explore-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          background-color: $primary-color;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 0.3s;
          
          i {
            font-size: 1rem;
            color: white;
            margin-right: 8px;
            margin-bottom: 0;
          }
          
          &:hover {
            background-color: darken($primary-color, 10%);
          }
        }
      }
    }
    
    // Modal Styles
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      
      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #333;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #666;
        cursor: pointer;
        
        &:hover {
          color: #333;
        }
      }
    }
    
    .modal-body {
      padding: 20px;
      
      p {
        margin-bottom: 20px;
      }
      
      .cancellation-details {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        
        .detail-item {
          display: flex;
          margin-bottom: 5px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .detail-label {
            width: 100px;
            font-weight: 500;
            color: #555;
          }
        }
      }
      
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
      }
      
      .cancellation-policy {
        background-color: #fff7e6;
        padding: 15px;
        border-radius: 4px;
        
        p {
          margin: 0 0 10px;
          color: #b45309;
          font-weight: 500;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 5px;
          }
        }
        
        ul {
          margin: 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 5px;
            font-size: 0.9rem;
            color: #92400e;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px;
      border-top: 1px solid #eee;
      
      button {
        padding: 10px 20px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        
        &.btn-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          
          &:hover {
            background-color: #eee;
          }
        }
        
        &.btn-danger {
          background-color: #ef4444;
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: darken(#ef4444, 10%);
          }
          
          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  </style>