# Shopping Cart System - Setup Guide

## 🚀 Khởi động Nhanh

### Cách 1: Chạy tất cả dịch vụ cùng lúc (Recommended)

**Terminal 1 - GraphQL Server:**
```bash
cd shopping-cart-server
npm install
npm run dev
```
✅ Server sẽ chạy tại http://localhost:4000
✅ GraphQL Playground: http://localhost:4000/graphql

**Terminal 2 - Demo App:**
```bash
cd shopping-cart-demo
npm install
npm run dev
```
✅ App sẽ chạy tại http://localhost:3000

### Cách 2: Build thư viện để publish

```bash
cd shopping-cart-lib
npm install
npm run build
```

## 📋 Checklist Hoàn thành

- [x] Tạo Shopping Cart Library
  - [x] Standardized Components (Button, Input, Modal, Card, CartItem, CartWidget)
  - [x] Cart Context & Hook (useCart)
  - [x] Add/Edit/Delete functionality
  - [x] Multi-select feature
  - [x] Responsive UI

- [x] Tạo GraphQL API Server
  - [x] Query: getCart, getSelectedItems, getCartTotal, getSelectedTotal
  - [x] Mutations: addItemToCart, updateCartItem, removeFromCart, clearCart
  - [x] Mutations: selectItems, selectAllItems, clearSelectedItems
  - [x] Mutation: checkout
  - [x] Sample products & in-memory database

- [x] Tạo Demo Application
  - [x] Product list
  - [x] Add to cart functionality
  - [x] Cart widget display
  - [x] Responsive design

- [x] Documentation
  - [x] README files cho mỗi module
  - [x] API documentation
  - [x] Usage examples

- [x] Ready to Push to GitHub & Publish to NPM

## 📦 NPM Package Info

```
Name: @hokimtri/shopping-cart-lib
Version: 1.0.0
Author: Ho Kim Tri (22110252)
Repository: https://github.com/Triskista/22110252_HoKimTri_BT4
```

## 🔗 Useful Commands

### Shopping Cart Library
```bash
cd shopping-cart-lib
npm install              # Cài dependencies
npm run build            # Build thư viện
npm run dev              # Watch mode
npm publish              # Publish lên NPM
```

### Shopping Cart Server
```bash
cd shopping-cart-server
npm install              # Cài dependencies
npm run dev              # Chạy development server
npm start                # Chạy production server
```

### Shopping Cart Demo
```bash
cd shopping-cart-demo
npm install              # Cài dependencies
npm run dev              # Chạy dev server
npm run build            # Build cho production
npm run preview          # Preview production build
```

## 📝 File Structure

```
shopping-cart-lib/
├── src/
│   ├── components/
│   │   ├── CartButton.jsx
│   │   ├── CartInput.jsx
│   │   ├── CartModal.jsx
│   │   ├── CartCard.jsx
│   │   ├── CartItem.jsx
│   │   └── CartWidget.jsx
│   ├── context/
│   │   └── CartContext.js
│   ├── hooks/
│   │   └── useCart.js
│   ├── styles/
│   │   ├── Button.css
│   │   ├── Input.css
│   │   ├── Modal.css
│   │   ├── Card.css
│   │   ├── CartItem.css
│   │   └── CartWidget.css
│   └── index.js
├── package.json
└── rollup.config.js

shopping-cart-server/
├── src/
│   ├── schema/
│   │   └── typeDefs.js
│   ├── resolvers/
│   │   └── cartResolvers.js
│   └── index.js
├── package.json
└── .env

shopping-cart-demo/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🧪 Testing

### Test Shopping Cart Library
```bash
cd shopping-cart-lib
npm test
```

### Test GraphQL Server (Manual)
1. Mở http://localhost:4000/graphql
2. Chạy các queries và mutations từ README

### Test Demo App
1. Mở http://localhost:3000
2. Thêm sản phẩm vào giỏ hàng
3. Chỉnh sửa số lượng
4. Xoá sản phẩm
5. Chọn sản phẩm và checkout

## 📚 Documentation Links

- [Shopping Cart Library README](./shopping-cart-lib/README.md)
- [GraphQL Server README](./shopping-cart-server/README.md)
- [Demo App README](./shopping-cart-demo/README.md)
- [Main Project README](./README_SHOPPING_CART.md)

## 🔐 Publishing to NPM

### Step 1: Create NPM Account
```bash
npm adduser
```

### Step 2: Login to NPM
```bash
npm login
```

### Step 3: Publish Package
```bash
cd shopping-cart-lib
npm publish --access public
```

### Step 4: Verify on NPM
Visit: https://www.npmjs.com/package/@hokimtri/shopping-cart-lib

## 🐙 Pushing to GitHub

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Shopping Cart System"
```

### Step 2: Add Remote
```bash
git remote add origin https://github.com/Triskista/22110252_HoKimTri_BT4.git
```

### Step 3: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## 🆘 Troubleshooting

### Port đã sử dụng
```bash
# Tìm process sử dụng port 4000
lsof -i :4000

# Kill process (Linux/Mac)
kill -9 <PID>

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### npm install lỗi
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module not found
```bash
# Cài lại từ đầu
rm -rf node_modules
npm install
```

## 📞 Contact

- Author: Hồ Kim Trí
- Student ID: 22110252
- GitHub: https://github.com/Triskista

---

**Last Updated:** December 3, 2025
**Status:** ✅ Ready for Production
