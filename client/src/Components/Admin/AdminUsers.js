import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import axios from 'axios';
import "../../Assets/Styles/Adminstyles/AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
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
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return (
        <>
            <AdminNav />
            <div className="admin-loading">Loading users...</div>
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
                    <h2>All Users</h2>
                    <span className="users-count">Total: {users.length}</span>
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
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id?.slice(-8)}</td>
                                    <td>{user.name || user.username || 'N/A'}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>
                                        <span 
                                            className={`status-badge ${user.status || 'active'}`}
                                        >
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td>{user.totalOrders || 0}</td>
                                    <td>₹{user.totalSpent || 0}</td>
                                    <td>{new Date(user.createdAt || user.joinDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className={`status-btn ${(user.status || 'active') === 'active' ? 'block' : 'activate'}`}
                                                onClick={() => toggleUserStatus(user._id, user.status || 'active')}
                                            >
                                                {(user.status || 'active') === 'active' ? 'Block' : 'Activate'}
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteUser(user._id)}
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