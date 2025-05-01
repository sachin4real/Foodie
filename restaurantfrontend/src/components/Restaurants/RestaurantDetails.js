import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/g_RestaurantDetails.css";

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

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantName = localStorage.getItem("restaurantName");

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/restaurants/${restaurantId}`)
      .then((res) => {
        setRestaurant(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error(err));
  }, [restaurantId, restaurantName]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/restaurants/${restaurantId}`,
        formData
      );
      console.log("Received response:", response.data);
      // Update both restaurant state and formData with the response from server
      setRestaurant(response.data);
      setFormData(response.data);

      alert("Profile updated successfully");
      setEditMode(false);
      setRestaurant(formData);
    } catch (error) {
      alert("Update failed");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(
          `http://localhost:8081/api/restaurants/${restaurantId}`
        );
        alert("Profile deleted successfully");
        localStorage.removeItem("restaurantId");
        window.location.href = "/owner/dashboard";
      } catch (error) {
        alert("Delete failed");
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!restaurant) return <p>Loading...</p>;

  const openStatus =
    restaurant?.openingTime && restaurant?.closingTime
      ? isRestaurantOpen(restaurant.openingTime, restaurant.closingTime)
      : false;

  return (
    <div className="restaurant-profile">
      {restaurant.image && (
        <div className="restaurant-image-container">
          <img
            src={`${restaurant.image}?${new Date().getTime()}`}
            alt="Restaurant"
            className="restaurant-image"
          />
        </div>
      )}
      <h2 className="profile-title">Restaurant Profile</h2>

      {editMode ? (
        <div className="form-section">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Owner Name"
          />
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image"
          />

          <div className="time-fields">
            <div>
              <label>Opening Time</label>
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Closing Time</label>
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleUpdate} className="save-button">
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="details-section">
          <div className="info-group">
            <p>
              <strong>Name:</strong> {restaurant.name}
            </p>
            <p>
              <strong>Email:</strong> {restaurant.email}
            </p>
            <p>
              <strong>Password:</strong> {restaurant.password}
            </p>
            <p>
              <strong>Phone:</strong> {restaurant.phone}
            </p>
            <p>
              <strong>Address:</strong> {restaurant.address}
            </p>
            <p>
              <strong>Owner:</strong> {restaurant.ownerName}
            </p>
            <p>
              <strong>Opening Time:</strong> {restaurant.openingTime}
            </p>
            <p>
              <strong>Closing Time:</strong> {restaurant.closingTime}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={openStatus ? "open" : "closed"}>
                {openStatus ? "Open Now" : "Closed Now"}
              </span>
            </p>
          </div>

          <div className="button-group">
            <button onClick={() => setEditMode(true)} className="edit-button">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
