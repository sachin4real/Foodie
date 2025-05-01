// src/services/api.js
import axios from 'axios';

// Create a custom Axios instance with the backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8083', // Your Spring Boot backend URL
});

// Function to register a rider
export const registerRider = (riderData) => {
    return api.post('/riders/register', riderData);
  };

// Function to log in the rider
export const loginRider = (riderData) => {
    return api.post('/riders/login', riderData);
  };

// Example of an API call to get deliveries
export const getDeliveries = () => {
  return api.get('/deliveries'); // The '/deliveries' endpoint should return a list of deliveries
};

// Fetch assigned deliveries for a rider
export const getAssignedDeliveries = (riderId) => {
    return api.get(`/deliveries/rider/${riderId}`);
};

// Update delivery status (picked up / delivered)
export const updateDeliveryStatus = (deliveryId, status) => {
    return api.put(`/deliveries/${deliveryId}/status`, null, {
      params: { status },
    });
};


