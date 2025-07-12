const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  amountReceived: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
