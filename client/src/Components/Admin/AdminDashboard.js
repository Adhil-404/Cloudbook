import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Adminstyles/AdminDashboard.css';
import AdminNav from './AdminNav';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin/login');
      return;
    }
    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/allbooks');
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      alert("Failed to load books.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/deletebook/${id}`);
      setBooks(b => b.filter(book => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Delete failed, please try again.");
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="dashboard">
        <h2 className="dashboard-title">Book Inventory</h2>
        <div className="book-list">
          {books.map(book => (
            <BookCard key={book._id} book={book} onDelete={handleDelete} onEdit={() => navigate(`/admin/editbook/${book._id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book, onDelete, onEdit }) {
  return (
    <div className="book-card">
      <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Price:</strong> ₹{book.price}</p>
      <p className="description">{book.description.length > 70 ? `${book.description.slice(0, 70)}...` : book.description}</p>
      <div className="admin-buttons">
        <button className="edit-btn" onClick={onEdit}>
          <i className="bi bi-pencil-square"></i>Edit
        </button>
        <button className="admindelete-btn" onClick={() => onDelete(book._id)}>
          <i className="bi bi-trash-fill"></i>Delete
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

