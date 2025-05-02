import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8084/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data); // Set the user data if the token is valid
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setUser(null); // Set user to null if fetching fails
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
