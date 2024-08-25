import { Router } from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
} from '../controllers/cart.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/cart
router.route('/')
  .get(isLoggedIn, getCart) // Get cart items for logged-in user
  .post(isLoggedIn, addToCart); // Add item to cart for logged-in user

// {{URL}}/api/v1/cart/:productId
router.route('/:productId')
  .delete(isLoggedIn, removeFromCart); // Remove item from cart by product ID for logged-in user

export default router;
