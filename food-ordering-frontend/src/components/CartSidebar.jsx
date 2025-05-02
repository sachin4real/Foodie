import { useContext, useState } from "react";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

function CartSidebar() {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const [selectedGroup, setSelectedGroup] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useContext(UserContext);

  const restaurantName = selectedGroup[0]?.restaurantName || "Unknown Restaurant";

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    deliveryLocation: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmAndCheckout = async () => {
    const { email, fullName, deliveryLocation } = formData;

    if (!fullName || !email || !deliveryLocation) {
      alert("Please fill all fields!");
      return;
    }

    const totalAmount = selectedGroup.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      customerId: user?.id,
      fullName,
      email,
      deliveryLocation,
      totalPrice: totalAmount,
      status: "PENDING",
      restaurantName: restaurantName,
      items: selectedGroup.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item.id,
        restaurantId: item.restaurantId,
        orderImage: item.imagePath,
      })),
    };

    try {
      const orderRes = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderRes.ok) throw new Error("Failed to save order");
      const savedOrder = await orderRes.json();

      const paymentRes = await fetch("http://localhost:8080/product/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          quantity: selectedGroup.length,
          currency: "LKR",
          name: fullName,
          customerId: savedOrder.customerId,
        }),
      });

      const paymentData = await paymentRes.json();

      if (paymentData?.status === "SUCCESS" && paymentData.sessionUrl) {
        const selectedIds = selectedGroup.map(i => i.id + i.restaurantName);
        const remainingItems = cartItems.filter(
          item => !selectedIds.includes(item.id + item.restaurantName)
        );
        localStorage.setItem("cart", JSON.stringify(remainingItems));
        clearCart();
        window.location.href = paymentData.sessionUrl;
      } else {
        alert("Failed to initiate payment session");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred during checkout.");
    }
  };

  const groupedItems = cartItems.reduce((groups, item) => {
    const restaurant = item.restaurantName || "Unknown Restaurant";
    if (!groups[restaurant]) groups[restaurant] = [];
    groups[restaurant].push(item);
    return groups;
  }, {});

  const calculateGroupTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <>
      <div className={`fixed top-0 right-0 bg-white shadow-2xl w-[450px] h-full p-8 flex flex-col transition-transform duration-300 z-50 border-l ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-orange-600">🛒 My Cart</h2>
          <button
            onClick={toggleCart}
            className="px-5 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 shadow-sm transition-all"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-black-500 text-center mt-24 text-lg " >Your cart is empty 🛍️</p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(groupedItems).map(([restaurant, items]) => (
                <div key={restaurant} className="p-5 bg-gray-50 rounded-xl shadow-inner border">
                  <h3 className="text-xl font-semibold text-orange-600 border-b pb-3 mb-4">{restaurant}</h3>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-all border border-gray-100">
                        <div className="flex justify-between items-center mb-5 h-1 mt-1">
                          <span className="font-medium text-gray-800 text-lg">{item.name}</span>
                          <button
                            onClick={() => removeFromCart(item.id, item.restaurantName)}
                            className="bg-red-700 text-white text-xs px-3 py-1 rounded-md hover:bg-red-800 transition"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex justify-between items-center h-10">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => item.quantity > 1 && decreaseQty(item.id, item.restaurantName)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold disabled:opacity-50"
                              disabled={item.quantity === 1}
                            >−</button>
                            <span className="text-base">{item.quantity}</span>
                            <button
                              onClick={() => increaseQty(item.id, item.restaurantName)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                            >+</button>
                          </div>
                          <span className="text-orange-600 font-semibold text-lg">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 ">
                    <div className="flex justify-between mb-3 text-black-800 text-l font-semibold text-base ml-2 tracking-wider">
                      <span>Total</span>
                      <span className="pr-2 text-black-500 text-l font-bold">Rs. {calculateGroupTotal(items)}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedGroup(items);
                        setShowPopup(true);
                      }}
                      className="w-full bg-orange-700 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition tracking-wider"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[420px] space-y-5 border border-gray-100">
            <h3 className="text-2xl font-bold text-orange-500 text-center">Checkout Details</h3>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <textarea
              name="deliveryLocation"
              placeholder="Delivery Location"
              value={formData.deliveryLocation}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              rows={3}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndCheckout}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-lg"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default CartSidebar;
