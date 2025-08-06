import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Assets/Styles/Userstyles/ProductDetail.css";
import { useParams } from 'react-router-dom';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { addToCart } from './Utils/cartUtils';
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from './Utils/wishlistUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/book/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error fetching book:", err));

    setWishlistItems(getWishlist());
  }, [id]);

  const refreshWishlist = () => {
    setWishlistItems(getWishlist());
  };

  const handleAddToCart = () => {
    addToCart(book);
    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(book._id)) {
      removeFromWishlist(book._id);
      toast.info("Removed from wishlist!", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      addToWishlist(book);
      toast.success("Added to wishlist!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    refreshWishlist();
  };

  if (!book) {
    return (
      <div className="loading-container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      <div className="single_main">
        <div
          className={`wishlist-icon-product ${isInWishlist(book._id) ? 'in-wishlist' : ''}`}
          title={isInWishlist(book._id) ? "Remove from Wishlist" : "Add to Wishlist"}
          onClick={handleWishlistToggle}
        >
          ♥
        </div>

        <div className="single_image">
          <img
            src={`http://localhost:5000/uploads/${book.coverImage}`}
            alt={book.title}
          />
        </div>
        <div className="single_details">
          <div className="single_title">
            <h3 className="title">{book.title}</h3>
            <span className="author">Author: {book.author}</span>
            <p className='card-category'>Category : {book.category}</p>
            <h6 className="single_price">₹{book.price}</h6>
            <p className="single_description">
              <span>Description: </span>{book.description}
            </p>
            <div className="button_container">
              <button className="single_cart" onClick={handleAddToCart}>Add to Cart</button>
              <button className="single_pay">BUY NOW</button>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
      <ToastContainer stacked />
    </div>
  );
}

export default ProductDetail;