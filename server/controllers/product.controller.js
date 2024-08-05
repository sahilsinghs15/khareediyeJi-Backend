import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/appError.js';

/**
 * @CREATE
 * @ROUTE @POST {{URL}}/api/v1/products
 * @ACCESS Seller, Admin
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});

/**
 * @UPDATE
 * @ROUTE @PUT {{URL}}/api/v1/products/:id
 * @ACCESS Seller, Admin
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new appError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product,
  });
});

/**
 * @DELETE
 * @ROUTE @DELETE {{URL}}/api/v1/products/:id
 * @ACCESS Seller, Admin
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new appError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * @GET_SINGLE
 * @ROUTE @GET {{URL}}/api/v1/products/:id
 * @ACCESS Public
 */
export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new appError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * @GET_ALL
 * @ROUTE @GET {{URL}}/api/v1/products
 * @ACCESS Public
 */
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

/**
 * @GET_BY_NAME
 * @ROUTE @GET {{URL}}/api/v1/products/name/:name
 * @ACCESS Public
 */
export const getProductByName = asyncHandler(async (req, res, next) => {
  const { name } = req.params;

  const product = await Product.findOne({ name: new RegExp('^' + name + '$', 'i') });

  if (!product) {
    return next(new appError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
