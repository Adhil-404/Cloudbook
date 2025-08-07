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
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('Fetching users from API...');
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Users received:', response.data);
            
            // If response is empty, try to get from localStorage for demo
            let usersData = response.data || [];
            
            if (usersData.length === 0) {
                // Get users from global storage for admin visibility
                const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
                usersData = globalUsers.map(user => ({
                    ...user,
                    status: user.status || 'active',
                    totalOrders: user.totalOrders || 0,
                    totalSpent: user.totalSpent || 0
                }));
            }
            
            setUsers(usersData);
            setFilteredUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            
            // Fallback to global users storage for demo
            const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
            const formattedUsers = globalUsers.map(user => ({
                ...user,
                status: user.status || 'active',
                totalOrders: user.totalOrders || 0,
                totalSpent: user.totalSpent || 0
            }));
            
            setUsers(formattedUsers);
            setFilteredUsers(formattedUsers);
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        setUpdating(true);
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            console.log('Updating user status:', userId, newStatus);
            
            // Update in global users for admin visibility
            const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
            const updatedGlobalUsers = globalUsers.map(user => 
                user._id === userId ? { ...user, status: newStatus } : user
            );
            localStorage.setItem('globalUsers', JSON.stringify(updatedGlobalUsers));
            
            // Try to update via API
            try {
                await axios.put(`http://localhost:5000/api/admin/users/${userId}`, 
                    { status: newStatus },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (apiError) {
                console.log('API not available, using localStorage only');
            }
            
            console.log('User status updated successfully');
            fetchUsers(); // Refresh the users list
            setUpdating(false);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status: ' + (error.response?.data?.message || error.message));
            setUpdating(false);
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUpdating(true);
            try {
                console.log('Deleting user:', userId);
                
                // Remove from global users for admin visibility
                const globalUsers = JSON.parse(localStorage.getItem('globalUsers') || '[]');
                const updatedGlobalUsers = globalUsers.filter(user => user._id !== userId);
                localStorage.setItem('globalUsers', JSON.stringify(updatedGlobalUsers));
                
                // Try to delete via API
                try {
                    await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (apiError) {
                    console.log('API not available, using localStorage only');
                }
                
                console.log('User deleted successfully');
                fetchUsers(); // Refresh the users list
                setUpdating(false);
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
                setUpdating(false);
            }
        }
    };

    const applyFilters = () => {
        let filtered = users;

        if (searchTerm.trim()) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm)
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

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
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
                                <span className="modal-value">{user.name || user.username || 'N/A'}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Email:</span>
                                <span className="modal-value email">{user.email}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Phone:</span>
                                <span className="modal-value">{user.phone || 'N/A'}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-label">Status:</span>
                                <span 
                                    className={`status-badge ${user.status || 'active'}`}
                                >
                                    {user.status || 'active'}
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
                <button onClick={fetchUsers} className="retry-button">Retry</button>
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
                                                <div className="user-name">{user.name || user.username || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="user-email">{user.email}</td>
                                        <td className="user-phone">{user.phone || 'N/A'}</td>
                                        <td>
                                            <span 
                                                className={`status-badge ${user.status || 'active'}`}
                                            >
                                                {user.status || 'active'}
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
                                                <button
                                                    className={`action-button status-btn ${(user.status || 'active') === 'active' ? 'block' : 'activate'}`}
                                                    onClick={() => toggleUserStatus(user._id, user.status || 'active')}
                                                    disabled={updating}
                                                    title={(user.status || 'active') === 'active' ? 'Block User' : 'Activate User'}
                                                >
                                                    <span className="action-icon">
                                                        {(user.status || 'active') === 'active' ? '🚫' : '✅'}
                                                    </span>
                                                </button>
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