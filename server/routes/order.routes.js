import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrders,
} from '../controllers/order.controller.js';
import { isLoggedIn, authorizeRoles } from '../middlewares/authmiddleware.js';

const router = express.Router();

/**
 * @CREATE_ORDER
 * @ROUTE @POST {{URL}}/api/v1/orders
 * @ACCESS User
 */
router.route('/').post(isLoggedIn, createOrder);

/**
 * @GET_ORDER, @UPDATE_ORDER_STATUS, @DELETE_ORDER
 * @ROUTE @GET, @PUT, @DELETE {{URL}}/api/v1/orders/:id
 * @ACCESS User (GET), Admin (PUT, DELETE)
 */
router.route('/:id')
  .get(isLoggedIn, getOrderById)
  .put(isLoggedIn, authorizeRoles('ADMIN'), updateOrderStatus)
  .delete(isLoggedIn, authorizeRoles('ADMIN'), deleteOrder);

/**
 * @GET_ORDERS
 * @ROUTE @GET {{URL}}/api/v1/orders
 * @ACCESS Admin
 */
router.route('/').get(isLoggedIn, authorizeRoles('ADMIN'), getOrders);

export default router;
