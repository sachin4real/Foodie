// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import UserTable from "../components/UserTable";

// export default function Users() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8080/api/users")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.error("Failed to fetch users", err));
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-orange-600 mb-4">All Users</h1>
//       <UserTable users={users} />
//     </div>
//   );
// }
