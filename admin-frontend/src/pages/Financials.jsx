// === src/pages/Financials.jsx ===
const Financials = () => {
  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Financial Overview</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-lg font-medium text-gray-800">Total Earnings: Rs. 1,200,000</p>
        <p className="text-lg font-medium text-gray-800">Expenses: Rs. 800,000</p>
        <p className="text-lg font-bold mt-2 text-gray-800">Net Profit: Rs. 400,000</p>
      </div>
    </div>
  );
};

export default Financials;
