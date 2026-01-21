
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { instance } from "../axiosConfig";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/product/productsdetails");
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="product-wrapper">
        <h2 className="product-title">All Products</h2>


 <div className="search-bar" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search products by name, slug, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="product-grid">
          {products
           .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
          .map((product) => (
            
            
            <div key={product.id} className="product-card">
              <div className="product-image">
                
               <Link to={`/product/${product.id}`}>
    <img src={product.image} alt={product.name} className="product-image" />
  </Link>
              </div>

      

      
              <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Slug:</strong> {product.slug}</p>
                <p><strong>Category:</strong> {product.category}</p>

                <div className="price">
                  <span>Price:</span>
                  <strong>₹{product.originalPrice}</strong>
                </div>

                <div className="discount-price">
                  Discounted Price: ₹{product.discountedPrice}
                </div>

                <p className="description">{product.description}</p>
              </div>
            </div>
          ))}







        </div>
      </div>
    </div>
  );
};

export default Home;

