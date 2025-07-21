import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Assets/Styles/Userstyles/HomepageProduct.css"
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { Link } from 'react-router-dom';

function HomepageProduct() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/api/allbooks")
      .then(res => {
        setProducts(res.data);
        console.table(res.data);
      })
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'priceLowHigh') return a.price - b.price;
    if (sortOption === 'priceHighLow') return b.price - a.price;
    if (sortOption === 'titleAZ') return a.title.localeCompare(b.title);
    if (sortOption === 'titleZA') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div>
      <UserNav />

      <div className="sort-container">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="titleAZ">Title: A-Z</option>
          <option value="titleZA">Title: Z-A</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="card">
              <img src={`http://localhost:5000/uploads/${product.coverImage}`} className="card-img-top" alt={product.title} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">₹{product.price}</h6>
                <p className="card-text">
                  {product.description.length > 100
                    ? product.description.substring(0, 100) + '...'
                    : product.description}
                </p>
                <Link to={`/product/${product._id}`}>
                  <button className="btn btn-primary">View More</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UserFooter />
    </div>
  );
}

export default HomepageProduct;
