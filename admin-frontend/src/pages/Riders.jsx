import { useEffect, useState } from "react";
import axios from "axios";

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await axios.get("http://localhost:8083/riders/all"); // Use the correct API endpoint for all riders
        setRiders(res.data); // Assuming the response data contains the list of riders
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchRiders();
  }, []);

  return (
    <div className="p-6 ml-64 bg-white min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Manage Riders</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          {/* Table header with a white background */}
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="py-4 px-6 text-left">Rider Name</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show a loading message if data is being fetched */}
            {loading ? (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : (
              // Render rider data dynamically
              riders.length > 0 ? (
                riders.map((rider, index) => (
                  <tr key={rider.id} className={`hover:bg-gray-50 hover:shadow-md transition-all duration-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-4 px-6">{rider.name}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          rider.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {rider.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-lg transition-all duration-300">
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center text-gray-500">No riders found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Riders;
