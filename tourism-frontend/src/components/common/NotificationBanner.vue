<template>
    <transition name="notification-fade">
      <div 
        v-if="visible" 
        class="notification-banner" 
        :class="notificationClass"
      >
        <div class="notification-content">
          <i :class="iconClass"></i>
          <span>{{ message }}</span>
        </div>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    name: 'NotificationBanner',
    props: {
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info',
        validator: value => ['success', 'error', 'warning', 'info'].includes(value)
      },
      duration: {
        type: Number,
        default: 5000 // 5 seconds
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const visible = ref(true);
      
      const notificationClass = computed(() => {
        return `notification-${props.type}`;
      });
      
      const iconClass = computed(() => {
        const iconMap = {
          success: 'fas fa-check-circle',
          error: 'fas fa-exclamation-circle',
          warning: 'fas fa-exclamation-triangle',
          info: 'fas fa-info-circle'
        };
        return iconMap[props.type] || iconMap.info;
      });
      
      const close = () => {
        visible.value = false;
        setTimeout(() => {
          emit('close');
        }, 300); // Wait for transition to complete
      };
      
      onMounted(() => {
        if (props.autoClose && props.duration > 0) {
          setTimeout(() => {
            close();
          }, props.duration);
        }
      });
      
      return {
        visible,
        notificationClass,
        iconClass,
        close
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .notification-banner {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1100;
    width: 90%;
    max-width: 500px;
    padding: 12px 16px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .notification-content {
      display: flex;
      align-items: center;
      
      i {
        margin-right: 12px;
        font-size: 1.2rem;
      }
    }
    
    .close-btn {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.7;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
      
      &:hover {
        opacity: 1;
      }
    }
    
    &.notification-success {
      background-color: #ecfdf5;
      color: #047857;
      border-left: 4px solid #10b981;
    }
    
    &.notification-error {
      background-color: #fef2f2;
      color: #b91c1c;
      border-left: 4px solid #ef4444;
    }
    
    &.notification-warning {
      background-color: #fffbeb;
      color: #92400e;
      border-left: 4px solid #f59e0b;
    }
    
    &.notification-info {
      background-color: #eff6ff;
      color: #1e40af;
      border-left: 4px solid #3b82f6;
    }
  }
  
  .notification-fade-enter-active,
  .notification-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .notification-fade-enter-from,
  .notification-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  </style>