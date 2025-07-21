import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Adminstyles/AdminDashboard.css';
import AdminNav from './AdminNav';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/dashboard');
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/allbooks');
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/deletebook/${id}`);
      setBooks(prevBooks => prevBooks.filter(book => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };


  return (
    <div>
      <div><AdminNav /></div>
      <div className="dashboard">
        <h2 className='dashboard-title'>Book Inventory</h2>
        <div className="book-list">
          {books.map((book) => (
            <div className="book-card" key={book._id}>
              <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Price:</strong> ₹{book.price}</p>
              <p className="description">
                {book.description.length > 70
                  ? book.description.slice(0, 42) + '... '
                  : book.description}
              </p>
              <div className="admin-buttons">
                <button className="edit-btn" onClick={() => navigate(`/admin/editbook/${book._id}`)}>
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                  <i className="bi bi-trash-fill"></i> Delete
                </button>
              </div>

            </div>
          ))}


        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
