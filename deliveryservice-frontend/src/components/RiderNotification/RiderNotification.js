import React from 'react';

const RiderNotification = ({ delivery, onClose, onAccept, timer }) => {
  const earnings = (delivery.orderAmount * 0.05).toFixed(2);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-xl w-80 z-50">
      <h3 className="text-xl font-bold text-center mb-4">🚨 New Delivery Assigned</h3>
      
      <div className="space-y-1 text-gray-700 text-sm">
        <p><strong>Order ID:</strong> {delivery.orderId}</p>
        <p><strong>Restaurant:</strong> {delivery.location}</p>
        <p><strong>Customer Address:</strong> {delivery.customerAddress}</p>
        <p><strong>Status:</strong> {delivery.status}</p>
        <p><strong>Delivery Time:</strong> {new Date(delivery.deliveryTime).toLocaleString()}</p>
        <p><strong>💵 Earning:</strong> ${earnings}</p>
        <p><strong>⏳ Time Left:</strong> {timer}s</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onAccept}
          className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
        >
          Accept
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
        >
          Decline
        </button>
      </div>

      {timer <= 0 && (
        <div className="text-center text-red-500 font-semibold mt-4">
          Time's up! 🕒
        </div>
      )}
    </div>
  );
};

export default RiderNotification;
