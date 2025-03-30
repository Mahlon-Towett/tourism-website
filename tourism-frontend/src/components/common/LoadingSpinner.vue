<template>
    <div :class="['loading-spinner', { overlay: overlay }]">
      <div class="spinner">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
        <div class="dot dot4"></div>
      </div>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      overlay: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: ''
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    
    &.overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
    
    .spinner {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
    }
    
    .dot {
      position: absolute;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background-color: $primary-color;
      animation: dot-move 2s infinite ease-in-out;
    }
    
    .dot1 {
      top: 0;
      left: 0;
      animation-delay: -1.5s;
    }
    
    .dot2 {
      top: 0;
      right: 0;
      animation-delay: -1s;
    }
    
    .dot3 {
      bottom: 0;
      right: 0;
      animation-delay: -0.5s;
    }
    
    .dot4 {
      bottom: 0;
      left: 0;
      animation-delay: 0s;
    }
    
    .loading-message {
      margin-top: 16px;
      font-size: 1rem;
      color: #666;
    }
  }
  
  @keyframes dot-move {
    0%, 100% {
      transform: scale(0.7);
      opacity: 0.7;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>