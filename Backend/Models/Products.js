const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    trim: true,
  },
  ProductDetails: {
    type: String,
    trim: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
    min: 0.0,
  },
  ProductBarcode: {
    type: String, // string supports leading 0s
    required: true,
    unique: true,
    match: /^\d{1,12}$/, // max 12 digits
  },
  ProductQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  Discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  MRP: {
    type: Number,
    min: 0.0,
  },
  PurchaseDate: {
    type: Date,
  },
  ExpiryDate: {
    type: Date,
  },
}, {
  timestamps: true // optional: adds createdAt, updatedAt
});

const Products = mongoose.model('Products', ProductSchema);
module.exports = Products;
