import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet marker icon issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  destLat: number;
  destLng: number;
  destTitle: string;
}

const MapUpdater: React.FC<{ destLat: number; destLng: number }> = ({ destLat, destLng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([destLat, destLng], 15);
  }, [destLat, destLng, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ destLat, destLng, destTitle }) => {
  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-pink-100 shadow-soft relative z-0">
      <MapContainer
        center={[destLat, destLng]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Destination Marker */}
        <Marker position={[destLat, destLng]}>
          <Popup>
            <div className="text-xs font-semibold text-slate-800">
              📍 {destTitle}
            </div>
          </Popup>
        </Marker>

        <MapUpdater destLat={destLat} destLng={destLng} />
      </MapContainer>
    </div>
  );
};
