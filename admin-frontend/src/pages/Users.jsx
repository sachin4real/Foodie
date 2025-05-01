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
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-orange-300 to-orange-200 text-gray-800">
            <tr>
              <th className="py-3 px-6">User Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Mobile Number</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show a loading message if data is being fetched */}
            {loading ? (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">Loading...</td>
              </tr>
            ) : (
              // Render users dynamically from the API response
              users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-6">{user.username}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.mobileNumber}</td>
                    <td className="py-3 px-6">{user.status}</td>
                    <td className="py-3 px-6">
                      <button className="text-orange-500">Deactivate</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center">No users found</td>
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
