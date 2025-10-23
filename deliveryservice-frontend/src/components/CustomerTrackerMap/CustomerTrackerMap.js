import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

const getCoordinatesFromAddress = async (address) => {
  if (!address) return null;
  const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  if (res.data?.length) return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
  return null;
};

const RoutingMachine = ({ riderLocation, customerLocation }) => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!riderLocation || !customerLocation) return;

    const control = L.Routing.control({
      waypoints: [ L.latLng(...riderLocation), L.latLng(...customerLocation) ],
      lineOptions: { styles: [{ color: 'green', weight: 6 }] },
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      createMarker: () => null
    }).addTo(map);
    controlRef.current = control;

    return () => {
      if (controlRef.current) {
        try { map.removeControl(controlRef.current); } catch (_) {}
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
    const id = navigator.geolocation.watchPosition(
      (pos) => setRiderLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error('geo error', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    (async () => {
      const coords = await getCoordinatesFromAddress(customerAddress);
      if (coords) setCustomerLocation(coords);
      else setError('❌ Cannot find customer location. Please check address.');
    })();
  }, [customerAddress]);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button onClick={onClose} className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600">Close</button>
      </div>
    );
  }
  if (!riderLocation || !customerLocation) return <div className="text-center p-4">Loading map...</div>;

  return (
    <div className="mt-6">
      <MapContainer center={riderLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RoutingMachine riderLocation={riderLocation} customerLocation={customerLocation} />
      </MapContainer>
      <div className="text-center mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Close Map</button>
      </div>
    </div>
  );
};

export default CustomerTrackerMap;
