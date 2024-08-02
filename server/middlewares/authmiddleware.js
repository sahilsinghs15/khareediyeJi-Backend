import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';

// Middleware to check if the user is logged in
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  // Extracting token from cookies
  const { token } = req.cookies;

  // If no token, send unauthorized message
  if (!token) {
    return next(new AppError('Unauthorized, please login to continue', 401));
  }

  try {
    // Decoding the token using jwt package verify method
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid, send unauthorized message
    if (!decoded) {
      return next(new AppError('Unauthorized, please login to continue', 401));
    }

    // Store the decoded user data in the request object
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (err) {
    return next(new AppError('Invalid token, please login again', 401));
  }
});

// Middleware to check if the user has the required role(s)
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    // If user role is not included in the allowed roles, send a forbidden message
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to view this route', 403));
    }

    // Proceed to the next middleware
    next();
  });
