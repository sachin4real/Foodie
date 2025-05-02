// === src/App.jsx ===
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  // Import Navigate
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import Users from './pages/Users';
import Riders from './pages/Riders';
import Financials from './pages/Financials';
import Profile from './pages/Profile';
import Login from './pages/Login';
import RegisterAdmin from './pages/Register';
import PrivateRoute from './components/PrivateRoute';  // Import the updated PrivateRoute component

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/register" element={<RegisterAdmin />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Route for Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/restaurants" element={<PrivateRoute element={<Restaurants />} />} />
            <Route path="/users" element={<PrivateRoute element={<Users />} />} />
            <Route path="/riders" element={<PrivateRoute element={<Riders />} />} />
            <Route path="/financials" element={<PrivateRoute element={<Financials />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

            {/* Default route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
