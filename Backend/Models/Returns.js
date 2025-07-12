const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  ProductName: String,
  ProductBarcode: String,
  returnedQuantity: { type: Number, required: true },
  productPrice: Number,
  discount: Number,
  returnValue: Number, // computed = price * qty - discount
  actualMoneyReceived: Number, // entered manually
  costImpact: Number, // returnValue - actualMoneyReceived
  reason: { type: String, enum: ['expired', 'near-expiry'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Returns', ReturnSchema);
