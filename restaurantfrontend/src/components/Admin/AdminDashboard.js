import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../../styles/g_AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
