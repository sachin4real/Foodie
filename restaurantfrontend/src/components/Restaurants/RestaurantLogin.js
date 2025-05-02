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
        { name, password }
      );
      const { token, id, name: restaurantName } = response.data;
      localStorage.setItem("restaurantToken", token);
      localStorage.setItem("restaurantId", id);
      localStorage.setItem("restaurantName", restaurantName);
      await new Promise((resolve) => setTimeout(resolve, 0));
      navigate("/owner/dashboard");
    } catch (error) {
      setErrorMessage("Invalid credentials or something went wrong.");
    }
  };

  return (
    <div className="login-bg-food">
      <div className="login-food-card">
        <h2 className="login-title-food">Restaurant Login</h2>
        <div className="login-group-food">
          <label>Restaurant Name</label>
          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="login-group-food">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="login-error-food">{errorMessage}</p>}
        <button className="login-btn-food" onClick={handleLogin}>
          Login
        </button>
        <button
          className="login-btn-secondary-food"
          onClick={() => navigate("/createrestaurant")}
        >
          Don't have a restaurant? Register here
        </button>
      </div>
    </div>
  );
}

export default RestaurantLogin;
