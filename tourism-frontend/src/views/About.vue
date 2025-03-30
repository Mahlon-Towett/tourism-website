<template>
    <div class="about-page">
      <div class="page-header">
        <h1>About Adventure Tours</h1>
        <p>Discover Kenya's natural beauty with us</p>
      </div>
      
      <div class="about-content">
        <section class="about-section">
          <div class="container">
            <div class="section-header">
              <h2>Our Story</h2>
            </div>
            
            <div class="about-grid">
              <div class="about-text">
                <p>Adventure Tours was founded in 2015 by a group of passionate travel enthusiasts who wanted to showcase the incredible beauty and diversity of Kenya to the world.</p>
                
                <p>What started as a small local tour operation has now grown into one of Kenya's premier tourism services, offering tailored experiences to travelers from all over the globe.</p>
                
                <p>Our mission is to provide unforgettable experiences while promoting sustainable and responsible tourism practices that benefit local communities and preserve Kenya's natural heritage.</p>
              </div>
              
              <div class="about-image">
                <div class="image-placeholder">
                  <i class="fas fa-image"></i>
                  <p>Image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="values-section">
          <div class="container">
            <div class="section-header">
              <h2>Our Values</h2>
            </div>
            
            <div class="values-grid">
              <div class="value-card">
                <div class="value-icon">
                  <i class="fas fa-leaf"></i>
                </div>
                <h3>Sustainability</h3>
                <p>We're committed to environmentally responsible tourism practices that preserve Kenya's natural beauty for future generations.</p>
              </div>
              
              <div class="value-card">
                <div class="value-icon">
                  <i class="fas fa-users"></i>
                </div>
                <h3>Community</h3>
                <p>We support local communities through employment, education, and sustainable development initiatives.</p>
              </div>
              
              <div class="value-card">
                <div class="value-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Safety</h3>
                <p>Your safety is our top priority. We maintain the highest standards of safety across all our tours and accommodations.</p>
              </div>
              
              <div class="value-card">
                <div class="value-icon">
                  <i class="fas fa-star"></i>
                </div>
                <h3>Excellence</h3>
                <p>We strive for excellence in every aspect of our service, from accommodations to customer support.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section class="team-section">
          <div class="container">
            <div class="section-header">
              <h2>Our Team</h2>
            </div>
            
            <div class="team-grid">
              <div class="team-member">
                <div class="member-image">
                  <div class="image-placeholder">
                    <i class="fas fa-user"></i>
                  </div>
                </div>
                <div class="member-info">
                  <h3>John Kamau</h3>
                  <p class="member-role">Founder & CEO</p>
                  <p class="member-bio">With over 15 years of experience in the tourism industry, John leads our company with passion and expertise.</p>
                </div>
              </div>
              
              <div class="team-member">
                <div class="member-image">
                  <div class="image-placeholder">
                    <i class="fas fa-user"></i>
                  </div>
                </div>
                <div class="member-info">
                  <h3>Sarah Wanjiku</h3>
                  <p class="member-role">Head of Operations</p>
                  <p class="member-bio">Sarah ensures our tours run smoothly and that each guest receives personalized attention.</p>
                </div>
              </div>
              
              <div class="team-member">
                <div class="member-image">
                  <div class="image-placeholder">
                    <i class="fas fa-user"></i>
                  </div>
                </div>
                <div class="member-info">
                  <h3>Michael Omondi</h3>
                  <p class="member-role">Lead Tour Guide</p>
                  <p class="member-bio">With extensive knowledge of Kenya's wildlife and landscapes, Michael creates unforgettable tour experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutPage'
  }
  </script>
  
  <style lang="scss" scoped>
  .about-page {
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
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 2rem;
      position: relative;
      padding-bottom: 15px;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: $primary-color;
      }
    }
  }
  
  .about-section {
    margin-bottom: 60px;
    
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .about-text {
        p {
          margin-bottom: 20px;
          line-height: 1.7;
          color: #555;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      
      .about-image {
        .image-placeholder {
          width: 100%;
          height: 350px;
          background-color: #f5f5f5;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          
          i {
            font-size: 3rem;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  
  .values-section {
    padding: 60px 0;
    background-color: #f9f9f9;
    margin: 0 -20px;
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      
      .value-card {
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s;
        
        &:hover {
          transform: translateY(-10px);
        }
        
        .value-icon {
          width: 80px;
          height: 80px;
          background-color: $primary-color;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          
          i {
            font-size: 2rem;
          }
        }
        
        h3 {
          margin-bottom: 15px;
          color: #333;
        }
        
        p {
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
  
  .team-section {
    padding: 60px 0;
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      
      .team-member {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        
        .member-image {
          .image-placeholder {
            width: 100%;
            height: 300px;
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #999;
            
            i {
              font-size: 3rem;
            }
          }
        }
        
        .member-info {
          padding: 20px;
          
          h3 {
            margin-bottom: 5px;
            font-size: 1.2rem;
          }
          
          .member-role {
            color: $primary-color;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .member-bio {
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }
  </style>