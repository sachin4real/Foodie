import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p className="mt-4">Please login or register first.</p>
        <div className="flex gap-4 mt-6">
          <button className="bg-green-500 text-white px-4 py-2" onClick={() => navigate("/login/customer")}>
            Customer Login
          </button>
          <button className="bg-red-500 text-white px-4 py-2" onClick={() => navigate("/login/admin")}>
            Admin Login
          </button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => navigate("/register/customer")}>
            Register Customer
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2" onClick={() => navigate("/register/admin")}>
            Register Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">🏠 Home Page</h1>
      <p>You are logged in!</p>
      <button
        className="mt-6 bg-blue-500 text-white px-4 py-2"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
