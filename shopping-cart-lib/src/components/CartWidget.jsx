import React, { useState } from 'react';
import '../styles/CartWidget.css';
import CartItem from './CartItem';
import CartButton from './CartButton';
import CartModal from './CartModal';
import { useCart } from '../hooks/useCart';

export const CartWidget = ({ onCheckout }) => {
  const { cart, selectedItems, removeItem, updateItem, selectItem, selectAll, getSelectedTotal } = useCart();
  const [showModal, setShowModal] = useState(false);

  const selectedCount = selectedItems.length;
  const totalItems = cart.length;

  const handleSelectAll = (e) => {
    selectAll(e.target.checked);
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert('Please select items to checkout');
      return;
    }
    onCheckout && onCheckout();
    setShowModal(false);
  };

  return (
    <>
      <button className="cart-widget__trigger" onClick={() => setShowModal(true)}>
        🛒 Cart ({totalItems})
      </button>

      <CartModal
        isOpen={showModal}
        title="Shopping Cart"
        onClose={() => setShowModal(false)}
        onConfirm={handleCheckout}
        confirmText="Checkout"
        size="large"
      >
        <div className="cart-widget__content">
          {cart.length === 0 ? (
            <p className="cart-widget__empty">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-widget__select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCount === totalItems && totalItems > 0}
                    indeterminate={selectedCount > 0 && selectedCount < totalItems}
                    onChange={handleSelectAll}
                  />
                  Select All ({selectedCount}/{totalItems})
                </label>
              </div>

              <div className="cart-widget__items">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onUpdateQuantity={updateItem}
                    onRemove={removeItem}
                    onSelect={selectItem}
                  />
                ))}
              </div>

              <div className="cart-widget__summary">
                <div className="cart-widget__summary-row">
                  <span>Selected Total:</span>
                  <strong>${getSelectedTotal().toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </CartModal>
    </>
  );
};

export default CartWidget;
