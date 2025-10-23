import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import RiderNotification from './RiderNotification'; // your popup/toast UI

const RiderNotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('riderToken') : null;
  const onRiderRoute =
    typeof window !== 'undefined' ? /^\/rider\//.test(window.location.pathname) : false;

  useEffect(() => {
    // ⛔ Do not create a socket unless authenticated AND on /rider/* pages
    if (!token || !onRiderRoute) return;

    const client = new Client({
      brokerURL: process.env.REACT_APP_WS_URL || 'ws://localhost:8083/ws',
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setConnected(true);
        client.subscribe('/topic/delivery', (msg) => {
          try {
            const payload = JSON.parse(msg.body);
            setNotifications((prev) => [...prev, payload]);
          } catch {/* ignore */}
        });
      },
      onWebSocketError: () => {},
      onStompError: () => {},
    });

    client.activate();
    return () => client.deactivate();
  }, [token, onRiderRoute]);

  if (!token || !onRiderRoute || !connected) return null;

  return (
    <>
      {notifications.map((n, i) => (
        <RiderNotification
          key={`${n?.deliveryId || n?.orderId || 'ws'}-${i}`}
          delivery={n}
          onAccept={() => setNotifications((prev) => prev.filter((_, idx) => idx !== i))}
          onClose={() => setNotifications((prev) => prev.filter((_, idx) => idx !== i))}
          timer={30}
        />
      ))}
    </>
  );
};

export default RiderNotificationContainer;
