const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  discount: { type: Number, default: 0 }, // phần trăm giảm giá
  views: { type: Number, default: 0 }, // lượt xem
  rating: { type: Number, default: 0, min: 0, max: 5 }, // đánh giá
  stock: { type: Number, default: 0 }, // số lượng tồn kho
  tags: [String], // tags tìm kiếm
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text', category: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: 1 });
productSchema.index({ views: 1 });
productSchema.index({ rating: 1 });

const Product = mongoose.model('product', productSchema);

module.exports = Product;
