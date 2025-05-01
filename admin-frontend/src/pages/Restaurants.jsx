// === src/pages/Restaurants.jsx ===
import { useEffect, useState } from "react";
import axios from "axios";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-500 text-lg font-medium">Loading Restaurants...</div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Restaurants</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-orange-300 to-orange-200 text-gray-800">
            <tr>
              <th className="py-3 px-6">Restaurant Name</th>
              <th className="py-3 px-6">Address</th>
              <th className="py-3 px-6">Opening Time</th>
              <th className="py-3 px-6">Closing Time</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr
                key={restaurant.id}
                className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="py-3 px-6">{restaurant.name}</td>
                <td className="py-3 px-6">{restaurant.address}</td>
                <td className="py-3 px-6">{restaurant.openingTime}</td>
                <td className="py-3 px-6">{restaurant.closingTime}</td>
                <td className="py-3 px-6">{restaurant.phone}</td>
                <td className="py-3 px-6">
                  <button className="text-orange-500">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Restaurants;
