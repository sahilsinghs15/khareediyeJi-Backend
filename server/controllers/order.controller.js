import Order from '../models/order.model.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/appError.js';

/**
 * @CREATE_ORDER
 * @ROUTE @POST {{URL}}/api/v1/orders
 * @ACCESS User
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new appError('No order items', 400));
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentInfo,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: createdOrder,
  });
});

/**
 * @GET_ORDER
 * @ROUTE @GET {{URL}}/api/v1/orders/:id
 * @ACCESS User, Admin
 */
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new appError('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

/**
 * @UPDATE_ORDER
 * @ROUTE @PUT {{URL}}/api/v1/orders/:id
 * @ACCESS Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new appError('Order not found', 404));
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  order.deliveredAt = req.body.orderStatus === 'Delivered' ? Date.now() : order.deliveredAt;

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order: updatedOrder,
  });
});

/**
 * @DELETE_ORDER
 * @ROUTE @DELETE {{URL}}/api/v1/orders/:id
 * @ACCESS Admin
 */
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new appError('Order not found', 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});

/**
 * @GET_ORDERS
 * @ROUTE @GET {{URL}}/api/v1/orders
 * @ACCESS Admin
 */
export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email');

  if (!orders) {
    return next(new appError('No orders found', 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});
