import { useEffect, useState } from "react";
import axios from "axios";
import Categories from "../components/Categories";
import Featured from "../components/Featured";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantsAndMenus = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/restaurants");
        const fetchedRestaurants = res.data;
        setRestaurants(fetchedRestaurants);

        const menuPromises = fetchedRestaurants.map((restaurant) =>
          axios.get(`http://localhost:8081/api/menu/${restaurant.id}`)
        );
        

        const menus = await Promise.all(menuPromises);

        const menuMap = {};
        fetchedRestaurants.forEach((restaurant, index) => {
          menuMap[restaurant.id] = menus[index].data;
        });

        setMenuItems(menuMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsAndMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-500 text-lg font-medium">Loading Restaurants...</div>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Categories */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <Categories />
      </div>

      {/* Global Featured Section */}
      <Featured items={Object.values(menuItems).flat().slice(0, 8)} />

      {/* Restaurants + Menus */}
      <main className="p-6 pt-0">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Restaurants on Foodie 🍽️</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden duration-300"
            >
              {/* Restaurant Info */}
              <img
                src={restaurant.image}
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
              </div>

              {/* Menu */}
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-semibold mb-2 text-orange-500">Menu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(menuItems[restaurant.id] || []).map((item) => (
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
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
