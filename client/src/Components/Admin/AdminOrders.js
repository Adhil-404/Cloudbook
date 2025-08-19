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

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            console.log('Fetching orders from API...');
            const response = await axios.get('http://localhost:5000/api/admin/orders');
            console.log('Orders received:', response.data);
            
            // If response is empty, try to get from localStorage for demo
            let ordersData = response.data || [];
            
            if (ordersData.length === 0) {
                // Get orders from global storage for admin visibility
                const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
                ordersData = globalOrders.map(order => ({
                    ...order,
                    customerName: order.customerName || 'Guest User',
                    customerEmail: order.customerEmail || 'guest@example.com'
                }));
            }
            
            setOrders(ordersData);
            setFilteredOrders(ordersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            
            // Fallback to global orders storage for demo
            const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
            const formattedOrders = globalOrders.map(order => ({
                ...order,
                customerName: order.customerName || 'Guest User',
                customerEmail: order.customerEmail || 'guest@example.com'
            }));
            
            setOrders(formattedOrders);
            setFilteredOrders(formattedOrders);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            console.log('Updating order status:', orderId, newStatus);
            
            // Update in global orders for admin visibility
            const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
            const updatedGlobalOrders = globalOrders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            localStorage.setItem('globalOrders', JSON.stringify(updatedGlobalOrders));
            
            // Try to update via API
            try {
                await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, 
                    { status: newStatus }
                );
            } catch (apiError) {
                console.log('API not available, using localStorage only');
            }
            
            console.log('Order status updated successfully');
            fetchOrders(); // Refresh the orders list
            setUpdating(false);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
            setUpdating(false);
        }
    };

    const applyFilters = () => {
        let filtered = orders;

        if (searchTerm.trim()) {
            filtered = filtered.filter(order =>
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            );
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
            totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
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
                                <span className="modal-value amount">₹{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="modal-items">
                            <div className="modal-items-header">
                                Items ({order.itemCount || order.items?.length || 0})
                            </div>
                            <div className="items-container">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="modal-item">
                                        <div className="modal-item-info">
                                            <h4>{item.title}</h4>
                                            <p className="modal-item-quantity">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="modal-item-price">
                                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const stats = getOrderStats();

    if (loading) return (
        <>
            <AdminNav />
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading orders...</p>
            </div>
        </>
    );

    return (
        <>
            <AdminNav />
            <div className="admin-orders-container">
                <div className="admin-orders-header">
                    <h2>Orders Management</h2>
                </div>

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
                                                {order.items?.slice(0, 2).map((item, index) => (
                                                    <span key={index} className="item-summary">
                                                        {item.title} (×{item.quantity})
                                                    </span>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <div className="more-items">
                                                        +{order.items.length - 2} more...
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="item-count">
                                                {order.itemCount || order.items?.length || 0}
                                            </span>
                                        </td>
                                        <td className="amount">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
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