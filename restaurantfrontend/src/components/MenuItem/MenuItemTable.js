import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../styles/g_MenuItemTable.css";
import EditMenuItemForm from "./EditMenuItemForm";
import AddMenuItemForm from "./AddMenuItemForm";

const MenuItemTable = ({ restaurantId, restaurantName, showAddForm }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/menu/${restaurantId}`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:8081/api/menu/${id}`);
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="table-container">
      <h2>🍽️ Menu Items</h2>
      {showAddForm && (
      <AddMenuItemForm
        restaurantId={restaurantId}
        restaurantName={restaurantName}
      />
      )}
      {editingItem && (
        <EditMenuItemForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={fetchMenuItems}
        />
      )}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price (Rs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    className="item-image"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>Rs. {item.price}</td>
                <td className="actions-cell">
                  <button onClick={() => setEditingItem(item)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuItemTable;
