import { useSidebar } from "../context/SidebarContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom"; // ✅ Import Link

function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { toggleCart, cartItems } = useCart();

  return (
    <div className="flex items-center justify-between p-4 shadow-sm bg-white sticky top-0 z-30">
      
      {/* Left Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 bg-orange-100 rounded-md hover:bg-orange-200 transition"
      >
        ☰
      </button>

      {/* Center Brand */}
      <div className="flex-1 flex justify-center mx-4">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-3xl font-extrabold text-gray-800 hover:text-orange-600 transition">
            <span className="text-orange-500">Foodie</span>
          </h1>
        </Link>
      </div>

      {/* Right Section: Search Bar and Cart */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 md:w-64 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        {/* Cart */}
        <div className="relative">
          <button
            onClick={toggleCart}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            🛒
          </button>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
