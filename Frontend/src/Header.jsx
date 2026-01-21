import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { EcomContext } from "./UseContext";
import { instance } from "../axiosConfig";
import "./Header.css";

export const Header = () => {
  const { user, setUser } = useContext(AuthContext);
    const { cart, wishlist, orders, fetchCart, fetchWishlist, fetchOrders } = useContext(EcomContext);

    useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
      fetchOrders();
    }
  }, [user, fetchCart, fetchWishlist, fetchOrders]);

  const handleLogout = async () => {
    try {
      await instance.post("/user/logout", null, {
        withCredentials: true,
      });
      setUser(null);
      alert("Logout successful");
      window.location.href = "/loginform";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/home" style={{ textDecoration: "none", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
          🛍️ MyShop
        </Link>
      </div>

      {user?.role === "admin" ? (
        <nav className="nav-links admin-nav">
          <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link to="/AddProduct" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
            + Add Product
          </Link>

           <Link to="/AllOrders" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
            AllOrders
          </Link>

          <span className="welcome-msg">
            <span className="hello">Welcome Admin, </span>
            <span className="username">{user.name}</span>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      ) : (
        <nav className="nav-links user-nav">
          <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>

          <Link to="/wishlist" className="nav-item-with-indicator" style={{ textDecoration: "none", color: "inherit" }}>
            Wishlist ({wishlist.length})
            {wishlist.length > 0 && (
              <div className="live-dot wishlist-dot">
                <div className="dot-pulse"></div>
              </div>
            )}
          </Link>

          <Link to="/cart" className="nav-item-with-indicator" style={{ textDecoration: "none", color: "inherit" }}>
            Cart ({cart.length})
            {cart.length > 0 && (
              <div className="live-dot cart-dot">
                <div className="dot-pulse"></div>
              </div>
            )}
          </Link>

          <Link to="/GetMyOrders" className="nav-item-with-indicator" style={{ textDecoration: "none", color: "inherit" }}>
            My Orders ({orders.length})
            {orders.length > 0 && (
              <div className="live-dot orders-dot">
                <div className="dot-pulse"></div>
              </div>
            )}
          </Link>

          {user ? (
            <>
              <span className="welcome-msg">
                <span className="hello">Welcome, </span>
                <span className="username">{user.name}</span>
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/loginform" style={{ textDecoration: "none", color: "inherit" }}>
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
