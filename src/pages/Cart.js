// src/pages/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = ({ cartItems, updateQuantity, removeItem, clearCart }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
          
          <div className="cart-actions">
            <button className="btn btn-clear" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/products" className="btn btn-continue">
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(calculateTotal() + 5).toFixed(2)}</span>
            </div>
          </div>
          
          <Link to="/checkout" className="btn btn-checkout">
            Proceed to Checkout
          </Link>
          
          <div className="cart-total-items">
            <p>Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;