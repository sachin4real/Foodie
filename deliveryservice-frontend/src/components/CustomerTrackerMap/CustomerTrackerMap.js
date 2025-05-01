// src/components/CustomerTrackerMap.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

// Helper function
const getCoordinatesFromAddress = async (address) => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  if (response.data.length > 0) {
    return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
  }
  return null;
};

// Routing Machine
const RoutingMachine = ({ riderLocation, customerLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!riderLocation || !customerLocation || !map) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(riderLocation[0], riderLocation[1]),
        L.latLng(customerLocation[0], customerLocation[1]),
      ],
      lineOptions: { styles: [{ color: 'green', weight: 6 }] },
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
    }).addTo(map);

    return () => {
      if (control && map.hasLayer(control)) {
        map.removeControl(control);
      }
    };
  }, [riderLocation, customerLocation, map]);

  return null;
};

const CustomerTrackerMap = ({ customerAddress, onClose }) => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRiderLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting rider location:', error);
      }
    );

    const fetchCustomerCoords = async () => {
      const coords = await getCoordinatesFromAddress(customerAddress);
      if (coords) {
        setCustomerLocation(coords);
      } else {
        setError('❌ Cannot find customer location. Please check address.');
      }
    };

    fetchCustomerCoords();
  }, [customerAddress]);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    );
  }

  if (!riderLocation || !customerLocation) {
    return <div className="text-center p-4">Loading map...</div>;
  }

  return (
    <div className="mt-6">
      <MapContainer center={riderLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine riderLocation={riderLocation} customerLocation={customerLocation} />
      </MapContainer>

      <div className="text-center mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close Map
        </button>
      </div>
    </div>
  );
};

export default CustomerTrackerMap;
