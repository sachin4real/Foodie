// src/components/Admin/AdminSidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/g_Sidebar.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Auto-close on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="logo">🛠️ Admin</h2>
        <nav>
          <Link 
            to="/admin/dashboard" 
            className={location.pathname === '/admin/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/restaurants" 
            className={location.pathname === '/admin/restaurants' ? 'active' : ''}
          >
            Restaurants
          </Link>
          <Link 
            to="/admin/profiles" 
            className={location.pathname === '/admin/profiles' ? 'active' : ''}
          >
            Profiles
          </Link>
          {/* Add more admin tabs here */}
          <Link to="/" className="logout-link">Logout</Link>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
