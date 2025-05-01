// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white p-6 border-r shadow-md h-screen sticky top-0">
      <h2 className="text-3xl font-extrabold text-orange-500 mb-10 flex items-center gap-2">
        <span role="img" aria-label="logo">🍽</span> Foodie
      </h2>
      <nav className="space-y-4 text-lg font-medium text-gray-700">
        <button
          onClick={() => navigate("/")}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/dashboard/riders")}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 transition"
        >
          Riders
        </button>
        <button
          onClick={() => navigate("/dashboard/users")}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 transition"
        >
          Users
        </button>
        <button
          onClick={() => navigate("/dashboard/restaurants")}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 transition"
        >
          Restaurants
        </button>
      </nav>
    </aside>
  );
}
