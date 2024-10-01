import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/appError.js';

/**
 * @CREATE
 * @ROUTE @POST {{URL}}/api/v1/products
 * @ACCESS Seller, Admin
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  let { name, description, price, category, stock, images } = req.body;

  // Convert the name to lowercase and remove spaces
  name = name.toLowerCase().replace(/\s+/g, '');

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
 * @GET_BY_QUERY
 * @ROUTE @GET {{URL}}/api/v1/products/search
 * @ACCESS Public
 */
export const getProductByQuery = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  let searchQuery = {};
  let isPriceQuery = !isNaN(query); 

  if (query) {
    if (isPriceQuery) {
      const priceValue = parseFloat(query);
      searchQuery.price = { 
        $gte: priceValue * 0.8,  
        $lte: priceValue * 1.2   
      };
    } else {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },      
        { category: { $regex: query, $options: 'i' } }  
      ];
    }
  }

  const productData = await Product.find(searchQuery);

  if (!productData || productData.length === 0) {
    return next(new appError("No products found", 404));
  }

  res.status(200).json({
    success: true,
    products: productData,
  });
});

