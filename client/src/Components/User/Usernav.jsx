import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "../../Assets/Styles/Userstyles/userNav.css";

function UserNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All category');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }

    if (selectedCategory !== 'All category') {
      params.append('category', selectedCategory);
    }

    const queryString = params.toString();
    navigate(`/user/homepage/product${queryString ? `?${queryString}` : ''}`);
  };

  const handleSearchClick = () => {
    handleSearch({ preventDefault: () => {} });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    closeSidebar();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
    closeSidebar();
  };

  const sidebarItems = [
    { icon: "bi bi-person-fill", label: "My Profile", path: "/user/homepage/profile", description: "Manage your account details" },
    { icon: "bi bi-bag-fill", label: "My Orders", path: "/user/homepage/orders", description: "Track your order history" },
    { icon: "bi bi-heart-fill", label: "Wishlist", path: "/user/homepage/wishlist", description: "Your saved items" },
    { icon: "bi bi-cart-fill", label: "Shopping Cart", path: "/user/homepage/cart", description: "Items in your cart" },
    { icon: "bi bi-credit-card-fill", label: "Payment Methods", path: "/user/homepage/payment-methods", description: "Manage cards & payments" },
    { icon: "bi bi-bell-fill", label: "Notifications", path: "/user/homepage/notifications", description: "Your alerts & updates" },
    { icon: "bi bi-star-fill", label: "Reviews & Ratings", path: "/user/homepage/reviews", description: "Your product reviews" },
    { icon: "bi bi-question-circle-fill", label: "Help & Support", path: "/user/homepage/support", description: "Get help" },
    { icon: "bi bi-box-arrow-right", label: "Logout", path: "#", description: "Sign out of your account", action: "logout" }
  ];

  const handleItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      closeSidebar();
    }
  };

  return (
    <div>
      <div className="header-top">
        <div className="contact-info">
          <i className="bi bi-telephone" aria-label="Phone"></i>
          <span>+(84) - 1800 - 4635</span>
          <i className="bi bi-envelope" aria-label="Email"></i>
          <span>Info@BookStore.com</span>
        </div>
        <div className="top-icons">
          <i className="bi bi-person" aria-label="User Profile"></i>
          <i className="bi bi-instagram" aria-label="Instagram"></i>
          <i className="bi bi-twitter" aria-label="Twitter"></i>
        </div>
      </div>

      <div className="header-middle">
        <div className="logo">Cloudbook</div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            aria-label="Search products"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <select 
            aria-label="Select category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All category">All category</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Crime Fiction">Crime Fiction</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
            <option value="Thriller">Thriller</option>
            <option value="Children's Literature">Children's Literature</option>
            <option value="Historical Fiction">Historical Fiction</option>
            <option value="Dystopian fiction">Dystopian fiction</option>
          </select>
          <button 
            type="button" 
            aria-label="Search"
            onClick={handleSearchClick}
            className="search-icon-btn"
          >
            <i className="bi bi-search"></i>
          </button>
        </form>
        </div>
        <div className="middle-icons">


          <Link to="user/homepage/order"><i className="bi bi-person-fill"></i></Link>
          <i className="bi bi-heart-fill"></i>
          <Link to="/user/homepage/cart">
            <i className="bi bi-cart-fill"></i>
          </Link>
        </div>
      </div>

      <header className="homepage-header">
          <button className="menu-toggle-btn left" onClick={toggleSidebar} aria-label="Open user menu">
          <i className="bi bi-list"></i>
        </button>
        <div className="nav-links">
          <NavLink to="/user/homepage" className={({ isActive }) => isActive ? 'active' : ''} end>Home</NavLink>
          <NavLink to="/user/homepage/product" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
          <NavLink to="/user/homepage/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          <NavLink to="/user/homepage/aboutus" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>
        <div className="header-bottom">

        </div>
        <div className="header-right">
          <div className="support-info">
            <i className="bi bi-telephone" aria-label="Support phone"></i>
            <span>+1 840 - 841 25 69</span>
            <p>24/7 Support Center</p>
          </div>
        </div>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div 
        ref={sidebarRef}
        className={`user-sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="user-details">
              <h3>John Doe</h3>
              <p>john.doe@email.com</p>
            </div>
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {sidebarItems.map((item, index) => (
              item.action === 'logout' ? (
                <div
                  key={index}
                  className="sidebar-item logout-item"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="item-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="item-content">
                    <span className="item-label">{item.label}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                  <div className="item-arrow">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="item-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="item-content">
                    <span className="item-label">{item.label}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                  <div className="item-arrow">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default UserNav;