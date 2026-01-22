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
  const [paymentMethod, setPaymentMethod] = useState("stripe");
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

    // Validate all required fields
    if (!address || !address.trim()) {
      setError("❌ Please enter a delivery address");
      return;
    }
    if (!phone || !phone.trim()) {
      setError("❌ Please enter a phone number");
      return;
    }
    if (!paymentMethod) {
      setError("❌ Please select a payment method");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (paymentMethod === "stripe") {
        // Use Stripe for payment
        console.log("Starting Stripe payment...");
        const response = await instance.post(
          "/payment/create-checkout-session",
          {
            productId: product.id,
            quantity,
            address,
            phone,
          },
          { withCredentials: true }
        );

        console.log("Stripe response:", response);

        // Redirect to Stripe Checkout
        if (response.data && response.data.sessionId) {
          // Check if Stripe is available
          if (typeof window.Stripe === "undefined") {
            setError("❌ Stripe failed to load. Please refresh the page.");
            setLoading(false);
            return;
          }

          const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          const { error } = await stripe.redirectToCheckout({ 
            sessionId: response.data.sessionId 
          });
          
          if (error) {
            setError("❌ Stripe Error: " + error.message);
            setLoading(false);
          }
        } else {
          setError("❌ Failed to create payment session. Please try again.");
          setLoading(false);
        }
      } else {
        // Create order for other payment methods (UPI, Netbanking, COD)
        console.log("Creating order with payment method:", paymentMethod);
        const response = await instance.post(
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

        console.log("Order response:", response);
        
        setMessage("✅ Order placed successfully!");
        updateCartQuantityAfterOrder(product.id, quantity);

        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error("Order placement error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to place order. Please try again.";
      setError("❌ " + errorMsg);
      setLoading(false);
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
              value="stripe"
              required
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            💳 Stripe (Card Payment)
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            📱 UPI
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={paymentMethod === "netbanking"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            🏦 Net Banking
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            📦 Cash on Delivery
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
          {loading ? "Processing..." : "Place Order"}
        </button>

      </form>
    </div>
  );
};

export default ProductOrder;