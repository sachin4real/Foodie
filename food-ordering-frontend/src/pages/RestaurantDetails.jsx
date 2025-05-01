// === src/pages/RestaurantDetails.jsx ===
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function RestaurantDetails() {
  const { id } = useParams(); // Get restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/restaurants/${id}`);
        setRestaurant(res.data); // Set restaurant details

        const menuRes = await axios.get(`http://localhost:8081/api/menu/${id}`);
        setMenuItems(menuRes.data); // Set menu items
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-500 text-lg font-medium">Loading Restaurant...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto"> {/* Increased max width */}
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">{restaurant.name}</h2>

        {/* Restaurant Image */}
        <img
          src={restaurant.image}  
          alt={restaurant.name}
          className="h-64 w-full object-cover mb-4 rounded-lg"
        />

        <div className="text-gray-700 mb-4">{restaurant.address}</div>
        <div className="text-gray-500">{restaurant.phone}</div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-4">Menu</h3>
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 border border-gray-200 p-2 rounded-md bg-white"
              >
                <img
                  src={item.imagePath}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h5 className="font-medium text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-500">{item.description}</p>
                  <span className="text-orange-500 text-sm font-semibold">
                    Rs. {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
