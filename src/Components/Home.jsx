import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-neoWhite dark:bg-neoDark text-neoBlack dark:text-neoWhite font-sans selection:bg-gYellow selection:text-neoBlack transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex flex-col justify-center items-center text-center overflow-hidden border-b-4 border-neoBlack dark:border-neoWhite bg-[radial-gradient(#121212_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="relative z-10 px-4 max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8">
            <span className="relative inline-block">
              REAL-TIME.
              {/* Jagged Seismograph Underline */}
              <svg className="absolute w-full h-6 -bottom-2 left-0 text-gRed" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 L 5 2 L 10 8 L 15 3 L 20 7 L 25 4 L 30 6 L 35 1 L 40 9 L 45 5 L 50 5 L 55 2 L 60 8 L 65 3 L 70 7 L 75 4 L 80 6 L 85 1 L 90 9 L 95 5 L 100 5" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
            <br />
            INTELLIGENCE.
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12 bg-white dark:bg-neoBlack border-2 border-neoBlack dark:border-neoWhite p-6 shadow-neo dark:shadow-neo-dark transform -rotate-1">
            Advanced disaster prediction and response coordination system for the National Disaster Response Force.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="px-10 py-4 bg-gBlue text-white font-black text-xl border-4 border-neoBlack dark:border-neoWhite shadow-neo dark:shadow-neo-dark hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              ENTER COMMAND
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Module 1: Live Command Center (Span 2) */}
          <div className="md:col-span-2 bg-white dark:bg-neoBlack border-4 border-neoBlack dark:border-neoWhite shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative min-h-[350px] flex flex-col">
            <div className="bg-neoBlack dark:bg-white text-white dark:text-neoBlack px-4 py-2 font-mono text-sm flex justify-between items-center border-b-4 border-neoBlack dark:border-neoWhite">
              <span className="font-bold">LIVE_FEED_V.1.0</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">STATUS: ONLINE</span>
                <span className="w-3 h-3 rounded-full bg-gRed animate-pulse"></span>
              </div>
            </div>
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 p-4 overflow-hidden">
              {/* Mock Map UI */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* Map Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-gRed rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-6 h-6 bg-gRed rounded-full relative border-4 border-white dark:border-neoBlack shadow-lg"></div>
              </div>

              {/* Decorative Map Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" stroke="currentColor">
                <path d="M100 100 L 300 200 L 500 150" fill="none" strokeWidth="2" className="text-neoBlack dark:text-white" strokeDasharray="5,5" />
                <circle cx="300" cy="200" r="4" className="fill-neoBlack dark:fill-white" />
              </svg>

              <div className="absolute top-4 left-4 p-3 bg-white dark:bg-neoBlack border-2 border-neoBlack dark:border-neoWhite shadow-sm text-xs font-mono font-bold z-10">
                LAT: 28.6139° N <br /> LNG: 77.2090° E <br /> <span className="text-gRed">ALERT LEVEL: HIGH</span>
              </div>
            </div>
            <div className="p-6 border-t-4 border-neoBlack dark:border-neoWhite bg-white dark:bg-neoBlack relative z-10">
              <h3 className="text-3xl font-black mb-2">Live Command Center</h3>
              <p className="font-medium text-gray-600 dark:text-gray-300">Real-time geospatial tracking of active units and hazard zones.</p>
            </div>
          </div>

          {/* Module 2: AI-Powered (Span 1) */}
          <div className="bg-gYellow border-4 border-neoBlack dark:border-neoWhite shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-end">
              <div className="p-3 bg-white border-2 border-neoBlack rounded-full">
                <svg className="w-8 h-8 text-neoBlack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-7xl font-black mb-2 text-neoBlack">High</h3>
              <h4 className="text-2xl font-bold border-b-4 border-neoBlack inline-block mb-3 text-neoBlack">ACCURACY</h4>
              <p className="font-bold text-neoBlack text-sm leading-tight">Models trained on 15+ years of disaster data for precise prediction.</p>
            </div>
          </div>

          {/* Module 3: Pan-India (Span 1) */}
          <div className="bg-gGreen border-4 border-neoBlack dark:border-neoWhite shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-30"></div>
            <h3 className="text-3xl font-black text-white mb-6 z-10 relative text-center uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Pan-India Coverage</h3>

            {/* Simplified India Map Representation */}
            <svg className="w-40 h-40 text-white drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <p className="mt-4 text-white font-bold text-center z-10">28 States • 8 UTs</p>
          </div>

          {/* Module 4: Instant Alerts (Span 2) */}
          <div className="md:col-span-2 bg-white dark:bg-neoBlack border-4 border-neoBlack dark:border-neoWhite shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark hover:scale-[1.02] transition-all duration-300 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">INSTANT ALERTS</h3>
              <div className="flex flex-wrap gap-3">
                {['SMS', 'EMAIL', 'VOICE', 'APP_NOTIF'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-neoBlack dark:bg-white text-white dark:text-neoBlack font-mono font-bold text-sm border-2 border-transparent hover:border-neoBlack dark:hover:border-white hover:bg-transparent hover:text-neoBlack dark:hover:text-white transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gBlue border-4 border-neoBlack flex items-center justify-center shadow-neo hover:-translate-y-2 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div className="w-20 h-20 bg-gRed border-4 border-neoBlack flex items-center justify-center shadow-neo hover:-translate-y-2 transition-transform delay-75">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="w-20 h-20 bg-gYellow border-4 border-neoBlack flex items-center justify-center shadow-neo hover:-translate-y-2 transition-transform delay-150">
                <svg className="w-10 h-10 text-neoBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;