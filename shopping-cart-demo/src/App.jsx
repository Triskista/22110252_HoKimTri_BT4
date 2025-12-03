import React, { useState, useEffect } from 'react';
import { CartProvider, useCart, CartWidget, CartButton, CartCard } from '@hokimtri/shopping-cart-lib';
import './App.css';

// Sample products
const PRODUCTS = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    image: 'https://via.placeholder.com/200x200?text=Laptop',
    stock: 50,
  },
  {
    id: '2',
    name: 'Mouse',
    description: 'Wireless mouse',
    price: 29.99,
    image: 'https://via.placeholder.com/200x200?text=Mouse',
    stock: 200,
  },
  {
    id: '3',
    name: 'Keyboard',
    description: 'Mechanical keyboard',
    price: 79.99,
    image: 'https://via.placeholder.com/200x200?text=Keyboard',
    stock: 150,
  },
  {
    id: '4',
    name: 'Monitor',
    description: '27" 4K monitor',
    price: 449.99,
    image: 'https://via.placeholder.com/200x200?text=Monitor',
    stock: 30,
  },
  {
    id: '5',
    name: 'USB-C Cable',
    description: 'High-speed USB-C cable',
    price: 9.99,
    image: 'https://via.placeholder.com/200x200?text=Cable',
    stock: 500,
  },
];

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <CartCard
      title={product.name}
      footer={`Stock: ${product.stock}`}
      className="product-card"
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <p className="product-description">{product.description}</p>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <div className="product-actions">
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="quantity-input"
        />
        <CartButton
          variant="primary"
          size="medium"
          onClick={() => {
            onAddToCart({ ...product, quantity });
            setQuantity(1);
          }}
        >
          Add to Cart
        </CartButton>
      </div>
    </CartCard>
  );
}

function ProductList() {
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-grid">
      {PRODUCTS.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}

function DemoContent() {
  const { getTotal } = useCart();

  return (
    <div className="demo-container">
      <header className="demo-header">
        <div className="header-content">
          <h1>🛍️ Shopping Cart Demo</h1>
          <p>Using Shopping Cart Library - Try adding products to your cart</p>
          <p className="current-total">Current Total: ${getTotal().toFixed(2)}</p>
        </div>
      </header>

      <main className="demo-main">
        <ProductList />
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <DemoContent />
      <CartWidget onCheckout={() => alert('Checkout successful!')} />
    </CartProvider>
  );
}

export default App;
