# Shopping Cart Library

A standardized React shopping cart library with reusable components and full CRUD functionality.

## Features

- 🛒 Shopping Cart UI Components
- 📦 Standardized Components (Input, Button, Modal, Card)
- ➕ Add products to cart
- ✏️ Edit cart items
- ❌ Delete cart items
- 🎨 Customizable styling
- 📱 Responsive design

## Installation

```bash
npm install @hokimtri/shopping-cart-lib
```

## Usage

### Cart Provider

```jsx
import { CartProvider } from '@hokimtri/shopping-cart-lib';

function App() {
  return (
    <CartProvider>
      <YourComponent />
    </CartProvider>
  );
}
```

### Cart Context Hook

```jsx
import { useCart } from '@hokimtri/shopping-cart-lib';

function MyComponent() {
  const { cart, addItem, removeItem, updateItem } = useCart();
  
  return (
    // Your component logic
  );
}
```

### Components

```jsx
import {
  CartWidget,
  CartModal,
  CartItem,
  CartButton,
  CartInput,
  CartCard
} from '@hokimtri/shopping-cart-lib';

// Use components in your application
```

## API

### useCart Hook

- `cart` - Current cart items
- `addItem(product)` - Add item to cart
- `removeItem(itemId)` - Remove item from cart
- `updateItem(itemId, quantity)` - Update item quantity
- `clearCart()` - Clear all items
- `getTotal()` - Get cart total
- `getSelectedItems()` - Get selected items for checkout

## License

MIT
