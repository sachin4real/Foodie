import { useCart } from "../context/CartContext";

function FoodCard({ item }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const itemWithRestaurant = {
      ...item,
      restaurantName: item.restaurantName, // ensure this prop exists
    };
    
    // Log the restaurantName
    console.log(itemWithRestaurant.restaurantName);

    addToCart(itemWithRestaurant);
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl overflow-hidden transform hover:scale-105 duration-300 cursor-pointer">
      {/* Food Image */}
      <img 
        src={item.imagePath} 
        alt={item.name} 
        className="h-40 w-full object-cover" 
      />
      {/* Food Info */}
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.description}</p>
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-orange-500 font-bold text-md">Rs. {item.price}</span>
          <button onClick={handleAddToCart} className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
