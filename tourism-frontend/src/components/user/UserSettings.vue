<template>
    <div class="user-settings">
      <div class="content-header">
        <h2>Account Settings</h2>
        <p>Manage your account information and preferences</p>
      </div>
      
      <div class="settings-content">
        <div class="settings-section">
          <div class="section-header">
            <h3>Personal Information</h3>
            <p>Update your personal details</p>
          </div>
          
          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="form-group" :class="{ 'has-error': errors.name }">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="profileForm.name" 
                placeholder="Enter your full name" 
                required
                @input="clearFieldError('name')"
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.email }">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                v-model="profileForm.email" 
                placeholder="Enter your email address" 
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
                v-model="profileForm.phone" 
                placeholder="Enter your phone number" 
                @input="clearFieldError('phone')"
              />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="save-btn" 
                :disabled="isProfileSubmitting"
              >
                <span v-if="isProfileSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Saving...
                </span>
                <span v-else>
                  Save Changes
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div class="settings-section">
          <div class="section-header">
            <h3>Change Password</h3>
            <p>Update your password to keep your account secure</p>
          </div>
          
          <form @submit.prevent="updatePassword" class="settings-form">
            <div class="form-group" :class="{ 'has-error': errors.currentPassword }">
              <label for="current-password">Current Password</label>
              <div class="password-input">
                <input 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  id="current-password" 
                  v-model="passwordForm.currentPassword" 
                  placeholder="Enter your current password" 
                  required
                  @input="clearFieldError('currentPassword')"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.newPassword }">
              <label for="new-password">New Password</label>
              <div class="password-input">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  id="new-password" 
                  v-model="passwordForm.newPassword" 
                  placeholder="Enter your new password" 
                  required
                  @input="clearFieldError('newPassword')"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showNewPassword = !showNewPassword"
                >
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
              
              <div class="password-strength" v-if="passwordForm.newPassword">
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
              <label for="confirm-password">Confirm New Password</label>
              <div class="password-input">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirm-password" 
                  v-model="passwordForm.confirmPassword" 
                  placeholder="Confirm your new password" 
                  required
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
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="save-btn" 
                :disabled="isPasswordSubmitting"
              >
                <span v-if="isPasswordSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Updating...
                </span>
                <span v-else>
                  Update Password
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div class="settings-section">
          <div class="section-header">
            <h3>Notification Preferences</h3>
            <p>Manage your email notification settings</p>
          </div>
          
          <div class="notification-options">
            <div class="option-item">
              <div class="option-label">
                <h4>Booking Confirmations</h4>
                <p>Receive booking confirmation emails</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationPreferences.bookingConfirmations">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-label">
                <h4>Booking Reminders</h4>
                <p>Receive reminders before your upcoming bookings</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationPreferences.bookingReminders">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-label">
                <h4>Special Offers</h4>
                <p>Receive emails about special offers and promotions</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationPreferences.specialOffers">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-label">
                <h4>Newsletter</h4>
                <p>Receive our monthly newsletter</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationPreferences.newsletter">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              @click="saveNotificationPreferences" 
              class="save-btn" 
              :disabled="isNotificationsSubmitting"
            >
              <span v-if="isNotificationsSubmitting">
                <i class="fas fa-spinner fa-spin"></i> Saving...
              </span>
              <span v-else>
                Save Preferences
              </span>
            </button>
          </div>
        </div>
        
        <div class="settings-section danger-zone">
          <div class="section-header">
            <h3>Account Actions</h3>
            <p>Dangerous actions related to your account</p>
          </div>
          
          <div class="account-actions">
            <div class="action-item">
              <div class="action-info">
                <h4>Delete Your Account</h4>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button @click="showDeleteConfirmation = true" class="delete-btn">
                Delete Account
              </button>
            </div>
          </div>
          
          <!-- Delete Account Confirmation Modal -->
          <div v-if="showDeleteConfirmation" class="modal-overlay" @click="showDeleteConfirmation = false">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>Delete Account</h3>
                <button @click="showDeleteConfirmation = false" class="close-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="modal-body">
                <div class="warning-message">
                  <i class="fas fa-exclamation-triangle"></i>
                  <h4>Warning: This action cannot be undone</h4>
                </div>
                
                <p>Are you sure you want to permanently delete your account? All of your data, including your profile, bookings, and payment history will be permanently removed.</p>
                
                <div class="form-group">
                  <label for="delete-confirmation">Please type <strong>DELETE</strong> to confirm</label>
                  <input 
                    type="text" 
                    id="delete-confirmation" 
                    v-model="deleteConfirmation" 
                    placeholder="Type DELETE here" 
                  />
                </div>
              </div>
              
              <div class="modal-footer">
                <button @click="showDeleteConfirmation = false" class="cancel-btn">
                  Cancel
                </button>
                <button 
                  @click="deleteAccount" 
                  :disabled="deleteConfirmation !== 'DELETE' || isDeleteSubmitting" 
                  class="confirm-delete-btn"
                >
                  <span v-if="isDeleteSubmitting">
                    <i class="fas fa-spinner fa-spin"></i> Deleting...
                  </span>
                  <span v-else>
                    Delete Account
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'UserSettings',
    setup() {
      const store = useStore();
      
      // Form states
      const isProfileSubmitting = ref(false);
      const isPasswordSubmitting = ref(false);
      const isNotificationsSubmitting = ref(false);
      const isDeleteSubmitting = ref(false);
      
      // Modal states
      const showDeleteConfirmation = ref(false);
      const deleteConfirmation = ref('');
      
      // Password visibility toggles
      const showCurrentPassword = ref(false);
      const showNewPassword = ref(false);
      const showConfirmPassword = ref(false);
      
      // Get user from store
      const user = computed(() => store.getters['auth/currentUser']);
      
      // Form models
      const profileForm = reactive({
        name: user.value ? user.value.name : '',
        email: user.value ? user.value.email : '',
        phone: user.value ? user.value.phone : ''
      });
      
      const passwordForm = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Placeholder for notification preferences
      // In a real app, these would be loaded from backend
      const notificationPreferences = reactive({
        bookingConfirmations: true,
        bookingReminders: true,
        specialOffers: false,
        newsletter: false
      });
      
      // Form validation errors
      const errors = reactive({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Password strength calculation
      const passwordStrength = computed(() => {
        const password = passwordForm.newPassword;
        
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
      
      // Methods
      const clearFieldError = (field) => {
        errors[field] = '';
      };
      
      const validateProfileForm = () => {
        let isValid = true;
        
        // Name validation
        if (!profileForm.name.trim()) {
          errors.name = 'Name is required';
          isValid = false;
        }
        
        // Email validation
        if (!profileForm.email) {
          errors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Phone validation (optional)
        if (profileForm.phone && !/^(?:\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(profileForm.phone)) {
          errors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
        
        return isValid;
      };
      
      const validatePasswordForm = () => {
        let isValid = true;
        
        // Current password validation
        if (!passwordForm.currentPassword) {
          errors.currentPassword = 'Current password is required';
          isValid = false;
        }
        
        // New password validation
        if (!passwordForm.newPassword) {
          errors.newPassword = 'New password is required';
          isValid = false;
        } else if (passwordForm.newPassword.length < 6) {
          errors.newPassword = 'Password must be at least 6 characters';
          isValid = false;
        } else if (passwordStrength.value.percentage < 50) {
          errors.newPassword = 'Please create a stronger password';
          isValid = false;
        }
        
        // Confirm password validation
        if (!passwordForm.confirmPassword) {
          errors.confirmPassword = 'Please confirm your new password';
          isValid = false;
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        
        return isValid;
      };
      
      const updateProfile = async () => {
        if (!validateProfileForm()) return;
        
        isProfileSubmitting.value = true;
        try {
          await store.dispatch('auth/updateUserProfile', {
            name: profileForm.name,
            email: profileForm.email,
            phone: profileForm.phone
          });
          
          store.dispatch('setNotification', {
            message: 'Profile updated successfully',
            type: 'success'
          });
        } catch (error) {
          console.error('Failed to update profile:', error);
          store.dispatch('setNotification', {
            message: 'Failed to update profile. Please try again.',
            type: 'error'
          });
        } finally {
          isProfileSubmitting.value = false;
        }
      };
      
      const updatePassword = async () => {
        if (!validatePasswordForm()) return;
        
        isPasswordSubmitting.value = true;
        try {
          await store.dispatch('auth/updatePassword', {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
          });
          
          // Reset form on success
          passwordForm.currentPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
          
          store.dispatch('setNotification', {
            message: 'Password updated successfully',
            type: 'success'
          });
        } catch (error) {
          console.error('Failed to update password:', error);
          
          // Handle specific error for incorrect current password
          if (error.response?.data?.error.includes('incorrect')) {
            errors.currentPassword = 'Current password is incorrect';
          } else {
            store.dispatch('setNotification', {
              message: 'Failed to update password. Please try again.',
              type: 'error'
            });
          }
        } finally {
          isPasswordSubmitting.value = false;
        }
      };
      
      const saveNotificationPreferences = async () => {
        isNotificationsSubmitting.value = true;
        try {
          // In a real application, this would be saved to the backend
          // Mocking API call success for demo purposes
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          store.dispatch('setNotification', {
            message: 'Notification preferences saved',
            type: 'success'
          });
        } catch (error) {
          console.error('Failed to save notification preferences:', error);
          store.dispatch('setNotification', {
            message: 'Failed to save preferences. Please try again.',
            type: 'error'
          });
        } finally {
          isNotificationsSubmitting.value = false;
        }
      };
      
      const deleteAccount = async () => {
        if (deleteConfirmation.value !== 'DELETE') return;
        
        isDeleteSubmitting.value = true;
        try {
          // This would be a real API call in production
          // Here we're just logging out the user
          await store.dispatch('auth/logout');
          
          store.dispatch('setNotification', {
            message: 'Your account has been deleted successfully',
            type: 'success'
          });
        } catch (error) {
          console.error('Failed to delete account:', error);
          store.dispatch('setNotification', {
            message: 'Failed to delete account. Please try again.',
            type: 'error'
          });
        } finally {
          isDeleteSubmitting.value = false;
          showDeleteConfirmation.value = false;
        }
      };
      
      // Initialization
      onMounted(() => {
        // Load user data if needed
        if (!user.value) {
          store.dispatch('auth/getUserProfile');
        }
        
        // Update form with current user data whenever user changes
        // This ensures form is populated even if user data loads after component mounts
        watch(user, (newUser) => {
          if (newUser) {
            profileForm.name = newUser.name || '';
            profileForm.email = newUser.email || '';
            profileForm.phone = newUser.phone || '';
          }
        });
      });
      
      return {
        profileForm,
        passwordForm,
        notificationPreferences,
        errors,
        isProfileSubmitting,
        isPasswordSubmitting,
        isNotificationsSubmitting,
        isDeleteSubmitting,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        passwordStrength,
        showDeleteConfirmation,
        deleteConfirmation,
        clearFieldError,
        updateProfile,
        updatePassword,
        saveNotificationPreferences,
        deleteAccount
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .user-settings {
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
    
    .settings-content {
      .settings-section {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 30px;
        
        &.danger-zone {
          border-left: 4px solid #ef4444;
        }
        
        .section-header {
          margin-bottom: 20px;
          
          h3 {
            margin: 0 0 5px;
            color: #333;
            font-size: 1.2rem;
          }
          
          p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    }
    
    .settings-form {
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        input {
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
        
        .password-input {
          position: relative;
          
          input {
            padding-right: 40px;
          }
          
          .toggle-password {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            
            &:hover {
              color: #333;
            }
          }
        }
        
        &.has-error {
          input {
            border-color: #ef4444;
          }
          
          .error-message {
            display: block;
            color: #ef4444;
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
                background-color: #ef4444;
              }
              
              &.fair {
                background-color: #f59e0b;
              }
              
              &.good {
                background-color: #3b82f6;
              }
              
              &.strong {
                background-color: #10b981;
              }
            }
          }
          
          .strength-text {
            font-size: 0.8rem;
            
            &.weak {
              color: #ef4444;
            }
            
            &.fair {
              color: #f59e0b;
            }
            
            &.good {
              color: #3b82f6;
            }
            
            &.strong {
              color: #10b981;
            }
          }
        }
      }
      
      .form-actions {
        display: flex;
        justify-content: flex-end;
        
        .save-btn {
          padding: 10px 20px;
          background-color: $primary-color;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
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
    
    .notification-options {
      margin-bottom: 20px;
      
      .option-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
        
        .option-label {
          h4 {
            margin: 0 0 5px;
            font-size: 1rem;
            color: #333;
          }
          
          p {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
          }
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          
          input {
            opacity: 0;
            width: 0;
            height: 0;
            
            &:checked + .toggle-slider {
              background-color: $primary-color;
              
              &:before {
                transform: translateX(26px);
              }
            }
            
            &:focus + .toggle-slider {
              box-shadow: 0 0 1px $primary-color;
            }
          }
          
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
            
            &:before {
              position: absolute;
              content: "";
              height: 16px;
              width: 16px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
            }
          }
        }
      }
    }
    
    .account-actions {
      .action-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .action-info {
          h4 {
            margin: 0 0 5px;
            font-size: 1rem;
            color: #333;
          }
          
          p {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
            max-width: 500px;
          }
        }
        
        .delete-btn {
          padding: 8px 16px;
          background-color: white;
          color: #ef4444;
          border: 1px solid #ef4444;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #ef4444;
            color: white;
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
      
      .warning-message {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        background-color: #fee2e2;
        border-radius: 4px;
        
        i {
          font-size: 1.5rem;
          color: #ef4444;
          margin-right: 15px;
        }
        
        h4 {
          margin: 0;
          color: #b91c1c;
        }
      }
      
      p {
        margin-bottom: 20px;
        color: #555;
      }
      
      .form-group {
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          
          &:focus {
            border-color: #ef4444;
            outline: none;
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
        
        &.cancel-btn {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          
          &:hover {
            background-color: #eee;
          }
        }
        
        &.confirm-delete-btn {
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
          
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
  </style>