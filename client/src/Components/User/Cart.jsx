import React, { useEffect, useState } from 'react';
import {getCart,removeFromCart,clearCart,updateCartQuantity } from './Utils/cartUtils';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(id);
    } else {
      updateCartQuantity(id, newQuantity);
      setCartItems(getCart());
    }
  };

  const handleIncrement = (id, currentQuantity) => {
    handleQuantityChange(id, currentQuantity + 1);
  };

  const handleDecrement = (id, currentQuantity) => {
    handleQuantityChange(id, currentQuantity - 1);
  };

  const handleClear = () => {
    clearCart();
    setCartItems([]);
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    
    try {
      // Create order object
      const orderData = {
        items: cartItems,
        totalAmount: totalPrice,
        orderDate: new Date().toISOString(),
        // Add other order details as needed
      };

      // Here you would typically make an API call to place the order
      // Example:
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(orderData),
      // });

      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful order
      clearCart();
      setCartItems([]);
      
      // Show success message or redirect to order confirmation
      alert('Order placed successfully!');
      // You might want to redirect to an order confirmation page
      // window.location.href = '/order-confirmation';
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <>
        <UserNav />
        <div className="cart-empty">
          <h3>Your cart is empty.</h3>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNav />
      <div className="cart-container">
        <h2>Your Cart</h2>
        <ul className="cart-list">
          {cartItems.map(item => (
            <li key={item.id} className="cart-item">
              <img src={item.images?.[0]} alt={item.title} />
              <div className="cart-details">
                <h4>{item.title}</h4>
                <p>Price: ${item.price}</p>
                
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn decrement"
                    onClick={() => handleDecrement(item.id, item.quantity)}
                    disabled={isOrdering}
                  >
                    -
                  </button>
                  <span className="quantity-display">Qty: {item.quantity}</span>
                  <button 
                    className="quantity-btn increment"
                    onClick={() => handleIncrement(item.id, item.quantity)}
                    disabled={isOrdering}
                  >
                    +
                  </button>
                </div>
                
                <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                  disabled={isOrdering}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="cart-summary">
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          
          <div className="cart-actions">
            <button 
              className="order-btn" 
              onClick={handleOrder}
              disabled={isOrdering || cartItems.length === 0}
            >
              {isOrdering ? 'Placing Order...' : 'Place Order'}
            </button>
            
            <button 
              className="clear-cart" 
              onClick={handleClear}
              disabled={isOrdering}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default Cart;