import React from 'react';
import './styles/Card.css';

export const CartCard = ({
  children,
  title,
  footer,
  onClick,
  className = '',
  isSelected = false,
  onSelect,
  ...props
}) => {
  return (
    <div
      className={`cart-card ${isSelected ? 'cart-card--selected' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {onSelect && (
        <div className="cart-card__checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          />
        </div>
      )}
      {title && <div className="cart-card__title">{title}</div>}
      <div className="cart-card__body">{children}</div>
      {footer && <div className="cart-card__footer">{footer}</div>}
    </div>
  );
};

export default CartCard;
