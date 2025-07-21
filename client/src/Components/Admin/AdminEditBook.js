import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Assets/Styles/Adminstyles/AdminEditBook.css';

function AdminEditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        author: '',
        category: '',
        description: '',
        price: '',
    });
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/book/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error("Error fetching book:", err);
            }
        };
        fetchBook();
    }, [id]);

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(book).forEach(([key, value]) => formData.append(key, value));
        if (coverImage) formData.append('coverImage', coverImage);

        try {
            await axios.put(`http://localhost:5000/api/updatebook/${id}`, formData);
            alert("Book updated successfully!");
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Error updating book:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="add-book-container">
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={book.title} onChange={handleChange} placeholder="Title" required />
                <input type="text" name="author" value={book.author} onChange={handleChange} placeholder="Author" required />
                <input type="text" name="category" value={book.category} onChange={handleChange} placeholder="Category" required />
                <textarea name="description" value={book.description} onChange={handleChange} placeholder="Description" required />
                <input type="number" name="price" value={book.price} onChange={handleChange} placeholder="Price" required />
                {book.coverImage && (
                    <div className="image-preview">
                        <img
                            src={`http://localhost:5000/uploads/${book.coverImage}`}
                            alt="Current Cover"
                            style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                        />
                        <p style={{ fontSize: '13px', color: 'gray' }}>Current cover image</p>
                    </div>
                )}

                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
                <button type="submit">Update Book</button>
            </form>
        </div>
    );
}

export default AdminEditBook;
