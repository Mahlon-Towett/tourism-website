<template>
    <header class="app-header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Tourism Website Logo" />
            <span class="site-name">Adventure Tours</span>
          </router-link>
        </div>
        
        <div class="search-bar" v-if="showSearch">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search for destinations..." 
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <nav class="main-nav">
          <div class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <ul class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
            <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
            <li><router-link to="/destinations" @click="closeMobileMenu">Destinations</router-link></li>
            <li><router-link to="/about" @click="closeMobileMenu">About</router-link></li>
            <li><router-link to="/contact" @click="closeMobileMenu">Contact</router-link></li>
          </ul>
          
          <div class="auth-links">
            <template v-if="isAuthenticated">
              <div class="user-menu" @click="toggleUserMenu" ref="userMenuToggle">
                <div class="user-avatar">
                  <span>{{ userInitials }}</span>
                </div>
                <div class="user-menu-dropdown" v-if="userMenuOpen">
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                  <ul>
                    <li><router-link to="/profile" @click="closeUserMenu">Your Profile</router-link></li>
                    <li><router-link to="/profile/bookings" @click="closeUserMenu">Your Bookings</router-link></li>
                    <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
                  </ul>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-outline">Login</router-link>
              <router-link to="/register" class="btn btn-primary">Sign Up</router-link>
            </template>
          </div>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'AppHeader',
    props: {
      showSearch: {
        type: Boolean,
        default: true
        }
      
   
    },
    setup(props) {
      const store = useStore();
      const router = useRouter();
      
      const searchQuery = ref('');
      const mobileMenuOpen = ref(false);
      const userMenuOpen = ref(false);
      const userMenuToggle = ref(null);
      
      const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
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
      
      const handleSearch = () => {
        if (searchQuery.value.trim()) {
          router.push({
            path: '/destinations',
            query: { search: searchQuery.value }
          });
          searchQuery.value = '';
          mobileMenuOpen.value = false;
        }
      };
      
      const handleLogout = () => {
        store.dispatch('auth/logout');
        closeUserMenu();
      };
      
      const toggleUserMenu = () => {
        userMenuOpen.value = !userMenuOpen.value;
      };
      
      const closeUserMenu = () => {
        userMenuOpen.value = false;
      };
      
      const closeMobileMenu = () => {
        mobileMenuOpen.value = false;
      };
      
      // Close user menu when clicking outside
      const handleClickOutside = (event) => {
        if (userMenuToggle.value && !userMenuToggle.value.contains(event.target)) {
          closeUserMenu();
        }
      };
      
      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });
      
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });
      
      return {
        searchQuery,
        mobileMenuOpen,
        userMenuOpen,
        userMenuToggle,
        isAuthenticated,
        user,
        userInitials,
        handleSearch,
        handleLogout,
        toggleUserMenu,
        closeUserMenu,
        closeMobileMenu
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .app-header {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo {
    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: $primary-color;
      
      img {
        height: 40px;
        margin-right: 10px;
      }
      
      .site-name {
        font-size: 1.5rem;
        font-weight: 700;
      }
    }
  }
  
  .search-bar {
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
    position: relative;
    
    input {
      width: 100%;
      padding: 10px 40px 10px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 25px;
      font-size: 1rem;
      outline: none;
      
      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }
    
    .search-btn {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 8px;
      
      &:hover {
        color: $primary-color;
      }
    }
  }
  
  .main-nav {
    display: flex;
    align-items: center;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      margin: 0 15px;
      
      a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        padding: 5px 0;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: $primary-color;
          transition: width 0.3s;
        }
        
        &:hover, &.router-link-active {
          color: $primary-color;
          
          &::after {
            width: 100%;
          }
        }
      }
    }
  }
  
  .auth-links {
    display: flex;
    align-items: center;
    margin-left: 20px;
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      margin-left: 10px;
      
      &.btn-outline {
        border: 1px solid $primary-color;
        color: $primary-color;
        
        &:hover {
          background-color: rgba($primary-color, 0.1);
        }
      }
      
      &.btn-primary {
        background-color: $primary-color;
        color: white;
        
        &:hover {
          background-color: darken($primary-color, 10%);
        }
      }
    }
  }
  
  .user-menu {
    position: relative;
    cursor: pointer;
    
    .user-avatar {
      width: 40px;
      height: 40px;
      background-color: $primary-color;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .user-menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 10px;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      width: 200px;
      z-index: 1000;
      
      .user-info {
        padding: 15px;
        border-bottom: 1px solid #eee;
        
        .user-name {
          display: block;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .user-email {
          display: block;
          font-size: 0.8rem;
          color: #666;
        }
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin: 0;
          
          a {
            display: block;
            padding: 10px 15px;
            text-decoration: none;
            color: #333;
            
            &:hover {
              background-color: #f5f5f5;
              color: $primary-color;
            }
          }
        }
      }
    }
  }
  
  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    cursor: pointer;
    
    span {
      display: block;
      height: 3px;
      width: 100%;
      background-color: #333;
      border-radius: 3px;
    }
  }
  
  @media (max-width: 768px) {
    .header-container {
      flex-wrap: wrap;
    }
    
    .logo {
      flex: 1;
    }
    
    .search-bar {
      order: 3;
      max-width: 100%;
      margin: 15px 0 0;
      flex: 0 0 100%;
    }
    
    .mobile-menu-toggle {
      display: flex;
      margin-right: 15px;
    }
    
    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      background-color: white;
      width: 100%;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      
      &.mobile-open {
        display: flex;
      }
      
      li {
        margin: 0;
        
        a {
          display: block;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          
          &::after {
            display: none;
          }
        }
      }
    }
  }
  </style>