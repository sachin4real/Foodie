import React from "react";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  const stats = {
    riders: 20,
    customers: 150,
    restaurants: 25,
  };

  return (
    <div className="min-h-screen flex bg-orange-50">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-orange-600 mb-10">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Riders</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.riders}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Customers</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.customers}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Restaurants</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.restaurants}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Orders (Mock)</h2>
          <div className="w-full h-64 bg-orange-100 flex items-center justify-center rounded-lg">
            <p className="text-orange-500 text-lg font-medium">[ Chart Placeholder ]</p>
          </div>
        </div>
      </main>
    </div>
  );
}
