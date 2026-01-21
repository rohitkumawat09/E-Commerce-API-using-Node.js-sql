
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { EcomContext } from "./UseContext.jsx";
import { AuthContext } from "./AuthContext";
import { instance } from "../axiosConfig";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useContext(EcomContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const {
    handleAddToCart,
    cart,
    wishlist,
    handleAddToWishlist,
    
  } = useContext(EcomContext);

  const { user,loading } = useContext(AuthContext);
  // console.log(user)

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await instance.get(`/product/productsdetails/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        const allProducts = await instance.get("/product/productsdetails");
        const related = allProducts.data.filter(
          (p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id
        );
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchSingleProduct();
  }, [id]);

if (!product || loading) return <div className="spinner"></div>

 const isOrdered = orders.some(order => order.product?.id === product.id);



  const isInCart = cart?.some((item) => item.id === product.id);
  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleAdd = async () => {
    if (!user) {
      navigate(`/LoginForm?referer=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!isInCart) {
      handleAddToCart(product);
      alert("Product added to cart");
      navigate("/cart");
    }
  };

  const handleWishlistAdd = async () => {
    if (!user) {
      navigate(`/LoginForm?referer=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!isInWishlist) {
      await handleAddToWishlist(product);
      alert("Product added to wishlist");
      navigate("/wishlist");
    }
  };

  const handleBuy = () => {
  if (!user) {
    navigate(`/LoginForm?referer=${encodeURIComponent(location.pathname)}`);
    return;
  }

  navigate("/productorder", {
    state: {
      product,
      userDetails: {
        name: user.name,
        email: user.email
      }
    }
  });
};


  const handleEdit = () => {
    navigate(`/admin/edit-product/${product.id}`);
  };


 
const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    await instance.delete(`/product/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    alert("Product deleted");
    navigate("/home");
  } catch (err) {
    alert("Failed to delete product");
    console.error("Delete error:", err.response?.data || err.message);
  }
};


  const isAdmin = user && user.role === "admin";
console.log(user?.role, "user role")

  return (
    <div className="single-product">
      {/* 🔙 Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Go Back
      </button>

      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} style={{ maxWidth: "300px" }} />
      <p><strong>Slug:</strong> {product.slug}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Original Price:</strong> ₹{product.originalPrice}</p>
      <p><strong>Discounted Price:</strong> ₹{product.discountedPrice}</p>

      {isAdmin ? (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleEdit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleAdd}
            disabled={isInCart}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: isInCart ? "#ccc" : "#28a745",
              color: isInCart ? "#666" : "#fff",
              border: "none",
              cursor: isInCart ? "not-allowed" : "pointer",
              marginRight: "10px",
            }}
          >
            {isInCart ? "Already in Cart" : "Add to Cart"}
          </button>

          <button
            onClick={handleWishlistAdd}
            disabled={isInWishlist}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: isInWishlist ? "#ccc" : "#ff4081",
              color: "#fff",
              border: "none",
              cursor: isInWishlist ? "not-allowed" : "pointer",
            }}
          >
            {isInWishlist ? "Already in Wishlist" : "Add to Wishlist"}
          </button>

<button
  onClick={handleBuy}
  disabled={isOrdered}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: isOrdered ? "#ccc" : "#007bff",
    color: "#fff",
    border: "none",
    cursor: isOrdered ? "not-allowed" : "pointer",
    marginLeft: "20px",
  }}
>
  {isOrdered ? "Already Ordered" : "Buy"}
</button>

        </div>
      )}

      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h3>Related Products (Same Category)</h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "200px",
                  textAlign: "center",
                }}
              >
                <Link to={`/product/${related.id}`}>
                  <img
                    src={related.image}
                    alt={related.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  <h4>{related.name}</h4>
                </Link>
                <p>₹{related.discountedPrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
