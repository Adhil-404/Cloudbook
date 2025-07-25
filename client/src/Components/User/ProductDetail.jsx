import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Assets/Styles/Userstyles/ProductDetail.css";
import { useParams } from 'react-router-dom';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { addToCart } from './Utils/cartUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Optional: required for toast styling

function ProductDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/book/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error fetching book:", err));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);
    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  if (!book) {
    return (
      <div className="spinner-container">
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
