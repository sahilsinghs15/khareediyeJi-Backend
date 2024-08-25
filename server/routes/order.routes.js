import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrders,
} from '../controllers/order.controller.js';
import { isLoggedIn, authorizeRoles } from '../middlewares/authmiddleware.js';
import Order from '../models/order.model.js';

const router = express.Router();

/**
 * @CREATE_ORDER
 * @ROUTE @POST {{URL}}/api/v1/orders
 * @ACCESS User
 */
router.route('/')
  .post(isLoggedIn, (req, res, next) => {
    req.body.paymentInfo = {
      method: req.body.paymentInfo.method || 'COD', // Default to COD if not provided
      status: 'Pending' // Default status
    };
    next();
  }, createOrder);

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
