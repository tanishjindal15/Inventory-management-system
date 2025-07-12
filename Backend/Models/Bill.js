const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  customerName: String,
  paymentMode: String,
  totalAmount: Number,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', BillSchema);
