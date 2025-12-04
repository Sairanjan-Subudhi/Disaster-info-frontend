import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    setLoading(true);
    setError('');

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token || '';
        const user = data.user || {};

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        window.dispatchEvent(new Event('authChanged'));

        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed — check credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-cyber-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">Sign in to access the Command Center</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg border border-neon-red/30 bg-neon-red/10 text-neon-red text-sm font-medium flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue uppercase tracking-widest">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neon-blue text-black font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neon-blue hover:text-white hover:underline transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}