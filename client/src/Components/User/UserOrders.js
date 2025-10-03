import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/UserOrders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const getAuthToken = () => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('userToken') ||
      sessionStorage.getItem('token')
    );
  };

  useEffect(() => {
    if (location.state?.orderSuccess) {
      handlePaymentSuccess();
    } else {
      fetchOrders();
    }
  }, [location]);

  // --- Fetch orders safely ---
  const fetchOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('You are not logged in. Please login to view orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Session expired or invalid token. Please login again.');
      } else {
        setError('Unable to load orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentSuccess = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Cannot save order: not logged in.');
      setLoading(false);
      return;
    }

    try {
      const { orderId, orderData, paymentMethod } = location.state || {};
      if (!orderId || !orderData) {
        fetchOrders();
        return;
      }

      const newOrder = {
        _id: orderId,
        orderNumber: orderId,
        orderDate: new Date().toISOString(),
        status: 'confirmed',
        items: orderData.items.map(item => ({
          ...item,
          coverImage: item.coverImage || 'default-book.jpg'
        })),
        totalAmount: orderData.totalAmount,
        itemCount: orderData.items.length,
        paymentMethod: paymentMethod || 'N/A',
        customerName: 'Guest User',
        customerEmail: 'guest@example.com'
      };

      
      setOrders(prev => [newOrder, ...prev]);

      await axios.post('http://localhost:5000/api/orders', newOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to save order:', err.response?.data || err.message);
      setError('Failed to save order. It may be saved locally.');
    } finally {
      setLoading(false);
    }
  };

  
  const cancelOrder = async (orderId) => {
    const token = getAuthToken();
    if (!token) {
      setError('You are not logged in. Cannot cancel order.');
      return;
    }

    try {
      
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Cancel order failed:', err.response?.data || err.message);
      setError('Failed to cancel order. Please try again.');
    }
  };

  
  const removeOrder = (orderId) => {
    try {
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Remove order failed:', err.message);
      setError('Failed to remove order. Please try again.');
    }
  };

  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '/default-book-cover.jpg';
    if (Array.isArray(coverImage)) {
      return coverImage.length > 0 ? `http://localhost:5000/uploads/${coverImage[0]}` : '/default-book-cover.jpg';
    }
    return `http://localhost:5000/uploads/${coverImage}`;
  };

  
  if (loading) return (
    <>
      <UserNav />
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
      <UserFooter />
    </>
  );

  if (error) return (
    <>
      <UserNav />
      <div className="orders-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => { setError(null); setLoading(true); fetchOrders(); }}>Try Again</button>
      </div>
      <UserFooter />
    </>
  );

  if (!orders.length) return (
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
                  <h4>Order #{order.orderNumber || order._id}</h4>
                  <p className="order-date">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date not available'}</p>
                </div>
                <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                </div>
              </div>

              <div className="order-items">
                {order.items?.length > 0 ? order.items.map((item, idx) => (
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
                        <span>₹{item.price || 0} × {item.quantity || 1}</span>
                      </div>
                    </div>
                  </div>
                )) : <p>No items found in this order</p>}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Items ({order.itemCount || order.items?.length || 0}):</span>
                  <span>₹{order.totalAmount || 0}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{order.totalAmount || 0}</span>
                </div>

                <div className="order-actions">
                  {order.status?.toLowerCase() === 'confirmed' && (
                    <button className="cancel-order-btn" onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                  )}
                  {order.status?.toLowerCase() === 'cancelled' && (
                    <button className="remove-order-btn" onClick={() => removeOrder(order._id)}>✕ Remove Order</button>
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

export default Orders;
