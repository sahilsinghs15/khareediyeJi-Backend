import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },
      price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'],
      },
    },
  ],
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['Paid', 'Unpaid', 'COD'],
      default: 'Unpaid',
    },
    status: {
      type: String,
      required: true,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be a positive number'],
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Processed',
      'Shipped',
      'Delivered',
      'Cancelled',
    ],
    default: 'Pending',
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
});



const Order = model('Order', orderSchema);

export default Order;
