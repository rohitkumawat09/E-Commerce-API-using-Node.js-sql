import React, { useState } from 'react';
import { instance } from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ProductAddForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    quantity: '',
    originalPrice: '',
    discountedPrice: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔴 New State

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      for (const key in formData) {
        submitData.append(key, formData[key]);
      }

      const response = await instance.post('/product/add', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setMessage(response.data.message || 'Product added successfully!');
      console.log('Product created:', response.data);

      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        category: '',
        quantity: '',
        originalPrice: '',
        discountedPrice: '',
        image: null,
      });

      document.querySelector('input[name="image"]').value = null;

      navigate('/home'); // ✅ Navigate to /home

    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
      setMessage('Product creation failed');
      setIsSubmitting(false); // 🔁 Enable button on error
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="form-title">Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-textarea"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="number"
          name="originalPrice"
          placeholder="Original Price"
          value={formData.originalPrice}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="number"
          name="discountedPrice"
          placeholder="Discounted Price"
          value={formData.discountedPrice}
          onChange={handleChange}
        />
        <input
          className="form-file"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />

      <button
  type="submit"
  className="submit-button"
  disabled={isSubmitting}
  style={{
    cursor: isSubmitting ? "not-allowed" : "pointer",
    opacity: isSubmitting ? 0.6 : 1,
  }}
>
  {isSubmitting ? "Submitting..." : "Add Product"}
</button>

      </form>

      <p className="message">{message}</p>
    </div>
  );
};

export default ProductAddForm;

