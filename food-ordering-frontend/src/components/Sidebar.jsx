import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Import UserContext
import {
  FiUser, FiBox, FiHeart, FiCreditCard, FiHelpCircle,
  FiGift, FiLogOut
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Access user data from context

  const handleSignOut = () => {
    localStorage.removeItem("token"); // ✅ Clear token
    toggleSidebar(); // ✅ Close sidebar
    navigate("/login"); // ✅ Redirect to login page
    window.location.reload(); // ✅ Full reload (optional but recommended for full logout reset)
  };

  const menuItems = [
    { label: "Manage Account", icon: <FiUser />, route: "/profile" },
    { label: "Orders", icon: <FiBox />, route: "/orders" },
    { label: "Favorites", icon: <FiHeart /> },
    { label: "Help", icon: <FiHelpCircle /> },
    { label: "Promotions", icon: <FiGift /> },
    { label: "Sign Out", icon: <FiLogOut />, action: handleSignOut },
  ];

  return (
    <div className={`fixed top-0 left-0 bg-white shadow-md w-64 h-full p-5 transition-transform duration-300 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button
        onClick={toggleSidebar}
        className="mb-6 p-2 bg-red-400 text-white rounded"
      >
        Close
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
        {/* Display the user's name here */}
        <p className="font-semibold text-lg">{user ? user.username : "User"}</p> {/* Show user name */}
        <button
          className="text-orange-500 text-sm"
          onClick={() => {
            toggleSidebar();
            navigate("/profile");
          }}
        >
          Manage account
        </button>
      </div>

      <ul className="space-y-6">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 text-gray-700 hover:text-orange-600 cursor-pointer"
            onClick={() => {
              toggleSidebar();
              if (item.action) {
                item.action();
              } else if (item.route) {
                navigate(item.route);
              }
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-md">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
