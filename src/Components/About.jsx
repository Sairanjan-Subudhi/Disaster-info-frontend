import React from "react";

export default function About() {
  const team = [
    { name: "Parth Dhavan", role: "Lead & Full Stack", color: "neon-blue" },
    { name: "Anshika Srivastava", role: "Frontend & Design", color: "neon-red" },
    { name: "Sairanjan Subudhi", role: "Backend Developer", color: "neon-green" },
    { name: "Rushil Alagh", role: "Research Analyst", color: "neon-purple" }
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-white pt-32 pb-12 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">

        {/* Section 1: The Mission Box */}
        <section className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              MISSION: CRITICAL
            </span>
          </h1>
          <div className="space-y-4 text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
            <p>
              Disasters don't wait. Neither do we.
            </p>
            <p>
              We aggregate <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">real-time data</span> from news and social media, process it with <span className="text-neon-blue font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">advanced AI</span>, and deliver actionable intelligence to save lives.
            </p>
          </div>
        </section>

        {/* Section 2: The Team (Holographic Cards) */}
        <section>
          <div className="flex items-center mb-10">
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest mr-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
              The Squad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-${member.color}/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--color-${member.color}),0.2)]`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${member.color} shadow-[0_0_15px_rgba(var(--color-${member.color}),0.8)]`}></div>

                <div className="p-8 flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-full bg-${member.color}/10 border border-${member.color}/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(var(--color-${member.color}),0.2)]`}>
                    <svg className={`w-10 h-10 text-${member.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-neon-blue transition-colors">{member.name}</h3>
                    <p className={`text-sm font-mono font-bold text-${member.color} uppercase tracking-wider mt-1`}>
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Mentorship */}
        <section className="flex justify-center">
          <div className="glass-panel p-8 max-w-2xl w-full text-center relative rounded-2xl border border-white/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-black text-neon-blue px-4 py-1 text-xs font-bold uppercase border border-neon-blue/30 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Mentorship
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">Dr. Arjun Arora</h3>
            <p className="text-lg font-medium text-gray-400 mt-2">
              School of Computer Science, UPES
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <span className="w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse"></span>
              <span className="w-2 h-2 bg-neon-red rounded-full shadow-[0_0_8px_rgba(255,0,60,0.8)] animate-pulse delay-75"></span>
              <span className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_8px_rgba(5,255,0,0.8)] animate-pulse delay-150"></span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}