import React, { useState } from 'react';
import '../styles/Modal.css';
import CartButton from './CartButton';

export const CartModal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  size = 'medium',
}) => {
  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div
        className={`cart-modal cart-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-modal__header">
          <h2 className="cart-modal__title">{title}</h2>
          <button className="cart-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cart-modal__body">{children}</div>
        <div className="cart-modal__footer">
          <CartButton variant="secondary" onClick={onClose}>
            {cancelText}
          </CartButton>
          {onConfirm && (
            <CartButton variant="primary" onClick={onConfirm}>
              {confirmText}
            </CartButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
