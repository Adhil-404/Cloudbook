import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import '../../Assets/Styles/Adminstyles/AdminUsers.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Fixed API base URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, users]);

    const getAuthHeaders = () => {
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!adminToken) {
            throw new Error('No admin token found. Please login as admin.');
        }
        
        return {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchUsers = async () => {
        console.log('Fetching users from:', `${API_BASE_URL}/users`);
        setLoading(true);
        setError(null);
        
        try {
            const headers = getAuthHeaders();
            console.log('Making request with headers:', headers);
            
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers,
                timeout: 15000
            });
            
            console.log('Users response:', response.data);
            console.log('Users response status:', response.status);
            
            let usersData = Array.isArray(response.data) ? response.data : [];
            
            // Transform users data to ensure consistency
            const transformedUsers = usersData.map(user => ({
                _id: user._id,
                userName: user.userName || 'N/A',
                userEmail: user.userEmail || 'N/A',
                contact: user.contact || 'N/A',
                dob: user.dob,
                gender: user.gender,
                status: user.status || 'active',
                totalOrders: user.totalOrders || 0,
                totalSpent: Number(user.totalSpent) || 0,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLogin: user.lastLogin,
                orders: user.orders || []
            }));
            
            setUsers(transformedUsers);
            setFilteredUsers(transformedUsers);
            console.log(`Successfully loaded ${transformedUsers.length} users`);
            
        } catch (error) {
            console.error('Error fetching users:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (error) => {
        let errorMessage = 'An error occurred while fetching users';
        
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            console.log('API Error Details:', {
                status,
                statusText: error.response.statusText,
                data,
                url: error.config?.url
            });
            
            if (status === 401) {
                errorMessage = 'Admin authentication failed. Please login again.';
                localStorage.removeItem('adminToken');
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 2000);
            } else if (status === 403) {
                errorMessage = 'Access denied. Admin privileges required.';
            } else if (status === 404) {
                errorMessage = 'Users endpoint not found. Please check API configuration.';
            } else if (data?.message) {
                errorMessage = data.message;
            } else {
                errorMessage = `Server error (${status}). Please try again.`;
            }
        } else if (error.request) {
            console.log('Network error:', error.message);
            errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Server may be slow or unavailable.';
        } else {
            errorMessage = error.message || 'Unknown error occurred';
        }
        
        setError(errorMessage);
    };

    const updateUserStatus = async (userId, newStatus) => {
        if (!userId) {
            alert('Invalid user ID');
            return;
        }

        if (!window.confirm(`Are you sure you want to change this user's status to ${newStatus}?`)) {
            return;
        }

        setUpdating(true);
        
        try {
            const headers = getAuthHeaders();
            console.log(`Updating user ${userId} status to ${newStatus}`);
            
            const response = await axios.put(
                `${API_BASE_URL}/users/${userId}/status`, 
                { status: newStatus },
                { headers, timeout: 10000 }
            );
            
            console.log('User status updated:', response.data);
            
            // Update local state
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId ? { ...user, status: newStatus, updatedAt: new Date() } : user
                )
            );
            
            alert('User status updated successfully!');
            
        } catch (error) {
            console.error('Error updating user status:', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Failed to update user status: ${errorMsg}`);
        } finally {
            setUpdating(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!userId) {
            alert('Invalid user ID');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        setUpdating(true);
        
        try {
            const headers = getAuthHeaders();
            console.log(`Deleting user: ${userId}`);
            
            const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, { 
                headers,
                timeout: 10000 
            });
            
            console.log('User deleted successfully:', response.data);
            
            // Remove user from local state
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            alert('User deleted successfully!');
            
        } catch (error) {
            console.error('Error deleting user:', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Failed to delete user: ${errorMsg}`);
        } finally {
            setUpdating(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...users];

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(user => {
                const userName = (user.userName || '').toLowerCase();
                const userEmail = (user.userEmail || '').toLowerCase();
                const contact = (user.contact || '').toString();
                const userId = (user._id || '').toLowerCase();
                
                return userName.includes(searchLower) ||
                       userEmail.includes(searchLower) ||
                       contact.includes(searchTerm.trim()) ||
                       userId.includes(searchLower);
            });
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => {
                const userStatus = user.status || 'active';
                return userStatus === statusFilter;
            });
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const getUserStats = () => {
        const stats = {
            total: users.length,
            active: 0,
            blocked: 0,
            suspended: 0,
            totalOrders: 0,
            totalRevenue: 0
        };

        users.forEach(user => {
            const status = user.status || 'active';
            if (stats.hasOwnProperty(status)) {
                stats[status]++;
            }
            stats.totalOrders += user.totalOrders || 0;
            stats.totalRevenue += user.totalSpent || 0;
        });

        stats.totalRevenue = Math.round(stats.totalRevenue * 100) / 100;
        return stats;
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            active: { color: '#10b981', icon: '✅', label: 'Active' },
            blocked: { color: '#dc2626', icon: '🚫', label: 'Blocked' },
            suspended: { color: '#f59e0b', icon: '⏸️', label: 'Suspended' },
            deleted: { color: '#6b7280', icon: '🗑️', label: 'Deleted' }
        };
        return statusMap[status?.toLowerCase()] || statusMap.active;
    };

    const viewUserDetails = async (user) => {
        if (!user || !user._id) {
            alert('Invalid user data');
            return;
        }

        try {
            const headers = getAuthHeaders();
            console.log(`Fetching details for user: ${user._id}`);
            
            const response = await axios.get(`${API_BASE_URL}/users/${user._id}`, { 
                headers,
                timeout: 10000 
            });
            
            console.log('User details fetched:', response.data);
            setSelectedUser(response.data);
            setShowUserModal(true);
            
        } catch (error) {
            console.error('Error fetching user details:', error);
            // Fallback to existing user data
            setSelectedUser({
                ...user,
                orders: user.orders || []
            });
            setShowUserModal(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const UserModal = ({ user, onClose }) => {
        if (!user) return null;

        return (
            <div className="user-modal-overlay" onClick={onClose}>
                <div className="user-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>User Details</h3>
                        <button onClick={onClose} className="modal-close">×</button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="user-info-grid">
                            <div className="info-item">
                                <label>User ID:</label>
                                <span title={user._id}>{user._id || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Name:</label>
                                <span>{user.userName || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{user.userEmail || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Phone:</label>
                                <span>{user.contact || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Status:</label>
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusInfo(user.status).color }}
                                >
                                    {getStatusInfo(user.status).icon} {getStatusInfo(user.status).label}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Total Orders:</label>
                                <span>{user.totalOrders || 0}</span>
                            </div>
                            <div className="info-item">
                                <label>Total Spent:</label>
                                <span>₹{(user.totalSpent || 0).toFixed(2)}</span>
                            </div>
                            <div className="info-item">
                                <label>Join Date:</label>
                                <span>{formatDate(user.createdAt)}</span>
                            </div>
                        </div>

                        {user.orders && user.orders.length > 0 && (
                            <div className="orders-section">
                                <h4>Recent Orders ({user.orders.length})</h4>
                                <div className="orders-list">
                                    {user.orders.slice(0, 5).map((order, index) => (
                                        <div key={order._id || `order-${index}`} className="order-item">
                                            <div className="order-info">
                                                <strong>{order.orderNumber || `Order ${index + 1}`}</strong>
                                                <span>{formatDate(order.orderDate || order.createdAt)}</span>
                                                <span className="order-status">{order.status || 'N/A'}</span>
                                            </div>
                                            <div className="order-amount">
                                                ₹{(order.totalAmount || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const stats = getUserStats();

    // Loading state
    if (loading && users.length === 0) {
        return (
            <>
                <AdminNav />
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                        API URL: {API_BASE_URL}/users
                    </p>
                </div>
            </>
        );
    }

    // Error state
    if (error && users.length === 0) {
        return (
            <>
                <AdminNav />
                <div className="admin-error">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Users</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchUsers} className="retry-button" disabled={loading}>
                            {loading ? 'Retrying...' : 'Retry'}
                        </button>
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                        <p>Debug Info:</p>
                        <p>API URL: {API_BASE_URL}/users</p>
                        <p>Token: {localStorage.getItem('adminToken') ? 'Present' : 'Missing'}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNav />
            <div className="admin-users-container">
                <div className="admin-users-header">
                    <h2>Users Management</h2>
                    <div className="header-actions">
                        <button
                            onClick={fetchUsers}
                            className="refresh-button"
                            disabled={loading || updating}
                        >
                            {loading ? '⏳ Loading...' : '🔄 Refresh'}
                        </button>
                    </div>
                </div>

                {/* Error banner for partial failures */}
                {error && users.length > 0 && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                    </div>
                    <div className="stat-card active">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.active}</div>
                            <div className="stat-label">Active</div>
                        </div>
                    </div>
                    <div className="stat-card blocked">
                        <div className="stat-icon">🚫</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.blocked}</div>
                            <div className="stat-label">Blocked</div>
                        </div>
                    </div>
                    <div className="stat-card revenue">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                            <div className="stat-label">Total Revenue</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="users-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or ID..."
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
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                        <option value="suspended">Suspended</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </div>

                {/* Users Table */}
                {filteredUsers.length === 0 ? (
                    <div className="no-users">
                        <div className="empty-icon">👥</div>
                        <h3>No users found</h3>
                        <p>
                            {searchTerm || statusFilter !== 'all'
                                ? 'No users match your current filters.'
                                : 'Users will appear here once they register.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="clear-filters-button"
                            >
                                Clear Filters
                            </button>
                        )}
                        {error && (
                            <button onClick={fetchUsers} className="retry-button">
                                Retry Loading Users
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Orders</th>
                                        <th>Spent</th>
                                        <th>Join Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <tr key={user._id || `user-${Date.now()}-${Math.random()}`}>
                                            <td className="user-id" title={user._id}>
                                                {user._id ? user._id.slice(-8) : 'N/A'}
                                            </td>
                                            <td className="user-name">{user.userName || 'N/A'}</td>
                                            <td className="user-email">{user.userEmail || 'N/A'}</td>
                                            <td className="user-phone">{user.contact || 'N/A'}</td>
                                            <td>
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusInfo(user.status).color }}
                                                >
                                                    {getStatusInfo(user.status).icon} {getStatusInfo(user.status).label}
                                                </span>
                                            </td>
                                            <td className="order-count">{user.totalOrders || 0}</td>
                                            <td className="amount">₹{(user.totalSpent || 0).toFixed(2)}</td>
                                            <td className="join-date">{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => viewUserDetails(user)}
                                                        className="action-button view-button"
                                                        title="View Details"
                                                        disabled={loading}
                                                    >
                                                        👁️
                                                    </button>
                                                    <select 
                                                        value={user.status || 'active'}
                                                        onChange={(e) => updateUserStatus(user._id, e.target.value)}
                                                        className="status-select"
                                                        disabled={updating || !user._id}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="blocked">Blocked</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                    <button
                                                        className="action-button delete-button"
                                                        onClick={() => deleteUser(user._id)}
                                                        disabled={updating || !user._id}
                                                        title="Delete User"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    Previous
                                </button>
                                
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages} 
                                    ({filteredUsers.length} users)
                                </span>
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Results Summary */}
                {filteredUsers.length > 0 && (
                    <div className="results-summary">
                        Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                        {users.length !== filteredUsers.length && (
                            <span> (filtered from {users.length} total)</span>
                        )}
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

            {/* User Details Modal */}
            {showUserModal && (
                <UserModal 
                    user={selectedUser} 
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                    }} 
                />
            )}
        </>
    );
}

export default AdminUsers;