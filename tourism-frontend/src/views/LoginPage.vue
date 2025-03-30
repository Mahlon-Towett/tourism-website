<template>
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Welcome Back</h1>
            <p>Log in to your account to continue</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group" :class="{ 'has-error': errors.email }">
              <label for="email">Email</label>
              <div class="input-with-icon">
                <i class="fas fa-envelope"></i>
                <input 
                  type="email" 
                  id="email" 
                  v-model="loginForm.email" 
                  placeholder="Enter your email" 
                  required
                  autocomplete="email"
                  @input="clearFieldError('email')"
                />
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.password }">
              <label for="password">Password</label>
              <div class="input-with-icon">
                <i class="fas fa-lock"></i>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="loginForm.password" 
                  placeholder="Enter your password" 
                  required
                  autocomplete="current-password"
                  @input="clearFieldError('password')"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            
            <div class="form-group options">
              <div class="remember-me">
                <input type="checkbox" id="remember" v-model="loginForm.remember" />
                <label for="remember">Remember me</label>
              </div>
              <router-link to="/forgot-password" class="forgot-password">Forgot Password?</router-link>
            </div>
            
            <div class="form-group">
              <button type="submit" class="auth-button" :disabled="isLoading">
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Logging in...
                </span>
                <span v-else>Login</span>
              </button>
            </div>
            
            <div v-if="authError" class="auth-error">
              <i class="fas fa-exclamation-circle"></i>
              <span>{{ authError }}</span>
            </div>
          </form>
          
          <div class="auth-separator">
            <span>OR</span>
          </div>
          
          <div class="social-auth">
            <button class="social-button google">
              <i class="fab fa-google"></i> Sign in with Google
            </button>
            <button class="social-button facebook">
              <i class="fab fa-facebook-f"></i> Sign in with Facebook
            </button>
          </div>
          
          <div class="auth-footer">
            <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    name: 'LoginPage',
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      
      const loginForm = reactive({
        email: '',
        password: '',
        remember: false
      });
      
      const errors = reactive({
        email: '',
        password: ''
      });
      
      const showPassword = ref(false);
      
      const isLoading = computed(() => store.state.loading);
      const authError = computed(() => store.getters['auth/authError']);
      
      const clearFieldError = (field) => {
        errors[field] = '';
      };
      
      const validateForm = () => {
        let isValid = true;
        
        // Email validation
        if (!loginForm.email) {
          errors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Password validation
        if (!loginForm.password) {
          errors.password = 'Password is required';
          isValid = false;
        } else if (loginForm.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
          isValid = false;
        }
        
        return isValid;
      };
      
      const handleLogin = async () => {
        if (!validateForm()) return;
        
        try {
          await store.dispatch('auth/login', {
            email: loginForm.email,
            password: loginForm.password
          });
          
          // If login successful, redirect to the originally requested page or home
          const redirectPath = route.query.redirect || '/';
          router.push(redirectPath);
        } catch (error) {
          // Error is handled by the auth module
          console.error('Login failed:', error);
        }
      };
      
      return {
        loginForm,
        errors,
        showPassword,
        isLoading,
        authError,
        clearFieldError,
        handleLogin
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .auth-page {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f5f5f5;
    margin: -20px;
  }
  
  .auth-container {
    width: 100%;
    max-width: 500px;
  }
  
  .auth-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 40px;
    
    @media (max-width: 576px) {
      padding: 30px 20px;
    }
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: 30px;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #333;
    }
    
    p {
      color: #666;
    }
  }
  
  .auth-form {
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
          padding: 12px 15px 12px 40px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
        
        .toggle-password {
          position: absolute;
          right: 15px;
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
      
      &.has-error {
        .input-with-icon input {
          border-color: #f44336;
        }
        
        .error-message {
          display: block;
          color: #f44336;
          font-size: 0.8rem;
          margin-top: 5px;
        }
      }
      
      &.options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .remember-me {
          display: flex;
          align-items: center;
          
          input[type="checkbox"] {
            margin-right: 8px;
          }
          
          label {
            margin-bottom: 0;
            font-weight: normal;
            color: #666;
            font-size: 0.9rem;
          }
        }
        
        .forgot-password {
          color: $primary-color;
          font-size: 0.9rem;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .auth-button {
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
    
    .auth-error {
      background-color: #ffebee;
      color: #f44336;
      padding: 10px 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 8px;
      }
    }
  }
  
  .auth-separator {
    position: relative;
    text-align: center;
    margin: 30px 0;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #eee;
    }
    
    span {
      position: relative;
      background-color: white;
      padding: 0 15px;
      color: #999;
    }
  }
  
  .social-auth {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
    
    .social-button {
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        margin-right: 10px;
      }
      
      &.google {
        background-color: #fff;
        color: #555;
        border: 1px solid #ddd;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
      
      &.facebook {
        background-color: #3b5998;
        color: white;
        
        &:hover {
          background-color: darken(#3b5998, 10%);
        }
      }
    }
  }
  
  .auth-footer {
    text-align: center;
    
    p {
      color: #666;
      
      a {
        color: $primary-color;
        text-decoration: none;
        font-weight: 600;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  </style>