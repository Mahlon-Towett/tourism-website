// services/darajaService.js - Daraja API Service
const axios = require('axios');
const moment = require('moment');
const config = require('../config/daraja');
const defaultConfig = require('../config/default');
const logger = require('../utils/logger');

/**
 * Initiates the STK Push transaction
 * @param {string} phoneNumber - Customer's phone number (format: 254XXXXXXXXX)
 * @param {number} amount - Amount to charge
 * @param {string} accountReference - Account reference
 * @param {string} description - Transaction description
 * @returns {Promise<Object>} - Daraja API response
 */
const initiateSTKPush = async (phoneNumber, amount, accountReference, description) => {
  try {
    // Get OAuth token
    const token = await config.getOAuthToken();
    
    // Format phone number (remove '+' if present and ensure starts with 254)
    const formattedPhone = phoneNumber.replace('+', '').replace(/^0/, '254');
    
    // Format timestamp (YYYYMMDDHHmmss)
    const timestamp = moment().format('YYYYMMDDHHmmss');
    
    // Generate password (shortcode + passkey + timestamp)
    const password = Buffer.from(
      `${config.DARAJA_SHORTCODE}${config.DARAJA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Prepare STK Push request
    const data = {
      BusinessShortCode: config.DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: config.DARAJA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: defaultConfig.darajaCallbackUrl,
      AccountReference: accountReference,
      TransactionDesc: description
    };

    // Make request to Daraja API
    const response = await axios.post(
      `${config.DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    logger.error(`STK Push error: ${error.message}`);
    throw new Error(error.response?.data?.errorMessage || 'Failed to initiate payment');
  }
};

/**
 * Check the status of an STK Push transaction
 * @param {string} checkoutRequestId - The CheckoutRequestID from STK Push
 * @returns {Promise<Object>} - Transaction status
 */
const checkTransactionStatus = async (checkoutRequestId) => {
  try {
    // Get OAuth token
    const token = await config.getOAuthToken();
    
    // Format timestamp
    const timestamp = moment().format('YYYYMMDDHHmmss');
    
    // Generate password
    const password = Buffer.from(
      `${config.DARAJA_SHORTCODE}${config.DARAJA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Prepare request data
    const data = {
      BusinessShortCode: config.DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    // Make request to query transaction status
    const response = await axios.post(
      `${config.DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    logger.error(`Transaction status check error: ${error.message}`);
    throw new Error(error.response?.data?.errorMessage || 'Failed to check transaction status');
  }
};

module.exports = {
  initiateSTKPush,
  checkTransactionStatus
};