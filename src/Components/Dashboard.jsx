import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const mapRef = useRef(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [userRole, setUserRole] = useState('user');

  // Listen for theme changes to update map tiles
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Check user role on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || 'user');
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const transformEvent = (ev) => ({
    id: ev._id,
    type: ev.disaster_type || "Unknown",
    place: ev.location_text || "Unknown Location",
    severity: ev.severity || "Low",
    time: ev.timestamp || new Date().toISOString(),
    lat: (ev.location && ev.location.coordinates) ? ev.location.coordinates[1] : null,
    lon: (ev.location && ev.location.coordinates) ? ev.location.coordinates[0] : null
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${SOCKET_URL}/api/alerts`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Loaded events:", data);
        setEvents(data.map(transformEvent));
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();

    const socket = io(SOCKET_URL);

    socket.on("connect", () => console.log("Connected to socket server"));
    socket.on("connect_error", (err) => console.error("Socket connection error:", err));

    socket.on("new_event", (evt) => {
      console.log("New event received:", evt);
      const transformedEvent = transformEvent(evt);
      setEvents((prev) => [transformedEvent, ...prev]);

      if (transformedEvent.lat && transformedEvent.lon && mapRef.current) {
        mapRef.current.flyTo([transformedEvent.lat, transformedEvent.lon], 10, { duration: 2.5 });
      }
    });

    return () => socket.disconnect();
  }, []);

  // Map Initialization & Tile Layer Update
  useEffect(() => {
    if (!events.length) return;
    const mapContainer = document.getElementById("dashboard-map");
    if (!mapContainer) return;

    if (!mapRef.current) {
      const map = L.map("dashboard-map", {
        preferCanvas: true,
        attributionControl: false,
        zoomControl: false
      }).setView([20.6, 78.9], 5);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
      window._disasterMap = map;
    }

    const map = mapRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer based on theme
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

  }, [events.length === 0, isDark]); // Re-run when theme changes

  // Markers Update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (window._dashMarkers) window._dashMarkers.forEach(m => m.remove());
    window._dashMarkers = [];

    const filteredEvents = filter === "all" ? events : events.filter(e => e.severity === filter);

    filteredEvents.forEach(e => {
      if (e.lat !== null && e.lon !== null) {
        const colors = {
          High: "#EA4335",   // gRed
          Medium: "#FBBC05", // gYellow
          Low: "#4285F4"     // gBlue
        };

        const marker = L.circleMarker([e.lat, e.lon], {
          radius: e.severity === "High" ? 12 : e.severity === "Medium" ? 10 : 8,
          fillColor: colors[e.severity] || "#999",
          color: "#000",
          weight: 2,
          fillOpacity: 1
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: 'Space Grotesk', sans-serif; padding: 4px;">
            <b style="color: ${colors[e.severity]}; font-size: 16px; text-transform: uppercase;">${e.type}</b><br/>
            <div style="margin-top: 4px; font-size: 14px; color: #000; font-weight: 500;">${e.place}</div>
            <div style="margin-top: 2px; font-size: 12px; color: #666;">Severity: ${e.severity}</div>
          </div>
        `);

        window._dashMarkers.push(marker);
      }
    });
  }, [events, filter]);

  const handleEventClick = (lat, lon) => {
    if (lat && lon && mapRef.current) {
      mapRef.current.flyTo([lat, lon], 10, { duration: 2.5 });
    }
  };

  const handleDeleteEvent = async (e, id) => {
    e.stopPropagation(); // Prevent triggering the card click

    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const token = localStorage.getItem('token');
      console.log(`Attempting to delete event ${id} with token:`, token ? 'Present' : 'Missing');

      const response = await fetch(`${SOCKET_URL}/api/alerts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Optimistic UI update
        setEvents(prev => prev.filter(event => event.id !== id));
        console.log(`Deleted event ID: ${id}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to delete event:', response.status, errorText);
        alert(`Failed to delete event. Server responded with: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please check your connection.');
    }
  };

  const filteredEvents = filter === "all" ? events : events.filter(e => e.severity === filter);

  const stats = {
    total: events.length,
    high: events.filter(e => e.severity === "High").length,
    medium: events.filter(e => e.severity === "Medium").length,
    low: events.filter(e => e.severity === "Low").length
  };

  if (!events.length) return (
    <div className="min-h-screen bg-neoWhite dark:bg-neoDark flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-neoBlack border-t-gBlue rounded-full animate-spin mb-6"></div>
      <p className="text-neoBlack dark:text-neoWhite font-bold text-xl animate-pulse">INITIALIZING SYSTEM...</p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neoWhite dark:bg-neoDark flex flex-col md:flex-row overflow-hidden relative">
      {/* Sidebar - Neo-Brutalist */}
      <aside className="w-full md:w-96 bg-white dark:bg-neoDark border-r-4 border-neoBlack dark:border-neoWhite flex flex-col z-20 shadow-neo lg:h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="p-6 border-b-4 border-neoBlack dark:border-neoWhite bg-gYellow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-neoBlack flex items-center tracking-tight">
              <span className="w-4 h-4 rounded-full bg-gRed border-2 border-neoBlack mr-3 animate-pulse"></span>
              LIVE FEED
            </h2>
            <span className="text-sm font-bold text-neoBlack bg-white px-3 py-1 border-2 border-neoBlack shadow-neo-sm">
              {filteredEvents.length} EVENTS
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'High', 'Medium', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-bold uppercase border-2 border-neoBlack transition-all shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${filter === f
                  ? 'bg-neoBlack text-white'
                  : 'bg-white text-neoBlack hover:bg-gray-100'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-neoWhite dark:bg-neoDark">
          {filteredEvents.map(ev => (
            <div
              key={ev.id}
              onClick={() => handleEventClick(ev.lat, ev.lon)}
              className={`p-4 border-2 border-neoBlack shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer bg-white dark:bg-neoDark group relative ${ev.severity === 'High' ? 'border-l-8 border-l-gRed' :
                ev.severity === 'Medium' ? 'border-l-8 border-l-gYellow' :
                  'border-l-8 border-l-gBlue'
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-black text-lg tracking-tight ${ev.severity === 'High' ? 'text-gRed' :
                    ev.severity === 'Medium' ? 'text-gYellow' :
                      'text-gBlue'
                    }`}>{ev.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold bg-neoBlack text-white px-2 py-1">
                    {ev.severity.toUpperCase()}
                  </span>
                  {/* Admin Delete Button */}
                  {userRole === 'admin' && (
                    <button
                      onClick={(e) => handleDeleteEvent(e, ev.id)}
                      className="p-1 bg-white border-2 border-neoBlack hover:bg-gRed hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                      title="Delete Event"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm text-neoBlack dark:text-neoWhite font-medium mb-2 flex items-center">
                <span className="truncate">{ev.place}</span>
              </div>

              <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {new Date(ev.time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative h-[50vh] md:h-auto p-4 bg-neoWhite dark:bg-neoDark">
        <div className="w-full h-full border-4 border-neoBlack dark:border-neoWhite shadow-neo relative overflow-hidden bg-gray-200">
          <div id="dashboard-map" className="w-full h-full z-0"></div>
        </div>

        {/* Floating Stats Overlay */}
        <div className="absolute top-8 right-8 flex flex-col gap-3 z-[1000]">
          <div className="bg-white border-2 border-neoBlack shadow-neo p-3 min-w-[140px] hover:translate-x-1 transition-transform">
            <p className="text-xs font-bold text-gray-500 uppercase">Total Events</p>
            <p className="text-3xl font-black text-neoBlack">{stats.total}</p>
          </div>
          <div className="bg-white border-2 border-neoBlack shadow-neo p-3 min-w-[140px] hover:translate-x-1 transition-transform border-l-8 border-l-gRed">
            <p className="text-xs font-bold text-gRed uppercase">High Severity</p>
            <p className="text-3xl font-black text-neoBlack">{stats.high}</p>
          </div>
          <div className="bg-white border-2 border-neoBlack shadow-neo p-3 min-w-[140px] hover:translate-x-1 transition-transform border-l-8 border-l-gYellow">
            <p className="text-xs font-bold text-gYellow uppercase">Medium Severity</p>
            <p className="text-3xl font-black text-neoBlack">{stats.medium}</p>
          </div>
          <div className="bg-white border-2 border-neoBlack shadow-neo p-3 min-w-[140px] hover:translate-x-1 transition-transform border-l-8 border-l-gBlue">
            <p className="text-xs font-bold text-gBlue uppercase">Low Severity</p>
            <p className="text-3xl font-black text-neoBlack">{stats.low}</p>
          </div>
        </div>
      </main>

      {/* Global Styles for Scrollbar Hiding */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F0F0F0;
          border-left: 2px solid #121212;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #121212;
          border: 2px solid #F0F0F0;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1E1E1E;
          border-left: 2px solid #FFFFFF;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFFFFF;
          border: 2px solid #1E1E1E;
        }
      `}</style>
    </div>
  );
}