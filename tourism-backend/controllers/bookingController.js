// controllers/bookingController.js - Booking Controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const emailService = require('../services/emailService');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/users/:userId/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('destination');

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('destination')
    .populate('user');

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/v1/destinations/:destinationId/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user and destination to request body
  req.body.user = req.user.id;
  req.body.destination = req.params.destinationId;

  // Check if destination exists
  const destination = await Destination.findById(req.params.destinationId);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination not found with id of ${req.params.destinationId}`,
        404
      )
    );
  }

  // Check if dates are available
  const { startDate, endDate } = req.body;
  
  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    return next(
      new ErrorResponse(
        `Check-in date must be before check-out date`,
        400
      )
    );
  }

  // Check for existing bookings in the date range
  const existingBooking = await Booking.findOne({
    destination: req.params.destinationId,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ],
    bookingStatus: { $in: ['confirmed', 'pending'] }
  });

  if (existingBooking) {
    return next(
      new ErrorResponse(
        `Destination is already booked for the selected dates`,
        400
      )
    );
  }

  // Calculate total price
  const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const price = destination.specialPrice && 
                new Date(startDate) >= new Date(destination.specialPriceFrom) && 
                new Date(endDate) <= new Date(destination.specialPriceTo) 
                ? destination.specialPrice 
                : destination.pricePerNight;
  
  req.body.totalPrice = nights * price;

  // Create booking
  const booking = await Booking.create(req.body);

  // Send email notification
  await emailService.sendBookingConfirmation(booking);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        401
      )
    );
  }

  // Don't allow updating payment status directly (should be handled by payment controller)
  if (req.body.paymentStatus) {
    delete req.body.paymentStatus;
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to cancel this booking`,
        401
      )
    );
  }

  // Update booking status
  booking.bookingStatus = 'cancelled';
  booking.cancellationReason = req.body.reason || 'No reason provided';
  await booking.save();

  // Send cancellation email
  await emailService.sendBookingCancellation(booking);

  res.status(200).json({
    success: true,
    data: booking
  });
});