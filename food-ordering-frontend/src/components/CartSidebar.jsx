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
        // Filter out the selected group items from the cart
        const remainingItems = cartItems.filter(
          (item) => item.restaurantName !== restaurantName
        );
        localStorage.setItem("cart", JSON.stringify(remainingItems));
        clearCart(); // Optionally clear the cart context
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
      <div className={`fixed top-0 right-0 bg-white shadow-lg w-80 h-full p-5 flex flex-col transition-transform duration-300 z-30 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-orange-500">My Cart</h2>
          <button onClick={toggleCart} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty 🛒</p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(groupedItems).map(([restaurant, items]) => (
                <div key={restaurant} className="mb-6 border-b pb-4">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">{restaurant}</h3>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-semibold hover:underline">Remove</button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => item.quantity > 1 && decreaseQty(item.id)} className="px-2 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50" disabled={item.quantity === 1}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)} className="px-2 py-1 bg-gray-300 text-gray-800 rounded">+</button>
                          </div>
                          <span className="text-orange-500 font-bold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">Total:</span>
                      <span className="font-bold text-lg text-orange-500">Rs. {calculateGroupTotal(items)}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedGroup(items);
                        setShowPopup(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-orange-500">Checkout Details</h3>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <textarea
              name="deliveryLocation"
              placeholder="Delivery Location"
              value={formData.deliveryLocation}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleConfirmAndCheckout} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartSidebar;
