const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
