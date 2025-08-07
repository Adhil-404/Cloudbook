import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Assets/Styles/Userstyles/ProductDetail.css";
import { useParams, useNavigate } from 'react-router-dom';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { addToCart } from './Utils/cartUtils';
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from './Utils/wishlistUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    console.log("Product ID from URL:", id);
    
    axios.get(`http://localhost:5000/api/book/${id}`)
      .then((res) => {
        console.log("Book data received:", res.data);
        setBook(res.data);
      })
      .catch((err) => {
        console.error("Error fetching book:", err);
        console.error("Full error:", err.response);
        
        toast.error("Failed to load product details", {
          position: "top-center",
          autoClose: 3000,
        });
      });

    setWishlistItems(getWishlist());
  }, [id]);

  const refreshWishlist = () => {
    setWishlistItems(getWishlist());
  };

  const checkAuthToken = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('authToken');
    return token;
  };

  const handleAddToCart = () => {
    if (!book) return;
    
    addToCart(book);
    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleWishlistToggle = () => {
    if (!book) return;

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

  const handleBuyNow = () => {
    if (!book) return;

    const token = checkAuthToken();
    if (!token) {
      toast.error("Please login to place an order!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/user/userlogin');
      }, 2000);
      return;
    }

   
    const orderData = {
      items: [{
        id: book._id,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        quantity: 1,
        coverImage: book.coverImage
      }],
      totalAmount: book.price,
      itemCount: 1
    };

    
    navigate('/user/payment', { 
      state: { orderData } 
    });

    toast.success("Redirecting to payment...", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  if (!book) {
    return (
      <div>
        <UserNav />
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <UserFooter />
        <ToastContainer stacked />
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
            onError={(e) => {
              console.log("Image failed to load:", book.coverImage);
              e.target.src = 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Image';
            }}
          />
        </div>
        
        <div className="single_details">
          <div className="single_title">
            <h3 className="title">{book.title}</h3>
            <span className="author">Author: {book.author}</span>
            <p className='card-category'>Category: {book.category}</p>
            <h6 className="single_price">₹{book.price}</h6>
            <p className="single_description">
              <span>Description: </span>{book.description}
            </p>
            <div className="button_container">
              <button className="single_cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="single_pay" onClick={handleBuyNow}>
                BUY NOW
              </button>
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