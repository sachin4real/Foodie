import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RiderRegistrationPage from './pages/RiderRegistrationPage/RiderRegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RiderDashboardPage from './pages/RiderDashboardPage/RiderDashboardPage';
import RiderDeliveriesPage from './pages/RiderDeliveriesPage/RiderDeliveriesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/riders/register" element={<RiderRegistrationPage />} />
        <Route path="/riders/login" element={<LoginPage />} />
        <Route path="/rider/dashboard" element={<RiderDashboardPage />} />
        <Route path="/rider/deliveries" element={<RiderDeliveriesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
