import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-cyber-black text-white pt-32 pb-12 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-red/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Have questions? Found a bug? Just want to say hi?
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neon-blue uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neon-blue uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  placeholder="YOU@EXAMPLE.COM"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue uppercase tracking-widest">Message</label>
              <textarea
                rows="5"
                placeholder="TYPE YOUR MESSAGE HERE..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-medium resize-none"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="px-8 py-4 bg-neon-blue text-black font-bold text-lg rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 transition-all uppercase tracking-wider"
              >
                Send Message
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}