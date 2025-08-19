import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import "../../Assets/Styles/Adminstyles/AdminUsers.css";

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

    useEffect(() => {
        console.log('AdminUsers component mounted');
        checkAdminAuth();
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, users]);

    const checkAdminAuth = () => {
        const adminToken = localStorage.getItem('adminToken');
        console.log('🔍 Checking admin auth...');
        console.log('Admin token check:', adminToken ? 'Token exists' : 'No token found');
        
        if (adminToken) {
            console.log('Token preview:', adminToken.substring(0, 20) + '...');
            try {
                // Decode token to check expiry (optional)
                const tokenPayload = JSON.parse(atob(adminToken.split('.')[1]));
                console.log('Token payload:', tokenPayload);
                if (tokenPayload.exp * 1000 < Date.now()) {
                    console.log('❌ Token expired');
                    localStorage.removeItem('adminToken');
                    return false;
                }
            } catch (e) {
                console.log('❌ Invalid token format');
                localStorage.removeItem('adminToken');
                return false;
            }
        } else {
            console.log('❌ No admin token found');
            return false;
        }
        
        console.log('✅ Admin token valid');
        return true;
    };

    const getAuthHeaders = () => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            throw new Error('No admin token found');
        }
        
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        };
        
        console.log('🔧 Request headers prepared:', {
            'Authorization': `Bearer ${adminToken.substring(0, 20)}...`,
            'Content-Type': 'application/json'
        });
        
        return headers;
    };

    const fetchUsers = async () => {
        console.log('🚀 Starting fetchUsers...');
        setLoading(true);
        setError(null);
        
        try {
            console.log('📡 Fetching users from API...');
            
            // Check if we have admin token first
            if (!checkAdminAuth()) {
                setError('Admin authentication required. Please login as admin first.');
                setLoading(false);
                return;
            }
            
            const headers = getAuthHeaders();
            console.log('🌐 Making request to: http://localhost:5000/api/users');
            
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: headers,
                timeout: 10000 // 10 second timeout
            });
            
            console.log('✅ Users response received:', {
                status: response.status,
                dataType: typeof response.data,
                userCount: response.data?.length || 0
            });
            console.log('👥 Users data:', response.data);
            
            let usersData = response.data || [];
            
            if (usersData.length === 0) {
                console.log('⚠️ No users from API, checking localStorage...');
                const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
                usersData = globalUsers.map(user => ({
                    ...user,
                    status: user.status || 'active',
                    totalOrders: user.totalOrders || 0,
                    totalSpent: user.totalSpent || 0,
                    orders: user.orders || []
                }));
                console.log('📦 Users from localStorage:', usersData.length);
            }
            
            setUsers(usersData);
            setFilteredUsers(usersData);
            setLoading(false);
            console.log('✅ Users loaded successfully');
            
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
            
            let errorMessage = 'Failed to fetch users';
            
            if (error.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login as admin again.';
                console.log('🔑 Removing invalid admin token');
                localStorage.removeItem('adminToken');
            } else if (error.response?.status === 403) {
                errorMessage = 'Access denied. Admin privileges required.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message.includes('Network Error')) {
                errorMessage = 'Server connection failed. Please check if backend is running on http://localhost:5000';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timeout. Server may be slow or unavailable.';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Connection refused. Make sure your backend server is running on port 5000.';
            }
            
            setError(errorMessage);
            
            // Fallback to localStorage
            console.log('🔄 Falling back to localStorage...');
            try {
                const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
                const formattedUsers = globalUsers.map(user => ({
                    ...user,
                    status: user.status || 'active',
                    totalOrders: user.totalOrders || 0,
                    totalSpent: user.totalSpent || 0,
                    orders: user.orders || []
                }));
                
                setUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
                console.log('📦 Fallback successful, loaded from localStorage');
            } catch (localStorageError) {
                console.error('❌ localStorage fallback failed:', localStorageError);
            }
            
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        console.log('🔄 Toggling user status:', userId, currentStatus);
        setUpdating(true);
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            console.log('➡️ New status:', newStatus);
            
            // Update localStorage first
            const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
            const updatedGlobalUsers = globalUsers.map(user => 
                user._id === userId ? { ...user, status: newStatus } : user
            );
            localStorage.setItem('globalUsers', JSON.stringify(updatedGlobalUsers));
            
            // Try to update via API
            try {
                const headers = getAuthHeaders();
                const response = await axios.put(`http://localhost:5000/api/users/${userId}`,
                    { status: newStatus },
                    { headers: headers }
                );
                console.log('✅ User status updated successfully via API:', response.data);
            } catch (apiError) {
                console.log('⚠️ API update failed, using localStorage only:', apiError.message);
            }
            
            fetchUsers();
            setUpdating(false);
        } catch (error) {
            console.error('❌ Error updating user status:', error);
            alert('Failed to update user status: ' + (error.response?.data?.message || error.message));
            setUpdating(false);
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            console.log('🗑️ Deleting user:', userId);
            setUpdating(true);
            try {
                // Update localStorage first
                const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
                const updatedGlobalUsers = globalUsers.filter(user => user._id !== userId);
                localStorage.setItem('globalUsers', JSON.stringify(updatedGlobalUsers));
                
                // Try to delete via API
                try {
                    const headers = getAuthHeaders();
                    const response = await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                        headers: headers
                    });
                    console.log('✅ User deleted successfully via API:', response.data);
                } catch (apiError) {
                    console.log('⚠️ API deletion failed, using localStorage only:', apiError.message);
                }
                
                fetchUsers();
                setUpdating(false);
            } catch (error) {
                console.error('❌ Error deleting user:', error);
                alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
                setUpdating(false);
            }
        }
    };

    const adminLogin = async () => {
        console.log('🔑 Attempting admin login...');
        try {
            const loginData = {
                email: 'admin@bookstore.com',
                password: 'admin123'
            };
            
            console.log('📡 Making login request to: http://localhost:5000/api/admin/login');
            const response = await axios.post('http://localhost:5000/api/admin/login', loginData, {
                timeout: 10000
            });
            
            console.log('✅ Login response:', response.data);
            
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                console.log('🔐 Admin token stored successfully');
                setError(null);
                fetchUsers();
            } else {
                console.error('❌ No token in response');
                setError('Login successful but no token received');
            }
        } catch (error) {
            console.error('❌ Admin login failed:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            let errorMessage = 'Admin login failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message.includes('Network Error')) {
                errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:5000';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Login request timeout. Server may be slow.';
            }
            
            setError(errorMessage);
        }
    };

    const applyFilters = () => {
        let filtered = users;

        if (searchTerm.trim()) {
            filtered = filtered.filter(user =>
                user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.contact?.toString().includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => (user.status || 'active') === statusFilter);
        }

        setFilteredUsers(filtered);
    };

    const getUserStats = () => {
        return {
            total: users.length,
            active: users.filter(u => (u.status || 'active') === 'active').length,
            blocked: users.filter(u => (u.status || 'active') === 'blocked').length,
            totalOrders: users.reduce((sum, user) => sum + (user.totalOrders || 0), 0),
            totalRevenue: users.reduce((sum, user) => sum + (user.totalSpent || 0), 0)
        };
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            active: { color: '#10b981', icon: '✅', label: 'Active' },
            blocked: { color: '#dc2626', icon: '🚫', label: 'Blocked' }
        };
        return statusMap[status?.toLowerCase()] || statusMap.active;
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const testConnection = async () => {
        console.log('🧪 Testing API connection...');
        try {
            const response = await axios.get('http://localhost:5000/api/test', { timeout: 5000 });
            console.log('✅ API test successful:', response.data);
            alert('API connection successful!');
        } catch (error) {
            console.error('❌ API test failed:', error);
            alert('API connection failed: ' + error.message);
        }
    };

    const UserModal = ({ user, onClose }) => {
        if (!user) return null;

        return (
            <div className="user-modal-overlay" onClick={onClose}>
                <div className="user-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">User Details</h3>
                        <button onClick={onClose} className="modal-close">×</button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="modal-grid">
                            <div className="modal-field">
                                <span className="modal-label">User ID:</span>
                                <span className="modal-value">{user._id}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Name:</span>
                                <span className="modal-value">{user.userName || 'N/A'}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Email:</span>
                                <span className="modal-value email">{user.userEmail}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Phone:</span>
                                <span className="modal-value">{user.contact || 'N/A'}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Status:</span>
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusInfo(user.status).color }}
                                >
                                    {getStatusInfo(user.status).icon} {getStatusInfo(user.status).label}
                                </span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Total Orders:</span>
                                <span className="modal-value">{user.totalOrders || 0}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Total Spent:</span>
                                <span className="modal-value amount">₹{(user.totalSpent || 0).toFixed(2)}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Join Date:</span>
                                <span className="modal-value">{new Date(user.createdAt || user.joinDate).toLocaleDateString()}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Last Login:</span>
                                <span className="modal-value">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>

                        {user.orders && user.orders.length > 0 && (
                            <div className="modal-items">
                                <div className="modal-items-header">Recent Orders ({user.orders.length})</div>
                                <div className="items-container">
                                    {user.orders.slice(0, 5).map((order, index) => (
                                        <div key={order._id || index} className="modal-item">
                                            <div className="modal-item-info">
                                                <h4>Order #{order.orderNumber || `ORD-${order._id?.slice(-6) || index}`}</h4>
                                                <p className="modal-item-quantity">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="modal-item-price">
                                                ₹{(order.totalAmount || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                    {user.orders.length > 5 && (
                                        <p className="orders-note">Showing 5 of {user.orders.length} orders</p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {(!user.orders || user.orders.length === 0) && (
                            <div className="no-orders">
                                <p>No orders found for this user.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const stats = getUserStats();

    if (loading) return (
        <>
            <AdminNav />
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading users...</p>
            </div>
        </>
    );

    if (error) return (
        <>
            <AdminNav />
            <div className="admin-error">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Users</h3>
                <p>{error}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={fetchUsers} className="retry-button">Retry</button>
                    <button onClick={testConnection} className="retry-button" style={{ background: '#3b82f6' }}>
                        Test Connection
                    </button>
                    <button onClick={adminLogin} className="retry-button" style={{ background: '#10b981' }}>
                        Login as Admin
                    </button>
                </div>
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '14px', textAlign: 'left' }}>
                    <strong>Debug Info:</strong>
                    <br />Admin Token: {localStorage.getItem('adminToken') ? 'Present' : 'Missing'}
                    <br />Backend URL: http://localhost:5000/api/users
                    <br />Server Status: Click "Test Connection" to check
                    <br />Timestamp: {new Date().toLocaleString()}
                    <br />Check browser console for detailed logs
                </div>
            </div>
        </>
    );

    return (
        <>
            <AdminNav />
            <div className="admin-users-container">
                <div className="admin-users-header">
                    <h2>Users Management</h2>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon">👥</div>
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card active">
                        <div className="stat-card-header">
                            <div className="stat-icon">✅</div>
                            <span className="stat-label">Active</span>
                        </div>
                        <div className="stat-value">{stats.active}</div>
                    </div>
                    <div className="stat-card blocked">
                        <div className="stat-card-header">
                            <div className="stat-icon">🚫</div>
                            <span className="stat-label">Blocked</span>
                        </div>
                        <div className="stat-value">{stats.blocked}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon">📦</div>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="stat-value">{stats.totalOrders}</div>
                    </div>
                    <div className="stat-card revenue">
                        <div className="stat-card-header">
                            <div className="stat-icon">💰</div>
                            <span className="stat-label">Revenue</span>
                        </div>
                        <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                <div className="users-controls">
                    <div className="search-container">
                        <div className="search-icon">🔍</div>
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
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
                    </select>
                    <button
                        onClick={fetchUsers}
                        className="refresh-button"
                        disabled={loading || updating}
                    >
                        <span className={`refresh-icon ${loading || updating ? 'spinning' : ''}`}>🔄</span>
                        Refresh
                    </button>
                </div>

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
                    </div>
                ) : (
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
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td className="user-id">{user._id?.slice(-8) || 'N/A'}</td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-name">{user.userName || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="user-email">{user.userEmail}</td>
                                        <td className="user-phone">{user.contact || 'N/A'}</td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusInfo(user.status).color }}
                                            >
                                                {getStatusInfo(user.status).icon} {getStatusInfo(user.status).label}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="order-count">
                                                {user.totalOrders || 0}
                                            </span>
                                        </td>
                                        <td className="amount">₹{(user.totalSpent || 0).toFixed(2)}</td>
                                        <td className="join-date">
                                            {new Date(user.createdAt || user.joinDate).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => viewUserDetails(user)}
                                                    className="action-button view-button"
                                                    title="View Details"
                                                >
                                                    <span className="action-icon">👁️</span>
                                                </button>
                                                <select 
                                                    value={user.status || 'active'}
                                                    onChange={(e) => toggleUserStatus(user._id, e.target.value)}
                                                    className="status-select"
                                                    disabled={updating}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="blocked">Blocked</option>
                                                </select>
                                                <button
                                                    className="action-button delete-btn"
                                                    onClick={() => deleteUser(user._id)}
                                                    disabled={updating}
                                                    title="Delete User"
                                                >
                                                    <span className="action-icon">🗑️</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredUsers.length > 0 && (
                    <div className="results-summary">
                        Showing {filteredUsers.length} of {users.length} users
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

            {showUserModal && (
                <UserModal user={selectedUser} onClose={closeUserModal} />
            )}
        </>
    );
}

export default AdminUsers;
