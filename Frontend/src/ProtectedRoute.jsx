import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // console.log(location);

  if (loading) return <div className="spinner"></div>;

  //  if (location.pathname === "/wishlist" && !user) {
  //   return <Navigate to="/LoginForm" state={{ from: location }} replace />;
  // }



    if (location.pathname === "/wishlist") {
    if (!user) {
      return <Navigate to="/home" state={{ from: location }} replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/home" replace />;
    }
  }

  if (location.pathname === "/AddProduct" && user?.role !== "admin") {
    return <Navigate to="/home" replace />; 
  }

  if (!user) {
    return <Navigate to="/LoginForm" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
