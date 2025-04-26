import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Vaccination = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Center on India
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markersRef.current = [];
  };

  const handleSearch = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError('');
    clearMarkers();

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) {
        setError('Location not found. Try a different one.');
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];
      mapRef.current.setView([lat, lon], 13);

      const query = `
        [out:json];
        (
          node["amenity"="veterinary"](around:5000,${lat},${lon});
          way["amenity"="veterinary"](around:5000,${lat},${lon});
        );
        out center;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error('Overpass API failed');

      const data = await response.json();

      if (!data.elements.length) {
        setError('No nearby pet clinics found.');
        return;
      }

      data.elements.forEach((place) => {
        const position =
          place.type === 'node'
            ? [place.lat, place.lon]
            : [place.center.lat, place.center.lon];

        const marker = L.marker(position)
          .addTo(mapRef.current)
          .bindPopup(`<strong>${place.tags.name || 'Unnamed Clinic'}</strong>`);

        markersRef.current.push(marker);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch map data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-[64px] p-6 bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-200">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
        🐾 Find Nearby Pet Vaccination Centers
      </h1>

      <div className="max-w-md mx-auto mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter your location (e.g., Ludhiana)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 rounded-lg border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          {loading ? '🔄 Searching...' : '🔍 Search Nearby Clinics'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="w-12 h-12 border-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-xl border border-indigo-300">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default Vaccination;
