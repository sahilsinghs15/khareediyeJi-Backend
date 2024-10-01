import jwt from 'jsonwebtoken';
import appError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Middleware to check if the user is logged in
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  // extracting token from the cookies
  
  const { token } = req.cookies;

  // If no token, send unauthorized message
  if (!token) {
    return next(new appError("Token not received - Unauthorized, please login to continue", 401));
  }

  // Decoding the token using jwt package verify method
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // If no decoded token, send unauthorized message
  if (!decoded) {
    return next(new appError("Token not decoded - Unauthorized, please login to continue", 401));
  }

  // Fetch user details from the database using the user ID from the decoded token
  const user = await User.findById(decoded.id);

  // If no user found, send unauthorized message
  if (!user) {
    return next(new appError("User not found, please login again", 401));
  }

  // Attach the full user object (without the password) to the request object
  req.user = user;

  // Pass control to the next middleware or route handler
  next();
});

// Middleware to check if the user has the required role(s)
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    // If user role is not included in the allowed roles, send a forbidden message
    if (!roles.includes(req.user.role)) {
      return next(new appError('You do not have permission to view this route', 403));
    }

    // Proceed to the next middleware
    next();
  });
