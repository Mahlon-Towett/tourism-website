<template>
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Create an Account</h1>
            <p>Join us to discover amazing destinations</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group" :class="{ 'has-error': errors.name }">
              <label for="name">Full Name</label>
              <div class="input-with-icon">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  id="name" 
                  v-model="registerForm.name" 
                  placeholder="Enter your full name" 
                  required
                  autocomplete="name"
                  @input="clearFieldError('name')"
                />
              </div>
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.email }">
              <label for="email">Email</label>
              <div class="input-with-icon">
                <i class="fas fa-envelope"></i>
                <input 
                  type="email" 
                  id="email" 
                  v-model="registerForm.email" 
                  placeholder="Enter your email" 
                  required
                  autocomplete="email"
                  @input="clearFieldError('email')"
                />
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.phone }">
              <label for="phone">Phone Number (Optional)</label>
              <div class="input-with-icon">
                <i class="fas fa-phone"></i>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="registerForm.phone" 
                  placeholder="Enter your phone number" 
                  autocomplete="tel"
                  @input="clearFieldError('phone')"
                />
              </div>
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.password }">
              <label for="password">Password</label>
              <div class="input-with-icon">
                <i class="fas fa-lock"></i>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="registerForm.password" 
                  placeholder="Create a password" 
                  required
                  autocomplete="new-password"
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
              
              <div class="password-strength" v-if="registerForm.password">
                <div class="strength-meter">
                  <div 
                    class="strength-bar" 
                    :style="{ width: passwordStrength.percentage + '%' }"
                    :class="passwordStrength.class"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrength.class">
                  {{ passwordStrength.label }}
                </span>
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
              <label for="confirm-password">Confirm Password</label>
              <div class="input-with-icon">
                <i class="fas fa-lock"></i>
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirm-password" 
                  v-model="registerForm.confirmPassword" 
                  placeholder="Confirm your password" 
                  required
                  autocomplete="new-password"
                  @input="clearFieldError('confirmPassword')"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
            
            <div class="form-group agree-terms">
              <input 
                type="checkbox" 
                id="agree" 
                v-model="registerForm.agreeTerms" 
                required
                @change="clearFieldError('agreeTerms')"
              />
              <label for="agree">
                I agree to the <a href="#" @click.prevent="showTerms">Terms & Conditions</a> and <a href="#" @click.prevent="showPrivacy">Privacy Policy</a>
              </label>
              <span v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</span>
            </div>
            
            <div class="form-group">
              <button type="submit" class="auth-button" :disabled="isLoading">
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Creating account...
                </span>
                <span v-else>Create Account</span>
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
              <i class="fab fa-google"></i> Sign up with Google
            </button>
            <button class="social-button facebook">
              <i class="fab fa-facebook-f"></i> Sign up with Facebook
            </button>
          </div>
          
          <div class="auth-footer">
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'RegisterPage',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const registerForm = reactive({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
      const errors = reactive({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: ''
      });
      
      const showPassword = ref(false);
      const showConfirmPassword = ref(false);
      
      const isLoading = computed(() => store.state.loading);
      const authError = computed(() => store.getters['auth/authError']);
      
      // Password strength calculation
      const passwordStrength = computed(() => {
        const password = registerForm.password;
        
        if (!password) {
          return { percentage: 0, class: '', label: '' };
        }
        
        // Calculate password strength
        let strength = 0;
        let feedback = '';
        
        // Length check
        if (password.length >= 8) {
          strength += 25;
        }
        
        // Contains uppercase letters
        if (/[A-Z]/.test(password)) {
          strength += 25;
        }
        
        // Contains numbers
        if (/[0-9]/.test(password)) {
          strength += 25;
        }
        
        // Contains special characters
        if (/[^A-Za-z0-9]/.test(password)) {
          strength += 25;
        }
        
        // Determine label and class based on strength
        let strengthClass = '';
        
        if (strength <= 25) {
          feedback = 'Weak';
          strengthClass = 'weak';
        } else if (strength <= 50) {
          feedback = 'Fair';
          strengthClass = 'fair';
        } else if (strength <= 75) {
          feedback = 'Good';
          strengthClass = 'good';
        } else {
          feedback = 'Strong';
          strengthClass = 'strong';
        }
        
        return {
          percentage: strength,
          class: strengthClass,
          label: feedback
        };
      });
      
      const clearFieldError = (field) => {
        errors[field] = '';
      };
      
      const validateForm = () => {
        let isValid = true;
        
        // Name validation
        if (!registerForm.name.trim()) {
          errors.name = 'Name is required';
          isValid = false;
        }
        
        // Email validation
        if (!registerForm.email) {
          errors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Phone validation (optional)
        if (registerForm.phone && !/^(?:\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(registerForm.phone)) {
          errors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
        
        // Password validation
        if (!registerForm.password) {
          errors.password = 'Password is required';
          isValid = false;
        } else if (registerForm.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
          isValid = false;
        } else if (passwordStrength.value.percentage < 50) {
          errors.password = 'Please create a stronger password';
          isValid = false;
        }
        
        // Confirm password
        if (!registerForm.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (registerForm.password !== registerForm.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        
        // Terms agreement
        if (!registerForm.agreeTerms) {
          errors.agreeTerms = 'You must agree to the terms and conditions';
          isValid = false;
        }
        
        return isValid;
      };
      
      const handleRegister = async () => {
        if (!validateForm()) return;
        
        try {
          await store.dispatch('auth/register', {
            name: registerForm.name,
            email: registerForm.email,
            phone: registerForm.phone,
            password: registerForm.password
          });
          
          // If registration successful, redirect to home
          router.push('/');
        } catch (error) {
          // Error is handled by the auth module
          console.error('Registration failed:', error);
        }
      };
      
      const showTerms = () => {
        // Implementation for showing terms & conditions modal/page
        alert('Terms & Conditions would be shown here.');
      };
      
      const showPrivacy = () => {
        // Implementation for showing privacy policy modal/page
        alert('Privacy Policy would be shown here.');
      };
      
      return {
        registerForm,
        errors,
        showPassword,
        showConfirmPassword,
        isLoading,
        authError,
        passwordStrength,
        clearFieldError,
        handleRegister,
        showTerms,
        showPrivacy
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
      
      .password-strength {
        margin-top: 10px;
        
        .strength-meter {
          height: 5px;
          background-color: #f1f1f1;
          border-radius: 2px;
          margin-bottom: 5px;
          
          .strength-bar {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s;
            
            &.weak {
              background-color: #f44336;
            }
            
            &.fair {
              background-color: #ff9800;
            }
            
            &.good {
              background-color: #2196f3;
            }
            
            &.strong {
              background-color: #4caf50;
            }
          }
        }
        
        .strength-text {
          font-size: 0.8rem;
          
          &.weak {
            color: #f44336;
          }
          
          &.fair {
            color: #ff9800;
          }
          
          &.good {
            color: #2196f3;
          }
          
          &.strong {
            color: #4caf50;
          }
        }
      }
      
      &.agree-terms {
        display: flex;
        align-items: flex-start;
        
        input[type="checkbox"] {
          margin-right: 10px;
          margin-top: 3px;
        }
        
        label {
          margin-bottom: 0;
          font-weight: normal;
          color: #666;
          font-size: 0.9rem;
          
          a {
            color: $primary-color;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
        
        .error-message {
          display: block;
          width: 100%;
          margin-top: 5px;
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