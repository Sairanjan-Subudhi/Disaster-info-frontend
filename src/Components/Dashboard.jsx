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
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [userRole, setUserRole] = useState('user');
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);
  const [mapCenter, setMapCenter] = useState(null);

  // Keep ref in sync with state for socket listener
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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

  // Custom Cluster Icon
  const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      html: `<span class="flex items-center justify-center w-full h-full text-white font-black text-lg">${cluster.getChildCount()}</span>`,
      className: 'bg-neoBlack border-2 border-white rounded-full shadow-neo',
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
      headStyles: { fillColor: [66, 133, 244] } // Google Blue
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

          {/* Admin Download Report Button */}
          {userRole === 'admin' && (
            <button
              onClick={handleDownloadReport}
              className="w-full mb-4 py-2 px-4 bg-gBlue text-white font-bold border-2 border-neoBlack shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              DOWNLOAD REPORT
            </button>
          )}

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
          <MapContainer
            center={[20.6, 78.9]}
            zoom={5}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              }
            />
            <MapController center={mapCenter} />

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
            >
              {filteredEvents.map(ev => {
                if (ev.lat !== null && ev.lon !== null) {
                  const colors = {
                    High: "#EA4335",   // gRed
                    Medium: "#FBBC05", // gYellow
                    Low: "#4285F4"     // gBlue
                  };

                  return (
                    <CircleMarker
                      key={ev.id}
                      center={[ev.lat, ev.lon]}
                      pathOptions={{
                        fillColor: colors[ev.severity] || "#999",
                        color: "#000",
                        weight: 2,
                        fillOpacity: 1
                      }}
                      radius={ev.severity === "High" ? 12 : ev.severity === "Medium" ? 10 : 8}
                    >
                      <Popup>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", padding: "4px" }}>
                          <b style={{ color: colors[ev.severity], fontSize: "16px", textTransform: "uppercase" }}>{ev.type}</b><br />
                          <div style={{ marginTop: "4px", fontSize: "14px", color: "#000", fontWeight: "500" }}>{ev.place}</div>
                          <div style={{ marginTop: "2px", fontSize: "12px", color: "#666" }}>Severity: {ev.severity}</div>
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

        {/* Floating Stats Overlay */}
        <div className="absolute top-8 right-8 flex flex-col gap-3 z-[1000]">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white border-2 border-neoBlack shadow-neo p-3 min-w-[140px] hover:translate-x-1 transition-transform flex items-center justify-between group cursor-pointer"
            title={isMuted ? "Unmute Audio Alerts" : "Mute Audio Alerts"}
          >
            <span className="text-xs font-bold text-neoBlack uppercase">Audio Alerts</span>
            {isMuted ? (
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gRed animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

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