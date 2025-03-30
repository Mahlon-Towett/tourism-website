<template>
    <div class="contact-page">
      <div class="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team for inquiries or bookings.</p>
      </div>
      
      <div class="contact-container">
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card">
              <div class="card-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="card-content">
                <h3>Visit Us</h3>
                <p>123 Tourism Street</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="card-icon">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="card-content">
                <h3>Call Us</h3>
                <p>+254 123 456 789</p>
                <p>Monday - Friday, 8am - 6pm</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="card-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="card-content">
                <h3>Email Us</h3>
                <p>info@adventuretours.com</p>
                <p>We'll respond within 24 hours</p>
              </div>
            </div>
            
            <div class="social-links">
              <h3>Follow Us</h3>
              <div class="social-icons">
                <a href="#" class="social-icon facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-icon instagram">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-icon twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-icon linkedin">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div class="contact-form-container">
            <h2>Send Us a Message</h2>
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  placeholder="Enter your name" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  placeholder="Enter your email" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="formData.phone" 
                  placeholder="Enter your phone number" 
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" v-model="formData.subject" required>
                  <option value="" disabled selected>Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  v-model="formData.message" 
                  placeholder="Write your message here" 
                  rows="5" 
                  required
                ></textarea>
              </div>
              
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Sending...
                </span>
                <span v-else>Send Message</span>
              </button>
            </form>
          </div>
        </div>
        
        <div class="map-section">
          <h2>Find Us</h2>
          <div class="map-container">
            <!-- Map would be implemented here with Mapbox or Google Maps -->
            <div class="map-placeholder">
              <i class="fas fa-map-marked-alt"></i>
              <p>Map placeholder - would be replaced with actual map</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue';
  
  export default {
    name: 'ContactPage',
    setup() {
      const formData = reactive({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      const isSubmitting = ref(false);
      
      const submitForm = async () => {
        isSubmitting.value = true;
        
        try {
          // In a real application, this would make an API call
          // For demo purposes, we'll just simulate a delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Reset form
          formData.name = '';
          formData.email = '';
          formData.phone = '';
          formData.subject = '';
          formData.message = '';
          
          // Show success message
          alert('Your message has been sent successfully! We will get back to you soon.');
        } catch (error) {
          console.error('Failed to send message:', error);
          alert('Failed to send message. Please try again.');
        } finally {
          isSubmitting.value = false;
        }
      };
      
      return {
        formData,
        isSubmitting,
        submitForm
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .contact-page {
    padding-bottom: 60px;
  }
  
  .page-header {
    text-align: center;
    padding: 60px 20px;
    background-color: #f9f9f9;
    margin-bottom: 40px;
    margin: -20px -20px 40px;
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: #333;
    }
    
    p {
      font-size: 1.2rem;
      color: #666;
      max-width: 700px;
      margin: 0 auto;
    }
  }
  
  .contact-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    margin-bottom: 60px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
  
  .contact-info {
    .info-card {
      display: flex;
      margin-bottom: 25px;
      
      .card-icon {
        width: 50px;
        height: 50px;
        background-color: $primary-color;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        
        i {
          font-size: 1.2rem;
        }
      }
      
      .card-content {
        h3 {
          margin: 0 0 5px;
          font-size: 1.1rem;
        }
        
        p {
          margin: 0 0 5px;
          color: #666;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    
    .social-links {
      margin-top: 40px;
      
      h3 {
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      
      .social-icons {
        display: flex;
        gap: 10px;
        
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: opacity 0.3s;
          
          &:hover {
            opacity: 0.8;
          }
          
          &.facebook {
            background-color: #3b5998;
          }
          
          &.instagram {
            background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
          }
          
          &.twitter {
            background-color: #1da1f2;
          }
          
          &.linkedin {
            background-color: #0077b5;
          }
        }
      }
    }
  }
  
  .contact-form-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    padding: 30px;
    
    h2 {
      margin-top: 0;
      margin-bottom: 25px;
      text-align: center;
      font-size: 1.5rem;
      color: #333;
    }
    
    .contact-form {
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
      }
      
      .submit-btn {
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
  }
  
  .map-section {
    h2 {
      text-align: center;
      margin-bottom: 25px;
      font-size: 1.5rem;
      color: #333;
    }
    
    .map-container {
      height: 400px;
      background-color: #f5f5f5;
      border-radius: 8px;
      overflow: hidden;
      
      .map-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        
        i {
          font-size: 3rem;
          margin-bottom: 15px;
        }
      }
    }
  }
  </style>