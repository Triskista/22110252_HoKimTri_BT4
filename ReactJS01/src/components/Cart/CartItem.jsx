import React from 'react';
import './styles/CartItem.css';
import CartButton from './CartButton';
import CartInput from './CartInput';

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSelect,
  isSelected = false,
}) => {
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item__checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
        />
      </div>

      <div className="cart-item__image">
        {item.image && <img src={item.image} alt={item.name} />}
      </div>

      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.name}</h3>
        {item.description && (
          <p className="cart-item__description">{item.description}</p>
        )}
        <p className="cart-item__price">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="cart-item__quantity">
        <label htmlFor={`qty-${item.id}`}>Quantity:</label>
        <CartInput
          id={`qty-${item.id}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
        />
      </div>

      <div className="cart-item__total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <div className="cart-item__actions">
        <CartButton
          variant="danger"
          size="small"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </CartButton>
      </div>
    </div>
  );
};

export default CartItem;
