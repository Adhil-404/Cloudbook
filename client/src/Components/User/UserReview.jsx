import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Userstyles/UserReview.css';
import UserNav from './Usernav';

function UserReview() {
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [newReview, setNewReview] = useState({
    bookId: '',
    rating: 5,
    title: '',
    comment: '',
    images: []
  });
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch books from your API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allbooks');
        setBooks(response.data);
        
        // Mock reviews data - replace this when you implement reviews API
        const mockReviews = [
          {
            id: 1,
            bookId: response.data[0]?._id,
            bookTitle: response.data[0]?.title,
            bookAuthor: response.data[0]?.author,
            bookImage: response.data[0]?.coverImage,
            rating: 5,
            title: "Excellent book!",
            comment: "This book exceeded my expectations. Great storytelling and well-developed characters. The delivery was also very fast.",
            date: "2024-01-15",
            status: "published",
            helpfulVotes: 12,
            verified: true
          },
          {
            id: 2,
            bookId: response.data[1]?._id,
            bookTitle: response.data[1]?.title,
            bookAuthor: response.data[1]?.author,
            bookImage: response.data[1]?.coverImage,
            rating: 4,
            title: "Good quality, fast delivery",
            comment: "The book quality is excellent and it arrived exactly as described. Would definitely recommend this seller.",
            date: "2024-01-10",
            status: "published",
            helpfulVotes: 8,
            verified: true
          }
        ];
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRatingClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newReview.images.length <= 5) {
      setNewReview({ ...newReview, images: [...newReview.images, ...files] });
    } else {
      alert('You can upload maximum 5 images');
    }
  };

  const removeImage = (index) => {
    const updatedImages = newReview.images.filter((_, i) => i !== index);
    setNewReview({ ...newReview, images: updatedImages });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      alert('Please select a book to review');
      return;
    }

    // Create new review object
    const reviewData = {
      id: Date.now(),
      bookId: selectedBook._id,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      bookImage: selectedBook.coverImage,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      status: "published",
      helpfulVotes: 0,
      verified: true
    };

    // Add to reviews (replace with API call when you implement reviews backend)
    setReviews([reviewData, ...reviews]);
    
    // Reset form
    setNewReview({
      bookId: '',
      rating: 5,
      title: '',
      comment: '',
      images: []
    });
    setSelectedBook(null);
    setShowWriteReview(false);
    setActiveTab('my-reviews');
    
    alert('Review submitted successfully!');
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  const sortedReviews = filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`}
            onClick={interactive ? () => onStarClick(star) : undefined}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          ></i>
        ))}
      </div>
    );
  };

  const getImageUrl = (imageName) => {
    return `http://localhost:5000/uploads/${imageName}`;
  };

  if (loading) {
    return (
      <div className="reviews-container">
        <div className="loading">
          <i className="bi bi-hourglass-split"></i>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div><UserNav/></div>
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>
          <i className="bi bi-star-fill"></i>
          Reviews & Ratings
        </h1>
        <p>Manage your product reviews and see your feedback history</p>
      </div>

      <div className="reviews-tabs">
        <button
          className={`tab ${activeTab === 'my-reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-reviews')}
        >
          <i className="bi bi-chat-square-text"></i>
          My Reviews ({reviews.length})
        </button>
        <button
          className={`tab ${activeTab === 'write-review' ? 'active' : ''}`}
          onClick={() => setActiveTab('write-review')}
        >
          <i className="bi bi-pencil-square"></i>
          Write a Review
        </button>
      </div>

      {activeTab === 'my-reviews' && (
        <div className="reviews-content">
          <div className="reviews-controls">
            <div className="filter-sort">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          <div className="reviews-list">
            {sortedReviews.length === 0 ? (
              <div className="no-reviews">
                <i className="bi bi-chat-square-dots"></i>
                <h3>No reviews yet</h3>
                <p>Start by writing your first review!</p>
                <button
                  className="write-first-review-btn"
                  onClick={() => setActiveTab('write-review')}
                >
                  Write Your First Review
                </button>
              </div>
            ) : (
              sortedReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-product">
                    <img
                      src={getImageUrl(review.bookImage)}
                      alt={review.bookTitle}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                    <div className="product-info">
                      <h4>{review.bookTitle}</h4>
                      <p>by {review.bookAuthor}</p>
                      <div className="review-meta">
                        <span className="review-date">{review.date}</span>
                        {review.verified && (
                          <span className="verified-badge">
                            <i className="bi bi-check-circle-fill"></i>
                            Verified Purchase
                          </span>
                        )}
                        <span className={`status-badge ${review.status}`}>
                          {review.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="review-content">
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-text">({review.rating}/5)</span>
                    </div>
                    <h5 className="review-title">{review.title}</h5>
                    <p className="review-comment">{review.comment}</p>
                    
                    <div className="review-actions">
                      <button className="helpful-btn">
                        <i className="bi bi-hand-thumbs-up"></i>
                        Helpful ({review.helpfulVotes})
                      </button>
                      <button className="edit-btn">
                        <i className="bi bi-pencil"></i>
                        Edit
                      </button>
                      <button className="delete-btn" >
                        <i className="bi bi-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'write-review' && (
        <div className="write-review-content">
          <div className="write-review-form">
            <h3>Write a New Review</h3>
            
            <div className="book-selection">
              <label>Select a Book to Review:</label>
              <div className="book-grid">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className={`book-card ${selectedBook?._id === book._id ? 'selected' : ''}`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <img
                      src={getImageUrl(book.coverImage)}
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/100/140';
                      }}
                    />
                    <div className="book-info">
                      <h5>{book.title}</h5>
                      <p>{book.author}</p>
                      <span className="book-price">${book.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedBook && (
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="selected-book-info">
                  <h4>Reviewing: {selectedBook.title}</h4>
                  <p>by {selectedBook.author}</p>
                </div>

                <div className="rating-input">
                  <label>Your Rating:</label>
                  {renderStars(newReview.rating, true, handleRatingClick)}
                  <span className="rating-text">({newReview.rating}/5)</span>
                </div>

                <div className="form-group">
                  <label>Review Title:</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    placeholder="Summarize your review in a few words"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Review Comment:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this book..."
                    rows="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Add Photos (Optional):</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                  />
                  <p className="image-help">You can upload up to 5 images</p>
                  
                  {newReview.images.length > 0 && (
                    <div className="image-preview">
                      {newReview.images.map((image, index) => (
                        <div key={index} className="preview-item">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-review-btn">
                    <i className="bi bi-check-circle"></i>
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBook(null);
                      setNewReview({
                        bookId: '',
                        rating: 5,
                        title: '',
                        comment: '',
                        images: []
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
   </div>
  );
}

export default UserReview;