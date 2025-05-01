// EditMenuItemForm.jsx
import React, { useState } from "react";
import axios from "axios";

const EditMenuItemForm = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedPrice = formData.price.toString().replace(/[^\d]/g, "");
      const updatedItem = {
        ...formData,
        price: parseFloat(cleanedPrice),
      };

      await axios.put(`http://localhost:8081/api/menu/update/${item.id}`, updatedItem);
      alert("Menu item updated!");
      onUpdate(); // reload list
      onClose();  // close modal or form
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update item.");
    }
  };

  return (
    <div className="edit-form-container">
      <h3>Edit Menu Item</h3>
      <form onSubmit={handleSubmit} className="menu-form">
        <input name="name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" value={formData.description} onChange={handleChange} required />
        <input name="price" value={formData.price} onChange={handleChange} required />
        <input name="imagePath" value={formData.imagePath} onChange={handleChange} required />
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditMenuItemForm;
