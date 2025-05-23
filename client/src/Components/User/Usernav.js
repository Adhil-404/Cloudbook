import React from 'react';
import "../../Assets/Styles/Userstyles/userNav.css"

function UserNav() {
  return (
    
    <div>
      <header className="homepage-header">
        <div className="logo">CloudBooks</div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Categories</a>
          <a href="#">Bestsellers</a>
          <a href="#">New Arrivals</a>
          <a href="#">Contact</a>
        </nav>
      </header>
      
   
    </div>
  );
}

export default UserNav;
