# 🛍️ Shopping Cart System - Complete Solution

<div align="center">

![Shopping Cart](https://img.shields.io/badge/status-ready%20for%20production-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-brightgreen)
![React](https://img.shields.io/badge/react-18%2B-61dafb)

A comprehensive shopping cart system with React library, GraphQL API, and demo application.

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Features](#-features) • [GitHub](https://github.com/Triskista/22110252_HoKimTri_BT4)

</div>

---

## 🎯 Overview

This project provides a complete, production-ready shopping cart system consisting of:

1. **📦 React Library** - Reusable, standardized shopping cart components
2. **🚀 GraphQL Server** - Powerful backend API for cart operations
3. **🎨 Demo Application** - Full-featured demo showcasing the library
4. **📚 Comprehensive Documentation** - Setup guides, API docs, and more

Perfect for:
- ✅ Learning React, GraphQL, and modern web development
- ✅ Building e-commerce applications
- ✅ Creating reusable component libraries
- ✅ Understanding API design patterns

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Triskista/22110252_HoKimTri_BT4.git
cd 22110252_HoKimTri_BT4
```

### 2️⃣ Start GraphQL Server (Terminal 1)
```bash
cd shopping-cart-server
npm install
npm run dev
```
✅ GraphQL at http://localhost:4000/graphql

### 3️⃣ Start Demo App (Terminal 2)
```bash
cd shopping-cart-demo
npm install
npm run dev
```
✅ App at http://localhost:3000

### 4️⃣ Try It!
- Browse products 🛍️
- Add to cart 🛒
- Manage quantities ✏️
- Checkout 💳

👉 **[More Details →](./QUICK_START.md)**

---

## 📦 Modules

### 1. Shopping Cart Library (`shopping-cart-lib`)

A production-ready React library for shopping cart functionality.

**Components:**
```
CartButton       - Standardized button with variants
CartInput        - Form input component
CartModal        - Modal dialog
CartCard         - Card container
CartItem         - Cart item display
CartWidget       - Shopping cart widget
```

**Key Features:**
- 🎨 Fully customizable UI components
- 🔌 Context API for state management
- 🪝 `useCart` hook for easy integration
- 📱 Responsive design (mobile, tablet, desktop)
- ✅ Multi-select support
- 🎯 Add, edit, delete operations

**Usage:**
```jsx
import { CartProvider, useCart, CartWidget } from '@hokimtri/shopping-cart-lib';

function App() {
  const { cart, addItem } = useCart();
  
  return (
    <CartProvider>
      <ProductList onAdd={addItem} />
      <CartWidget />
    </CartProvider>
  );
}
```

📖 **[Library Docs →](./shopping-cart-lib/README.md)**

---

### 2. GraphQL Server (`shopping-cart-server`)

Apollo Server + Express backend with complete cart functionality.

**Queries:**
```graphql
getCart(userId)        # Get user's cart
getSelectedItems       # Get selected items
getCartTotal           # Calculate total
getSelectedTotal       # Calculate selected total
```

**Mutations:**
```graphql
addItemToCart          # Add product
updateCartItem         # Update quantity
removeFromCart         # Remove item
selectItems            # Select for checkout
checkout               # Process payment
```

**Features:**
- 🔍 Full GraphQL implementation
- 📊 In-memory database (easily replaceable)
- 🛡️ Input validation
- ⚡ Fast query resolution
- 🔌 RESTful + GraphQL support

**Test Queries:**
```graphql
# Get cart
query { getCart(userId: "user-1") { items { product { name } } } }

# Add item
mutation { addItemToCart(userId: "user-1", input: { productId: "1" }) { success } }

# Checkout
mutation { checkout(userId: "user-1") { orderId total } }
```

📖 **[Server Docs →](./shopping-cart-server/README.md)**

---

### 3. Demo Application (`shopping-cart-demo`)

Full-featured demo showcasing the shopping cart library.

**Features:**
- 🛍️ Product listing
- 🛒 Add to cart
- ✏️ Manage quantities
- ❌ Remove items
- 💳 Checkout flow
- 📱 Responsive design

**Tech Stack:**
- React 18
- Vite
- CSS3

📖 **[Demo Docs →](./shopping-cart-demo/README.md)**

---

## ✨ Features

### Shopping Cart Library
- ✅ Add products to cart
- ✅ Update product quantities
- ✅ Remove items
- ✅ Clear entire cart
- ✅ Select single/multiple items
- ✅ Calculate totals
- ✅ Mobile responsive
- ✅ Customizable components
- ✅ Context API integration
- ✅ Reusable hooks

### GraphQL Server
- ✅ Complete CRUD operations
- ✅ Multi-select support
- ✅ Checkout process
- ✅ Error handling
- ✅ Input validation
- ✅ Sample data included
- ✅ Scalable architecture
- ✅ GraphQL Playground

### Demo Application
- ✅ Product catalog
- ✅ Shopping experience
- ✅ Real-time updates
- ✅ Responsive layout
- ✅ Sample products
- ✅ Easy to extend

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | Get running in 5 minutes |
| **[PROJECT_DETAILS.md](./PROJECT_DETAILS.md)** | Complete architecture & design |
| **[NPM_PUBLISHING_GUIDE.md](./NPM_PUBLISHING_GUIDE.md)** | Publish to NPM registry |
| **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** | Project completion checklist |
| **[shopping-cart-lib/README.md](./shopping-cart-lib/README.md)** | Library usage guide |
| **[shopping-cart-server/README.md](./shopping-cart-server/README.md)** | Server API docs |
| **[shopping-cart-demo/README.md](./shopping-cart-demo/README.md)** | Demo app guide |

---

## 🏗️ Project Structure

```
22110252_HoKimTri_BT4/
├── shopping-cart-lib/          # React library
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── context/            # CartContext
│   │   ├── hooks/              # useCart hook
│   │   └── styles/             # CSS modules
│   └── package.json
│
├── shopping-cart-server/       # GraphQL API
│   ├── src/
│   │   ├── schema/             # GraphQL types
│   │   ├── resolvers/          # Query/Mutation handlers
│   │   └── index.js            # Apollo + Express
│   └── package.json
│
├── shopping-cart-demo/         # Demo app
│   ├── src/
│   │   ├── App.jsx             # Main component
│   │   └── styles/
│   └── package.json
│
├── QUICK_START.md              # Quick setup
├── PROJECT_DETAILS.md          # Full details
├── NPM_PUBLISHING_GUIDE.md     # NPM guide
└── VERIFICATION_CHECKLIST.md   # Completion checklist
```

---

## 🚀 Usage Examples

### Using the Library

```jsx
import { CartProvider, useCart, CartWidget, CartButton } from '@hokimtri/shopping-cart-lib';

function ProductComponent() {
  const { addItem, cart, getTotal } = useCart();
  
  return (
    <div>
      <h2>Products</h2>
      <CartButton 
        variant="primary" 
        onClick={() => addItem({ id: '1', name: 'Laptop', price: 999 })}
      >
        Add to Cart
      </CartButton>
      
      <p>Items in cart: {cart.length}</p>
      <p>Total: ${getTotal().toFixed(2)}</p>
    </div>
  );
}

export default () => (
  <CartProvider>
    <ProductComponent />
    <CartWidget onCheckout={() => console.log('Checkout!')} />
  </CartProvider>
);
```

### GraphQL Queries

```javascript
// Get cart
const GET_CART = `
  query GetCart($userId: ID!) {
    getCart(userId: $userId) {
      data {
        items { id product { name price } quantity }
        total
      }
    }
  }
`;

// Add to cart
const ADD_TO_CART = `
  mutation AddItem($userId: ID!, $input: AddItemInput!) {
    addItemToCart(userId: $userId, input: $input) {
      success
      data { total }
    }
  }
`;
```

---

## 📦 NPM Package

### Installation
```bash
npm install @hokimtri/shopping-cart-lib
```

### Publishing
```bash
cd shopping-cart-lib
npm login
npm run build
npm publish --access public
```

📖 **[Full Publishing Guide →](./NPM_PUBLISHING_GUIDE.md)**

---

## 🔧 API Reference

### useCart Hook

```javascript
const {
  cart: CartItem[],           // All items in cart
  selectedItems: ID[],        // Selected item IDs
  addItem: (product) => void,
  removeItem: (itemId) => void,
  updateItem: (itemId, qty) => void,
  clearCart: () => void,
  selectItem: (itemId) => void,
  selectAll: (selectAll) => void,
  getTotal: () => number,
  getSelectedItems: () => CartItem[],
  getSelectedTotal: () => number
} = useCart();
```

### GraphQL Types

```graphql
type Cart {
  id: ID!
  userId: ID!
  items: [CartItem!]!
  total: Float!
  selectedItems: [ID!]!
}

type CartItem {
  id: ID!
  productId: ID!
  product: Product!
  quantity: Int!
  price: Float!
}

type CartResponse {
  success: Boolean!
  message: String!
  data: Cart
  error: String
}
```

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

### Module Not Found
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
cd shopping-cart-lib
npm install
npm run build
ls dist/  # Verify output
```

📖 **[More Troubleshooting →](./QUICK_START.md#troubleshooting)**

---

## 🎓 Learning Outcomes

This project teaches:
- ✅ React Hooks and Context API
- ✅ GraphQL and Apollo Server
- ✅ Component library design
- ✅ State management patterns
- ✅ API design and documentation
- ✅ Build tools (Rollup, Vite, Babel)
- ✅ NPM package publishing
- ✅ Git and GitHub workflows

---

## 📈 Roadmap

### v1.0.0 ✅ (Current)
- [x] Core cart functionality
- [x] GraphQL API
- [x] React components
- [x] Demo application
- [x] Documentation

### v1.1.0 (Planned)
- [ ] Database integration (MongoDB)
- [ ] Authentication (JWT)
- [ ] Order history
- [ ] Wishlist feature
- [ ] Product recommendations

### v2.0.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Real-time sync

---

## 🔗 Resources

### Official Documentation
- [React Docs](https://react.dev)
- [GraphQL Docs](https://graphql.org)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)
- [Rollup](https://rollupjs.org)
- [Vite](https://vitejs.dev)

### This Project
- 📖 [Full Documentation](./PROJECT_DETAILS.md)
- 🚀 [Quick Start](./QUICK_START.md)
- 📦 [NPM Guide](./NPM_PUBLISHING_GUIDE.md)
- ✅ [Checklist](./VERIFICATION_CHECKLIST.md)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

See [LICENSE](./LICENSE) file for details.

---

## 👤 About

**Author:** Hồ Kim Trí  
**Student ID:** 22110252  
**Repository:** [GitHub](https://github.com/Triskista/22110252_HoKimTri_BT4)  
**Created:** December 3, 2025

---

## 📞 Support

- 📖 Check the [documentation](./PROJECT_DETAILS.md)
- 🚀 Read the [quick start](./QUICK_START.md)
- 🐛 Report issues on [GitHub](https://github.com/Triskista/22110252_HoKimTri_BT4/issues)
- 💬 Start a discussion on [GitHub Discussions](https://github.com/Triskista/22110252_HoKimTri_BT4/discussions)

---

<div align="center">

**Made with ❤️ by Hồ Kim Trí**

⭐ Star this repo if you find it helpful!

[↑ Back to Top](#-shopping-cart-system---complete-solution)

</div>
