// === src/pages/Dashboard.jsx ===
const Dashboard = () => {
  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Foodie.lk Dashboard</h2>
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Search for dishes, restaurants..." 
            className="px-4 py-2 border rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sales Card */}
        <div className="bg-green-100 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-green-800">Sales</h3>
            <p className="text-gray-700 text-lg">Rs. 230,220</p>
            <p className="text-sm text-green-600">+55% last month</p>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-blue-100 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-blue-800">Customers</h3>
            <p className="text-gray-700 text-lg">Rs. 3,200</p>
            <p className="text-sm text-blue-600">+12% last month</p>
          </div>
        </div>

        {/* Avg Revenue Card */}
        <div className="bg-red-100 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-red-800">Avg Revenue</h3>
            <p className="text-gray-700 text-lg">Rs. 2,300</p>
            <p className="text-sm text-red-600">+210% last month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="font-semibold text-lg mb-4">Revenue Chart</h4>
          <div className="w-full h-48 bg-orange-100 rounded-lg flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>

        {/* Website Visitors Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="font-semibold text-lg mb-4">Website Visitors</h4>
          <div className="w-full h-48 bg-orange-100 rounded-lg flex items-center justify-center text-gray-400">
            [Pie Chart Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
