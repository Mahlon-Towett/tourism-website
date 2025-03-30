// models/Payment.js - Payment Schema
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add the payment amount']
  },
  currency: {
    type: String,
    default: 'KES'
  },
  method: {
    type: String,
    required: [true, 'Please specify the payment method'],
    enum: ['mpesa', 'card', 'bank', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  // Daraja/M-Pesa specific fields
  phoneNumber: String,
  mpesaReceiptNumber: String,
  transactionId: String,
  transactionDate: Date,
  merchantRequestId: String,
  checkoutRequestId: String,
  // General fields
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);