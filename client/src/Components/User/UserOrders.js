import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/UserOrders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('Token value:', token);
      
      if (!token) {
        setError('Please login to view orders');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Order fetch error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        setError('Session expired. Please login again');
      } else if (error.response?.status === 403) {
        setError('Access denied. Please login again');
      } else {
        setError('Failed to fetch orders. Please try again');
      }
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
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
                  <h4>Order #{order.orderNumber}</h4>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => {
                  const imageUrl = item.coverImage 
                    ? `http://localhost:5000/uploads/${Array.isArray(item.coverImage) ? item.coverImage[0] : item.coverImage}`
                    : '/default-book-cover.jpg';

                  return (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          onError={(e) => {
                            e.target.src = '/default-book-cover.jpg';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h5>{item.title}</h5>
                        {item.author && <p>by {item.author}</p>}
                        <p className="item-category">{item.category}</p>
                        <div className="item-price-qty">
                          <span>₹{item.price} × {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Items ({order.itemCount}):</span>
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
              </div>
            </div>
          ))}
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default Orders;