# Shopping Cart System

Một hệ thống Shopping Cart hoàn chỉnh gồm: Thư viện React reusable, GraphQL API Server, và Demo Application.

## 📁 Cấu trúc Dự án

```
HoKimTri_22110252_BT4/
├── shopping-cart-lib/          # Thư viện Shopping Cart React
├── shopping-cart-server/       # GraphQL API Server
├── shopping-cart-demo/         # Demo Application
├── ExpressJS01/                # Ứng dụng Express hiện có
├── ReactJS01/                  # Ứng dụng React hiện có
└── README.md
```

## 📦 Thành phần

### 1. Shopping Cart Library (`shopping-cart-lib`)

Thư viện React chuẩn hóa để quản lý giỏ hàng.

**Tính năng:**
- ✅ Context API cho state management
- ✅ Các component chuẩn hóa (Button, Input, Modal, Card, CartItem, CartWidget)
- ✅ Hook `useCart` để truy cập cart context
- ✅ Hỗ trợ chọn một hoặc nhiều sản phẩm
- ✅ Tính năng thêm, sửa, xóa sản phẩm
- ✅ Responsive UI

**Cài đặt:**
```bash
cd shopping-cart-lib
npm install
npm run build
```

**Sử dụng:**
```jsx
import { CartProvider, useCart, CartWidget } from '@hokimtri/shopping-cart-lib';

function App() {
  return (
    <CartProvider>
      <YourComponent />
      <CartWidget />
    </CartProvider>
  );
}
```

### 2. Shopping Cart Server (`shopping-cart-server`)

GraphQL API Server cho các chức năng giỏ hàng.

**Tính năng:**
- 🔍 Xem giỏ hàng
- ➕ Thêm sản phẩm vào giỏ hàng
- ✏️ Chỉnh sửa giỏ hàng
- ❌ Xóa giỏ hàng
- ✅ Chọn một hoặc nhiều sản phẩm
- 💳 Thanh toán

**Cài đặt:**
```bash
cd shopping-cart-server
npm install
npm run dev
```

Server chạy tại: `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

**Ví dụ GraphQL Query:**
```graphql
query {
  getCart(userId: "user-1") {
    success
    data {
      items {
        id
        product {
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

### 3. Demo Application (`shopping-cart-demo`)

Ứng dụng demo để test Shopping Cart Library.

**Cài đặt:**
```bash
cd shopping-cart-demo
npm install
npm run dev
```

Demo chạy tại: `http://localhost:3000`

## 🚀 Hướng dẫn Sử dụng

### Chạy tất cả dịch vụ

1. **Terminal 1 - GraphQL Server:**
```bash
cd shopping-cart-server
npm install
npm run dev
```

2. **Terminal 2 - Demo App:**
```bash
cd shopping-cart-demo
npm install
npm run dev
```

3. Truy cập:
   - Demo: http://localhost:3000
   - GraphQL: http://localhost:4000/graphql

## 📚 API Reference

### Queries

#### `getCart(userId)`
Lấy toàn bộ giỏ hàng của user

```graphql
query {
  getCart(userId: "user-1") {
    success
    message
    data {
      id
      items { ... }
      total
      selectedItems
    }
  }
}
```

#### `getSelectedItems(userId)`
Lấy các sản phẩm được chọn

```graphql
query {
  getSelectedItems(userId: "user-1") {
    id
    product { name price }
    quantity
  }
}
```

#### `getSelectedTotal(userId)`
Tính tổng giá các sản phẩm được chọn

### Mutations

#### `addItemToCart`
Thêm sản phẩm vào giỏ hàng

```graphql
mutation {
  addItemToCart(userId: "user-1", input: {
    productId: "1"
    quantity: 2
  }) {
    success
    data { total }
  }
}
```

#### `updateCartItem`
Cập nhật số lượng sản phẩm

```graphql
mutation {
  updateCartItem(userId: "user-1", input: {
    itemId: "item-123"
    quantity: 5
  }) { success }
}
```

#### `removeFromCart`
Xóa sản phẩm khỏi giỏ hàng

```graphql
mutation {
  removeFromCart(userId: "user-1", itemId: "item-123") { success }
}
```

#### `selectItems`
Chọn nhiều sản phẩm để thanh toán

```graphql
mutation {
  selectItems(userId: "user-1", input: {
    itemIds: ["item-1", "item-2"]
  }) { success }
}
```

#### `checkout`
Thanh toán các sản phẩm được chọn

```graphql
mutation {
  checkout(userId: "user-1") {
    success
    orderId
    total
    items { ... }
  }
}
```

## 🔧 Cấu hình

### Shopping Cart Library

**File:** `shopping-cart-lib/package.json`
- Tên package: `@hokimtri/shopping-cart-lib`
- Hỗ trợ React 18.0.0+

### Shopping Cart Server

**File:** `shopping-cart-server/.env`
```
PORT=4000
NODE_ENV=development
```

## 📝 Component Properties

### CartWidget
```jsx
<CartWidget 
  onCheckout={() => {}} // Callback khi checkout
/>
```

### CartButton
```jsx
<CartButton
  variant="primary|secondary|danger|success" // default: primary
  size="small|medium|large" // default: medium
  onClick={() => {}}
  disabled={false}
/>
```

### CartModal
```jsx
<CartModal
  isOpen={true}
  title="Title"
  onClose={() => {}}
  onConfirm={() => {}}
  size="small|medium|large" // default: medium
/>
```

### CartInput
```jsx
<CartInput
  type="text|number"
  value=""
  onChange={() => {}}
  placeholder=""
/>
```

### CartCard
```jsx
<CartCard
  title="Title"
  isSelected={false}
  onSelect={() => {}}
  footer="Footer text"
/>
```

## 💡 Hook: useCart

```javascript
const {
  cart,              // Mảng các item trong giỏ hàng
  selectedItems,     // Mảng ID các item được chọn
  addItem,           // Function: thêm sản phẩm
  removeItem,        // Function: xóa sản phẩm
  updateItem,        // Function: cập nhật số lượng
  clearCart,         // Function: xóa toàn bộ
  selectItem,        // Function: chọn 1 sản phẩm
  selectAll,         // Function: chọn tất cả
  getTotal,          // Function: tính tổng tất cả
  getSelectedItems,  // Function: lấy items được chọn
  getSelectedTotal,  // Function: tính tổng items được chọn
} = useCart();
```

## 🌟 Tính năng Nâng cao

1. **Multi-select:** Chọn một hoặc nhiều sản phẩm để thanh toán
2. **Responsive Design:** Hoạt động trên desktop, tablet, mobile
3. **GraphQL API:** Dễ dàng mở rộng và tích hợp
4. **Reusable Components:** Các component chuẩn hóa có thể tái sử dụng
5. **In-memory Storage:** Có thể thay bằng database thực

## 📦 NPM Package

Thư viện đã được đóng gói và sẵn sàng publish lên NPM:

```bash
cd shopping-cart-lib
npm publish --access public
```

## 🔗 GitHub Repository

Toàn bộ source code đã được push lên GitHub:
- Repository: https://github.com/Triskista/22110252_HoKimTri_BT4

## 📄 Liên kết

- [Shopping Cart Library Docs](./shopping-cart-lib/README.md)
- [GraphQL Server Docs](./shopping-cart-server/README.md)
- [Demo App Docs](./shopping-cart-demo/README.md)

## 👨‍💻 Author

**Hồ Kim Trí** - 22110252

## 📄 License

MIT

---

**Ngày tạo:** December 3, 2025
**Phiên bản:** 1.0.0
