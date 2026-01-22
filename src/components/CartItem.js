// src/components/CartItem.js
import React from 'react';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <div className="cart-item-total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div className="cart-item-remove">
        <button onClick={() => removeItem(item.id)} className="btn-remove">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;