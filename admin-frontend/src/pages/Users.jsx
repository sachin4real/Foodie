import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);  // State to store users data
  const [loading, setLoading] = useState(true);  // State to handle loading

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8084/api/auth/customers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers if required
          }
        });
        setUsers(response.data); // Set the fetched users data into state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchUsers(); // Call the function to fetch users data
  }, []);

  return (
    <div className="p-6 ml-64 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Manage Users</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          {/* Removed the background color for the header */}
          <thead>
            <tr>
              <th className="py-4 px-6 text-left text-gray-800">User Name</th>
              <th className="py-4 px-6 text-left text-gray-800">Email</th>
              <th className="py-4 px-6 text-left text-gray-800">Mobile Number</th>
              <th className="py-4 px-6 text-left text-gray-800">Status</th>
              <th className="py-4 px-6 text-left text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show a loading message if data is being fetched */}
            {loading ? (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : (
              // Render users dynamically from the API response
              users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100 hover:shadow-md transition-all duration-300">
                    <td className="py-4 px-6">{user.username}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">{user.mobileNumber}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-lg transition-all duration-300">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center text-gray-500">No users found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
