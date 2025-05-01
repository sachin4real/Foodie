// === src/components/Sidebar.jsx ===
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaHome, FaUser, FaMotorcycle, FaStore, FaMoneyBillWave, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize navigate to use for redirection

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white shadow-md border-r min-h-screen p-4 fixed">
      <div className="text-2xl font-bold text-orange-500 mb-10 text-center">Foodie.lk</div>
      <nav className="space-y-4">
        <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaHome className="mr-3" /> Dashboard
        </Link>
        <Link to="/restaurants" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaStore className="mr-3" /> Restaurants
        </Link>
        <Link to="/users" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaUser className="mr-3" /> Users
        </Link>
        <Link to="/riders" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaMotorcycle className="mr-3" /> Riders
        </Link>
        <Link to="/financials" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaMoneyBillWave className="mr-3" /> Financials
        </Link>
        <Link to="/profile" className="flex items-center text-gray-700 hover:text-orange-500">
          <FaUserCircle className="mr-3" /> Profile
        </Link>
      </nav>
      <div
        className="absolute bottom-6 left-6 text-sm text-orange-500 cursor-pointer"
        onClick={handleLogout} // Call handleLogout when clicked
      >
        Log out
      </div>
    </div>
  );
};

export default Sidebar;
