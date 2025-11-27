import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Marquee() {
  const content = "LIVE UPDATES • AI POWERED • 24/7 MONITORING • PAN-INDIA COVERAGE • ";
  // Repeat content enough times to ensure it covers wide screens
  const repeatedContent = Array(4).fill(content);

  return (
    <div className="bg-gYellow border-y-4 border-neoBlack py-3 overflow-hidden whitespace-nowrap relative z-20 flex">
      <div className="flex animate-marquee flex-shrink-0">
        {repeatedContent.map((text, i) => (
          <span key={i} className="text-2xl font-black text-neoBlack mx-4">{text}</span>
        ))}
      </div>
      {/* Duplicate for seamless loop */}
      <div className="flex animate-marquee flex-shrink-0">
        {repeatedContent.map((text, i) => (
          <span key={`dup-${i}`} className="text-2xl font-black text-neoBlack mx-4">{text}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: flex;
          min-width: 100%;
        }
      `}</style>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative bg-neoWhite dark:bg-neoDark py-20 md:py-32 overflow-hidden border-b-4 border-neoBlack dark:border-neoWhite">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gBlue rounded-full border-4 border-neoBlack shadow-neo opacity-50 hidden md:block animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gRed rotate-12 border-4 border-neoBlack shadow-neo opacity-50 hidden md:block animate-pulse"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="inline-block bg-white dark:bg-neoBlack border-2 border-neoBlack dark:border-neoWhite px-4 py-1 mb-6 shadow-neo-sm transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
          <span className="font-bold text-neoBlack dark:text-neoWhite flex items-center gap-2">
            <span className="w-2 h-2 bg-gGreen rounded-full animate-ping"></span>
            SYSTEM OPERATIONAL
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-neoBlack dark:text-neoWhite mb-8 leading-tight tracking-tighter">
          <span className="relative inline-block hover:text-gBlue transition-colors duration-300">
            Real-Time
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-gRed" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
          <br />
          Disaster Intelligence.
        </h1>

        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-xl md:text-2xl text-neoBlack dark:text-neoWhite font-bold leading-relaxed">
            An advanced specialized system designed for the <span className="bg-gYellow px-2 border-2 border-neoBlack shadow-neo-sm transform -rotate-1 inline-block text-neoBlack">National Disaster Response Force</span> to detect and analyze threats across the nation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-gGreen text-white font-black text-xl border-4 border-neoBlack shadow-neo hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2 group"
          >
            <span>GO TO DASHBOARD</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            to="/docs"
            className="px-8 py-4 bg-white text-neoBlack font-black text-xl border-4 border-neoBlack shadow-neo hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full sm:w-auto text-center"
          >
            READ DOCS
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Live Monitoring",
      desc: "Real-time aggregation of local news and social media across all Indian states.",
      color: "gBlue",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "AI Analysis",
      desc: "BERT-based Severity & Classification models to filter noise and detect threats.",
      color: "gRed",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "National Mapping",
      desc: "Precise geolocation of incidents within Indian borders for rapid NDRF deployment.",
      color: "gGreen",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-neoWhite dark:bg-neoDark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`
                p-8 bg-white dark:bg-neoBlack border-4 border-neoBlack dark:border-neoWhite 
                shadow-neo hover:shadow-neo-lg hover:-translate-y-2 transition-all duration-300
                group relative overflow-hidden
              `}
            >
              {/* Color Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-4 bg-${f.color}`}></div>

              <div className={`
                w-16 h-16 bg-${f.color} border-4 border-neoBlack dark:border-neoWhite 
                flex items-center justify-center mb-6 shadow-neo-sm group-hover:rotate-12 transition-transform
              `}>
                {f.icon}
              </div>

              <h3 className="text-2xl font-black text-neoBlack dark:text-neoWhite mb-4 uppercase tracking-tight">
                {f.title}
              </h3>

              <p className="text-neoBlack dark:text-neoWhite font-medium text-lg leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Marquee />
      <Features />
    </div>
  );
}