import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductByName,
  getProductsByCategory,
} from '../controllers/product.controller.js';
import { isLoggedIn, authorizeRoles } from '../middlewares/authmiddleware.js';

const router = express.Router();

/**
 * @CREATE
 * @ROUTE @POST {{URL}}/api/v1/products
 * @ACCESS Seller, Admin
 */
router.route('/').post(isLoggedIn, authorizeRoles('SELLER', 'ADMIN'), createProduct).get(getProducts);

/**
 * @GET_SINGLE, @UPDATE, @DELETE
 * @ROUTE @GET, @PUT, @DELETE {{URL}}/api/v1/products/:id
 * @ACCESS Public, Seller (for update and delete)
 */
router.route('/:id')
  .get(getProduct)
  .put(isLoggedIn, authorizeRoles('SELLER', 'ADMIN'), updateProduct)
  .delete(isLoggedIn, authorizeRoles('SELLER', 'ADMIN'), deleteProduct);

/**
 * @GET_BY_NAME
 * @ROUTE @GET {{URL}}/api/v1/products/name/:name
 * @ACCESS Public
 */
router.route('/name/:name').get(getProductByName);
router.route('/category/:category').get(getProductsByCategory);

export default router;
