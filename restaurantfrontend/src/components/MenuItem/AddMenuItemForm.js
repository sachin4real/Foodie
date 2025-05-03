import React, { useState } from "react";
import axios from "axios";
import "../../styles/g_AddMenuItemForm.css";

const AddMenuItemForm = ({ restaurantId, restaurantName }) => {
  const resolvedRestaurantName =
    restaurantName || localStorage.getItem("restaurantName");
  const [menuItem, setMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    imagePath: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedPrice = menuItem.price.replace(/[^\d]/g, ""); // removes Rs. and any symbols
      const priceAsNumber = parseFloat(cleanedPrice); // convert to number

      const newItem = {
        ...menuItem,
        restaurantId,
        restaurantName: resolvedRestaurantName,
        price: priceAsNumber,
      };
      console.log("restaurantName=", restaurantName);
      await axios.post("http://localhost:8081/api/menu/add", newItem);
      alert("Menu item added successfully!");
      setMenuItem({ name: "", description: "", price: "", imagePath: "" });
    } catch (err) {
      console.error("Error adding menu item:", err);
      alert("Failed to add menu item.");
    }
  };

  return (
    <div className="menu-form-container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="menu-form">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={menuItem.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={menuItem.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imagePath"
          placeholder="Image URL or Path"
          value={menuItem.imagePath}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Menu Item</button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;
