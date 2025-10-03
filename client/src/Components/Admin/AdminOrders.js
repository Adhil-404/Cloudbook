import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import "../../Assets/Styles/Adminstyles/AdminOrders.css";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [updating, setUpdating] = useState(false);

  

    const [deleting, setDeleting] = useState(null);

    // Fixed API base URL - use the correct endpoint
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, orders]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) {
            throw new Error('No admin token found');
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching orders from:', `${API_BASE_URL}/orders`);
            const headers = getAuthHeaders();
            
            // Try the corrected endpoint first
            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: headers
            });

            console.log('Orders response:', response.data);
            
            let ordersData = Array.isArray(response.data) ? response.data : [];
            
            // If no orders from /api/orders, try the admin specific endpoint
            if (ordersData.length === 0) {
                try {
                    const adminResponse = await axios.get(`${API_BASE_URL}/admin/orders`, {
                        headers: headers
                    });
                    ordersData = Array.isArray(adminResponse.data) ? adminResponse.data : [];
                    console.log('Admin orders response:', adminResponse.data);
                } catch (adminError) {
                    console.log('Admin orders endpoint not available:', adminError.message);
                }
            }
            
            // Transform data to ensure consistency
            const transformedOrders = ordersData.map(order => ({
                _id: order._id,
                orderNumber: order.orderNumber || `ORD-${order._id?.toString().slice(-6) || 'Unknown'}`,
                customerName: order.customerName || order.userId?.userName || 'Guest User',
                customerEmail: order.customerEmail || order.userId?.userEmail || 'N/A',
                items: Array.isArray(order.items) ? order.items : [],
                itemCount: order.itemCount || order.items?.length || 0,
                totalAmount: Number(order.totalAmount) || 0,
                status: order.status || 'pending',
                orderDate: order.orderDate || order.createdAt || new Date(),
                paymentMethod: order.paymentMethod || 'N/A'
            }));
            
            setOrders(transformedOrders);
            setFilteredOrders(transformedOrders);
            console.log(`Successfully loaded ${transformedOrders.length} orders`);
        } catch (error) {
            console.error('Error fetching orders:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch orders';
            setError(errorMsg);
            
            // Don't show error if it's just that there are no orders
            if (error.response?.status !== 404) {
                setOrders([]);
                setFilteredOrders([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!orderId) {
            alert('Invalid order ID');
            return;
        }

        setUpdating(true);
        try {
            console.log('Updating order status:', orderId, newStatus);
            const headers = getAuthHeaders();
            
            // Update local state optimistically
            const updatedOrders = orders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            
            // Try to update via API - try both endpoints
            try {
                await axios.put(`${API_BASE_URL}/orders/${orderId}`, 
                    { status: newStatus },
                    { headers }
                );
                console.log('Order status updated successfully via /api/orders');
            } catch (apiError) {
                try {
                    await axios.put(`${API_BASE_URL}/admin/orders/${orderId}`, 
                        { status: newStatus },
                        { headers }
                    );
                    console.log('Order status updated successfully via /api/admin/orders');
                } catch (adminError) {
                    console.log('Both API endpoints failed, keeping local update');
                }
            }
            
        } catch (error) {
            console.error('Error updating order status:', error);
            // Revert local changes on error
            fetchOrders();
            alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
        }
    };

    const deleteOrder = async (orderId) => {
        if (!orderId) {
            alert('Invalid order ID');
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to permanently delete this order? This action cannot be undone.'
        );
        
        if (!confirmed) return;

        setDeleting(orderId);
        try {
            console.log('Deleting order:', orderId);
            const headers = getAuthHeaders();
            
            // Remove from local state optimistically
            const updatedOrders = orders.filter(order => order._id !== orderId);
            setOrders(updatedOrders);
            setFilteredOrders(filteredOrders.filter(order => order._id !== orderId));
            
            // Try to delete via API
            try {
                await axios.delete(`${API_BASE_URL}/orders/${orderId}`, { headers });
                console.log('Order deleted successfully via /api/orders');
            } catch (apiError) {
                try {
                    await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`, { headers });
                    console.log('Order deleted successfully via /api/admin/orders');
                } catch (adminError) {
                    console.log('Both delete endpoints failed, keeping local deletion');
                }
            }
            
            alert('Order deleted successfully');
            
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order: ' + (error.response?.data?.message || error.message));
            // Restore the order if deletion failed
            fetchOrders();
        } finally {
            setDeleting(null);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order => {
                const orderNumber = (order.orderNumber || '').toLowerCase();
                const customerName = (order.customerName || '').toLowerCase();
                const customerEmail = (order.customerEmail || '').toLowerCase();
                
                return orderNumber.includes(searchLower) ||
                       customerName.includes(searchLower) ||
                       customerEmail.includes(searchLower);
            });
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { color: '#f59e0b', icon: '🕐', label: 'Pending' },
            confirmed: { color: '#06b6d4', icon: '📦', label: 'Confirmed' },
            shipped: { color: '#3b82f6', icon: '🚚', label: 'Shipped' },
            delivered: { color: '#10b981', icon: '🏆', label: 'Delivered' },
            cancelled: { color: '#dc2626', icon: '❌', label: 'Cancelled' }
        };
        return statusMap[status?.toLowerCase()] || statusMap.pending;
    };

    const getOrderStats = () => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            totalRevenue: orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0)
        };
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setSelectedOrder(null);
    };

    const OrderModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="order-modal-overlay" onClick={onClose}>
                <div className="order-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">Order Details</h3>
                        <button onClick={onClose} className="modal-close">×</button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="modal-grid">
                            <div className="modal-field">
                                <span className="modal-label">Order Number:</span>
                                <span className="modal-value">{order.orderNumber}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Status:</span>
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusInfo(order.status).color }}
                                >
                                    {getStatusInfo(order.status).icon} {getStatusInfo(order.status).label}
                                </span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Customer:</span>
                                <span className="modal-value">{order.customerName}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Email:</span>
                                <span className="modal-value email">{order.customerEmail}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Order Date:</span>
                                <span className="modal-value">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Total Amount:</span>
                                <span className="modal-value amount">₹{(Number(order.totalAmount) || 0).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="modal-items">
                            <div className="modal-items-header">
                                Items ({order.itemCount || 0})
                            </div>
                            <div className="items-container">
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div key={index} className="modal-item">
                                            <div className="modal-item-info">
                                                <h4>{item.title || 'Unknown Item'}</h4>
                                                <p className="modal-item-quantity">Quantity: {item.quantity || 1}</p>
                                            </div>
                                            <div className="modal-item-price">
                                                ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="modal-item">
                                        <div className="modal-item-info">
                                            <h4>No items found</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => {
                                    deleteOrder(order._id);
                                    onClose();
                                }}
                                className="delete-order-btn-modal"
                                disabled={deleting === order._id}
                            >
                                {deleting === order._id ? '🗑️ Deleting...' : '🗑️ Delete Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <>
                <AdminNav />
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading orders...</p>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                        Trying: {API_BASE_URL}/orders
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNav />
            <div className="admin-orders-container">
                <div className="admin-orders-header">
                    <h2>Orders Management</h2>
                </div>

                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon">📊</div>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-card-header">
                            <div className="stat-icon">🕐</div>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon">🚚</div>
                            <span className="stat-label">Shipped</span>
                        </div>
                        <div className="stat-value">{stats.shipped}</div>
                    </div>
                    <div className="stat-card delivered">
                        <div className="stat-card-header">
                            <div className="stat-icon">🏆</div>
                            <span className="stat-label">Delivered</span>
                        </div>
                        <div className="stat-value">{stats.delivered}</div>
                    </div>
                    <div className="stat-card revenue">
                        <div className="stat-card-header">
                            <div className="stat-icon">💰</div>
                            <span className="stat-label">Revenue</span>
                        </div>
                        <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                <div className="orders-controls">
                    <div className="search-container">
                        <div className="search-icon">🔍</div>
                        <input
                            type="text"
                            placeholder="Search orders by number, customer name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                        onClick={fetchOrders} 
                        className="refresh-button"
                        disabled={loading || updating}
                    >
                        <span className={`refresh-icon ${loading || updating ? 'spinning' : ''}`}>🔄</span>
                        Refresh
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="no-orders">
                        <div className="empty-icon">📦</div>
                        <h3>No orders found</h3>
                        <p>
                            {searchTerm || statusFilter !== 'all' 
                                ? 'No orders match your current filters.' 
                                : 'Orders will appear here once customers start placing them.'
                            }
                        </p>
                        {error && (
                            <button onClick={fetchOrders} className="retry-button">
                                Retry Loading Orders
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Count</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="order-number">{order.orderNumber}</td>
                                        <td>
                                            <div className="customer-info">
                                                <div className="customer-name">{order.customerName || 'N/A'}</div>
                                                <div className="customer-email">{order.customerEmail || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="items-list">
                                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                                    <>
                                                        {order.items.slice(0, 2).map((item, index) => (
                                                            <span key={index} className="item-summary">
                                                                {item.title || 'Unknown'} (×{item.quantity || 1})
                                                            </span>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <div className="more-items">
                                                                +{order.items.length - 2} more...
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="item-summary">No items</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="item-count">
                                                {order.itemCount || 0}
                                            </span>
                                        </td>
                                        <td className="amount">₹{(Number(order.totalAmount) || 0).toFixed(2)}</td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusInfo(order.status).color }}
                                            >
                                                {getStatusInfo(order.status).icon} {getStatusInfo(order.status).label}
                                            </span>
                                        </td>
                                        <td className="order-date">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => viewOrderDetails(order)}
                                                    className="action-button view-button"
                                                    title="View Details"
                                                >
                                                    <span className="action-icon">👁️</span>
                                                </button>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="status-select"
                                                    disabled={updating}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button 
                                                    onClick={() => deleteOrder(order._id)}
                                                    className="action-button delete-button"
                                                    title="Delete Order"
                                                    disabled={deleting === order._id}
                                                >
                                                    <span className="action-icon">
                                                        {deleting === order._id ? '⏳' : '🗑️'}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredOrders.length > 0 && (
                    <div className="results-summary">
                        Showing {filteredOrders.length} of {orders.length} orders
                        {(searchTerm || statusFilter !== 'all') && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="clear-filters"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showOrderModal && (
                <OrderModal order={selectedOrder} onClose={closeOrderModal} />
            )}
        </>
    );
}

export default AdminOrders;