<template>
    <div class="destination-card">
      <div class="card-image">
        <img :src="destinationImage" :alt="destination.name" />
        <div class="image-overlay">
          <span class="category">{{ destination.category }}</span>
          <div v-if="destination.specialPrice" class="special-offer">
            Special Offer
          </div>
        </div>
      </div>
      
      <div class="card-content">
        <div class="card-header">
          <h3 class="destination-name">{{ destination.name }}</h3>
          <div class="destination-rating">
            <div class="stars">
              <i 
                v-for="star in 5" 
                :key="star" 
                :class="[
                  'fas', 
                  { 
                    'fa-star': star <= Math.round(destination.rating), 
                    'fa-star-half-alt': star === Math.ceil(destination.rating) && destination.rating % 1 !== 0,
                    'far fa-star': star > Math.round(destination.rating)
                  }
                ]"
              ></i>
            </div>
            <span class="rating-text">{{ destination.rating.toFixed(1) }}</span>
          </div>
        </div>
        
        <div class="location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ locationText }}</span>
        </div>
        
        <p class="description">{{ truncatedDescription }}</p>
        
        <div class="amenities" v-if="destination.amenities && destination.amenities.length">
          <div v-for="(amenity, index) in limitedAmenities" :key="index" class="amenity">
            <i :class="getAmenityIcon(amenity)"></i>
            <span>{{ amenity }}</span>
          </div>
          <div v-if="destination.amenities.length > 3" class="amenity more">
            +{{ destination.amenities.length - 3 }} more
          </div>
        </div>
        
        <div class="card-footer">
          <div class="price">
            <span v-if="destination.specialPrice" class="original-price">KES {{ formatPrice(destination.pricePerNight) }}</span>
            <span class="current-price">
              KES {{ formatPrice(destination.specialPrice || destination.pricePerNight) }}
            </span>
            <span class="price-period">per night</span>
          </div>
          
          <router-link :to="`/destinations/${destination._id}`" class="view-btn">
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'DestinationCard',
    props: {
      destination: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      // Get main image or placeholder
      const destinationImage = computed(() => {
        if (props.destination.images && props.destination.images.length > 0) {
          const mainImage = props.destination.images.find(img => img.isMain) || props.destination.images[0];
          return mainImage.url;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image+Available';
      });
      
      // Format location text
      const locationText = computed(() => {
        const location = props.destination.location || {};
        if (location.city && location.country) {
          return `${location.city}, ${location.country}`;
        } else if (location.city) {
          return location.city;
        } else if (location.country) {
          return location.country;
        }
        return 'Location not specified';
      });
      
      // Truncate description
      const truncatedDescription = computed(() => {
        const desc = props.destination.shortDescription || props.destination.description || '';
        return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
      });
      
      // Limit amenities to show
      const limitedAmenities = computed(() => {
        return (props.destination.amenities || []).slice(0, 3);
      });
      
      // Helper function to get amenity icon
      const getAmenityIcon = (amenity) => {
        const iconMap = {
          'wifi': 'fas fa-wifi',
          'pool': 'fas fa-swimming-pool',
          'parking': 'fas fa-parking',
          'restaurant': 'fas fa-utensils',
          'gym': 'fas fa-dumbbell',
          'spa': 'fas fa-spa',
          'bar': 'fas fa-glass-martini-alt',
          'beach': 'fas fa-umbrella-beach',
          'ac': 'fas fa-snowflake',
          'breakfast': 'fas fa-coffee'
        };
        
        const amenityLower = amenity.toLowerCase();
        for (const [key, value] of Object.entries(iconMap)) {
          if (amenityLower.includes(key)) {
            return value;
          }
        }
        
        return 'fas fa-check-circle';
      };
      
      // Format price
      const formatPrice = (price) => {
        return price ? price.toLocaleString() : '0';
      };
      
      return {
        destinationImage,
        locationText,
        truncatedDescription,
        limitedAmenities,
        getAmenityIcon,
        formatPrice
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .destination-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    .card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
      
      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 15px;
        
        .category {
          align-self: flex-start;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }
        
        .special-offer {
          align-self: flex-end;
          background-color: $primary-color;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      }
    }
    
    .card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      
      .destination-name {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
      }
      
      .destination-rating {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        
        .stars {
          color: #ffc107;
          
          i {
            margin-left: 2px;
          }
        }
        
        .rating-text {
          font-size: 0.8rem;
          color: #666;
          margin-top: 3px;
        }
      }
    }
    
    .location {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      color: #666;
      font-size: 0.9rem;
      
      i {
        color: $primary-color;
        margin-right: 5px;
      }
    }
    
    .description {
      margin-bottom: 15px;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      flex-grow: 1;
    }
    
    .amenities {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      
      .amenity {
        display: flex;
        align-items: center;
        margin-right: 15px;
        margin-bottom: 5px;
        font-size: 0.85rem;
        color: #555;
        
        i {
          color: $primary-color;
          margin-right: 5px;
        }
        
        &.more {
          color: #999;
        }
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 15px;
      border-top: 1px solid #eee;
      
      .price {
        display: flex;
        flex-direction: column;
        
        .original-price {
          font-size: 0.85rem;
          color: #999;
          text-decoration: line-through;
        }
        
        .current-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: $primary-color;
        }
        
        .price-period {
          font-size: 0.75rem;
          color: #999;
        }
      }
      
      .view-btn {
        padding: 8px 16px;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: darken($primary-color, 10%);
        }
      }
    }
  }
</style>