// context/UserContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.get("http://localhost:8084/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        setUser(res.data);
      }).catch(err => {
        console.error("User fetch failed:", err);
        setUser(null);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
