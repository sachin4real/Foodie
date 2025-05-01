import React from "react";
import MenuItemTable from "../MenuItem/MenuItemTable";
import '../../styles/g_Dashboard.css';

const Dashboard = () => {
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantName = localStorage.getItem("restaurantName");
  console.log("restaurantName=",restaurantName);

  // Example stats – replace with real data as needed
  const stats = [
    { label: "Today's Orders", value: 24 },
    { label: "Active Menu Items", value: 42 },
    { label: "Revenue (Today)", value: "LKR 7500" },
  ];

  return (
    <div className="dashboard-content">
       <div className="dashboard-inner">
      <h1 className="dashboard-title">Restaurant Owner Dashboard</h1>
      <p className="dashboard-description">
        Welcome back! Here you can efficiently manage your restaurant’s menu, track orders, and monitor key business metrics-all in one place.
      </p>

      <div className="dashboard-stats">
        {stats.map((stat, idx) => (
          <div className="dashboard-stat-card" key={idx}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      </div>

      <h2 className="dashboard-section-title">Menu Management</h2>
      <MenuItemTable restaurantId={restaurantId} restaurantName={restaurantName} />
      
    </div>
  );
};

export default Dashboard;
