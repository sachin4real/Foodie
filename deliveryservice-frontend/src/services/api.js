import axios from 'axios';

const API_BASE = process.env.REACT_APP_DELIVERY_BASE || 'http://localhost:8083';

export const api = axios.create({ baseURL: API_BASE });

// attach token automatically
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

// bootstrap token from storage on app load
const init = () => {
  try {
    const t = localStorage.getItem('riderToken');
    if (t) setAuthToken(t);
  } catch {}
};
init();

/* ---------- Rider auth ---------- */
export const registerRider = (riderData) => api.post('/riders/register', riderData);
export const loginRider = (riderData) => api.post('/riders/login', riderData);
export const getMe       = () => api.get('/riders/me'); // (recommended backend)
export const setOnlineStatus = (online) => api.patch(`/riders/me/status`, null, { params: { online }});
export const updateMyLocation = ({ lat, lng }) => api.put('/riders/me/location', { lat, lng });

/* ---------- Deliveries ---------- */
export const getDeliveries = () => api.get('/deliveries');
export const getAssignedDeliveries = (email) => api.get(`/deliveries/rider/${encodeURIComponent(email)}`);
export const updateDeliveryStatus = (deliveryId, status) => api.put(`/deliveries/${deliveryId}/status`, null, { params: { status } });
export const acknowledgeAssignment = (deliveryId) => updateDeliveryStatus(deliveryId, 'PICKED_UP');

// global 401 handler
api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('riderToken');
      setAuthToken(null);
      // soft redirect
      if (window.location.pathname !== '/riders/login') window.location.href = '/riders/login';
    }
    return Promise.reject(err);
  }
);
