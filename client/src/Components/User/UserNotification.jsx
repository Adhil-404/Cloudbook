import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNav from './Usernav';
import  '../../Assets/Styles/Userstyles/UserNotification.css' ;

function UserNotification() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMarkAllRead, setShowMarkAllRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeFilter, searchTerm]);

  const fetchNotifications = async () => {
    try {
      // Mock notifications data - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #ORD-2024-001 has been confirmed and is being processed.',
          timestamp: '2024-01-20T10:30:00Z',
          read: false,
          priority: 'high',
          icon: 'bi-bag-check-fill',
          color: '#28a745'
        },
        {
          id: 2,
          type: 'shipping',
          title: 'Order Shipped',
          message: 'Your order #ORD-2024-001 has been shipped and is on its way to you. Track your package.',
          timestamp: '2024-01-19T14:22:00Z',
          read: false,
          priority: 'medium',
          icon: 'bi-truck',
          color: '#007bff'
        },
        {
          id: 3,
          type: 'promotion',
          title: 'Special Offer - 30% Off',
          message: 'Limited time offer! Get 30% off on all fantasy books. Use code FANTASY30.',
          timestamp: '2024-01-18T09:15:00Z',
          read: true,
          priority: 'low',
          icon: 'bi-gift-fill',
          color: '#ffc107'
        },
        {
          id: 4,
          type: 'payment',
          title: 'Payment Successful',
          message: 'Payment of $45.99 for order #ORD-2024-001 has been processed successfully.',
          timestamp: '2024-01-17T16:45:00Z',
          read: true,
          priority: 'high',
          icon: 'bi-credit-card-fill',
          color: '#28a745'
        },
        {
          id: 5,
          type: 'review',
          title: 'Review Reminder',
          message: 'How was your recent purchase? Please take a moment to review "The Great Gatsby".',
          timestamp: '2024-01-16T11:20:00Z',
          read: false,
          priority: 'low',
          icon: 'bi-star-fill',
          color: '#fd7e14'
        },
        {
          id: 6,
          type: 'wishlist',
          title: 'Price Drop Alert',
          message: 'Good news! "1984 by George Orwell" from your wishlist is now 25% off.',
          timestamp: '2024-01-15T13:30:00Z',
          read: true,
          priority: 'medium',
          icon: 'bi-heart-fill',
          color: '#e83e8c'
        },
        {
          id: 7,
          type: 'account',
          title: 'Security Alert',
          message: 'Your password was changed successfully. If this wasn\'t you, please contact support.',
          timestamp: '2024-01-14T08:10:00Z',
          read: false,
          priority: 'high',
          icon: 'bi-shield-fill-check',
          color: '#dc3545'
        },
        {
          id: 8,
          type: 'system',
          title: 'Welcome to CloudBook!',
          message: 'Thank you for joining CloudBook. Explore our vast collection of books and enjoy reading!',
          timestamp: '2024-01-10T12:00:00Z',
          read: true,
          priority: 'low',
          icon: 'bi-check-circle-fill',
          color: '#6f42c1'
        }
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by type
    if (activeFilter !== 'all') {
      if (activeFilter === 'unread') {
        filtered = filtered.filter(notification => !notification.read);
      } else if (activeFilter === 'read') {
        filtered = filtered.filter(notification => notification.read);
      } else {
        filtered = filtered.filter(notification => notification.type === activeFilter);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
    setShowMarkAllRead(filtered.some(notification => !notification.read));
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (notificationId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this notification?');
    if (confirmDelete) {
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    }
  };

  const clearAllNotifications = () => {
    const confirmClear = window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.');
    if (confirmClear) {
      setNotifications([]);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return notificationDate.toLocaleDateString();
      }
    }
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      order: '#28a745',
      shipping: '#007bff',
      payment: '#28a745',
      promotion: '#ffc107',
      review: '#fd7e14',
      wishlist: '#e83e8c',
      account: '#dc3545',
      system: '#6f42c1'
    };
    return colors[type] || '#6c757d';
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  if (loading) {
    return (
      <div>
        <UserNav />
        <div className="notifications-container">
          <div className="loading-spinner">
            <i className="bi bi-hourglass-split"></i>
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="header-content">
            <h1>
              <i className="bi bi-bell-fill"></i>
              Notifications
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </h1>
            <p>Stay updated with your orders, promotions, and account activities</p>
          </div>
          <div className="header-actions">
            {showMarkAllRead && (
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                <i className="bi bi-check-all"></i>
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllNotifications}>
                <i className="bi bi-trash-fill"></i>
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="notifications-controls">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-tab ${activeFilter === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-tab ${activeFilter === 'order' ? 'active' : ''}`}
              onClick={() => setActiveFilter('order')}
            >
              Orders
            </button>
            <button
              className={`filter-tab ${activeFilter === 'promotion' ? 'active' : ''}`}
              onClick={() => setActiveFilter('promotion')}
            >
              Promotions
            </button>
            <button
              className={`filter-tab ${activeFilter === 'account' ? 'active' : ''}`}
              onClick={() => setActiveFilter('account')}
            >
              Account
            </button>
          </div>
        </div>

        <div className="notifications-content">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <i className="bi bi-bell-slash"></i>
              <h3>No notifications found</h3>
              <p>
                {searchTerm
                  ? 'No notifications match your search criteria.'
                  : activeFilter === 'unread'
                  ? 'All caught up! You have no unread notifications.'
                  : 'You don\'t have any notifications yet.'}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} priority-${notification.priority}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-icon" style={{ color: notification.color }}>
                    <i className={notification.icon}></i>
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && <span className="unread-dot"></span>}
                      </div>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-footer">
                      <span className={`notification-type ${notification.type}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      <span className={`priority-badge ${notification.priority}`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Mark as read"
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserNotification;