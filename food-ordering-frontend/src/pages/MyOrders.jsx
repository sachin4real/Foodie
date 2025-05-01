import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.id) return;
    console.log("userID : ", user.id);

    // Fetch orders by customer
    axios
      .get(`http://localhost:8080/api/orders/customer/${user.id}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });

    // Fetch all payments
    axios
      .get("http://localhost:8080/api/payments")
      .then((res) => {
        setPayments(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
      });
  }, [user?.id]);

  const getPaymentForOrder = (orderId) =>
    payments.find((p) => p.orderId === orderId);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-20 bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-orange-500">My Orders</h1>
      </div>

      <main className="p-6 pt-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            You haven’t placed any orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Restaurant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Payment Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const payment = getPaymentForOrder(order.id);
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{order.restaurantName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">Rs. {order.totalPrice}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span
                          className={`${
                            payment?.paymentStatus === "SUCCESS" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {payment?.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li key={item.itemId} className="flex items-center space-x-3">
                              <img
                                src={item.orderImage}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                                <span className="text-orange-500 text-sm font-semibold">
                                  Rs. {item.price} * {item.quantity}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
