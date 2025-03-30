// controllers/destinationController.js - Destination Controller
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Destination = require('../models/Destination');
const storageService = require('../services/storageService');

// @desc    Get all destinations
// @route   GET /api/v1/destinations
// @access  Public
exports.getDestinations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single destination
// @route   GET /api/v1/destinations/:id
// @access  Public
exports.getDestination = asyncHandler(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id).populate('reviews');

  if (!destination) {
    return next(
      new ErrorResponse(`Destination not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: destination
  });
});

// @desc    Create new destination
// @route   POST /api/v1/destinations
// @access  Private/Admin
exports.createDestination = asyncHandler(async (req, res, next) => {
  const destination = await Destination.create(req.body);

  res.status(201).json({
    success: true,
    data: destination
  });
});

// @desc    Update destination
// @route   PUT /api/v1/destinations/:id
// @access  Private/Admin
exports.updateDestination = asyncHandler(async (req, res, next) => {
  let destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(`Destination not found with id of ${req.params.id}`, 404)
    );
  }

  destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: destination
  });
});

// @desc    Delete destination
// @route   DELETE /api/v1/destinations/:id
// @access  Private/Admin
exports.deleteDestination = asyncHandler(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(`Destination not found with id of ${req.params.id}`, 404)
    );
  }

  await destination.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload photos for destination
// @route   PUT /api/v1/destinations/:id/photos
// @access  Private/Admin
exports.uploadDestinationPhotos = asyncHandler(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(`Destination not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const files = Array.isArray(req.files) ? req.files : [req.files];

  // Process each file
  const uploadPromises = files.map(async (file) => {
    // Check file type
    if (!file.mimetype.startsWith('image')) {
      throw new ErrorResponse(`Please upload an image file`, 400);
    }

    // Upload file to storage service
    const fileUrl = await storageService.uploadFile(file);

    return {
      url: fileUrl,
      alt: destination.name,
      isMain: destination.images.length === 0 // First image is main
    };
  });

  try {
    const newImages = await Promise.all(uploadPromises);
    
    // Add new images to destination
    destination.images.push(...newImages);
    await destination.save();

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (err) {
    next(err);
  }
});