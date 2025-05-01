// RiderDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { getAssignedDeliveries } from '../../services/api';
import RiderNotification from '../../components/RiderNotification/RiderNotification';
import { Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const RiderDashboardPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [tempDelivery, setTempDelivery] = useState(null);
  const [timer, setTimer] = useState(60);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [darkMode, setDarkMode] = useState(false);

  let riderEmail = "";
  try {
    const token = localStorage.getItem('riderToken');
    if (token) {
      const decoded = jwtDecode(token);
      riderEmail = decoded.sub;
    }
  } catch (error) {
    console.error('Error decoding token', error);
  }

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await getAssignedDeliveries(riderEmail);
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries', error);
      setLoading(false);
    }
  };

  const startTimerCountdown = () => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowNotification(false);
          setTempDelivery(null);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAssignDelivery = async () => {
    const newDelivery = {
      orderId: "ORD12345",
      customerId: "1234412",
      deliveryPersonnelId: riderEmail,
      status: "ASSIGNED",
      location: "Kalutara, Nagoda",
      customerAddress: "Kalutara, Panadura",
      deliveryTime: new Date('2025-04-28T10:00:00'),
      orderAmount: 750.00,
    };
    setTempDelivery(newDelivery);
    setShowNotification(true);
    startTimerCountdown();
  };

  const handleAcceptDelivery = async () => {
    try {
      await axios.post('http://localhost:8083/deliveries', tempDelivery);
      fetchDeliveries();
      setShowNotification(false);
      showToast("✅ Delivery Accepted!");
    } catch (error) {
      console.error('Error accepting delivery', error);
    }
  };

  const handleDeclineDelivery = () => {
    setTempDelivery(null);
    setShowNotification(false);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const totalDelivered = deliveries.filter(d => d.status === "DELIVERED").length;
  const totalOngoing = deliveries.filter(d => d.status !== "DELIVERED").length;
  const totalEarnings = deliveries
    .filter(d => d.status === "DELIVERED")
    .reduce((sum, d) => sum + (d.orderAmount * 0.05), 0)
    .toFixed(2);

  const today = new Date();
  const todaysEarnings = deliveries
    .filter(d => {
      const deliveryDate = new Date(d.deliveryTime);
      return d.status === "DELIVERED" &&
        deliveryDate.getDate() === today.getDate() &&
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, d) => sum + (d.orderAmount * 0.05), 0)
    .toFixed(2);

  const deliveryStatusChart = [
    { name: 'Assigned', value: deliveries.filter(d => d.status === 'ASSIGNED').length },
    { name: 'Picked Up', value: deliveries.filter(d => d.status === 'PICKED_UP').length },
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'DELIVERED').length },
  ];

  const weeklyEarnings = (() => {
    let result = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);

      const earnings = deliveries
        .filter(d => {
          const deliveryDate = new Date(d.deliveryTime);
          return d.status === "DELIVERED" &&
            deliveryDate.getDate() === day.getDate() &&
            deliveryDate.getMonth() === day.getMonth() &&
            deliveryDate.getFullYear() === day.getFullYear();
        })
        .reduce((sum, d) => sum + (d.orderAmount * 0.05), 0);

      result.push({
        date: day.toLocaleDateString('en-US', { weekday: 'short' }),
        earnings: parseFloat(earnings.toFixed(2)),
      });
    }
    return result;
  })();

  if (loading) {
    return <div className="text-center text-xl mt-10 animate-pulse">Loading...</div>;
  }

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-white'} min-h-screen flex flex-col`}>
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 space-x-6">
          <nav className="space-x-6">
            <a href="#dashboard" className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600">Dashboard</a>
            <a href="/rider/deliveries" className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600">My Deliveries</a>
          </nav>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-200 dark:bg-gray-600 text-sm px-4 py-1 rounded-full">
            {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon="📦" title="Deliveries Completed" value={totalDelivered} color="green" />
          <StatCard icon="🛻" title="Ongoing Deliveries" value={totalOngoing} color="yellow" />
          <StatCard icon="💸" title="Total Earnings" value={`Rs.${(totalEarnings * 300).toFixed(2)}`} color="blue" />
          <StatCard icon="📅" title="Today's Earnings" value={`Rs.${(todaysEarnings * 300).toFixed(2)}`} color="indigo" />

        </div>

        <div className="text-center">
          
        </div>

        <DashboardChart title="📦 Delivery Status" data={deliveryStatusChart} dataKey="value" fill="#38bdf8" labelKey="name" />
        <DashboardChart title="📈 Weekly Earnings" data={weeklyEarnings} dataKey="earnings" fill="#4ade80" labelKey="date" />

        {showNotification && tempDelivery && (
          <RiderNotification
            delivery={tempDelivery}
            onClose={handleDeclineDelivery}
            onAccept={handleAcceptDelivery}
            timer={timer}
          />
        )}

        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toast.message}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t text-center text-gray-500 dark:text-gray-400 text-sm py-6">
        © 2025 Foody Express
      </footer>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className={`p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition bg-opacity-80 ${
    color === 'green' ? 'bg-green-200 dark:bg-green-800' :
    color === 'yellow' ? 'bg-yellow-200 dark:bg-yellow-700' :
    color === 'blue' ? 'bg-blue-200 dark:bg-blue-800' :
    color === 'indigo' ? 'bg-indigo-200 dark:bg-indigo-800' :
    'bg-gray-200 dark:bg-gray-700'
  }`}>
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="font-bold text-lg mt-2 dark:text-gray-100">{title}</h3>
    <p className="text-3xl font-extrabold dark:text-white">{value}</p>
  </div>
);

const DashboardChart = ({ title, data, dataKey, fill, labelKey }) => {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
          <XAxis dataKey={labelKey} stroke={isDark ? '#ddd' : '#333'} />
          <YAxis allowDecimals={false} stroke={isDark ? '#ddd' : '#333'} />
          <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', borderColor: isDark ? '#555' : '#ccc' }} />
          <Legend />
          <Bar dataKey={dataKey} fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};



export default RiderDashboardPage;
