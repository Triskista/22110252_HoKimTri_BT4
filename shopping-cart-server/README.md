# Shopping Cart GraphQL Server

GraphQL API for shopping cart operations with advanced features.

## Features

- 🛒 View cart
- ➕ Add products to cart
- ✏️ Update cart items
- ❌ Remove items from cart
- 🗑️ Clear entire cart
- ✅ Select specific items for checkout
- 💳 Checkout selected items
- 📦 Get cart totals and selected totals

## Installation

```bash
npm install
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## GraphQL Queries

### Get Cart
```graphql
query {
  getCart(userId: "user-1") {
    success
    message
    data {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
      }
      total
    }
  }
}
```

### Get Cart Total
```graphql
query {
  getCartTotal(userId: "user-1")
}
```

### Get Selected Items
```graphql
query {
  getSelectedItems(userId: "user-1") {
    id
    product {
      name
      price
    }
    quantity
  }
}
```

### Get Selected Total
```graphql
query {
  getSelectedTotal(userId: "user-1")
}
```

## GraphQL Mutations

### Add Item to Cart
```graphql
mutation {
  addItemToCart(userId: "user-1", input: {
    productId: "1"
    quantity: 2
  }) {
    success
    message
    data {
      total
    }
  }
}
```

### Update Cart Item
```graphql
mutation {
  updateCartItem(userId: "user-1", input: {
    itemId: "item-123"
    quantity: 5
  }) {
    success
    message
  }
}
```

### Remove from Cart
```graphql
mutation {
  removeFromCart(userId: "user-1", itemId: "item-123") {
    success
    message
  }
}
```

### Clear Cart
```graphql
mutation {
  clearCart(userId: "user-1") {
    success
    message
  }
}
```

### Select Items
```graphql
mutation {
  selectItems(userId: "user-1", input: {
    itemIds: ["item-1", "item-2"]
  }) {
    success
    message
  }
}
```

### Select All Items
```graphql
mutation {
  selectAllItems(userId: "user-1") {
    success
    message
  }
}
```

### Checkout
```graphql
mutation {
  checkout(userId: "user-1") {
    success
    message
    orderId
    total
    items {
      id
      product {
        name
      }
      quantity
    }
  }
}
```

## License

MIT
