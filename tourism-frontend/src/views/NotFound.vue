<template>
    <div class="not-found-page">
      <div class="not-found-container">
        <div class="not-found-content">
          <div class="not-found-icon">
            <i class="fas fa-map-signs"></i>
          </div>
          <h1>404</h1>
          <h2>Oops! Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <router-link to="/" class="back-home-btn">
            <i class="fas fa-home"></i> Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage'
  }
  </script>
  
  <style lang="scss" scoped>
  .not-found-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 200px);
    background-color: #f9f9f9;
    margin: -20px;
  }
  
  .not-found-container {
    max-width: 600px;
    padding: 40px 20px;
    text-align: center;
  }
  
  .not-found-content {
    .not-found-icon {
      font-size: 5rem;
      color: $primary-color;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }
    
    h1 {
      font-size: 6rem;
      font-weight: 700;
      color: $primary-color;
      margin: 0 0 10px;
      line-height: 1;
    }
    
    h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 15px;
    }
    
    p {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 30px;
    }
    
    .back-home-btn {
      display: inline-flex;
      align-items: center;
      padding: 12px 25px;
      background-color: $primary-color;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: background-color 0.3s;
      
      i {
        margin-right: 8px;
      }
      
      &:hover {
        background-color: darken($primary-color, 10%);
      }
    }
  }
  
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0);
    }
  }
  </style>