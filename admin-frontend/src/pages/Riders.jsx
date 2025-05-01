// === src/pages/Riders.jsx ===
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-500 text-lg font-medium">Loading Riders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Riders</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-orange-300 to-orange-200 text-gray-800">
            <tr>
              <th className="py-3 px-6">Rider Name</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-6">{rider.name}</td>
                <td className="py-3 px-6">{rider.status}</td>
                <td className="py-3 px-6">
                  <button className="text-orange-500">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Riders;
