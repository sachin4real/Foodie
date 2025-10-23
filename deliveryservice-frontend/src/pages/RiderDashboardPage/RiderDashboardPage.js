// src/pages/RiderDashboardPage/RiderDashboardPage.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  getAssignedDeliveries,
  acknowledgeAssignment,
  getMe,
  setOnlineStatus,
  updateMyLocation
} from '../../services/api';


import {
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { jwtDecode } from 'jwt-decode';
import { Client } from '@stomp/stompjs';
import { Link } from 'react-router-dom';

const RiderDashboardPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showNotification, setShowNotification] = useState(false);
  const [tempDelivery, setTempDelivery] = useState(null);
  const [timer, setTimer] = useState(60);

  const [toast, setToast] = useState({ show: false, message: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [online, setOnline] = useState(false);
  const geoTimer = useRef(null);

  let riderEmail = '';
  try {
    const token = localStorage.getItem('riderToken');
    if (token) riderEmail = jwtDecode(token).sub;
  } catch {}

  useEffect(() => {
    bootstrap();
    connectWebSocket();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (online) {
      pingGeo();
      geoTimer.current = setInterval(pingGeo, 20000);
    } else if (geoTimer.current) {
      clearInterval(geoTimer.current);
      geoTimer.current = null;
    }
    return () => { if (geoTimer.current) clearInterval(geoTimer.current); };
    // eslint-disable-next-line
  }, [online]);

  const pingGeo = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => updateMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }).catch(()=>{}),
      () => {}
    );
  };

  const bootstrap = async () => {
    try {
      const me = await getMe().then(r => r.data).catch(()=>null);
      if (me?.status !== undefined) setOnline(!!me.status);
      await fetchDeliveries();
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await getAssignedDeliveries(riderEmail);
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Error fetching deliveries', error);
    }
  };

  const toggleOnline = async () => {
    try {
      await setOnlineStatus(!online);
      setOnline(!online);
      showToast(!online ? '🟢 You are online — you can receive jobs' : '⚪ You are offline');
    } catch {
      showToast('Could not change status');
    }
  };

  const startTimerCountdown = () => {
    setTimer(60);
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setShowNotification(false);
          setTempDelivery(null);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAcceptDelivery = async () => {
    try {
      if (!tempDelivery?.deliveryId) return;
      await acknowledgeAssignment(tempDelivery.deliveryId);
      setShowNotification(false);
      setTempDelivery(null);
      showToast('✅ Delivery accepted');
      fetchDeliveries();
    } catch (error) {
      console.error('Error accepting delivery', error);
    }
  };

  const connectWebSocket = () => {
    const client = new Client({
      brokerURL: 'ws://localhost:8083/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/delivery', (msg) => {
          try {
            const payload = JSON.parse(msg.body);
            setTempDelivery(payload);
            setShowNotification(true);
            startTimerCountdown();
            fetchDeliveries();
          } catch {}
        });
      },
    });
    client.activate();
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  // ---------- derived metrics ----------
  const rupees = (usd) => `Rs.${(usd * 300).toFixed(2)}`;

  const totalDelivered = deliveries.filter(d => d.status === 'DELIVERED').length;
  const totalOngoing   = deliveries.filter(d => d.status !== 'DELIVERED').length;
  const totalEarningsUSD  = deliveries
    .filter(d => d.status === 'DELIVERED')
    .reduce((sum, d) => sum + (d.orderAmount * 0.05), 0);

  const today = new Date();
  const todaysEarningsUSD = deliveries
    .filter(d => {
      const dt = new Date(d.deliveryTime);
      return d.status === 'DELIVERED'
        && dt.getDate() === today.getDate()
        && dt.getMonth() === today.getMonth()
        && dt.getFullYear() === today.getFullYear();
    })
    .reduce((s, d) => s + (d.orderAmount * 0.05), 0);

  const statusChart = useMemo(() => ([
    { name: 'Assigned',  value: deliveries.filter(d => d.status === 'ASSIGNED').length },
    { name: 'Picked Up', value: deliveries.filter(d => d.status === 'PICKED_UP').length },
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'DELIVERED').length },
  ]), [deliveries]);

  const weeklyEarnings = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      const sum = deliveries
        .filter(d => {
          const dt = new Date(d.deliveryTime);
          return d.status === 'DELIVERED'
            && dt.getDate() === day.getDate()
            && dt.getMonth() === day.getMonth()
            && dt.getFullYear() === day.getFullYear();
        })
        .reduce((s, d) => s + (d.orderAmount * 0.05), 0);
      out.push({
        date: day.toLocaleDateString('en-US', { weekday: 'short' }),
        earnings: +sum.toFixed(2),
      });
    }
    return out;
  }, [deliveries]);

  const activeJob = deliveries.find(d => d.status !== 'DELIVERED');

  if (loading) return <div className="text-center text-xl mt-10 animate-pulse">Loading...</div>;

  return (
    <div className={`${darkMode ? 'dark bg-[#0b1220] text-white' : 'bg-gradient-to-br from-blue-50 to-white'} min-h-screen`}>
      {/* Page content only (navbar comes from AppLayout) */}
      <main className="max-w-7xl mx-auto px-5 py-6 space-y-8">
        {/* Availability banner */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`col-span-2 rounded-2xl p-5 border shadow ${online ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 border-emerald-300/40' : 'bg-gradient-to-r from-gray-200/40 to-gray-100/20 border-gray-300/40'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Availability</p>
                <h2 className="text-2xl font-extrabold mt-1">{online ? 'You are Online' : 'You are Offline'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {online ? 'You will receive new delivery requests.' : 'Go online to start receiving jobs.'}
                </p>
              </div>
              <button
                onClick={toggleOnline}
                className={`px-4 py-2 rounded-xl font-semibold shadow ${online ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-900'}`}
              >
                {online ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-5 border shadow bg-white/70 dark:bg-white/5 dark:border-white/10">
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Rating & Cancellations</p>
            <div className="mt-3 flex items-center justify-between">
              <Metric label="Rating" value="4.9" sub="/ 5.0" />
              <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
              <Metric label="Cancel Rate" value="1.2%" />
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard icon="📦" title="Deliveries Completed" value={totalDelivered} gradient="from-emerald-500 to-teal-500" />
          <StatCard icon="🚚" title="Ongoing Deliveries" value={totalOngoing} gradient="from-amber-500 to-orange-500" />
          <StatCard icon="💸" title="Total Earnings" value={rupees(totalEarningsUSD)} gradient="from-blue-600 to-indigo-600" />
          <StatCard icon="📅" title="Today's Earnings" value={rupees(todaysEarningsUSD)} gradient="from-indigo-600 to-violet-600" />
        </section>

        {/* Active job + quick actions + recent activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveJobCard job={activeJob} />
          <QuickActionsCard />
          <RecentActivity deliveries={deliveries} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPanel title="📦 Delivery Status">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404858" />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis allowDecimals={false} stroke="#cbd5e1" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="📈 Weekly Earnings">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyEarnings}>
                <defs>
                  <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopOpacity={0.6}/>
                    <stop offset="95%" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#404858" />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" strokeWidth={2} fillOpacity={1} fill="url(#earn)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        {/* WS popup for “assignment” */}
        

        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toast.message}
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
        © 2025 Foody Express
      </footer>
    </div>
  );
};

/* ---------- building blocks ---------- */

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`rounded-2xl p-5 shadow border bg-gradient-to-tr ${gradient} text-white`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm uppercase tracking-wide opacity-80">{title}</div>
    <div className="text-3xl font-extrabold mt-1">{value}</div>
  </div>
);

const Metric = ({ label, value, sub }) => (
  <div>
    <div className="text-3xl font-extrabold">{value}<span className="text-base font-medium opacity-70">{sub}</span></div>
    <div className="text-xs mt-1 opacity-70">{label}</div>
  </div>
);

const ChartPanel = ({ title, children }) => (
  <div className="rounded-2xl p-5 shadow border bg-white/70 dark:bg-white/5 dark:border-white/10">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    {children}
  </div>
);

const ActiveJobCard = ({ job }) => {
  if (!job) {
    return (
      <div className="rounded-2xl p-5 shadow border bg-white/70 dark:bg-white/5 dark:border-white/10">
        <h3 className="text-lg font-bold mb-3">🛵 Active Job</h3>
        <p className="text-gray-600 dark:text-gray-300">No active jobs right now. Go online to receive new assignments.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 shadow border bg-white/70 dark:bg-white/5 dark:border-white/10">
      <h3 className="text-lg font-bold mb-3">🛵 Active Job</h3>
      <div className="space-y-1 text-sm">
        <div><b>Order:</b> {job.orderId}</div>
        <div><b>Restaurant:</b> {job.location}</div>
        <div><b>Customer:</b> {job.customerAddress}</div>
        <div><b>Status:</b> <span className={`font-semibold ${job.status === 'DELIVERED' ? 'text-emerald-500' : 'text-amber-500'}`}>{job.status}</span></div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link to="/rider/deliveries" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Open Deliveries</Link>
        {job.status === 'ASSIGNED' && (
          <Link to="/rider/deliveries" className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600">Pick Up</Link>
        )}
      </div>
    </div>
  );
};

const QuickActionsCard = () => (
  <div className="rounded-2xl p-5 shadow border bg-white/70 dark:bg-white/5 dark:border-white/10">
    <h3 className="text-lg font-bold mb-3">⚡ Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Link to="/rider/deliveries" className="px-4 py-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/10 text-center">My Deliveries</Link>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/10">Refresh</button>
      <Link to="/rider/dashboard" className="px-4 py-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/10 text-center">Dashboard</Link>
      <Link to="/riders/login" className="px-4 py-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/10 text-center">Switch Account</Link>
    </div>
  </div>
);

const RecentActivity = ({ deliveries }) => {
  const items = [...deliveries]
    .sort((a, b) => new Date(b.deliveryTime) - new Date(a.deliveryTime))
    .slice(0, 6);

  return (
    <div className="rounded-2xl p-5 shadow border bg-white/70 dark:bg-white/5 dark:border-white/10">
      <h3 className="text-lg font-bold mb-3">🧾 Recent Activity</h3>
      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No recent activity.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-white/10">
          {items.map(d => (
            <li key={d.id} className="py-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-semibold">{d.status.replace('_', ' ')}</div>
                <div className="text-xs opacity-70">{new Date(d.deliveryTime).toLocaleString()}</div>
              </div>
              <div className="text-right text-sm">
                <div className="opacity-70">Order {d.orderId}</div>
                <div className={`font-semibold ${d.status === 'DELIVERED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {d.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RiderDashboardPage;
