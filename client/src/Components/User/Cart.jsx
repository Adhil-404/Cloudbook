import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, clearCart, updateCartQuantity } from './Utils/cartUtils';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/Cart.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const refreshCart = () => {
    setCartItems(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    refreshCart();
    toast.success("Item removed from cart");
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
      toast.success("Cart cleared successfully");
    }
  };

  
  const handleProceedToPayment = () => {

    const token = localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('authToken');
    
    if (!token) {
      toast.error("Please login to proceed with payment");
      navigate('/user/userlogin');
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        author: item.author,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        coverImage: item.coverImage
      })),
      totalAmount: totalPrice,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

   
    setTimeout(() => {
      navigate('/user/payment', {
        state: {
          orderData: orderData,
          fromCart: true
        }
      });
      setIsProcessing(false);
    }, 500);
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
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Discover your next favorite book!</p>

            <Link to='/user/homepage/product' className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
        <UserFooter />
        <ToastContainer />
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
                  <div className="item-image-wrapper">
                    <div className="item-image">
                      <img
                        src={`http://localhost:5000/uploads/${Array.isArray(item.coverImage) ? item.coverImage[0] : item.coverImage}`}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = '/default-book-cover.jpg';
                        }}
                      />
                    </div>
                  </div>

                  <div className="cart-details">
                    <h4 className="item-title">{item.title}</h4>

                    {item.author && (
                      <p className="item-author">by {item.author}</p>
                    )}
                    <p className='card-category1'>Category: {item.category}</p>
                    <p className="item-price">
                      ₹{item.price.toFixed(2)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="original-price">
                          ₹{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn decrement"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        disabled={isProcessing}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="quantity-display">
                        Qty: {item.quantity}
                      </span>
                      <button
                        className="quantity-btn increment"
                        onClick={() => handleIncrement(item.id, item.quantity)}
                        disabled={isProcessing}
                        aria-label="Increase quantity"
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
                      disabled={isProcessing}
                    >
                      Remove
                    </button>
                    <Link to={`/product/${item._id}`}>
                      <button className="detail-btn">Details</button>
                    </Link>
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
                <span className="free-shipping">Free</span>
              </div>

              <div className="summary-row total-row">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="cart-actions">
                <button
                  className="order-btn primary-btn"
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <button
                  className="clear-cart secondary-btn"
                  onClick={handleClear}
                  disabled={isProcessing}
                >
                  Clear Cart
                </button>
              </div>

              <div className="secure-checkout-note">
                <p>🔒 Secure checkout with multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
      <ToastContainer />
    </>
  );
}

export default Cart;