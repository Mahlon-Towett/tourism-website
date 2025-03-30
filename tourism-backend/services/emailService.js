// services/emailService.js - Email Service
const nodemailer = require('nodemailer');
const config = require('../config/default');
const logger = require('../utils/logger');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email body (text)
 * @param {string} options.html - Email body (HTML)
 * @returns {Promise<Object>} - Nodemailer info object
 */
const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword
    }
  });

  // Define mail options
  const mailOptions = {
    from: `${config.emailFrom} <${config.smtpUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || '',
    html: options.html || ''
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking object (populated with destination and user)
 * @returns {Promise<Object>} - Nodemailer info object
 */
const sendBookingConfirmation = async (booking) => {
  try {
    // Ensure booking has destination and user populated
    await booking.populate('destination').populate('user').execPopulate();
    
    const subject = `Booking Confirmation - ${booking.destination.name}`;
    
    // Create HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Thank you for booking with us! Your booking details are as follows:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">${booking.destination.name}</h3>
          <p><strong>Check-in Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
          <p><strong>Check-out Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests.adults} Adults, ${booking.guests.children} Children</p>
          <p><strong>Total Price:</strong> KES ${booking.totalPrice.toLocaleString()}</p>
          <p><strong>Booking Status:</strong> ${booking.bookingStatus}</p>
          <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
        </div>
        
        <p>If your payment is pending, please complete it to confirm your booking.</p>
        <p>You can view your booking details by logging into your account on our website.</p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Thank you for choosing us for your travel needs!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    return await sendEmail({
      email: booking.user.email,
      subject,
      html
    });
  } catch (error) {
    logger.error(`Booking confirmation email error: ${error.message}`);
    // Don't throw error to prevent booking process from failing
    return null;
  }
};

/**
 * Send booking cancellation email
 * @param {Object} booking - Booking object (populated with destination and user)
 * @returns {Promise<Object>} - Nodemailer info object
 */
const sendBookingCancellation = async (booking) => {
  try {
    // Ensure booking has destination and user populated
    await booking.populate('destination').populate('user').execPopulate();
    
    const subject = `Booking Cancellation - ${booking.destination.name}`;
    
    // Create HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Cancellation</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking has been cancelled as requested. Details are as follows:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">${booking.destination.name}</h3>
          <p><strong>Check-in Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
          <p><strong>Check-out Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Booking Reference:</strong> ${booking._id}</p>
          <p><strong>Cancellation Reason:</strong> ${booking.cancellationReason || 'No reason provided'}</p>
        </div>
        
        <p>If you have already made a payment, please allow 5-7 business days for the refund to be processed to your original payment method.</p>
        
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        
        <p>We hope to serve you again in the future.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    return await sendEmail({
      email: booking.user.email,
      subject,
      html
    });
  } catch (error) {
    logger.error(`Booking cancellation email error: ${error.message}`);
    // Don't throw error to prevent cancellation process from failing
    return null;
  }
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendBookingCancellation
};