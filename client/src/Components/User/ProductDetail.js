import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../Assets/Styles/Userstyles/ProductDetail.css";
import { useParams } from 'react-router-dom';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { GiClick } from 'react-icons/gi';

function ProductDetail() {
  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);



  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${id}`)
      .then((res) => setSingleProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);
  console.log(singleProduct);


  if (!singleProduct) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
   <div>
    <UserNav/>
    <div className="single_main">
      <div className="single_image">
        <img src={singleProduct.images?.[0]} alt={singleProduct.title} />
      </div>
      <div className="single_details">
        <div className="single_title">
          <h3 className="title">{singleProduct.title}</h3>
          <span className='author'> author: {singleProduct.brand}</span>
          <h6 className="single_price">${singleProduct.price}</h6>
          <p className="single_description">
            <span>Description: </span>{singleProduct.description}
          </p>
          <div className="button_container">
            <button className="single_cart">Add to Cart</button>
            <button className='single_pay'>BUY NOW</button>
          </div>
        </div>
      </div>
    </div>
    <UserFooter/>
    </div>
  );

}

export default ProductDetail;
