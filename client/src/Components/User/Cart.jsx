import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity
} from './Utils/cartUtils';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  // ✅ Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const refreshCart = () => {
    setCartItems(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    refreshCart();
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(id);
    } else {
      updateCartQuantity(id, newQuantity);
      refreshCart();
    }
  };

  const handleIncrement = (id, currentQuantity) => {
    handleQuantityChange(id, currentQuantity + 1);
  };

  const handleDecrement = (id, currentQuantity) => {
    handleQuantityChange(id, currentQuantity - 1);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      setCartItems([]);
    }
  };

  const handleOrder = async () => {
  if (cartItems.length === 0) {
    alert("Cart is empty");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) {
    alert("You must be logged in to place an order.");
    navigate("/");
    return;
  }

  const orderData = {
    userId: user._id,
    items: cartItems,
    totalAmount: totalPrice,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };

  try {
    setIsOrdering(true);
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Order submission failed");

    const savedOrder = await response.json();
    clearCart();
    setCartItems([]);
    navigate("/order", {
      state: { orderData: savedOrder },
    });
  } catch (error) {
    console.error("Failed to place order:", error);
    alert("Something went wrong while placing the order.");
  } finally {
    setIsOrdering(false);
  }
};

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <>
        <UserNav />
        <div className="cart-empty">
          <div className="empty-cart-content">
            <div className="empty-cart-icon"></div>
            <h3>Your cart is empty</h3>
            <p>Discover your next favorite book!</p>
            <button className="continue-shopping-btn" onClick={() => navigate(-1)}>
              Continue Shopping
            </button>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNav />
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <p className="cart-item-count">
            {totalItems} {totalItems === 1 ? 'book' : 'books'}
          </p>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <ul className="cart-list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.coverImage?.[0] || '/default-book-cover.jpg'}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = '/default-book-cover.jpg';
                      }}
                    />
                  </div>

                  <div className="cart-details">
                    <h4 className="item-title">{item.title}</h4>
                    {item.author && <p className="item-author">by {item.author}</p>}
                    <p className="item-price">
                      ₹{item.price.toFixed(2)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                      )}
                    </p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn decrement"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        disabled={isOrdering}
                      >
                        −
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

                    <p className="item-total">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

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
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({totalItems}):</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free-shipping">
                  {totalPrice >= 25 ? 'Free' : '₹4.99'}
                </span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>₹{(totalPrice + (totalPrice >= 25 ? 0 : 4.99)).toFixed(2)}</span>
              </div>

              {totalPrice < 25 && (
                <div className="shipping-notice">
                  <p>Add ₹{(25 - totalPrice).toFixed(2)} more for free shipping!</p>
                </div>
              )}

              <div className="cart-actions">
                <button
                  className="order-btn primary-btn"
                  onClick={handleOrder}
                  disabled={isOrdering || cartItems.length === 0}
                >
                  {isOrdering ? 'Processing...' : 'Proceed to Order'}
                </button>

                <button
                  className="clear-cart secondary-btn"
                  onClick={handleClear}
                  disabled={isOrdering}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default Cart;
