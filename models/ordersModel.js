const mongoose = require('mongoose');

const OrderModel = new mongoose.Schema({
  userId: String,
  productId: String,
  productName: String,
  unitPrice: Number,
  totalPrice: Number,
  quantities: Number,
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

module.exports = mongoose.model('order', OrderModel);
