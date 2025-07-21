import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../Assets/Styles/Userstyles/ProductDetail.css";
import { useParams } from 'react-router-dom';  
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { addToCart } from './Utils/cartUtils';
import { ToastContainer, toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();
  const [singleBook, setSingleBook] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/book/${id}`)
      .then((res) => setSingleBook(res.data))
  console.log('ID from URL:', id);
  const [ singleProduct, setSingleProduct] = useState(null);
  

  useEffect(() => {
    axios.get(`http://localhost:5000/api/allbooks/${id}`)
      .then((res) => setSingleProduct(res.data))

      .catch((err) => console.log(err));
  }, [id]);

  if (!singleBook) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(singleBook); 
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

const handleAddToCart = () => {
  addToCart(singleProduct);
  toast.success(" Successfully added to cart!", {
    position: "top-center",
    autoClose: 2000,
  });
};


  return (
    <div>
      <UserNav />
      <div className="single_main">
        <div className="single_image">

          <img
            src={`http://localhost:5000/uploads/${singleBook.coverImage}`}
            alt={singleBook.title}
          />
        </div>
        <div className="single_details">
          <div className="single_title">
            <h3 className="title">{singleBook.title}</h3>
            <span className='author'>Author: {singleBook.author}</span>
            
            <h6 className="single_price">₹{singleBook.price}</h6>

          <img src={singleProduct.coverImage} alt={singleProduct.title || "Product"} />
        </div>
        <div className="single_details">
          <div className="single_title">
            <h3 className="title">{singleProduct.title}</h3>
            <span className='author'> author: {singleProduct.brand}</span>
            <h6 className="single_price">{singleProduct.price}</h6>

            <p className="single_description">
              <span>Description: </span>{singleBook.description}
            </p>
            <div className="button_container">
              <button className="single_cart" onClick={handleAddToCart}>Add to Cart</button>
              <button className='single_pay'>BUY NOW</button>

            </div>
          </div>
        </div>
      </div>
      <UserFooter />
      <ToastContainer stacked/>
    </div>
  );
}

export default ProductDetail;
