import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/restaurants");
        setRestaurants(res.data); // Set fetched restaurant data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Restaurants</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden duration-300"
          >
            {/* Restaurant Info */}
            <Link to={`/admin/restaurant/${restaurant.id}`}>
              <img
                src={restaurant.image}  // Assuming the restaurant has an image URL
                alt={restaurant.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{restaurant.name}</h3>
                <div className="text-sm text-gray-500 flex justify-between mb-1">
                  <span>{restaurant.address}</span>
                  <span>{restaurant.phone}</span>
                </div>
                <div className="text-orange-500 font-medium">
                  🕒 {restaurant.openingTime} - {restaurant.closingTime}
                </div>
                {/* Set Status to Active */}
                <div className="text-sm font-semibold mt-2 text-green-500">
                  Status: Active
                </div>
              </div>
            </Link>
            {/* Button to manage restaurant */}
            <div className="p-4 bg-gray-50">
              <Link to={`/admin/restaurant/edit/${restaurant.id}`} className="text-blue-500 hover:text-blue-700 font-semibold">
                Edit Restaurant
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
