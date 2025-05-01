import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/g_RestaurantLoginForm.css";

function RestaurantLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/restaurants/login",
        {
          name,
          password,
        }
      );
      const { token, id, name: restaurantName } = response.data;

     // Store token securely (use HttpOnly cookies in production)
    localStorage.setItem("restaurantToken", token);
    localStorage.setItem("restaurantId", id);
    localStorage.setItem("restaurantName", restaurantName);

      //if (response.data.status === "pending") {
      // setErrorMessage(
      //   "Your request is still pending. Please wait for admin approval."
      //  );
      //  } else if (response.data.status === "approved") {
      // Successful login
      // Ensure data is stored before navigating
      await new Promise((resolve) => setTimeout(resolve, 0));

      navigate("/owner/dashboard");
    } catch (error) {
      setErrorMessage("Invalid credentials or something went wrong.");
    }
  };

  return (
    <div className="rlf-container">
      <h2 className="rlf-title">Restaurant Login</h2>
      <div className="rlf-group">
        <label className="rlf-label">Restaurant Name</label>
        <input
          type="text"
          className="rlf-input"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="rlf-group">
        <label className="rlf-label">Password</label>
        <input
          type="password"
          className="rlf-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

     

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button className="rlf-btn" onClick={handleLogin}>
        Login
      </button>

      {errorMessage && <p className="rlf-error">{errorMessage}</p>}

      <button
        className="rlf-btn rlf-btn-secondary"
        onClick={() => navigate("/createrestaurant")}
      >
        Don't you register the restaurant? Register restaurant
      </button>
    </div>
  );
}

export default RestaurantLogin;
