import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

// Helper function to get coordinates from address
const getCoordinatesFromAddress = async (address) => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  if (response.data.length > 0) {
    return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
  }
  return null;
};

const RoutingMachine = ({ riderLocation, restaurantLocation }) => {
    const map = useMap();
    const [routingControl, setRoutingControl] = useState(null);
  
    useEffect(() => {
      if (!riderLocation || !restaurantLocation || !map) return;
  
      // Create the routing
      const control = L.Routing.control({
        waypoints: [
          L.latLng(riderLocation[0], riderLocation[1]),
          L.latLng(restaurantLocation[0], restaurantLocation[1]),
        ],
        lineOptions: {
          styles: [{ color: 'blue', weight: 6 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        createMarker: (i, waypoint, n) => {
          if (i === 0) {
            return L.marker(waypoint.latLng, {
              icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685655.png',
                iconSize: [30, 30],
              }),
            }).bindPopup('🚴 Rider Start');
          } else if (i === n - 1) {
            return L.marker(waypoint.latLng, {
              icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
                iconSize: [30, 30],
              }),
            }).bindPopup('🏠 Restaurant');
          }
          return null;
        },
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
      }).addTo(map);
  
      setRoutingControl(control); // Save the control safely
  
      return () => {
        if (routingControl && map.hasLayer(routingControl)) {
          map.removeControl(routingControl); 
        }
      };
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riderLocation, restaurantLocation, map]);
  
    return null;
  };
  

const RestaurantTrackerMap = ({ restaurantAddress, onClose }) => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRiderLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting rider location:', error);
      }
    );

    const fetchRestaurantCoords = async () => {
      const coords = await getCoordinatesFromAddress(restaurantAddress);
      setRestaurantLocation(coords);
    };

    fetchRestaurantCoords();
  }, [restaurantAddress]);

  if (!riderLocation || !restaurantLocation) {
    return <div className="text-center p-4">Loading map...</div>;
  }

  return (
    <div className="mt-6">
      <MapContainer center={riderLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine riderLocation={riderLocation} restaurantLocation={restaurantLocation} />
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

export default RestaurantTrackerMap;
