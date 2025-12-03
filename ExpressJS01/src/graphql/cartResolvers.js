// In-memory database for shopping carts
const carts = new Map();
const orders = [];

// Get or create cart
const getCart = (userId) => {
  if (!carts.has(userId)) {
    carts.set(userId, {
      id: `cart-${userId}`,
      userId,
      items: [],
      selectedItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return carts.get(userId);
};

// Calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const cartResolvers = {
  Query: {
    getCart: (_, { userId }) => {
      const cart = getCart(userId);
      return {
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    getCartItem: (_, { userId, itemId }) => {
      const cart = getCart(userId);
      return cart.items.find(item => item.id === itemId);
    },

    getSelectedItems: (_, { userId }) => {
      const cart = getCart(userId);
      return cart.items.filter(item => cart.selectedItems.includes(item.id));
    },

    getCartTotal: (_, { userId }) => {
      const cart = getCart(userId);
      return calculateTotal(cart.items);
    },

    getSelectedTotal: (_, { userId }) => {
      const cart = getCart(userId);
      const selectedItems = cart.items.filter(item => cart.selectedItems.includes(item.id));
      return calculateTotal(selectedItems);
    },
  },

  Mutation: {
    addItemToCart: (_, { userId, input }) => {
      const cart = getCart(userId);

      const existingItem = cart.items.find(item => item.productId === input.productId);

      if (existingItem) {
        existingItem.quantity += input.quantity;
      } else {
        const newItem = {
          id: `item-${Date.now()}`,
          productId: input.productId,
          quantity: input.quantity,
          price: input.price || 0,
        };
        cart.items.push(newItem);
      }

      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'Item added to cart successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    updateCartItem: (_, { userId, input }) => {
      const cart = getCart(userId);
      const item = cart.items.find(item => item.id === input.itemId);

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
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'Item updated successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    removeFromCart: (_, { userId, itemId }) => {
      const cart = getCart(userId);
      const itemIndex = cart.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        return {
          success: false,
          message: 'Item not found in cart',
          data: null,
          error: `Item with ID ${itemId} not found`,
        };
      }

      cart.items.splice(itemIndex, 1);
      cart.selectedItems = cart.selectedItems.filter(id => id !== itemId);
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    clearCart: (_, { userId }) => {
      carts.delete(userId);
      const cart = getCart(userId);

      return {
        success: true,
        message: 'Cart cleared successfully',
        data: {
          ...cart,
          total: 0,
        },
      };
    },

    selectItems: (_, { userId, input }) => {
      const cart = getCart(userId);
      cart.selectedItems = input.itemIds;
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'Items selected successfully',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    selectAllItems: (_, { userId }) => {
      const cart = getCart(userId);
      cart.selectedItems = cart.items.map(item => item.id);
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'All items selected',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    clearSelectedItems: (_, { userId }) => {
      const cart = getCart(userId);
      cart.selectedItems = [];
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

      return {
        success: true,
        message: 'Selection cleared',
        data: {
          ...cart,
          total: calculateTotal(cart.items),
        },
      };
    },

    checkout: (_, { userId }) => {
      const cart = getCart(userId);
      const selectedItems = cart.items.filter(item => 
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
      const order = {
        orderId,
        userId,
        items: selectedItems,
        total,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      orders.push(order);

      cart.items = cart.items.filter(item => !cart.selectedItems.includes(item.id));
      cart.selectedItems = [];
      cart.updatedAt = new Date().toISOString();
      carts.set(userId, cart);

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
