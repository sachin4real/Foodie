import React, { useState } from "react";
import axios from "axios";
import "../../styles/g_EditMenuItemForm.css";

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
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update item.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Menu Item</h3>
        <form onSubmit={handleSubmit} className="menu-form">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Item Name"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <input
            name="imagePath"
            value={formData.imagePath}
            onChange={handleChange}
            placeholder="Image URL"
            required
          />
          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemForm;
