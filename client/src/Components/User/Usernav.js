import React from 'react';
import "../../Assets/Styles/Userstyles/userNav.css";



function UserNav() {
  return (


    <header className="homepage-header">
      <div className="header-top">
        <div className="contact-info">
          <i class="bi bi-telephone"></i> <span>+(84) - 1800 - 4635</span>
          <i class="bi bi-envelope"></i> <span>Info@BookStore.com</span>
        </div>
        <div className="top-icons">
          <i class="bi bi-person"></i>
          <i class="bi bi-instagram" ></i>
          <i class="bi bi-twitter"></i>
        </div>
      </div>

      <div className="header-middle">
        <div className="logo">cloudbook</div>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All category</option>
            <option>Fantacy</option>
            <option>Crime</option>
            <option>Romance</option>
            <option>Horror</option>
          </select>
          <button><i class="bi bi-search"></i></button>
        </div>
        <div className="middle-icons">
          <span>Find a book store</span>
          <i class="bi bi-person-fill"></i>
          <i class="bi bi-heart-fill"></i>
          <i class="bi bi-cart-fill"></i>
        </div>
      </div>


      <div className="header-bottom">
        <button className="categories-btn">☰ Categories</button>
       </div>

        

    <div>
    
        <div className="logo">CloudBooks</div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
          <a href="#">About Us</a>
        </nav>
        <div className="support-info">
         <i class="bi bi-telephone"></i>  <span>+1 840 - 841 25 69</span>
          <p>24/7 Support Center</p>
        </div>
      </div>
    </header>
  );
}

export default UserNav;
