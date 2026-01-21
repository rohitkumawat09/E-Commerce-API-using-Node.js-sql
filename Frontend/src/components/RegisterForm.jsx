// import { Link } from "react-router-dom";
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { instance } from "../../axiosConfig";
// // Import the axios instance

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//     const navigate = useNavigate();
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await instance.post(
//         "/user/register",
//         formData,
//         { withCredentials: true }
//       );
//       alert("Registration successful!");
//       navigate("/loginform");

//       console.log(res.data);
//     } catch (err) {
//       console.error(err.response?.data);
//       alert(err.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2 className="auth-title">Register</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           name="name"
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="auth-input"
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="auth-input"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="auth-input"
//         />
//         <button type="submit" className="auth-button">Register</button>

        
//         <Link to="/loginform"><h3>LoginForm</h3></Link>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;

import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../../axiosConfig";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await instance.post("/user/register", formData, {
        withCredentials: true
      });
      alert("Registration successful!");
      console.log(res.data);
      navigate("/loginform");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-button">Register</button>
        <Link to="/loginform"><h3>Login</h3></Link>
      </form>
    </div>
  );
};

export default RegisterForm;
