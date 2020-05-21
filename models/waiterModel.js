const mongoose = require('mongoose');

const WaiterSchema = new mongoose.Schema({
  username: String,
  password: String,
  rating: {type: Number, default: 3},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

module.exports = mongoose.model('waiter', WaiterSchema);


