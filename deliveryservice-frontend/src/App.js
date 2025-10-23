// src/App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import RiderRegistrationPage from './pages/RiderRegistrationPage/RiderRegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RiderDashboardPage from './pages/RiderDashboardPage/RiderDashboardPage';
import RiderDeliveriesPage from './pages/RiderDeliveriesPage/RiderDeliveriesPage';

// ✅ import delivery-service APIs for status
import { getMe, setOnlineStatus } from './services/api';

const RequireAuth = () => {
  const token = localStorage.getItem('riderToken');
  return token ? <Outlet /> : <Navigate to="/riders/login" replace />;
};

const AppLayout = () => {
  const navigate = useNavigate();

  // ---- Navbar state: dark theme + rider availability ----
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [online, setOnline] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Load current rider status once after login
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe().then(r => r.data).catch(() => null);
        if (mounted && me && typeof me.status !== 'undefined') {
          setOnline(!!me.status);
        }
      } finally {
        setLoadingStatus(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Apply/remove the `dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggleDark = () => setDark(v => !v);

  const toggleOnline = async () => {
    try {
      await setOnlineStatus(!online);
      setOnline(prev => !prev);
    } catch {
      // optional: toast
      console.error('Failed to change availability');
    }
  };

  const logout = () => {
    localStorage.removeItem('riderToken');
    navigate('/riders/login', { replace: true });
  };

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
  const linkActive = 'bg-white/10 text-white';
  const linkIdle = 'text-gray-300 hover:text-white hover:bg-white/10';

  return (
    <div className="min-h-screen">
      {/* SINGLE, sticky top nav for the portal */}
      <header className="sticky top-0 z-50 bg-gray-900 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2">
            <NavLink
              to="/rider/dashboard"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/rider/deliveries"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              My Deliveries
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {/* Online/Offline toggle */}
            <button
              onClick={toggleOnline}
              disabled={loadingStatus}
              title="Toggle availability"
              className={`px-3 py-1 rounded-full text-sm shadow ${
                online ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-900'
              } disabled:opacity-60`}
            >
              {online ? '🟢 Online' : '⚪ Offline'}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
              title="Toggle dark mode"
            >
              {dark ? '☀️ Light' : '🌙 Dark'} Mode
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* All protected pages render beneath the single navbar */}
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/riders/register" element={<RiderRegistrationPage />} />
        <Route path="/riders/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/rider/dashboard" element={<RiderDashboardPage />} />
            <Route path="/rider/deliveries" element={<RiderDeliveriesPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
