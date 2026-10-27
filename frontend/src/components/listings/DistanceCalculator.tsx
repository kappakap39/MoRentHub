import React, { useState } from 'react';
import { Navigation, MapPin, Compass, ExternalLink, AlertCircle } from 'lucide-react';

interface DistanceCalculatorProps {
  destLat: number;
  destLng: number;
  destTitle: string;
  onLocationChange?: (lat: number | null, lng: number | null) => void;
}

// Preset popular locations for easy 1-click selection
const PRESET_LOCATIONS = [
  { name: 'กรุงเทพฯ (สยามสแควร์)', lat: 13.7466, lng: 100.5348 },
  { name: 'สนามบินสุวรรณภูมิ', lat: 13.6900, lng: 100.7501 },
  { name: 'สนามบินดอนเมือง', lat: 13.9126, lng: 100.6068 },
  { name: 'เชียงใหม่ (นิมมาน)', lat: 18.7961, lng: 98.9699 },
  { name: 'พัทยากลาง (ชลบุรี)', lat: 12.9354, lng: 100.8887 },
  { name: 'ภูเก็ต (เมือง)', lat: 7.8804, lng: 98.3923 },
  { name: 'ขอนแก่น (เซ็นทรัล)', lat: 16.4322, lng: 102.8236 },
];

// Haversine formula to compute great-circle distance between two points in km
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({
  destLat,
  destLng,
  destTitle,
  onLocationChange,
}) => {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [userPlaceName, setUserPlaceName] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // 1. Get current GPS position
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('เบราว์เซอร์ของคุณไม่รองรับการระบุพิกัด GPS');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setUserPlaceName('ตำแหน่งปัจจุบันของฉัน (GPS)');
        setIsLocating(false);
        onLocationChange?.(lat, lng);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGeoError('ไม่สามารถดึงตำแหน่งปัจจุบันได้ กรุณาลองเลือกจากรายการด้านล่าง');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 2. Select from preset locations
  const handleSelectPreset = (preset: { name: string; lat: number; lng: number }) => {
    setUserLat(preset.lat);
    setUserLng(preset.lng);
    setUserPlaceName(preset.name);
    setGeoError(null);
    onLocationChange?.(preset.lat, preset.lng);
  };

  // Distance calculation
  const distance =
    userLat !== null && userLng !== null
      ? calculateHaversineDistance(userLat, userLng, destLat, destLng)
      : null;

  // Estimated driving time (rough average 60 km/h)
  const estimatedHours = distance !== null ? distance / 60 : null;

  // Google Maps directions link
  const googleMapsDirectionsUrl =
    userLat !== null && userLng !== null
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}`
      : `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;

  return (
    <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-3xl p-6 border border-sky-100 shadow-soft space-y-5">
      <div className="flex items-center gap-2.5 text-sky-700">
        <Compass size={22} className="text-sky-500" />
        <h4 className="font-semibold text-slate-800 text-base">
          วัดระยะทางจากตำแหน่งของคุณ
        </h4>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        เลือกตำแหน่งที่อยู่ของคุณ หรือกดค้นหาจาก GPS เพื่อคำนวณระยะห่างไปยังทรัพย์สินนี้แบบทันที
      </p>

      {/* Button: Use Current GPS Location */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50/80 text-sky-700 font-medium text-xs sm:text-sm rounded-2xl shadow-sm transition-all disabled:opacity-60"
      >
        <Navigation size={16} className={isLocating ? 'animate-spin text-sky-500' : 'text-sky-500'} />
        <span>{isLocating ? 'กำลังดึงพิกัดของคุณ...' : 'ใช้ตำแหน่งปัจจุบันของฉัน (GPS)'}</span>
      </button>

      {geoError && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <AlertCircle size={15} className="shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Quick Select Presets */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">
          หรือเลือกจุดเริ่มต้นยอดนิยม:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                userPlaceName === preset.name
                  ? 'bg-sky-500 text-white font-medium shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Results */}
      {distance !== null && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-sky-50/80 border border-pink-100/80 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">ต้นทาง:</span>
            <span className="text-xs font-semibold text-slate-700">{userPlaceName}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/50 pt-2">
            <span className="text-xs text-slate-500">ระยะทางโดยประมาณ:</span>
            <span className="text-lg font-bold text-pink-600">
              {distance < 1 ? `${Math.round(distance * 1000)} เมตร` : `${distance.toFixed(1)} กิโลเมตร`}
            </span>
          </div>

          {estimatedHours !== null && (
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>เวลาเดินทางโดยประมาณ (รถยนต์):</span>
              <span className="font-medium text-slate-800">
                {estimatedHours < 1
                  ? `~${Math.max(1, Math.round(estimatedHours * 60))} นาที`
                  : `~${Math.floor(estimatedHours)} ชม. ${Math.round((estimatedHours % 1) * 60)} นาที`}
              </span>
            </div>
          )}

          {/* Open Google Maps Directions */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
          >
            <ExternalLink size={16} />
            <span>เปิดนำทางใน Google Maps</span>
          </a>
        </div>
      )}

      {distance === null && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-all"
        >
          <MapPin size={16} className="text-pink-500" />
          <span>ดูพิกัดนี้บน Google Maps</span>
        </a>
      )}
    </div>
  );
};
