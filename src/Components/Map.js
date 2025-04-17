import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Coordinates for 21 King St, Melbourne
const center = [-37.81991530572905, 144.95707707682146];

// Custom Red Marker Icon
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red Marker Icon URL
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32],
});

const Map = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-11/12 md:w-3/4 lg:w-2/3 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          📍 21 King St, Melbourne
        </h2>
        <MapContainer center={center} zoom={16} style={{ height: "500px", width: "100%" }}>
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Red Marker for the Location */}
          <Marker position={center} icon={redIcon}>
            <Popup>
              <b>21 King St, Melbourne</b> <br />📍 Landmark Location
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;