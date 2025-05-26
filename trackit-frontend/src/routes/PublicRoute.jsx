// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
