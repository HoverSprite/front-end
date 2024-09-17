import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { getAssignedOrdersWithCoordinates } from '../service/DataService'; // The function you've provided
import { useAuth } from '../context/AuthContext';  // Assuming you have AuthContext to get the user

const generateColors = (count) => {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 50%)`);
};

const createCustomIcon = (time) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: white; padding: 2px 5px; border: 1px solid #666; border-radius: 3px;">
             <div style="font-size: 12px; font-weight: bold;">${time}</div>
             <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>
           </div>
           <div style="width: 12px; height: 12px; background-color: #007bff; border-radius: 50%; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 0],
  });
};

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the user from AuthContext

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    // Fetch assigned orders with coordinates for the logged-in sprayer
    if (user) {
      getAssignedOrdersWithCoordinates()
        .then(response => setOrders(response))  // Assuming the function returns the data directly
        .catch(err => setError('Failed to fetch assigned orders with coordinates'));
    }
  }, [user]);

  console.log(orders);

  return (
    <MapContainer
      center={currentPosition || { lat: 10.7769, lng: 106.7009 }}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition && orders.length > 0 && (
        <>
          <Marker position={currentPosition}>
            <Popup>Your Location</Popup>
          </Marker>
          <RoutingComponent currentPosition={currentPosition} orders={orders} />
        </>
      )}
    </MapContainer>
  );
};

const RoutingComponent = ({ currentPosition, orders }) => {
  const map = useMap();
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeRouteControl, setActiveRouteControl] = useState(null);

  useEffect(() => {
    if (!map) return;

    const checkMapReady = setInterval(() => {
      if (map.getZoom() !== undefined) {
        setIsMapReady(true);
        clearInterval(checkMapReady);
      }
    }, 100);

    return () => clearInterval(checkMapReady);
  }, [map]);

  useEffect(() => {
    if (!isMapReady || !map || !L.Routing) return;

    const sortedOrders = sortOrdersByTime(orders);
    const waypoints = [
      L.latLng(currentPosition.lat, currentPosition.lng),
      ...sortedOrders.map(order => L.latLng(order.latitude, order.longitude))
    ];

    const colors = generateColors(waypoints.length - 1);

    // Create route segments
    for (let i = 0; i < waypoints.length - 1; i++) {
      const routeControl = L.Routing.control({
        waypoints: [waypoints[i], waypoints[i + 1]],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        createMarker: () => null,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: colors[i], weight: 5, opacity: 0.7 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1`
        }),
      });

      routeControl.addTo(map);
    }

    // Add clickable markers for each destination
    sortedOrders.forEach((order, index) => {
      const marker = L.marker([order.latitude, order.longitude], {
        icon: createCustomIcon(new Date(order.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      }).addTo(map);

      marker.on('click', () => {
        // Remove existing route control
        if (activeRouteControl) {
          map.removeControl(activeRouteControl);
        }

        // Create new route control from start to clicked destination
        const clickedRouteControl = L.Routing.control({
          waypoints: [
            L.latLng(currentPosition.lat, currentPosition.lng),
            L.latLng(order.latitude, order.longitude)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          createMarker: () => null,
          addWaypoints: false,
          lineOptions: {
            styles: [{ color: 'blue', weight: 5, opacity: 1 }],
          },
          router: L.Routing.osrmv1({
            serviceUrl: `https://router.project-osrm.org/route/v1`
          }),
        });

        clickedRouteControl.addTo(map);
        setActiveRouteControl(clickedRouteControl);
      });
    });

    // Add color legend
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.border = '1px solid #ccc';
      div.style.borderRadius = '5px';
      div.innerHTML += '<h4>Route Order</h4>';
      
      for (let i = 0; i < colors.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
          (i === 0 ? 'Start to 1st' : i + 'th to ' + (i + 1) + 'th') + '<br>';
      }
      
      return div;
    };

    legend.addTo(map);

    return () => {
      if (activeRouteControl) {
        map.removeControl(activeRouteControl);
      }
      map.removeControl(legend);
    };
  }, [isMapReady, map, currentPosition, orders]);

  return null;
};

// Function to sort orders by their scheduled time
const sortOrdersByTime = (orders) => {
  return [...orders].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
};

export default MapComponent;
