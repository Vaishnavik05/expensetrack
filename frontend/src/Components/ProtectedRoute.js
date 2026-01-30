import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  console.log("ProtectedRoute check - Token exists:", !!token);

  if (!token) {
    console.warn("No token - redirecting to login");
    return <Navigate to="/login" />;
  }

  console.log("✓ Token valid - rendering protected component");
  return children;
}

export default ProtectedRoute;
