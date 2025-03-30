// controllers/reviewController.js - Review Controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/destinations/:destinationId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.destinationId) {
    const reviews = await Review.find({ destination: req.params.destinationId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'destination',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add review
// @route   POST /api/v1/destinations/:destinationId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.destination = req.params.destinationId;
  req.body.user = req.user.id;

  const destination = await Destination.findById(req.params.destinationId);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination not found with id of ${req.params.destinationId}`,
        404
      )
    );
  }

  // Check if user has booked this destination
  const userBookings = await Booking.find({
    user: req.user.id,
    destination: req.params.destinationId,
    bookingStatus: 'completed'
  });

  if (userBookings.length === 0 && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must have completed a stay at this destination to leave a review`,
        400
      )
    );
  }

  // Check for existing review
  const existingReview = await Review.findOne({
    user: req.user.id,
    destination: req.params.destinationId
  });

  if (existingReview) {
    return next(
      new ErrorResponse(
        `User has already submitted a review for this destination`,
        400
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalculate average rating
  await Review.getAverageRating(review.destination);

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete review`, 401));
  }

  await review.remove();

  // Recalculate average rating
  await Review.getAverageRating(review.destination);

  res.status(200).json({
    success: true,
    data: {}
  });
});