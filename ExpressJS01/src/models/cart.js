const mongoose = require('mongoose');

// Item inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true, // each item will have its own _id -> used as CartItem.id in GraphQL
  }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      // lưu id user dạng string cho đơn giản (chính là _id của user)
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    // lưu danh sách id (string) của các item đã chọn
    selectedItems: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // tự sinh createdAt, updatedAt
  }
);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;


