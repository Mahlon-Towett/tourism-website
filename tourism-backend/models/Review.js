// models/Review.js - Review Schema
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per destination
ReviewSchema.index({ destination: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function(destinationId) {
  const obj = await this.aggregate([
    {
      $match: { destination: destinationId }
    },
    {
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Destination').findByIdAndUpdate(destinationId, {
      rating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.destination);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.destination);
});

module.exports = mongoose.model('Review', ReviewSchema);