import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EcomContext } from "./UseContext";
import { instance } from "../axiosConfig";

const ProductOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, updateCartQuantityAfterOrder, updateQuantityInCart } = useContext(EcomContext);

  const { product, userDetails } = location.state || {};

  if (!product || !userDetails) {
    return <p>No product selected.</p>;
  }

  const cartItem = cart.find((item) => item.id === product.id);
  const initialQuantity = cartItem ? cartItem.quantity : 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState("");

  const handleQuantityChange = (e) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(val);
    updateQuantityInCart(product.id, val);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address || !phone || !paymentMethod) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await instance.post(
        "/orders/create",
        {
          productId: product.id,
          quantity,
          address,
          phone,
          paymentMethod,
        },
        { withCredentials: true }
      );

      setMessage("✅ Order placed successfully!");
      updateCartQuantityAfterOrder(product.id, quantity);

      setTimeout(() => navigate("/"), 1500); // redirect after short delay
    } catch (err) {
      console.error("Order placement error:", err);
      setError("❌ Failed to place order. Please try again.");
      setLoading(false); // re-enable button for retry
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="product-summary">
        <h3>{product.name}</h3>
        <p className="price">
          ₹{product.discountedPrice}{" "}
          <span className="original-price">₹{product.originalPrice}</span>
        </p>
      </div>

      <div className="user-info">
        <h4>User Details</h4>
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            required
          />
        </label>

        <label>
          Address:
          <textarea
            required
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </label>

        <label>
          Phone:
          <input
            type="tel"
            required
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <div className="payment-method">
          <h4>Select Payment Method</h4>
          <label>
            <input
              type="radio"
              name="payment"
              value="upi"
              required
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            UPI
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={paymentMethod === "netbanking"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Net Banking
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Cash on Delivery
          </label>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

   <button
  type="submit"
  className="place-order-btn"
  disabled={loading}
  style={{
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
  }}
>
  {loading ? "Placing Order..." : "Place Order"}
</button>

      </form>
    </div>
  );
};

export default ProductOrder;