import React from 'react';
import './styles/Input.css';

export const CartInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  min,
  max,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      className={`cart-input ${className}`}
      {...props}
    />
  );
};

export default CartInput;
