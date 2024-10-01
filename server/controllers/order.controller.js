import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
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
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new appError('No order items', 400));
  }

  // Fetch product details and calculate total price
  const detailedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new appError(`Product with id ${item.product} not found`, 404));
      }
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  const totalPrice = detailedOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Make sure req.user is populated correctly
  if (!req.user || !req.user.id) {
    return next(new appError('User not authenticated', 401));
  }

  const order = new Order({
    user: req.user.id,
    orderItems: detailedOrderItems,
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


/** 
  * @GET_AllOrders
  * @ROUTE @GET {{URL}}/api/v1/order/orders
  * @ACCESS User
 */

export const getUserOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({user:req.user.id});

    if(!orders || orders.length == 0){
      return next(new appError("No order found ",404));
    }

    res.status(200).json({
      success:true,
      orders,
    })
});
