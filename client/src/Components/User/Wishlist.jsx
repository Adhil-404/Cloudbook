import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { Link } from 'react-router-dom';
import "../../Assets/Styles/Userstyles/Wishlist.css";
import { getWishlist, removeFromWishlist, clearWishlist } from './Utils/wishlistUtils';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    try {
      const wishlistData = getWishlist();
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    const success = removeFromWishlist(id);
    if (success) {
      setWishlist(getWishlist());
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      const success = clearWishlist();
      if (success) {
        setWishlist([]);
      }
    }
  };

  if (loading) {
    return (
      <>
        <UserNav />
        <div className="wishlist-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  if (wishlist.length === 0) {
    return (
      <>
        <UserNav />
        <div className="wishlist-container">
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <svg width="80" height="80" viewBox="0 0 24 22" fill="none" stroke="#ccc" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2>Your wishlist is empty.</h2>
            <p>Start adding books you love!</p>
            <Link to="/user/homepage/product" className="btn btn-primary">
              Browse Books
            </Link>
          </div>
        </div>
        <UserFooter />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          stacked
        />
      </>
    );
  }

  return (
    <>
      <UserNav />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Your Wishlist</h1>
          <div className="wishlist-actions">
            <span className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
            {wishlist.length > 0 && (
              <button
                className="btn btn-secondary clear-all-btn"
                onClick={handleClearAll}
                title="Clear all items from wishlist"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="product-card">
              <div className="card">
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/uploads/${item.coverImage}`}
                    className="card-img-top"
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = '/path/to/default-book-cover.png';
                    }}
                  />
                </div>
                <div className="card-body">
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-author">Author : {item.author}</p>
                  <p className='card-category1'>Category : {item.category}</p>
                  <h6 className="card-subtitle">₹{item.price.toFixed(2)}</h6>
                  <p className="card-text">
                    {item.description && item.description.length > 100
                      ? item.description.substring(0, 70) + '...'
                      : item.description}
                  </p>
                  <div className="card-buttons">
                    <Link to={`/product/${item.id}`} className="btn btn-primary">
                      View More
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                </div>
              </div>
            </div>

          ))}
        </div>
      </div>
      <UserFooter />

 
      <ToastContainer stacked />
    </>
  );
}

export default Wishlist;