// In-memory database (in production, use real database like MongoDB)
const carts = new Map();
const products = new Map();
const orders = [];

// Initialize some sample products
const initializeProducts = () => {
  const sampleProducts = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      image: 'https://via.placeholder.com/300x300?text=Laptop',
      stock: 50,
    },
    {
      id: '2',
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 29.99,
      image: 'https://via.placeholder.com/300x300?text=Mouse',
      stock: 200,
    },
    {
      id: '3',
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 79.99,
      image: 'https://via.placeholder.com/300x300?text=Keyboard',
      stock: 150,
    },
    {
      id: '4',
      name: 'Monitor',
      description: '27" 4K monitor',
      price: 449.99,
      image: 'https://via.placeholder.com/300x300?text=Monitor',
      stock: 30,
    },
    {
      id: '5',
      name: 'USB-C Cable',
      description: 'High-speed USB-C cable',
      price: 9.99,
      image: 'https://via.placeholder.com/300x300?text=Cable',
      stock: 500,
    },
  ];

  sampleProducts.forEach(product => {
    products.set(product.id, product);
  });
};

initializeProducts();

// Helper functions
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

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const getProduct = (productId) => {
  return products.get(productId);
};

export const resolvers = {
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
      const product = getProduct(input.productId);

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
          data: null,
          error: `Product with ID ${input.productId} does not exist`,
        };
      }

      if (input.quantity > product.stock) {
        return {
          success: false,
          message: 'Insufficient stock',
          data: null,
          error: `Only ${product.stock} items available`,
        };
      }

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => item.productId === input.productId);

      if (existingItem) {
        existingItem.quantity += input.quantity;
      } else {
        const newItem = {
          id: `item-${Date.now()}`,
          productId: input.productId,
          product,
          quantity: input.quantity,
          price: product.price,
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

      const product = getProduct(item.productId);
      if (input.quantity > product.stock) {
        return {
          success: false,
          message: 'Insufficient stock',
          data: null,
          error: `Only ${product.stock} items available`,
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
      const cart = getCart(userId); // Creates a new empty cart

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
      
      // Validate that all items exist in cart
      const validItems = input.itemIds.every(itemId => 
        cart.items.some(item => item.id === itemId)
      );

      if (!validItems) {
        return {
          success: false,
          message: 'Some items not found in cart',
          data: null,
          error: 'One or more items do not exist in cart',
        };
      }

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

      // Create order
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

      // Remove selected items from cart
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

  CartItem: {
    product: (item) => getProduct(item.productId),
  },
};
