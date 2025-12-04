import React from "react";

export default function Docs() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white flex flex-col md:flex-row relative pt-28">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-cyber-black/90 border-b md:border-b-0 md:border-r border-white/10 sticky top-28 h-auto md:h-[calc(100vh-112px)] overflow-y-auto z-10 backdrop-blur-xl">
        <div className="p-6">
          <h3 className="text-xs font-bold text-neon-blue uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
            Contents
          </h3>
          <nav className="space-y-1">
            {['Architecture', 'API Reference', 'Tech Stack'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-neon-blue transition-all rounded-r-lg"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 max-w-5xl mx-auto">

        {/* Architecture Section */}
        <section id="architecture" className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">System Architecture</span>
          </h1>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              The DisasterWatch system operates on a high-performance microservices architecture designed for speed and reliability.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-red/50 transition-colors group">
                <span className="font-mono text-neon-red mr-4 text-xl">01</span>
                <span className="font-bold text-white group-hover:text-neon-red transition-colors">Python Scraper</span>
                <span className="mx-4 text-gray-600">→</span>
                <span className="text-sm text-gray-400">Collects raw data from Google RSS & Social Media</span>
              </div>
              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-purple/50 transition-colors group">
                <span className="font-mono text-neon-purple mr-4 text-xl">02</span>
                <span className="font-bold text-white group-hover:text-neon-purple transition-colors">Flask ML Engine</span>
                <span className="mx-4 text-gray-600">→</span>
                <span className="text-sm text-gray-400">BERT/RoBERTa models classify severity & type</span>
              </div>
              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-green/50 transition-colors group">
                <span className="font-mono text-neon-green mr-4 text-xl">03</span>
                <span className="font-bold text-white group-hover:text-neon-green transition-colors">MongoDB</span>
                <span className="mx-4 text-gray-600">→</span>
                <span className="text-sm text-gray-400">Stores GeoJSON data for spatial queries</span>
              </div>
              <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-blue/50 transition-colors group">
                <span className="font-mono text-neon-blue mr-4 text-xl">04</span>
                <span className="font-bold text-white group-hover:text-neon-blue transition-colors">Node.js Backend</span>
                <span className="mx-4 text-gray-600">→</span>
                <span className="text-sm text-gray-400">Serves API & Real-time Socket.io events</span>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference Section */}
        <section id="api-reference" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-neon-red shadow-[0_0_10px_rgba(255,0,60,0.8)]"></span>
            API Reference
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 text-xs font-mono rounded border border-neon-blue/50">POST</span>
              /ml/predict
            </h3>
            <p className="text-gray-400 mb-6">
              Submit raw text for disaster classification and severity analysis.
            </p>

            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 overflow-x-auto shadow-inner">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="text-gray-300">
                  <span className="text-gray-500">// Request Body</span>
                  {`
{
  `}
                  <span className="text-neon-purple">"text"</span>: <span className="text-neon-green">"Massive flooding reported in downtown Mumbai after heavy rains."</span>,
                  <span className="text-neon-purple">"source"</span>: <span className="text-neon-green">"twitter"</span>
                  {`
}

`}
                  <span className="text-gray-500">// Response</span>
                  {`
{
  `}
                  <span className="text-neon-purple">"disaster_type"</span>: <span className="text-neon-green">"Flood"</span>,
                  <span className="text-neon-purple">"severity"</span>: <span className="text-neon-green">"High"</span>,
                  <span className="text-neon-purple">"confidence"</span>: <span className="text-neon-blue">0.98</span>,
                  <span className="text-neon-purple">"location"</span>: {`{`}
                  <span className="text-neon-purple">"lat"</span>: <span className="text-neon-blue">19.0760</span>,
                  <span className="text-neon-purple">"lon"</span>: <span className="text-neon-blue">72.8777</span>
                  {`}`}
                  {`
}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-neon-green shadow-[0_0_10px_rgba(5,255,0,0.8)]"></span>
            Tech Stack
          </h2>

          <div className="flex flex-wrap gap-3">
            {['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Socket.io', 'Python', 'Flask', 'MongoDB', 'Leaflet', 'BERT'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm font-bold text-gray-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}