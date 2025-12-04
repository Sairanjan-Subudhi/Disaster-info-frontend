import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userRole, setUserRole] = useState('user');
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);
  const [mapCenter, setMapCenter] = useState(null);

  // Keep ref in sync with state for socket listener
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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

  // Custom Cluster Icon - Cyber Style
  const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      html: `<span class="flex items-center justify-center w-full h-full text-white font-bold text-lg drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">${cluster.getChildCount()}</span>`,
      className: 'bg-cyber-black/90 border border-neon-blue rounded-full shadow-glow-blue backdrop-blur-sm',
      iconSize: L.point(40, 40, true),
    });
  };

  // Component to handle map animations
  function MapController({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo(center, 10, { duration: 2.5 });
      }
    }, [center, map]);
    return null;
  }

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

      if (transformedEvent.lat && transformedEvent.lon) {
        setMapCenter([transformedEvent.lat, transformedEvent.lon]);
      }

      // Audio Alert for High Severity
      if (transformedEvent.severity === 'High' && !isMutedRef.current) {
        const text = `Alert. High severity ${transformedEvent.type} detected in ${transformedEvent.place}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleEventClick = (lat, lon) => {
    if (lat && lon) {
      setMapCenter([lat, lon]);
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

  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("DisasterWatch Situation Report", 14, 22);

    // Timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Table
    const tableColumn = ["Type", "Location", "Severity", "Time"];
    const tableRows = [];

    events.forEach(event => {
      const eventData = [
        event.type,
        event.place,
        event.severity,
        new Date(event.time).toLocaleString()
      ];
      tableRows.push(eventData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 240, 255] } // Neon Blue
    });

    doc.save(`Situation_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredEvents = filter === "all" ? events : events.filter(e => e.severity === filter);

  const stats = {
    total: events.length,
    high: events.filter(e => e.severity === "High").length,
    medium: events.filter(e => e.severity === "Medium").length,
    low: events.filter(e => e.severity === "Low").length
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cyber-black text-white">

      {/* Map Background - Z-index 0 */}
      <div className="absolute inset-0 z-0 h-screen w-full">
        <MapContainer
          center={[20.6, 78.9]}
          zoom={5}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={mapCenter} />

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {filteredEvents.map(ev => {
              if (ev.lat !== null && ev.lon !== null) {
                const colors = {
                  High: "#FF003C",   // Neon Red
                  Medium: "#BC13FE", // Neon Purple
                  Low: "#00F0FF"     // Neon Blue
                };

                return (
                  <CircleMarker
                    key={ev.id}
                    center={[ev.lat, ev.lon]}
                    pathOptions={{
                      fillColor: colors[ev.severity] || "#999",
                      color: colors[ev.severity] || "#999",
                      weight: 1,
                      fillOpacity: 0.6,
                      className: "animate-pulse"
                    }}
                    radius={ev.severity === "High" ? 12 : ev.severity === "Medium" ? 10 : 8}
                  >
                    <Popup className="glass-popup">
                      <div className="p-2 font-sans">
                        <b style={{ color: colors[ev.severity], fontSize: "16px", textTransform: "uppercase", textShadow: `0 0 10px ${colors[ev.severity]}` }}>{ev.type}</b><br />
                        <div className="mt-1 text-sm font-bold text-gray-800">{ev.place}</div>
                        <div className="text-xs text-gray-600">Severity: {ev.severity}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              }
              return null;
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Sidebar (Left) - Floating Glass Panel */}
      <aside className="absolute top-20 left-4 bottom-4 w-80 z-10 flex flex-col bg-cyber-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">

        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-neon-blue tracking-widest uppercase flex items-center">
              <span className="w-2 h-2 rounded-full bg-neon-red mr-2 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]"></span>
              Live Feed
            </h2>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">
              {filteredEvents.length} EVENTS
            </span>
          </div>

          {/* Admin Download Report Button */}
          {userRole === 'admin' && (
            <button
              onClick={handleDownloadReport}
              className="w-full mb-4 py-2 px-4 text-xs font-bold text-neon-blue border border-neon-blue/30 bg-neon-blue/10 hover:bg-neon-blue/20 hover:shadow-glow-blue transition-all rounded uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'High', 'Medium', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-transparent transition-all rounded ${filter === f
                  ? 'bg-neon-blue text-black shadow-glow-blue'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/10'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredEvents.map(ev => (
            <div
              key={ev.id}
              onClick={() => handleEventClick(ev.lat, ev.lon)}
              className={`p-4 bg-white/5 border-l-2 border-transparent hover:bg-white/10 transition-all cursor-pointer rounded-r-lg group relative backdrop-blur-sm ${ev.severity === 'High' ? 'border-l-neon-red shadow-[inset_10px_0_20px_-10px_rgba(255,0,60,0.2)]' :
                  ev.severity === 'Medium' ? 'border-l-neon-purple shadow-[inset_10px_0_20px_-10px_rgba(188,19,254,0.2)]' :
                    'border-l-neon-blue shadow-[inset_10px_0_20px_-10px_rgba(0,240,255,0.2)]'
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-sm tracking-wide ${ev.severity === 'High' ? 'text-neon-red drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]' :
                      ev.severity === 'Medium' ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]' :
                        'text-neon-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]'
                    }`}>{ev.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Admin Delete Button */}
                  {userRole === 'admin' && (
                    <button
                      onClick={(e) => handleDeleteEvent(e, ev.id)}
                      className="p-1 text-gray-500 hover:text-neon-red transition-colors"
                      title="Delete Event"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-300 font-medium mb-2 flex items-center">
                <span className="truncate opacity-80">{ev.place}</span>
              </div>

              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                {new Date(ev.time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Stats Overlay (Top Right) */}
      <div className="absolute top-24 right-8 flex flex-col gap-3 z-10 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-3">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-cyber-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 min-w-[160px] hover:border-neon-blue/50 transition-all flex items-center justify-between group cursor-pointer shadow-lg"
            title={isMuted ? "Unmute Audio Alerts" : "Mute Audio Alerts"}
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audio Feed</span>
            {isMuted ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-neon-green animate-pulse drop-shadow-[0_0_5px_rgba(5,255,0,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          <div className="bg-cyber-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-4 min-w-[160px] shadow-lg">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stats.total}</p>
          </div>

          <div className="bg-cyber-black/80 backdrop-blur-xl border border-white/10 border-l-4 border-l-neon-red rounded-lg p-4 min-w-[160px] shadow-lg">
            <p className="text-[10px] font-bold text-neon-red uppercase tracking-widest mb-1">High Severity</p>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]">{stats.high}</p>
          </div>

          <div className="bg-cyber-black/80 backdrop-blur-xl border border-white/10 border-l-4 border-l-neon-purple rounded-lg p-4 min-w-[160px] shadow-lg">
            <p className="text-[10px] font-bold text-neon-purple uppercase tracking-widest mb-1">Medium Severity</p>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">{stats.medium}</p>
          </div>

          <div className="bg-cyber-black/80 backdrop-blur-xl border border-white/10 border-l-4 border-l-neon-blue rounded-lg p-4 min-w-[160px] shadow-lg">
            <p className="text-[10px] font-bold text-neon-blue uppercase tracking-widest mb-1">Low Severity</p>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{stats.low}</p>
          </div>
        </div>
      </div>

      {/* Global Styles for Scrollbar Hiding */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.6);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(4px);
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  );
}