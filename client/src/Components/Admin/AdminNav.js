import { Link,useLocation } from "react-router-dom";
import "../../Assets/Styles/Adminstyles/AdminNav.css"



function AdminNav() {

    const location = useLocation();
    const { pathname } = useLocation();

    return (


        <div>
            <h2 className="admindash-logo">CloudBook</h2>
            <div className="admindash-top-bar"></div>

            <aside className="admindash-sidebar">
                <ul className="admindash-nav-links">
                    <li className={location.pathname === "/admin/dashboard" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className={location.pathname === "/admin/books" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/books">Books</Link>
                    </li>
                    <li className={location.pathname === "/admin/orders" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/orders">Orders</Link>
                    </li>
                    <li className={location.pathname === "/admin/users" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/users">Users</Link>
                    </li>
                    <li className={location.pathname === "/admin/reviews" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/reviews">Reviews</Link>
                    </li>
                    <li className={location.pathname === "/admin/settings" ? "admindash-active" : ""}>
                        <Link className="link" to="/admin/settings">Settings</Link>
                    </li>
                </ul>
            </aside>
        </div>
    );
};

export default AdminNav;