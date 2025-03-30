<template>
    <div class="profile-page">
      <div class="profile-container">
        <aside class="profile-sidebar">
          <div class="user-info">
            <div class="user-avatar">
              <span v-if="user">{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <h3>{{ user ? user.name : 'Loading...' }}</h3>
              <p>{{ user ? user.email : '' }}</p>
            </div>
          </div>
          
          <nav class="profile-nav">
            <router-link 
              :to="{ name: 'UserProfile' }" 
              exact-active-class="active"
              class="nav-item"
            >
              <i class="fas fa-user"></i> Account Details
            </router-link>
            
            <router-link 
              :to="{ name: 'UserBookings' }" 
              active-class="active"
              class="nav-item"
            >
              <i class="fas fa-calendar-alt"></i> My Bookings
            </router-link>
            
            <router-link 
              :to="{ name: 'UserSettings' }" 
              active-class="active"
              class="nav-item"
            >
              <i class="fas fa-cog"></i> Settings
            </router-link>
            
            <a href="#" class="nav-item" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
          </nav>
        </aside>
        
        <main class="profile-content">
          <router-view v-if="!loading" />
          <LoadingSpinner v-else />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  
  export default {
    name: 'UserProfilePage',
    components: {
      LoadingSpinner
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const loading = ref(true);
      
      const user = computed(() => store.getters['auth/currentUser']);
      
      const userInitials = computed(() => {
        if (!user.value || !user.value.name) return '?';
        
        return user.value.name
          .split(' ')
          .map(name => name.charAt(0))
          .join('')
          .toUpperCase()
          .substring(0, 2);
      });
      
      const fetchUserData = async () => {
        loading.value = true;
        try {
          // Fetch user profile if not already loaded
          if (!user.value) {
            await store.dispatch('auth/getUserProfile');
          }
          
          // Fetch user bookings
          await store.dispatch('bookings/fetchUserBookings');
        } catch (error) {
          console.error('Failed to load user data:', error);
          store.dispatch('setNotification', {
            message: 'Failed to load user data. Please try again.',
            type: 'error'
          });
        } finally {
          loading.value = false;
        }
      };
      
      const handleLogout = () => {
        store.dispatch('auth/logout');
      };
      
      onMounted(() => {
        fetchUserData();
      });
      
      return {
        user,
        userInitials,
        loading,
        handleLogout
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .profile-page {
    padding: 20px 0 60px;
  }
  
  .profile-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .profile-sidebar {
    .user-info {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      
      .user-avatar {
        width: 100px;
        height: 100px;
        background-color: $primary-color;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 15px;
      }
      
      .user-details {
        text-align: center;
        
        h3 {
          margin: 0 0 5px;
          font-size: 1.2rem;
          color: #333;
        }
        
        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
    
    .profile-nav {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      
      .nav-item {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        color: #555;
        text-decoration: none;
        border-left: 3px solid transparent;
        
        i {
          margin-right: 10px;
          width: 20px;
          text-align: center;
        }
        
        &:hover {
          background-color: #f5f5f5;
        }
        
        &.active {
          border-left-color: $primary-color;
          background-color: rgba($primary-color, 0.05);
          color: $primary-color;
          font-weight: 500;
        }
        
        & + .nav-item {
          border-top: 1px solid #eee;
        }
      }
    }
    
    @media (max-width: 768px) {
      .profile-nav {
        margin-bottom: 20px;
      }
    }
  }
  
  .profile-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    min-height: 500px;
  }
  </style>