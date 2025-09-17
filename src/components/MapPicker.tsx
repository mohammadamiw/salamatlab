import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MapPickerProps = {
  height?: number;
  onPick: (lat: number, lng: number) => void;
};

// Lightweight loader for Leaflet via CDN (no npm dependency)
async function loadLeaflet(): Promise<typeof window & { L: any }> {
  const w = window as any;
  if (w.L) return w;
  await new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet load error'));
    document.body.appendChild(script);
  });
  return window as any;
}

const MapPicker: React.FC<MapPickerProps> = ({ height = 360, onPick }) => {
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const initMap = async () => {
    try {
      const w: any = await loadLeaflet();
      const L = w.L;
      if (!mapRef.current) return;
      const defaultCenter: [number, number] = [35.6892, 51.3890]; // Tehran
      const map = L.map(mapRef.current, { center: defaultCenter, zoom: 12, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      map.on('click', (e: any) => {
        const { lat: clat, lng: clng } = e.latlng || {};
        if (typeof clat === 'number' && typeof clng === 'number') {
          setLat(String(clat));
          setLng(String(clng));
          setPicked({ lat: clat, lng: clng });
          onPick(clat, clng);
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = L.marker([clat, clng]).addTo(map);
        }
      });
      leafletMap.current = map;
    } catch {}
  };

  useEffect(() => {
    initMap();
    return () => {
      try { leafletMap.current?.remove(); } catch {}
    };
  }, []);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('مرورگر شما از موقعیت‌یاب پشتیبانی نمی‌کند.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude;
        const currentLng = pos.coords.longitude;
        setLat(String(currentLat));
        setLng(String(currentLng));
        setPicked({ lat: currentLat, lng: currentLng });
        onPick(currentLat, currentLng);
        const L: any = (window as any).L;
        if (leafletMap.current && L) {
          leafletMap.current.setView([currentLat, currentLng], 15);
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = L.marker([currentLat, currentLng]).addTo(leafletMap.current);
        }
      },
      () => {
        alert('دریافت موقعیت فعلی ناموفق بود.');
      }
    );
  };

  const handleSetManually = () => {
    const nlat = Number(lat);
    const nlng = Number(lng);
    if (Number.isFinite(nlat) && Number.isFinite(nlng)) {
      setPicked({ lat: nlat, lng: nlng });
      onPick(nlat, nlng);
      const L: any = (window as any).L;
      if (leafletMap.current && L) {
        leafletMap.current.setView([nlat, nlng], 15);
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([nlat, nlng]).addTo(leafletMap.current);
      }
    } else {
      alert('مختصات نامعتبر است.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="space-y-2">
          <Label htmlFor="lat">عرض جغرافیایی (Lat)</Label>
          <Input id="lat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="مثال: 35.7240" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">طول جغرافیایی (Lng)</Label>
          <Input id="lng" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="مثال: 51.1113" />
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={handleSetManually} className="flex-1">ثبت مختصات</Button>
          <Button type="button" onClick={handleUseCurrentLocation} variant="outline" className="flex-1">موقعیت فعلی</Button>
        </div>
      </div>

      <div ref={mapRef} className="rounded-xl overflow-hidden border border-blue-100 bg-white" style={{ height }} />

      {picked && (
        <div className="text-xs text-gray-600">
          مختصات انتخاب‌شده: {picked.lat.toFixed(6)}, {picked.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default MapPicker;


