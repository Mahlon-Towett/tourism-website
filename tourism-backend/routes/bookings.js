// routes/bookings.js - Booking Routes
const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');

const Booking = require('../models/Booking');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(
    advancedResults(
      Booking,
      { path: 'destination', select: 'name location pricePerNight' }
    ),
    getBookings
  )
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking);

router
  .route('/:id/cancel')
  .put(cancelBooking);

module.exports = router;