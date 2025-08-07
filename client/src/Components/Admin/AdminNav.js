import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../Assets/Styles/Adminstyles/AdminNav.css";

function AdminNav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            navigate('/admin');
        }
    };
    return (
        <div>
            <div className="admin-header-top">
                <div className="admin-contact-info">
                    <i className="bi bi-person-badge-fill"></i> <span>Admin Panel</span>
                    <i className="bi bi-envelope"></i> <span>admin@cloudbook.com</span>
                </div>

                <div className="admin-top-icons">
                    <i className="bi bi-gear-fill"></i>
                    <i className="bi bi-bell-fill"></i>
                </div>
            </div>

            <div className="admin-header-middle">
                <div className="admin-logo">Cloudbook Admin</div>
                <div className="admin-middle-icons">
                    <span className="logout-link" onClick={handleLogout}>
                        Logout <i className="bi bi-box-arrow-right"></i>
                    </span>

                </div>
            </div>

            <header className="admin-header">
                <div>
                    <nav className="admin-nav-links">
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/addbook">Add Book</Link>
                        <Link to="/admin/orders">Orders</Link>
                        <Link to="/admin/users">Users</Link>
                    </nav>
                </div>
                <div className="admin-support-info">
                    <i className="bi bi-clock-fill"></i> <span>Active: 9am - 9pm</span>
                    <p>Admin Support</p>
                </div>
            </header>
        </div>
    );
}

export default AdminNav;
