import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="spinner"></div>;

  if (user) {
    
    return <Navigate to="/Home" replace />;
  }

  return children;
}

export default PublicRoute;
