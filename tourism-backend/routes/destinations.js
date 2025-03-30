// routes/destinations.js - Destination Routes
const express = require('express');
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  uploadDestinationPhotos
} = require('../controllers/destinationController');

const Destination = require('../models/Destination');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

// Include review router
const reviewRouter = require('./reviews');
const bookingRouter = require('./bookings');

const router = express.Router();

// Re-route into other resource routers
router.use('/:destinationId/reviews', reviewRouter);
router.use('/:destinationId/bookings', bookingRouter);

router
  .route('/')
  .get(
    advancedResults(
      Destination,
      { path: 'reviews', select: 'rating title text' }
    ),
    getDestinations
  )
  .post(protect, authorize('admin'), createDestination);

router
  .route('/:id')
  .get(getDestination)
  .put(protect, authorize('admin'), updateDestination)
  .delete(protect, authorize('admin'), deleteDestination);

router
  .route('/:id/photos')
  .put(
    protect,
    authorize('admin'),
    upload.array('photos', 5),
    uploadDestinationPhotos
  );

module.exports = router;