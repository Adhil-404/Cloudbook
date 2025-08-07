import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import "../../Assets/Styles/Userstyles/UserOrders.css";

// OrderManager utility
const OrderManager = {
  saveOrderGlobally: (order) => {
    try {
      const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
      const existingIndex = globalOrders.findIndex(o => o._id === order._id);
      
      if (existingIndex >= 0) {
        globalOrders[existingIndex] = order;
      } else {
        globalOrders.unshift(order);
      }
      
      localStorage.setItem('globalOrders', JSON.stringify(globalOrders));
    } catch (error) {
      console.error('Error saving order globally:', error);
    }
  },

  saveOrderForUser: (order) => {
    try {
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const existingIndex = userOrders.findIndex(o => o._id === order._id);
      
      if (existingIndex >= 0) {
        userOrders[existingIndex] = order;
      } else {
        userOrders.unshift(order);
      }
      
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
    } catch (error) {
      console.error('Error saving user order:', error);
    }
  },

  updateOrderStatus: (orderId, newStatus) => {
    try {
      const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
      const globalUpdated = globalOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('globalOrders', JSON.stringify(globalUpdated));

      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const userUpdated = userOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('userOrders', JSON.stringify(userUpdated));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.orderSuccess) {
      handlePaymentSuccess();
    } else {
      fetchOrders();
    }
  }, [location]);

  const handlePaymentSuccess = async () => {
    try {
      const { orderId, orderData, paymentMethod } = location.state;
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const orderExists = existingOrders.find(order => order._id === orderId);
      
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = userInfo.name || userInfo.username || 'Guest User';
      const userEmail = userInfo.email || 'guest@example.com';
      
      if (!orderExists) {
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
          paymentMethod: paymentMethod,
          customerName: userName,
          customerEmail: userEmail,
          userId: userInfo._id || null
        };

        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        
        // Save to global orders for admin visibility
        OrderManager.saveOrderGlobally(newOrder);
        OrderManager.saveOrderForUser(newOrder);
        
        // Try to save to backend as well
        try {
          const token = localStorage.getItem('token') || 
                       localStorage.getItem('authToken') || 
                       localStorage.getItem('userToken') || 
                       sessionStorage.getItem('token');
          
          if (token) {
            await axios.post('http://localhost:5000/api/orders', newOrder, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          }
        } catch (backendError) {
          console.log('Backend not available, order saved locally only');
        }
        
        setOrders(updatedOrders);
      } else {
        setOrders(existingOrders);
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Error handling payment success:', error);
      fetchOrders(); 
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('userToken') || 
                   sessionStorage.getItem('token');
      
      if (!token) {
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        setOrders(localOrders);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Orders response:', response.data);
        setOrders(response.data || []);
        setLoading(false);
      } catch (backendError) {
        console.log('Backend not available, using local storage');
        
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        setOrders(localOrders);
        setLoading(false);
      }

    } catch (error) {
      console.error('Order fetch error:', error);

      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      setOrders(localOrders);
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');

      const updatedOrders = existingOrders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      );
      
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      // Update in global orders as well
      OrderManager.updateOrderStatus(orderId, 'cancelled');
    
      setOrders(updatedOrders);
      
      // Try to update backend as well
      try {
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('userToken') || 
                     sessionStorage.getItem('token');
        
        if (token) {
          await axios.put(`http://localhost:5000/api/orders/${orderId}`, 
            { status: 'cancelled' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      } catch (backendError) {
        console.log('Backend not available, order cancelled locally only');
      }
      
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const removeOrder = (orderId) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');

      const updatedOrders = existingOrders.filter(order => order._id !== orderId);

      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      setOrders(updatedOrders);
      
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#6c757d';
    
    switch (status.toLowerCase()) {
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
      return coverImage.length > 0 ? 
        `http://localhost:5000/uploads/${coverImage[0]}` : 
        '/default-book-cover.jpg';
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
          <button onClick={fetchOrders} className="retry-button">
            Try Again
          </button>
        </div>
        <UserFooter />
      </>
    );
  }

  if (!orders || orders.length === 0) {
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
                  <h4>Order #{order.orderNumber || order._id}</h4>
                  <p className="order-date">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date not available'}
                  </p>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status ? 
                    order.status.charAt(0).toUpperCase() + order.status.slice(1) : 
                    'Unknown'
                  }
                </div>
              </div>

              <div className="order-items">
                {order.items && order.items.length > 0 ? 
                  order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <img
                          src={getImageUrl(item.coverImage)}
                          alt={item.title || 'Book cover'}
                          onError={(e) => {
                            e.target.src = '/default-book-cover.jpg';
                          }}
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
                  )) : 
                  <p>No items found in this order</p>
                }
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
                  {order.status && order.status.toLowerCase() === 'confirmed' && (
                    <button 
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(order._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        marginRight: '10px',
                        fontSize: '14px'
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.status && order.status.toLowerCase() === 'cancelled' && (
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

export default Orders;