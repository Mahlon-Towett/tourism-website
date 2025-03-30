// middleware/roleCheck.js - Role-Based Access Control Middleware
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to check if a user has the required role
 * @param {...string} roles - Roles that are allowed to access the route
 * @returns {Function} - Express middleware function
 */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return next(new ErrorResponse('Unauthorized access', 401));
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

module.exports = roleCheck;