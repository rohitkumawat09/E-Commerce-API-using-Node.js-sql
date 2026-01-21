import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { instance } from "../axiosConfig";
import { AuthContext } from "./AuthContext";

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    originalPrice: "",
    discountedPrice: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await instance.get(`/product/productsdetails/${id}`);
        const data = res.data;
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description,
          category: data.category,
          originalPrice: data.originalPrice,
          discountedPrice: data.discountedPrice,
        });
        setPreview(data.image);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (image) data.append("image", image);

      await instance.put(`/product/product/edit/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      navigate(`/product/${id}`);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="edit-product-container">
      <h2 className="edit-product-heading">Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="form-input"
        />
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug"
          required
          className="form-input"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="form-textarea"
        ></textarea>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="form-input"
        />
        <input
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          placeholder="Original Price"
          required
          className="form-input"
        />
        <input
          type="number"
          name="discountedPrice"
          value={formData.discountedPrice}
          onChange={handleChange}
          placeholder="Discounted Price"
          required
          className="form-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-file-input"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
          />
        )}
        <button type="submit" className="form-submit-btn">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductForm;
