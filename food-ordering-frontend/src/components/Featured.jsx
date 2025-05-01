// components/Featured.js
import FoodCard from "./FoodCard";

function Featured({ items = [] }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">Popular Dishes 🍴</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <FoodCard key={item.id || index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Featured;
