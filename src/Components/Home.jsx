import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Magic Particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-neon-purple selection:text-white overflow-hidden relative">

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Pattern with Parallax */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear_gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
        ></div>

        {/* Massive Glow Orb - Interactive */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/10 rounded-full blur-[120px] opacity-40 animate-pulse-glow"
          style={{ transform: `translate(calc(-50% + ${mousePosition.x * -30}px), calc(-50% + ${mousePosition.y * -30}px))` }}
        ></div>

        {/* Secondary Glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px] opacity-30 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent h-[20%] w-full animate-scanline opacity-10 pointer-events-none"></div>

        {/* Magic Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white opacity-20 animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        <div className="max-w-6xl mx-auto space-y-8 perspective-1000">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-fade-in-up hover:border-neon-blue/50 transition-colors cursor-default group">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
            </span>
            <span className="text-xs font-mono text-gray-300 tracking-widest uppercase group-hover:text-white transition-colors">System Online v2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none animate-fade-in-up delay-100">
            <span className="inline-block hover:scale-105 transition-transform duration-500 cursor-default bg-gradient-to-r from-neon-blue via-white to-neon-blue bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.3)] bg-[length:200%_auto] animate-gradient">
              PREDICT.
            </span>
            <br />
            <span className="inline-block hover:scale-105 transition-transform duration-500 cursor-default bg-gradient-to-r from-neon-purple via-white to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(188,19,254,0.3)] bg-[length:200%_auto] animate-gradient delay-75">
              PREPARE.
            </span>
            <br />
            <span className="inline-block hover:scale-105 transition-transform duration-500 cursor-default bg-gradient-to-r from-neon-red via-white to-neon-red bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,0,60,0.3)] bg-[length:200%_auto] animate-gradient delay-150">
              PROTECT.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            AI-Powered Disaster Intelligence for the <span className="text-white font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-neon-blue after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Next Generation</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-fade-in-up delay-300">
            <Link
              to="/dashboard"
              className="group relative px-8 py-4 bg-neon-blue text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <span className="relative flex items-center gap-2">
                Launch Console
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/docs"
              className="group px-8 py-4 bg-transparent text-white font-bold text-lg border border-white/20 rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="group-hover:text-neon-blue transition-colors">Read Documentation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-neon-blue/50 transition-all duration-500">
            <div className="absolute inset-0 bg-neon-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative h-full p-8 bg-cyber-black/90 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-transparent transition-all">
              <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-blue/20 transition-all duration-300">
                <svg className="w-7 h-7 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">Real-Time Tracking</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                Live geospatial monitoring of active hazard zones with millisecond latency updates.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-neon-purple/50 transition-all duration-500">
            <div className="absolute inset-0 bg-neon-purple/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative h-full p-8 bg-cyber-black/90 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-transparent transition-all">
              <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-purple/20 transition-all duration-300">
                <svg className="w-7 h-7 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-purple transition-colors">AI Prediction</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                Advanced neural networks analyzing 50+ years of data to predict disaster severity.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-neon-red/50 transition-all duration-500">
            <div className="absolute inset-0 bg-neon-red/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative h-full p-8 bg-cyber-black/90 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-transparent transition-all">
              <div className="w-14 h-14 rounded-xl bg-neon-red/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-red/20 transition-all duration-300">
                <svg className="w-7 h-7 text-neon-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-red transition-colors">Instant Alerts</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                Multi-channel notification system delivering critical warnings via SMS, Email, and Voice.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;