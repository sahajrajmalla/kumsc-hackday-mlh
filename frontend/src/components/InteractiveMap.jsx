import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
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

        {(() => {
          let routePositions = [];
          if (geojson && geojson.features && geojson.features.length > 0) {
            try {
              const feature = geojson.features[0];
              if (feature.geometry && feature.geometry.coordinates) {
                routePositions = feature.geometry.coordinates.map(coord => {
                   if (Array.isArray(coord) && coord.length >= 2) return [coord[1], coord[0]];
                   return null;
                }).filter(Boolean);
              }
            } catch(e) {
              console.error("Safely caught map trace render:", e);
            }
          }
          return routePositions.length > 0 ? (
            <Polyline 
              positions={routePositions} 
              pathOptions={{ color: '#10b981', weight: 8, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
            />
          ) : null;
        })()}
      </MapContainer>
    </div>
  );
}
