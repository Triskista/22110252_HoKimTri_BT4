import React from 'react';
import './styles/Button.css';

export const CartButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`cart-btn cart-btn--${variant} cart-btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default CartButton;
