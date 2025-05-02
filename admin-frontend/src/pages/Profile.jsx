// === src/pages/Profile.jsx ===
const Profile = () => {
    return (
      <div className="p-6 ml-64 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
        <div className="bg-white shadow-md rounded-xl p-6 max-w-xl">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value="Admin User"
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value="admin@foodie.lk"
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="text"
              value="+94 77 123 4567"
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
  
          <button className="mt-4 bg-orange-300 hover:bg-orange-400 text-white py-2 px-6 rounded-lg transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    );
  };
  
  export default Profile;
  