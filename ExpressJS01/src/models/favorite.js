const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // email hoặc _id user ở dạng string
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Một user chỉ được yêu thích một lần cho một sản phẩm
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite = mongoose.model('favorite', favoriteSchema);

module.exports = Favorite;


