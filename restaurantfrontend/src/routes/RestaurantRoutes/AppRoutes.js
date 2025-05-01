// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";
import OwnerRoutes from "./OwnerRoutes";
import AdminRoutes from "../AdminRoutes/AdminRoutes";
import RestaurantLogin from "../../components/Restaurants/RestaurantLogin";

const AppRoutes = () => {
  return (
    <Routes>
       <Route path="/" element={<RestaurantLogin />} />
      
      {/* Route for AddRestaurantForm */}
      <Route path="/createrestaurant" element={<AddRestaurantForm />} />

     

      <Route path="/owner/*" element={<OwnerRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
