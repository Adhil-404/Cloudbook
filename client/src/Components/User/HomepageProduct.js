import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../Assets/Styles/Userstyles/HomepageProduct.css'

function HomepageProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-3 mb-4">
            <div className="card" style={{ width: '18rem' }}>
              <img src={product.image} className="card-img-top" alt={product.title} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">${product.price}</h6>
                <p className="card-text">{product.description}</p>
                <button className="btn btn-primary">View More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomepageProduct;
