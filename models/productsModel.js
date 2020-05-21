const mongoose = require('mongoose');

const ProductModel = new mongoose.Schema({
  name: String,
  pathImg: String,
  unitPrice: Number,
  color: String,
  material: String,
  type: String,
  brand: String,
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

ProductModel.statics = {
  createNew(product) {
    return this.create(product);
  },
  getAll() {
    return this.find().exec();
  },
  getByKey(color, type, price, material, brand) {
    return this.find({
      $and: [
        { type: type },
        { unitPrice: { $lte: price } },
        {
          $or: [
            { color: color },
            { material: material },
            { brand: brand }
          ]
        }
      ]
    }).exec();
  }
}

module.exports = mongoose.model('product', ProductModel);
