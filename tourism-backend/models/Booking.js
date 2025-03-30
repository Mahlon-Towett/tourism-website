// models/Booking.js - Booking Schema
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a check-in date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add a check-out date']
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Please add number of adults'],
      min: [1, 'At least one adult is required']
    },
    children: {
      type: Number,
      default: 0
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add the total price']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'pending'],
    default: 'pending'
  },
  cancellationReason: String,
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from booking the same destination on the same dates
BookingSchema.index({ user: 1, destination: 1, startDate: 1, endDate: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);