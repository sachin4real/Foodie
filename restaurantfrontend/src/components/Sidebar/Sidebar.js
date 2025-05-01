import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/g_Sidebar.css";

const Sidebar = () => {
  const [restaurantName, setRestaurantName] = useState("MyRestaurant");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const restaurantId = localStorage.getItem("restaurantId");
  console.log("Restaurant ID from localStorage:", restaurantId);

  useEffect(() => {
    if (!restaurantId || restaurantId === "undefined" || restaurantId === "null") {
      console.error("Invalid restaurantId:", restaurantId);
      localStorage.removeItem("restaurantId"); // Cleanup corrupt data
      return;
    }

    const fetchRestaurantName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/restaurants/${restaurantId}`
        );
        setRestaurantName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch restaurant name", err);
        // Fallback to localStorage name if available
        const storedName = localStorage.getItem("restaurantName");
        if (storedName) setRestaurantName(storedName);
      }
    };

    fetchRestaurantName();
  }, [restaurantId]);

  // Auto-close on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="logo">🍴 {restaurantName}</h2>
        <nav>
          <Link
            to="/owner/dashboard"
            className={location.pathname === "/owner/dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/owner/menu"
            className={location.pathname === "/owner/menu" ? "active" : ""}
          >
            Menu
          </Link>
          <Link
            to="/owner/orders"
            className={location.pathname === "/owner/orders" ? "active" : ""}
          >
            Orders
          </Link>
          <Link
            to="/owner/details"
            className={location.pathname === "/owner/details" ? "active" : ""}
          >
            Details
          </Link>
          <Link to="/" className="logout-link">
            Logout
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
