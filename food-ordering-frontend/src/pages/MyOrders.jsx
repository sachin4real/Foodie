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
  {/* Header */}
  <div className="sticky top-0 z-20 bg-white shadow-md px-8 py-5">
    <h1 className="text-3xl font-bold text-orange-500 tracking-wider">📦 My Orders</h1>
  </div>

  {/* Main Content */}
  <main className="p-8 pt-6 max-w-7xl mx-auto w-full">
    {orders.length === 0 ? (
      <p className="text-gray-500 text-center mt-20 text-lg tracking-wider">
        You haven’t placed any orders yet. 🕒
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-orange-100 border-b-2 border-orange-100">
            <tr>
              <th className="px-6 py-4 text-center text-xl font-semibold text-black-600 tracking-wide">RESTAURANT</th>
              <th className="px-6 py-4 text-center text-xl font-semibold text-black-600 tracking-wide">ORDER DATE</th>
              <th className="px-6 py-4 text-center text-xl font-semibold text-black-600 tracking-wide">TOTAL PRICE (RS.)</th>
              <th className="px-6 py-4 text-center text-xl font-semibold text-black-600 tracking-wide">ORDER STATUS</th>
              <th className="px-6 py-4 text-center text-xl font-semibold text-black-600 tracking-wide">ITEMS</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const payment = getPaymentForOrder(order.id);
              return (
                <tr key={order.id} className="border-b hover:bg-orange-50 transition">
                  <td className="px-6 py-5 text-base text-black-800 whitespace-nowrap text-center">{order.restaurantName}</td>
                  <td className="px-6 py-5 text-base text-black-500 whitespace-nowrap text-center">
                  {new Date(order.createdAt + 'Z').toLocaleString()}




                  </td>
                  <td className="px-6 py-5 text-base text-black-800 whitespace-nowrap font-semibold text-black-600 text-center">
                    {order.totalPrice}
                  </td>
                  <td className="px-6 py-5 text-base font-semibold whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-base font-bold ${
                        payment?.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {payment?.paymentStatus || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-black-700 text-center">
                    <ul className="space-y-3 ">
                      {order.items.map((item) => (
                        <li key={item.itemId} className="flex justify space-x-5 h-12">
                          <img
                            src={item.orderImage}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-xl shadow"
                          />
                          <div>
                            <p className="font-medium text-black-900 text-base text-left">{item.name}</p>
                            <p className="text-sm text-black-500 text-left">{item.description}</p>
                            <span className="text-orange-700 text-sm font-semibold ">Rs. {item.price}</span>
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
