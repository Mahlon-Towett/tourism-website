// routes/payments.js - Payment Routes
const express = require('express');
const {
  initiatePayment,
  checkPaymentStatus,
  mpesaCallback,
  getPayments,
  getUserPayments
} = require('../controllers/paymentController');

const Payment = require('../models/Payment');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Public route for M-Pesa callback
router.post('/callback', mpesaCallback);

// Protected routes
router.use(protect);

router.route('/initiate')
  .post(initiatePayment);

router.route('/status/:checkoutRequestId')
  .get(checkPaymentStatus);

// Admin only routes
router.route('/')
  .get(
    authorize('admin'),
    advancedResults(Payment, { path: 'booking', select: 'destination startDate endDate totalPrice' }),
    getPayments
  );

module.exports = router;