// src/routes/OwnerRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Dashboard from "../../components/Dashboard/Dashboard";
import RestaurantDetails from "../../components/Restaurants/RestaurantDetails";
import AddMenuItemForm from "../../components/MenuItem/AddMenuItemForm";


const OwnerRoutes = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="details" element={<RestaurantDetails />} />
          <Route
  path="menu"
  element={
    <AddMenuItemForm restaurantId={localStorage.getItem("restaurantId")} />
  }
/>
        </Routes>
      </div>
    </div>
  );
};

export default OwnerRoutes;
