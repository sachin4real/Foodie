// restaurantfrontend/src/services/deliveryApi.js
import axios from "axios";

const deliveryApi = axios.create({
  baseURL: "http://localhost:8083",
  withCredentials: true,
});

export const getAllRiders = () => deliveryApi.get("/riders/all");

export const createDelivery = (payload) => deliveryApi.post("/deliveries", payload);

// (optional) update status if you want buttons in restaurant UI later
export const updateDeliveryStatus = (deliveryId, status) =>
  deliveryApi.put(`/deliveries/${deliveryId}/status`, null, { params: { status } });


export default { getAllRiders, createDelivery };