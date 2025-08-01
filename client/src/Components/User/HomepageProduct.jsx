import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Assets/Styles/Userstyles/HomepageProduct.css';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { Link, useLocation } from 'react-router-dom';
import { addToWishlist, removeFromWishlist, isInWishlist, getWishlist} from './Utils/wishlistUtils';

function HomepageProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
    updateWishlistState();
  }, []);

  // Filter products when search parameters or products change
  useEffect(() => {
    filterProducts();
  }, [products, location.search]);

  const fetchProducts = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/allbooks")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
        toast.error('Failed to load products. Please refresh the page.', {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search query (title, author, description)
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== 'All category') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const updateWishlistState = () => {
    const wishlist = getWishlist();
    const wishlistIds = new Set(wishlist.map(item => item.id));
    setWishlistItems(wishlistIds);
  };

  const handleWishlistToggle = (product) => {
    const isCurrentlyInWishlist = isInWishlist(product._id);
    
    if (isCurrentlyInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    
    updateWishlistState();
  };

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'priceLowHigh': return a.price - b.price;
      case 'priceHighLow': return b.price - a.price;
      case 'titleAZ': return a.title.localeCompare(b.title);
      case 'titleZA': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div>
        <UserNav />
        <div className="loading-container">
          <div className="loading-spinner">Loading products...</div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div>
      <UserNav />

      {/* Search Results Info */}
      {(searchQuery || categoryFilter) && (
        <div className="search-results-info">
          <div className="search-info-content">
            {searchQuery && (
              <p className="search-query">
                <i className="bi bi-search"></i>
                Search results for: "<strong>{searchQuery}</strong>"
              </p>
            )}
            {categoryFilter && categoryFilter !== 'All category' && (
              <p className="category-filter">
                <i className="bi bi-tag"></i>
                Category: <strong>{categoryFilter}</strong>
              </p>
            )}
            <p className="results-count">
              Found <strong>{filteredProducts.length}</strong> book(s)
            </p>
          </div>
        </div>
      )}

      <div className="sort-container">
        <label htmlFor="sort" style={{ marginRight: "10px", fontWeight: 500 }}>Sort:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort Products</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="titleAZ">Title: A-Z</option>
          <option value="titleZA">Title: Z-A</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="card">
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/uploads/${product.coverImage}`}
                    className="card-img-top"
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/path/to/default-book-cover.png'; 
                    }}
                  />
                  <button 
                    className={`wishlist-icon ${wishlistItems.has(product._id) ? 'active' : ''}`}
                    onClick={() => handleWishlistToggle(product)}
                    title={wishlistItems.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg 
                      width="20" 
                      height="18" 
                      viewBox="0 0 24 22" 
                      fill={wishlistItems.has(product._id) ? '#ff4757' : 'none'}
                      stroke={wishlistItems.has(product._id) ? '#ff4757' : '#666'}
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <h4 className="card-title">{product.title}</h4>
                  <p className="card-author">Author : {product.author}</p>
                  <p className='card-category1'>Category : {product.category}</p>  
                  <h6 className="card-subtitle">₹{product.price}</h6>
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
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <i className="bi bi-search" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
              <h3>No books found</h3>
              <p>
                {searchQuery || categoryFilter 
                  ? "Try adjusting your search criteria or browse all categories."
                  : "No products available at the moment."
                }
              </p>
              {(searchQuery || categoryFilter) && (
                <Link to="/user/homepage/product" className="btn btn-primary" style={{ marginTop: '15px' }}>
                  View All Products
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <UserFooter />
      
      <ToastContainer stacked />
    </div>
  );
}

export default HomepageProduct;