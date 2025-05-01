import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/g_Orders.css"; // Correct CSS import

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assume you store restaurant ID in localStorage after login
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/orders/restaurant/${restaurantId}`
        );
        setOrders(res.data);
        console.log("Fetched orders:", res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) fetchOrders();
  }, [restaurantId]);

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
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Delivery Location</th>
                <th>Status</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.fullName}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{order.deliveryLocation}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
