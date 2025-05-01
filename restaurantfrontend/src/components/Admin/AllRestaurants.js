import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/g_AdminRestaurants.css";

// Helper function to check if restaurant is open
const isRestaurantOpen = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return false;

  const now = new Date();
  const [openHour, openMin] = openingTime.split(":").map(Number);
  const [closeHour, closeMin] = closingTime.split(":").map(Number);

  const open = new Date();
  open.setHours(openHour, openMin, 0);

  const close = new Date();
  close.setHours(closeHour, closeMin, 0);

  return now >= open && now <= close;
};



const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingRestaurant, setEditingRestaurant] = useState(null);
const [formData, setFormData] = useState({
  name: "",
  address: "",
  phone: "",
  email: "",
  ownerName: "",
  openingTime: "",
  closingTime: "",
});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/restaurants")
      .then((res) => {
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
      })
      .catch((err) => console.error("Failed to fetch restaurants:", err));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = restaurants.filter((rest) => {
      const name = rest.name ? rest.name.toLowerCase() : "";
      const status = rest.status ? rest.status.toLowerCase() : "";
      return name.includes(term) || status.includes(term);
    });

    setFilteredRestaurants(filtered);
  };

  const handleEdit = (id) => {
    const restaurantToEdit = restaurants.find((rest) => rest.id === id);
    setEditingRestaurant(restaurantToEdit);
    setFormData({
        name: restaurantToEdit.name || "",
        address: restaurantToEdit.address || "",
        phone: restaurantToEdit.phone || "",
        email: restaurantToEdit.email || "",
        ownerName: restaurantToEdit.ownerName || "",
        openingTime: restaurantToEdit.openingTime || "",
        closingTime: restaurantToEdit.closingTime || "",
      });      
  };
  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:8080/api/restaurants/${id}`);
      const updatedList = restaurants.filter((rest) => rest.id !== id);
      setRestaurants(updatedList);
      setFilteredRestaurants(updatedList);
      alert("Restaurant deleted successfully.");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete the restaurant.");
    }
  };
  

  return (
    <div>
      <h2>All Restaurants</h2>
      <input
        type="text"
        placeholder="Search by name or status..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="restaurant-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Restaurant Name</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Owner Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((rest, index) => {
            const openStatus = isRestaurantOpen(rest.openingTime, rest.closingTime);
            return (
              <tr key={rest.id}>
                <td>{index + 1}</td>
                <td>{rest.name}</td>
                <td>{rest.address}</td>
                <td>{rest.phone}</td>
                <td>{rest.email}</td>
                <td>{rest.ownerName}</td>
                <td>
                  <span style={{ color: openStatus ? "green" : "red" }}>
                    {openStatus ? "Open Now" : "Closed Now"}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(rest.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(rest.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingRestaurant && (
  <div className="edit-modal">
    <h3>Edit Restaurant: {editingRestaurant.name}</h3>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await axios.put(`http://localhost:8080/api/restaurants/${editingRestaurant.id}`, formData);
          const updatedList = restaurants.map((rest) =>
            rest.id === editingRestaurant.id ? { ...rest, ...formData } : rest
          );
          setRestaurants(updatedList);
          setFilteredRestaurants(updatedList);
          setEditingRestaurant(null);
          alert("Restaurant updated successfully.");
        } catch (error) {
          console.error("Failed to update restaurant:", error);
          alert("Failed to update the restaurant.");
        }
      }}
    >
      <input
        type="text"
        placeholder="Restaurant Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
      />
      <input
  type="time"
  placeholder="Opening Time"
  value={formData.openingTime}
  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
/>
<input
  type="time"
  placeholder="Closing Time"
  value={formData.closingTime}
  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
/>

      <button type="submit">Save</button>
      <button type="button" onClick={() => setEditingRestaurant(null)}>
        Cancel
      </button>
    </form>
  </div>
)}

    </div>
  );
};

export default AllRestaurants;
