import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import RiderNotification from './RiderNotification';

const RiderNotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8083/ws',  
      onConnect: () => {
        console.log('WebSocket connected');
        setSocketConnected(true);
        // Subscribe to the delivery notifications topic
        client.subscribe('/topic/delivery', (message) => {
          const deliveryNotification = JSON.parse(message.body);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            deliveryNotification,
          ]);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setSocketConnected(false);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const handleAccept = (deliveryId) => {
    // Handle accepting the delivery
    console.log(`Delivery ${deliveryId} accepted`);
    // Implement logic for accepting the delivery here
  };

  const handleDecline = (deliveryId) => {
    // Handle declining the delivery
    console.log(`Delivery ${deliveryId} declined`);
    // Implement logic for declining the delivery here
  };

  return (
    <div>
      {socketConnected ? (
        notifications.map((delivery, index) => (
          <RiderNotification
            key={index}
            delivery={delivery}
            onAccept={() => handleAccept(delivery.orderId)}
            onClose={() => handleDecline(delivery.orderId)}
            timer={30} // Example timer, replace with actual logic
          />
        ))
      ) : (
        <p>Connecting to WebSocket...</p>
      )}
    </div>
  );
};

export default RiderNotificationContainer;
