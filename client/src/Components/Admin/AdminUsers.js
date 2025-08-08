import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import "../../Assets/Styles/Adminstyles/AdminUsers.css";

function AdminUsers() {
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    const fetchAdminUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            setAdminUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin users:', error);
            setError('Failed to fetch admin users');
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await axios.put(`http://localhost:5000/api/admin/users/${userId}`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchAdminUsers();
        } catch (error) {
            console.error('Error updating admin user status:', error);
            alert('Failed to update status');
        }
    };

    const deleteAdminUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this admin user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchAdminUsers();
            } catch (error) {
                console.error('Error deleting admin user:', error);
                alert('Failed to delete admin user');
            }
        }
    };

    if (loading) return (
        <>
            <AdminNav />
            <div className="admin-loading">Loading admin users...</div>
        </>
    );

    if (error) return (
        <>
            <AdminNav />
            <div className="admin-error">{error}</div>
        </>
    );

    return (
        <>
            <AdminNav />
            <div className="admin-users-container">
                <div className="admin-users-header">
                    <h2>All Admin Users</h2>
                    <span className="users-count">Total: {adminUsers.length}</span>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsers.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id?.slice(-8)}</td>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge ${user.status}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.totalOrders}</td>
                                    <td>₹{user.totalSpent}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className={`status-btn ${user.status === 'active' ? 'block' : 'activate'}`}
                                                onClick={() => toggleStatus(user._id, user.status)}
                                            >
                                                {user.status === 'active' ? 'Block' : 'Activate'}
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteAdminUser(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminUsers;
