import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/appError.js';

/**
 * @ADD_TO_CART
 * @ROUTE @POST {{URL}}/api/v1/cart/add
 * @ACCESS Private
 */
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new AppError('Product ID and quantity are required', 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if the product already exists in the cart
  const existingItem = user.cart.find(item => item.product.toString() === productId);

  if (existingItem) {
    // Update the quantity if item already exists
    existingItem.quantity += quantity;
  } else {
    // Add a new item to the cart
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    cart: user.cart,
  });
});

/**
 * @UPDATE_CART_ITEM
 * @ROUTE @PUT {{URL}}/api/v1/cart/update
 * @ACCESS Private
 */
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new AppError('Product ID and quantity are required', 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const item = user.cart.find(item => item.product.toString() === productId);

  if (!item) {
    return next(new AppError('Item not found in cart', 404));
  }

  if (quantity <= 0) {
    // Remove the item if quantity is 0 or less
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
  } else {
    // Update the quantity
    item.quantity = quantity;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Cart item updated successfully',
    cart: user.cart,
  });
});

/**
 * @REMOVE_FROM_CART
 * @ROUTE @DELETE {{URL}}/api/v1/cart/remove
 * @ACCESS Private
 */
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new AppError('Product ID is required', 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.cart = user.cart.filter(item => item.product.toString() !== productId);

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    cart: user.cart,
  });
});

/**
 * @GET_CART
 * @ROUTE @GET {{URL}}/api/v1/cart
 * @ACCESS Private
 */
export const getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('cart.product');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});
