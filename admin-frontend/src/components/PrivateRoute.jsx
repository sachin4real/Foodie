// === src/components/PrivateRoute.jsx ===
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Use useEffect to check if the user is logged in (this runs once on component mount)
  useEffect(() => {
    const token = localStorage.getItem("token");  // Check for token in localStorage
    if (token) {
      setIsAuthenticated(true);  // Set authenticated to true if token exists
    } else {
      setIsAuthenticated(false);  // Otherwise, set it to false
    }
  }, []);  // The empty array makes this effect run only once when the component mounts

  // While checking if authenticated, return null to avoid rendering
  if (isAuthenticated === null) {
    return null;  // Optionally, you can show a loading spinner here
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected element
  return element;
};

export default PrivateRoute;
