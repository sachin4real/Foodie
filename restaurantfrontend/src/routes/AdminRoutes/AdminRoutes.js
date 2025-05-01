import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../../components/Admin/AdminDashboard";
import AllRestaurants from "../../components/Admin/AllRestaurants";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route path="dashboard" element={<div>Welcome to Admin Dashboard</div>} />
        <Route path="restaurants" element={<AllRestaurants />} />
        </Route>
    </Routes>
  );
};

export default AdminRoutes;
