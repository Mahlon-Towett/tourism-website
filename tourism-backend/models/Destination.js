// models/Destination.js - Destination Schema
const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  category: {
    type: String,
    enum: [
      'beach',
      'mountain',
      'forest',
      'desert',
      'urban',
      'rural',
      'historical',
      'cultural',
      'adventure',
      'relaxation',
      'other'
    ],
    required: true
  },
  features: [String],
  amenities: [String],
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price per night']
  },
  specialPrice: {
    type: Number
  },
  specialPriceFrom: {
    type: Date
  },
  specialPriceTo: {
    type: Date
  },
  images: [
    {
      url: String,
      alt: String,
      isMain: {
        type: Boolean,
        default: false
      }
    }
  ],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add the capacity']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for reviews
DestinationSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'destination',
  justOne: false
});

// Cascade delete reviews when a destination is deleted
DestinationSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ destination: this._id });
  next();
});

module.exports = mongoose.model('Destination', DestinationSchema);