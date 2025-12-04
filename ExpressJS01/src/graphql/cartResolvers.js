import Cart from '../models/cart.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

// Calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Chuẩn hóa dữ liệu cart từ MongoDB sang format GraphQL Cart
const normalizeCart = (cartDoc) => {
  if (!cartDoc) return null;

  const cart = cartDoc.toObject();

  const items = (cart.items || []).map((item) => ({
    id: item._id.toString(),
    productId: item.productId.toString(),
    quantity: item.quantity,
    price: item.price,
  }));

  const selectedItems = (cart.selectedItems || []).map((id) => id.toString());

  return {
    id: cart._id.toString(),
    userId: cart.userId,
    items,
    selectedItems,
    createdAt: cart.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: cart.updatedAt?.toISOString?.() || new Date().toISOString(),
  };
};

// Lấy cart từ DB, nếu chưa có thì tạo mới
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
      selectedItems: [],
    });
  }
  return cart;
};

export const cartResolvers = {
  Query: {
    getCart: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    getCartItem: async (_, { userId, itemId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);
      return cart.items.find((item) => item.id === itemId) || null;
    },

    getSelectedItems: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);
      return cart.items.filter((item) => cart.selectedItems.includes(item.id));
    },

    getCartTotal: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);
      return calculateTotal(cart.items);
    },

    getSelectedTotal: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);
      const selectedItems = cart.items.filter((item) =>
        cart.selectedItems.includes(item.id)
      );
      return calculateTotal(selectedItems);
    },
  },

  Mutation: {
    // Khi người dùng thêm sản phẩm vào giỏ hàng -> lưu vào MongoDB (table cart)
    addItemToCart: async (_, { userId, input }) => {
      const cartDoc = await getOrCreateCart(userId);

      // lấy thông tin sản phẩm để biết giá
      const product = await Product.findById(input.productId);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
          data: null,
          error: `Product with ID ${input.productId} not found`,
        };
      }

      const price = product.price || 0;

      const existingItem = cartDoc.items.find(
        (item) => item.productId.toString() === input.productId
      );

      if (existingItem) {
        existingItem.quantity += input.quantity;
        existingItem.price = price;
      } else {
        cartDoc.items.push({
          productId: input.productId,
          quantity: input.quantity,
          price,
        });
      }

      await cartDoc.save();
      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Item added to cart successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    updateCartItem: async (_, { userId, input }) => {
      const cartDoc = await getOrCreateCart(userId);
      const item = cartDoc.items.id(input.itemId);

      if (!item) {
        return {
          success: false,
          message: 'Item not found in cart',
          data: null,
          error: `Item with ID ${input.itemId} not found`,
        };
      }

      if (input.quantity < 1) {
        return {
          success: false,
          message: 'Invalid quantity',
          data: null,
          error: 'Quantity must be at least 1',
        };
      }

      item.quantity = input.quantity;
      await cartDoc.save();
      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Item updated successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    removeFromCart: async (_, { userId, itemId }) => {
      const cartDoc = await getOrCreateCart(userId);

      // Hỗ trợ xoá theo cả cartItemId (Mongo _id) hoặc productId
      let item = cartDoc.items.id(itemId);

      if (!item) {
        item = cartDoc.items.find(
          (it) => it.productId?.toString() === itemId
        );
      }

      if (!item) {
        return {
          success: false,
          message: 'Item not found in cart',
          data: null,
          error: `Item with ID ${itemId} not found`,
        };
      }

      const cartItemId = item._id?.toString();

      // Xoá item khỏi mảng
      item.remove();

      // Xoá khỏi danh sách selectedItems theo cả cartItemId và productId
      cartDoc.selectedItems = cartDoc.selectedItems.filter(
        (id) => id !== cartItemId && id !== itemId
      );

      await cartDoc.save();
      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    clearCart: async (_, { userId }) => {
      let cartDoc = await Cart.findOne({ userId });

      if (cartDoc) {
        // Tăng buyerCount cho tất cả sản phẩm có trong giỏ trước khi xoá giỏ hàng
        try {
          const productIds = [
            ...new Set(
              (cartDoc.items || [])
                .map((item) => item.productId)
                .filter(Boolean)
            ),
          ];

          console.log('[clearCart] userId =', userId, 'productIds =', productIds);

          if (productIds.length > 0) {
            const result = await Product.updateMany(
              { _id: { $in: productIds } },
              { $inc: { buyerCount: 1 } }
            );
            console.log('[clearCart] buyerCount updateMany result =', result);
          }
        } catch (e) {
          console.error('Failed to update buyerCount on clearCart', e);
        }

        cartDoc.items = [];
        cartDoc.selectedItems = [];
        await cartDoc.save();
      } else {
        cartDoc = await getOrCreateCart(userId);
      }

      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Cart cleared successfully',
        data: {
          ...cart,
          total: 0,
        },
      };
    },

    selectItems: async (_, { userId, input }) => {
      const cartDoc = await getOrCreateCart(userId);
      cartDoc.selectedItems = input.itemIds || [];
      await cartDoc.save();

      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Items selected successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    selectAllItems: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      cartDoc.selectedItems = cartDoc.items.map((item) => item._id.toString());
      await cartDoc.save();

      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'All items selected',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    clearSelectedItems: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      cartDoc.selectedItems = [];
      await cartDoc.save();

      const cart = normalizeCart(cartDoc);

      return {
        success: true,
        message: 'Selection cleared',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    checkout: async (_, { userId }) => {
      const cartDoc = await getOrCreateCart(userId);
      const cart = normalizeCart(cartDoc);

      const selectedItems = cart.items.filter((item) =>
        cart.selectedItems.includes(item.id)
      );

      if (selectedItems.length === 0) {
        return {
          success: false,
          message: 'No items selected for checkout',
          error: 'Please select items to checkout',
        };
      }

      const orderId = `order-${Date.now()}`;
      const total = calculateTotal(selectedItems);

      // tăng bộ đếm số khách mua cho các sản phẩm tương ứng
      try {
        const productIds = [
          ...new Set(selectedItems.map((item) => item.productId)),
        ].map((id) => new mongoose.Types.ObjectId(id));

        if (productIds.length > 0) {
          await Product.updateMany(
            { _id: { $in: productIds } },
            { $inc: { buyerCount: 1 } }
          );
        }
      } catch (e) {
        console.error('Failed to update buyerCount', e);
      }

      // Sau khi checkout thì xóa các item đã chọn khỏi giỏ hàng
      cartDoc.items = cartDoc.items.filter(
        (item) => !cart.selectedItems.includes(item._id.toString())
      );
      cartDoc.selectedItems = [];
      await cartDoc.save();

      return {
        success: true,
        message: 'Checkout successful',
        orderId,
        total,
        items: selectedItems,
      };
    },
  },
};
