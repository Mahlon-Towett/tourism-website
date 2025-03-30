<template>
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-logo">
          <img src="@/assets/logo.png" alt="Tourism Website Logo" />
          <h3>Adventure Tours</h3>
          <p>Discover the world with us. Create unforgettable memories on your next adventure.</p>
          <div class="social-links">
            <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" title="Pinterest"><i class="fab fa-pinterest-p"></i></a>
          </div>
        </div>
        
        <div class="footer-nav">
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/destinations">Destinations</router-link></li>
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Top Destinations</h4>
            <ul>
              <li><a href="#">Maasai Mara</a></li>
              <li><a href="#">Mombasa Beaches</a></li>
              <li><a href="#">Lake Nakuru</a></li>
              <li><a href="#">Mount Kenya</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Help & Support</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Booking Policy</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Contact Us</h4>
            <address>
              <p><i class="fas fa-map-marker-alt"></i> 123 Tourism Street, Nairobi, Kenya</p>
              <p><i class="fas fa-phone"></i> +254 123 456 789</p>
              <p><i class="fas fa-envelope"></i> info@adventuretours.com</p>
            </address>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; {{ currentYear }} Adventure Tours. All Rights Reserved.</p>
          <div class="payment-methods">
            <span><i class="fab fa-cc-visa"></i></span>
            <span><i class="fab fa-cc-mastercard"></i></span>
            <span><i class="fab fa-cc-paypal"></i></span>
            <span><i class="fab fa-mpesa"></i></span>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'AppFooter',
    setup() {
      const currentYear = computed(() => new Date().getFullYear());
      
      return {
        currentYear
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .app-footer {
    background-color: #222;
    color: #fff;
    padding-top: 60px;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 2fr;
    }
  }
  
  .footer-logo {
    img {
      height: 60px;
      margin-bottom: 15px;
    }
    
    h3 {
      margin: 0 0 15px;
      font-size: 1.5rem;
      color: #fff;
    }
    
    p {
      margin-bottom: 20px;
      color: #aaa;
      line-height: 1.6;
    }
    
    .social-links {
      display: flex;
      
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 50%;
        margin-right: 10px;
        text-decoration: none;
        transition: all 0.3s;
        
        &:hover {
          background-color: $primary-color;
          transform: translateY(-3px);
        }
      }
    }
  }
  
  .footer-nav {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 30px;
  }
  
  .footer-col {
    h4 {
      color: #fff;
      margin: 0 0 20px;
      position: relative;
      font-size: 1.1rem;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background-color: $primary-color;
      }
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 10px;
        
        a {
          text-decoration: none;
          color: #aaa;
          transition: color 0.3s;
          
          &:hover {
            color: $primary-color;
          }
        }
      }
    }
    
    address {
      font-style: normal;
      color: #aaa;
      
      p {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        
        i {
          margin-right: 10px;
          color: $primary-color;
        }
      }
    }
  }
  
  .footer-bottom {
    margin-top: 60px;
    padding: 20px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      
      p {
        margin: 0;
        color: #aaa;
      }
    }
    
    .payment-methods {
      display: flex;
      
      span {
        margin-left: 15px;
        font-size: 1.5rem;
        color: #aaa;
      }
    }
    
    @media (max-width: 576px) {
      .container {
        flex-direction: column;
        text-align: center;
        
        p {
          margin-bottom: 15px;
        }
      }
    }
  }
  </style>