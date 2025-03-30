<template>
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>Discover Kenya's Beauty</h1>
          <p>Find the perfect destination for your next adventure</p>
          
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Where would you like to go?" 
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch">
              <i class="fas fa-search"></i> Search
            </button>
          </div>
          
          <div class="quick-categories">
            <div 
              v-for="category in featuredCategories" 
              :key="category.value"
              class="category-item"
              @click="goToCategory(category.value)"
            >
              <div class="category-icon">
                <i :class="category.icon"></i>
              </div>
              <span>{{ category.label }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Featured Destinations Section -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Featured Destinations</h2>
          <router-link to="/destinations" class="view-all-link">
            View All <i class="fas fa-chevron-right"></i>
          </router-link>
        </div>
        
        <div class="featured-grid">
          <LoadingSpinner v-if="loading" />
          
          <template v-else-if="featuredDestinations.length > 0">
            <DestinationCard 
              v-for="destination in featuredDestinations" 
              :key="destination._id" 
              :destination="destination"
            />
          </template>
          
          <div v-else class="no-destinations">
            <p>No featured destinations available at the moment.</p>
          </div>
        </div>
      </section>
      
      <!-- Special Offers Section -->
      <section class="special-offers-section">
        <div class="section-header">
          <h2>Special Offers</h2>
        </div>
        
        <div class="offers-container">
          <div class="offer-card">
            <div class="offer-image">
              <img src="@/assets/images/offer1.jpg" alt="Special Offer" />
            </div>
            <div class="offer-content">
              <span class="offer-badge">25% OFF</span>
              <h3>Weekend Getaway</h3>
              <p>Enjoy a relaxing weekend with our special package</p>
              <router-link to="/destinations" class="offer-btn">View Deal</router-link>
            </div>
          </div>
          
          <div class="offer-card">
            <div class="offer-image">
              <img src="@/assets/images/offer2.jpg" alt="Special Offer" />
            </div>
            <div class="offer-content">
              <span class="offer-badge">FREE UPGRADE</span>
              <h3>Summer Special</h3>
              <p>Book now and get a free room upgrade</p>
              <router-link to="/destinations" class="offer-btn">View Deal</router-link>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="section-header">
          <h2>What Our Travelers Say</h2>
        </div>
        
        <div class="testimonials-container">
          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="@/assets/images/avatar1.jpg" alt="User Avatar" />
            </div>
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <p class="testimonial-text">"The best travel experience I've ever had. The destinations were breathtaking and the service was top-notch!"</p>
              <p class="testimonial-author">- Jane Doe</p>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="@/assets/images/avatar2.jpg" alt="User Avatar" />
            </div>
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
              <p class="testimonial-text">"Booking was easy and the destinations exceeded our expectations. Will definitely use this service again for our future travels."</p>
              <p class="testimonial-author">- John Smith</p>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="@/assets/images/avatar3.jpg" alt="User Avatar" />
            </div>
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <p class="testimonial-text">"The support team was extremely helpful and responsive. Our trip to Maasai Mara was flawless thanks to their recommendations."</p>
              <p class="testimonial-author">- Mary Johnson</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="newsletter-container">
          <div class="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Stay updated with our latest offers, destinations, and travel tips.</p>
            
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <input 
                type="email" 
                v-model="email" 
                placeholder="Enter your email address" 
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import DestinationCard from '@/components/destinations/DestinationCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

export default {
    name: 'HomePage',
    components: {
        DestinationCard,
        LoadingSpinner
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        
        const searchQuery = ref('');
        const email = ref('');
        
        // Featured categories
        const featuredCategories = [
            { label: 'Beach', value: 'beach', icon: 'fas fa-umbrella-beach' },
            { label: 'Safari', value: 'adventure', icon: 'fas fa-paw' },
            { label: 'Mountain', value: 'mountain', icon: 'fas fa-mountain' },
            { label: 'Historical', value: 'historical', icon: 'fas fa-landmark' },
            { label: 'Cultural', value: 'cultural', icon: 'fas fa-theater-masks' }
        ];
        
        // Get destinations from store
        const loading = computed(() => store.getters['destinations/isLoading']);
        const featuredDestinations = computed(() => store.getters['destinations/featuredDestinations']);
        
        // Fetch destinations on component mount
        onMounted(async () => {
            try {
                if (featuredDestinations.value.length === 0) {
                    await store.dispatch('destinations/fetchDestinations');
                }
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            }
        });
        
        // Handle search
        const handleSearch = () => {
            if (searchQuery.value.trim()) {
                router.push({
                    path: '/destinations',
                    query: { search: searchQuery.value }
                });
            }
        };
        
        // Navigate to category
        const goToCategory = (category) => {
            router.push({
                path: '/destinations',
                query: { category }
            });
        };
        
        // Newsletter subscription
        const subscribeNewsletter = () => {
            // This would normally call an API to subscribe the user
            store.dispatch('setNotification', {
                message: 'Thank you for subscribing to our newsletter!',
                type: 'success'
            });
            email.value = '';
        };
        
        return {
            searchQuery,
            email,
            featuredCategories,
            loading,
            featuredDestinations,
            handleSearch,
            goToCategory,
            subscribeNewsletter
        };
    }
};
</script>

<style lang="scss" scoped>
.home-page {
    section {
        margin-bottom: 60px;
    }
}

// Hero Section
.hero-section {
    position: relative;
    height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/hero-bg.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    margin-top: -20px; // Offset page padding
    margin-left: -20px;
    margin-right: -20px;
    
    .hero-content {
        max-width: 800px;
        padding: 0 20px;
        
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
    }
    
    .search-container {
        display: flex;
        max-width: 600px;
        margin: 0 auto 30px;
        
        input {
            flex: 1;
            padding: 15px 20px;
            border: none;
            border-radius: 4px 0 0 4px;
            font-size: 1rem;
            outline: none;
        }
        
        button {
            padding: 15px 25px;
            background-color: $primary-color;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
            
            &:hover {
                background-color: darken($primary-color, 10%);
            }
            
            i {
                margin-right: 5px;
            }
        }
    }
    
    .quick-categories {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        
        .category-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 15px;
            cursor: pointer;
            transition: transform 0.3s;
            
            &:hover {
                transform: translateY(-5px);
            }
            
            .category-icon {
                width: 60px;
                height: 60px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                
                i {
                    font-size: 1.5rem;
                }
            }
            
            span {
                font-size: 0.9rem;
            }
        }
    }
}

// Featured Destinations Section
.featured-section {
    max-width: 1200px;
    margin: 0 auto;
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        
        h2 {
            font-size: 2rem;
            color: #333;
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 0;
                width: 50px;
                height: 3px;
                background-color: $primary-color;
            }
        }
        
        .view-all-link {
            color: $primary-color;
            text-decoration: none;
            display: flex;
            align-items: center;
            
            i {
                font-size: 0.8rem;
                margin-left: 5px;
            }
            
            &:hover {
                text-decoration: underline;
            }
        }
    }
    
    .featured-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 30px;
        
        .no-destinations {
            grid-column: 1 / -1;
            text-align: center;
            padding: 30px;
            background-color: #f9f9f9;
            border-radius: 8px;
            
            p {
                color: #666;
            }
        }
    }
}

// Special Offers Section
.special-offers-section {
    max-width: 1200px;
    margin: 0 auto;
    
    .offers-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }
    
    .offer-card {
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
        
        &:hover {
            transform: translateY(-5px);
        }
        
        .offer-image {
            flex: 0 0 40%;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        
        .offer-content {
            flex: 1;
            padding: 20px;
            position: relative;
            
            .offer-badge {
                position: absolute;
                top: 15px;
                right: 15px;
                background-color: $primary-color;
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 0.8rem;
                font-weight: bold;
            }
            
            h3 {
                margin-top: 0;
                font-size: 1.3rem;
                margin-bottom: 10px;
            }
            
            p {
                color: #666;
                margin-bottom: 20px;
            }
            
            .offer-btn {
                display: inline-block;
                padding: 8px 20px;
                background-color: $primary-color;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
                
                &:hover {
                    background-color: darken($primary-color, 10%);
                }
            }
        }
    }
}

// Testimonials Section
.testimonials-section {
    background-color: #f9f9f9;
    padding: 60px 0;
    margin-left: -20px;
    margin-right: -20px;
    
    .section-header {
        max-width: 1200px;
        margin: 0 auto 40px;
        padding: 0 20px;
        
        h2 {
            font-size: 2rem;
            color: #333;
            text-align: center;
        }
    }
    
    .testimonials-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        gap: 30px;
    }
    
    .testimonial-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 30px;
        width: 100%;
        max-width: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        
        .testimonial-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 20px;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        
        .testimonial-content {
            .testimonial-rating {
                color: #ffc107;
                margin-bottom: 15px;
                
                i {
                    margin: 0 2px;
                }
            }
            
            .testimonial-text {
                color: #555;
                font-style: italic;
                margin-bottom: 15px;
                line-height: 1.6;
            }
            
            .testimonial-author {
                font-weight: 600;
                color: #333;
            }
        }
    }
}

// Newsletter Section
.newsletter-section {
    background-color: $primary-color;
    color: white;
    padding: 60px 0;
    margin: 0 -20px;
    
    .newsletter-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .newsletter-content {
        text-align: center;
        
        h2 {
            font-size: 2rem;
            margin-bottom: 15px;
        }
        
        p {
            margin-bottom: 30px;
            font-size: 1.1rem;
        }
    }
    
    .newsletter-form {
        display: flex;
        max-width: 500px;
        margin: 0 auto;
        
        input {
            flex: 1;
            padding: 12px 15px;
            border: none;
            border-radius: 4px 0 0 4px;
            font-size: 1rem;
        }
        
        button {
            padding: 12px 25px;
            background-color: #fff;
            color: $primary-color;
            border: none;
            border-radius: 0 4px 4px 0;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
            
            &:hover {
                background-color: #eee;
            }
        }
    }
}

@media (max-width: 768px) {
    .hero-section {
        height: auto;
        padding: 80px 0;
        
        .hero-content {
            h1 {
                font-size: 2.2rem;
            }
            
            p {
                font-size: 1rem;
            }
        }
        
        .search-container {
            flex-direction: column;
            
            input {
                border-radius: 4px;
                margin-bottom: 10px;
            }
            
            button {
                border-radius: 4px;
            }
        }
    }
    
    .quick-categories {
        .category-item {
            margin: 10px;
        }
    }
    
    .section-header {
        h2 {
            font-size: 1.5rem;
        }
    }
    
    .offer-card {
        flex-direction: column;
        
        .offer-image {
            flex: 0 0 200px;
        }
    }
    
    .newsletter-form {
        flex-direction: column;
        
        input {
            border-radius: 4px;
            margin-bottom: 10px;
        }
        
        button {
            border-radius: 4px;
        }
    }
}
</style>