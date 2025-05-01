// === src/components/RestaurantCard.jsx ===
import React from "react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white shadow-md transition rounded-xl overflow-hidden duration-300 cursor-pointer">
      {/* Restaurant Image */}
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="h-40 w-full object-cover" // Match the height to FoodCard
      />
      
      {/* Restaurant Info */}
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{restaurant.name}</h3>
          <p className="text-gray-500 text-sm">{restaurant.address}</p>
        </div>

        {/* Operating hours + Phone number */}
        <div className="mt-4 text-sm text-gray-700">
          <span className="text-orange-500 font-medium">🕒 {restaurant.openingTime} - {restaurant.closingTime}</span>
          <div className="mt-2">📞 {restaurant.phone}</div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
