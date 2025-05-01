// === src/pages/RegisterAdmin.jsx ===
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8084/api/auth/register/admin", form);
      alert("Admin Registered Successfully");
      navigate("/login");  // Navigate to login after successful registration
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register Admin</h1>
      <input
        className="border p-2 mb-2"
        type="text"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="border p-2 mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-red-500 text-white px-4 py-2" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
