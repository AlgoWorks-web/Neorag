import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Coordinates for 13208 Spinning Glen St, Euless, TX
const center = [32.821166, -97.081148];

// Custom Red Marker Icon
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-11/12 md:w-3/4 lg:w-2/3 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          📍 13208 Spinning Glen St, Euless, TX
        </h2>
        <MapContainer center={center} zoom={16} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={center} icon={redIcon}>
            <Popup>
              <b>13208 Spinning Glen St, Euless, TX</b><br />📍 Residential Address
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
