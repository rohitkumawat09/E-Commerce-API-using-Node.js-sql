import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { instance } from "../../axiosConfig";
import { EcomContext } from "../UseContext";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const referer =
    new URLSearchParams(location.search).get("referer") || "/home";

  const { fetchCart, fetchWishlist } = useContext(EcomContext);
  const { fetchUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await instance.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );

      alert("Login successful");

      // setUser(res.data.user);
      await fetchUser();
      await fetchCart();
      await fetchWishlist();

      if (res.data.user.role === "admin") {
        navigate("/AddProduct");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-heading">Login</h2>

      <input
        type="email"
        className="form-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="form-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="form-button">
        Login
      </button>

      <Link to="/">
        <h3>RegisterForm</h3>
      </Link>
    </form>
  );
};

export default LoginForm;
