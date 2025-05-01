import { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8081/api/restaurants")
      .then((res) => {
        setRestaurants(res.data);
        res.data.forEach((restaurant) => {
          axios.get(`http://localhost:8081/api/menu/${restaurant.id}`)
            .then((menuRes) => {
              setMenuItems(prev => ({ ...prev, [restaurant.id]: menuRes.data }));
            });
        });
      })
      .catch((err) => {
        console.error("Error fetching restaurants:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-6">🍽 All Restaurants (Admin View)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
              <div className="text-gray-500 text-sm">
                {restaurant.address} | 📞 {restaurant.phone}
              </div>
              <div className="text-orange-500 font-medium text-sm">
                🕒 {restaurant.openingTime} - {restaurant.closingTime}
              </div>
            </div>

            <div className="bg-gray-50 p-4">
              <h4 className="text-orange-500 text-sm font-semibold mb-2">Menu</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(menuItems[restaurant.id] || []).map((item) => (
                  <div key={item.id} className="bg-white border rounded p-2 flex items-center space-x-3">
                    <img src={item.imagePath} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h5 className="font-medium text-sm text-gray-800">{item.name}</h5>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      <span className="text-sm text-orange-600 font-semibold">Rs. {item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
