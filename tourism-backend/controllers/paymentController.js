// controllers/paymentController.js - Payment Controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');
const darajaService = require('../services/darajaService');
const logger = require('../utils/logger');

// @desc    Initiate M-Pesa payment
// @route   POST /api/v1/payments/initiate
// @access  Private
exports.initiatePayment = asyncHandler(async (req, res, next) => {
  const { bookingId, phoneNumber } = req.body;

  if (!bookingId || !phoneNumber) {
    return next(new ErrorResponse('Please provide booking ID and phone number', 400));
  }

  // Find booking
  const booking = await Booking.findById(bookingId).populate('destination');

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${bookingId}`, 404));
  }

  // Check if booking belongs to user
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to make payment for this booking`, 401)
    );
  }

  // Check if booking is already paid
  if (booking.paymentStatus === 'paid') {
    return next(new ErrorResponse(`Booking is already paid`, 400));
  }

  try {
    // Format phone number (ensure starts with 254)
    const formattedPhone = phoneNumber.replace('+', '').replace(/^0/, '254');
    
    // Initiate STK Push
    const stkResponse = await darajaService.initiateSTKPush(
      formattedPhone,
      booking.totalPrice,
      `Booking-${booking._id}`,
      `Payment for ${booking.destination.name}`
    );

    // Create payment record
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user.id,
      amount: booking.totalPrice,
      method: 'mpesa',
      phoneNumber: formattedPhone,
      merchantRequestId: stkResponse.MerchantRequestID,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      data: {
        payment,
        requestId: stkResponse.CheckoutRequestID
      }
    });
  } catch (error) {
    logger.error(`Payment initiation error: ${error.message}`);
    return next(new ErrorResponse(`Payment initiation failed: ${error.message}`, 500));
  }
});

// @desc    Check payment status
// @route   GET /api/v1/payments/status/:checkoutRequestId
// @access  Private
exports.checkPaymentStatus = asyncHandler(async (req, res, next) => {
  const { checkoutRequestId } = req.params;

  // Find payment by checkout request ID
  const payment = await Payment.findOne({ checkoutRequestId }).populate('booking');

  if (!payment) {
    return next(new ErrorResponse(`Payment not found with that request ID`, 404));
  }

  // Check if payment belongs to user
  if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to check this payment`, 401)
    );
  }

  try {
    // Check transaction status
    const statusResponse = await darajaService.checkTransactionStatus(checkoutRequestId);
    
    // Update payment status based on response
    if (statusResponse.ResultCode === '0') {
      payment.status = 'completed';
      payment.mpesaReceiptNumber = statusResponse.ResultDesc.split(' ')[2];
      payment.transactionId = statusResponse.ResultDesc.split(' ')[2];
      payment.transactionDate = new Date();
      
      // Update booking payment status
      if (payment.booking) {
        const booking = await Booking.findById(payment.booking._id);
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        await booking.save();
      }
    } else if (statusResponse.ResultCode === '1') {
      payment.status = 'failed';
    }
    
    await payment.save();

    res.status(200).json({
      success: true,
      data: {
        payment,
        mpesaStatus: statusResponse
      }
    });
  } catch (error) {
    logger.error(`Payment status check error: ${error.message}`);
    return next(new ErrorResponse(`Payment status check failed: ${error.message}`, 500));
  }
});

// @desc    M-Pesa callback
// @route   POST /api/v1/payments/callback
// @access  Public
exports.mpesaCallback = asyncHandler(async (req, res, next) => {
  const { Body } = req.body;

  // Log callback for debugging
  logger.info('M-Pesa callback received:', JSON.stringify(req.body));

  try {
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const { MerchantRequestID, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
      
      // Extract metadata
      const metadataItems = CallbackMetadata.Item;
      const amount = metadataItems.find(item => item.Name === 'Amount').Value;
      const mpesaReceiptNumber = metadataItems.find(item => item.Name === 'MpesaReceiptNumber').Value;
      const transactionDate = metadataItems.find(item => item.Name === 'TransactionDate').Value;
      const phoneNumber = metadataItems.find(item => item.Name === 'PhoneNumber').Value;

      // Update payment record
      const payment = await Payment.findOne({ checkoutRequestId: CheckoutRequestID });
      
      if (payment) {
        payment.status = 'completed';
        payment.mpesaReceiptNumber = mpesaReceiptNumber;
        payment.transactionId = mpesaReceiptNumber;
        payment.transactionDate = new Date(transactionDate);
        await payment.save();

        // Update booking status
        if (payment.booking) {
          const booking = await Booking.findById(payment.booking);
          booking.paymentStatus = 'paid';
          booking.bookingStatus = 'confirmed';
          await booking.save();
        }
      }
    } else {
      // Payment failed
      const { MerchantRequestID, CheckoutRequestID, ResultDesc } = Body.stkCallback;
      
      // Update payment record
      const payment = await Payment.findOne({ checkoutRequestId: CheckoutRequestID });
      
      if (payment) {
        payment.status = 'failed';
        payment.notes = ResultDesc;
        await payment.save();
      }
    }

    // Always return success to Daraja API
    res.status(200).json({ ResponseCode: "00000000", ResponseDesc: "success" });
  } catch (error) {
    logger.error(`M-Pesa callback error: ${error.message}`);
    // Still return success to Daraja API
    res.status(200).json({ ResponseCode: "00000000", ResponseDesc: "success" });
  }
});

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get user payments
// @route   GET /api/v1/users/:userId/payments
// @access  Private
exports.getUserPayments = asyncHandler(async (req, res, next) => {
  // Check if user is requesting their own payments or is admin
  if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to view these payments`, 401)
    );
  }

  const payments = await Payment.find({ user: req.params.userId })
    .populate('booking');

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});