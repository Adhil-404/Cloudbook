import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/UserOrders.css";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('userToken');
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('Token value:', token?.substring(0, 20) + '...');
      
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      console.log('Making request to: http://localhost:5000/api/user/orders');
      const response = await axios.get('http://localhost:5000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response received:', response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
      }
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Please login to cancel order');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/user/orders/${orderId}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order');
    }
  };

  const removeOrder = (orderId) => {
    setOrders(orders.filter(order => order._id !== orderId));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status?.toLowerCase()] || '#6c757d';
  };

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '/default-book-cover.jpg';
    if (Array.isArray(coverImage)) {
      return coverImage.length > 0 
        ? `http://localhost:5000/uploads/${coverImage[0]}` 
        : '/default-book-cover.jpg';
    }
    return `http://localhost:5000/uploads/${coverImage}`;
  };

  if (loading) {
    return (
      <>
        <UserNav />
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
        <UserFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNav />
        <div className="orders-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchUserOrders}>Try Again</button>
        </div>
        <UserFooter />
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <UserNav />
        <div className="orders-empty">
          <div className="empty-orders-content">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet!</p>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNav />
      <div className="orders-container">
        <div className="orders-header">
          <h2>My Orders</h2>
          <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h4>Order #{order.orderNumber || order._id.slice(-8)}</h4>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div 
                  className="order-status" 
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-image">
                      <img
                        src={getImageUrl(item.coverImage)}
                        alt={item.title || 'Book cover'}
                        onError={(e) => { e.target.src = '/default-book-cover.jpg'; }}
                      />
                    </div>
                    <div className="item-details">
                      <h5>{item.title || 'Unknown Title'}</h5>
                      {item.author && <p>by {item.author}</p>}
                      {item.category && <p className="item-category">{item.category}</p>}
                      <div className="item-price-qty">
                        <span>₹{item.price} × {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Items ({order.itemCount || order.items?.length}):</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>

                <div className="order-actions">
                  {order.status?.toLowerCase() === 'confirmed' && (
                    <button 
                      className="cancel-order-btn" 
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status?.toLowerCase() === 'cancelled' && (
                    <button 
                      className="remove-order-btn" 
                      onClick={() => removeOrder(order._id)}
                    >
                      ✕ Remove Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default UserOrders;