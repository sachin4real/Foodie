import React, { useState, useEffect } from 'react';
import { getAssignedDeliveries, updateDeliveryStatus } from '../../services/api';
import RiderTimeline from '../../components/RiderTimeline.js/RiderTimeline';
import RestaurantTrackerMap from '../../components/RestaurantTrackerMap/RestaurantTrackerMap';
import CustomerTrackerMap from '../../components/CustomerTrackerMap/CustomerTrackerMap';
import { jwtDecode } from 'jwt-decode';

const RiderDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  let riderEmail = '';
  try {
    const token = localStorage.getItem('riderToken');
    if (token) {
      const decoded = jwtDecode(token);
      riderEmail = decoded.sub;
    }
  } catch (error) {
    console.error('Error decoding token', error);
  }

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await getAssignedDeliveries(riderEmail);
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const openModal = (type, address) => {
    setModalContent({ type, address });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const ongoingDeliveries = deliveries.filter(d => d.status !== 'DELIVERED');
  const completedDeliveries = deliveries.filter(d => d.status === 'DELIVERED');

  if (loading) {
    return (
      <div className="text-center text-xl mt-10 animate-pulse text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-white'} min-h-screen flex flex-col`}>
      {/* Header with dark mode toggle */}
      

      {/* Main */}
      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-10 relative">
        <h1 className="text-3xl font-bold text-center dark:text-white">🚚 My Deliveries</h1>

        {/* Ongoing Deliveries */}
        {ongoingDeliveries.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🛵 Ongoing Deliveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingDeliveries.map(renderDeliveryCard)}
            </div>
          </section>
        )}

        {/* Completed Deliveries */}
        {completedDeliveries.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-10 mb-4">✅ Completed Deliveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedDeliveries.map(renderDeliveryCard)}
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-2xl p-6 w-[90%] md:w-[600px] relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <div className="mt-4">
              {modalContent.type === 'restaurant' ? (
                <RestaurantTrackerMap restaurantAddress={modalContent.address} onClose={closeModal} />
              ) : (
                <CustomerTrackerMap customerAddress={modalContent.address} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t text-center text-gray-500 dark:text-gray-400 text-sm py-6">
        © 2025 Foody Express
      </footer>
    </div>
  );

  function renderDeliveryCard(delivery) {
    const earning = (delivery.orderAmount * 0.05).toFixed(2);
    return (
      <div key={delivery.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl space-y-4 transition-all">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold dark:text-white">📦 Order ID: {delivery.orderId}</h2>
          <p className="text-gray-700 dark:text-gray-300">👤 Customer ID: {delivery.customerId}</p>
          <p className="text-gray-700 dark:text-gray-300">🏠 Restaurant: {delivery.location}</p>
          <p className="text-gray-700 dark:text-gray-300">📍 Customer Address: {delivery.customerAddress}</p>
          <p className="text-gray-700 dark:text-gray-300">🕒 Delivery Time: {new Date(delivery.deliveryTime).toLocaleString()}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Status:{' '}
            <span className={`font-semibold ${
              delivery.status === 'DELIVERED' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {delivery.status}
            </span>
          </p>
        </div>

        <div className="text-green-600 dark:text-green-400 font-bold text-lg">💵 ${earning}</div>

        <RiderTimeline status={delivery.status} />

        <div className="flex flex-wrap gap-4">
          {delivery.status === "ASSIGNED" && (
            <>
              <button
                onClick={() => handleStatusUpdate(delivery.id, "PICKED_UP")}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:scale-105"
              >
                🚚 Picked Up
              </button>
              <button
                onClick={() => openModal('restaurant', delivery.location)}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-transform hover:scale-105"
              >
                🧭 Track Restaurant
              </button>
            </>
          )}
          {delivery.status === "PICKED_UP" && (
            <>
              <button
                onClick={() => handleStatusUpdate(delivery.id, "DELIVERED")}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform hover:scale-105"
              >
                ✅ Delivered
              </button>
              <button
                onClick={() => openModal('customer', delivery.customerAddress)}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-transform hover:scale-105"
              >
                🧭 Track Customer
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default RiderDeliveriesPage;
