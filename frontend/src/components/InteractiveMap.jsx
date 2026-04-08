import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Fix typical leaflet icon issue with React
import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarkerUrl from 'leaflet/dist/images/marker-icon.png';
import iconMarkerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconMarker2x,
  iconUrl: iconMarkerUrl,
  shadowUrl: iconMarkerShadow,
});

function MapClickHandler({ setWaypoints }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setWaypoints((prev) => [...prev, [lat, lng]]);
    },
  });
  return null;
}

export default function InteractiveMap({ waypoints, setWaypoints, geojson }) {
  // Center of Nepal roughly
  const defaultCenter = [28.3949, 84.1240];

  return (
    <div className="map-container-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler setWaypoints={setWaypoints} />

        {waypoints.map((wp, index) => (
          <Marker key={index} position={wp} />
        ))}

        {geojson && (
          <GeoJSON 
            data={geojson} 
            style={{ color: '#10b981', weight: 5, opacity: 0.8 }} 
          />
        )}
      </MapContainer>
    </div>
  );
}
