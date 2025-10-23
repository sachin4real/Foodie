// src/components/Sidebar/Orders.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./g_Orders.css";
import AssignRiderModal from "../Orders/AssignRiderModal";
import { getAllRiders, createDelivery } from "../Services/deliveryApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riders, setRiders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantName = localStorage.getItem("restaurantName") || "";

  // 1) Load restaurant orders from order-payment service
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!restaurantId) return;
        const res = await axios.get(`http://localhost:8080/api/orders/restaurant/${restaurantId}`);
        setOrders(res.data || []);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantId]);

  // Open modal & load riders
  const openAssign = async (order) => {
    try {
      const res = await getAllRiders();
      setRiders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to fetch riders", e);
      alert("Could not load riders. Please try again.");
      return;
    }
    setActiveOrder(order);
    setModalOpen(true);
  };

  // Confirm assignment -> create Delivery in delivery-service
  const confirmAssign = async (riderEmail) => {
    if (!activeOrder) return;

    try {
      const payload = {
        // map order -> delivery-service expected fields
        orderId: activeOrder.id,
        restaurantId,
        restaurantName,
        restaurantAddress: activeOrder.restaurantName || "", // if you have a real address, pass it
        customerId: activeOrder.customerId || activeOrder.email || "", // adjust if different
        customerAddress: activeOrder.customerAddress || activeOrder.deliveryLocation || "",
        location: activeOrder.deliveryLocation || activeOrder.restaurantName || "",
        orderAmount: activeOrder.totalPrice || 0,
        status: "ASSIGNED",
        riderEmail,
        // deliveryTime can be filled by service; not necessary here
      };

      await createDelivery(payload);

      // UI feedback
      setModalOpen(false);
      setActiveOrder(null);
      alert("Rider assigned and delivery created.");

      // Optional: mark the order as "CONFIRMED"/"ASSIGNED" locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrder.id ? { ...o, status: "ASSIGNED" } : o
        )
      );
    } catch (e) {
      console.error("Assign failed", e);
      alert("Failed to assign rider.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Delivery Location</th>
                <th>Price (Rs.)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.items?.map((item, idx) => (
                      <div key={idx}>{item.name} x {item.quantity}</div>
                    ))}
                  </td>
                  <td>{order.deliveryLocation}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    <span className={`status-badge ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="assign-btn"
                      onClick={() => openAssign(order)}
                      disabled={order.status && order.status !== "PENDING"}
                      title={order.status && order.status !== "PENDING" ? "Only PENDING orders can be assigned" : ""}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          <AssignRiderModal
            open={modalOpen}
            riders={riders}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmAssign}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
