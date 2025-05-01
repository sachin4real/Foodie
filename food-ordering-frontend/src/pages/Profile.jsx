import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8084/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">
          Profile Information
        </h2>

        {user ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Username</label>
              <p className="text-lg font-semibold text-gray-700">{user.username}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="text-lg font-semibold text-gray-700">{user.role}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
