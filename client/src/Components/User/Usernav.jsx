import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../Assets/Styles/Userstyles/userNav.css";

function UserNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All category');
  const navigate = useNavigate();

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
          >
            <i className="bi bi-search"></i>
          </button>
        </form>
        <div className="middle-icons">
          <i className="bi bi-person-fill"></i>
          <Link to="/user/homepage/wishlist">
            <i className="bi bi-heart-fill"></i>
          </Link>
          <Link to="/user/homepage/cart">
            <i className="bi bi-cart-fill"></i>
          </Link>
        </div>
      </div>

      <header className="homepage-header">
        <div className="header-bottom"></div>
        <nav className="nav-links">
          <NavLink 
            to="/user/homepage" 
            className={({ isActive }) => isActive ? 'active' : ''}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/user/homepage/product" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Products
          </NavLink>
          <NavLink 
            to="/user/homepage/contact" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/user/homepage/aboutus" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            About Us
          </NavLink>
        </nav>
        <div className="support-info">
          <i className="bi bi-telephone" aria-label="Support phone"></i>
          <span>+1 840 - 841 25 69</span>
          <p>24/7 Support Center</p>
        </div>
      </header>
    </div>
  );
}

export default UserNav;