import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState('user');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function checkAuth() {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role || 'user');
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
          setUserRole('user');
        }
      } else {
        setUserRole('user');
      }
    }

    checkAuth();

    function onAuthChanged() {
      checkAuth();
    }

    function onStorage(e) {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    }

    window.addEventListener("authChanged", onAuthChanged);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-4">
      <nav className="w-full max-w-7xl bg-cyber-glass backdrop-blur-xl border border-white/10 rounded-full shadow-lg transition-all duration-300">
        <div className="px-6 md:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                <span className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-300">
                  DisasterWatch
                </span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Dashboard', 'About', 'Docs', 'Contact'].map((item) => (
                <NavLink
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative px-1 py-2 text-sm font-medium transition-all duration-300 ${isActive
                      ? "text-neon-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.6)]"
                      : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {/* Admin Link */}
              {isAuthenticated && userRole === 'admin' && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `relative px-1 py-2 text-sm font-medium transition-all duration-300 ${isActive
                      ? "text-neon-red drop-shadow-[0_0_5px_rgba(255,0,60,0.6)]"
                      : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Manage Users
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-red rounded-full shadow-[0_0_8px_rgba(255,0,60,0.8)]"></span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-medium text-white bg-white/5 border border-white/20 rounded-full hover:bg-neon-blue/20 hover:border-neon-blue hover:shadow-glow-blue transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 text-sm font-medium text-black bg-neon-blue border border-neon-blue rounded-full shadow-glow-blue hover:bg-white hover:text-neon-blue transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium text-white bg-white/5 border border-white/20 rounded-full hover:bg-neon-red/20 hover:border-neon-red hover:shadow-glow-red transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Open menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-6 pt-2 bg-cyber-black/90 backdrop-blur-xl border-t border-white/10 rounded-b-3xl mx-4 mb-4">
            <div className="space-y-2 flex flex-col">
              {['Home', 'Dashboard', 'About', 'Docs', 'Contact'].map((item) => (
                <NavLink
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${isActive
                      ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}

              {/* Mobile Admin Link */}
              {isAuthenticated && userRole === 'admin' && (
                <NavLink
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${isActive
                      ? "bg-neon-red/10 text-neon-red border border-neon-red/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  Manage Users
                </NavLink>
              )}

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-5 py-3 text-sm font-medium text-white bg-white/5 border border-white/20 rounded-lg hover:bg-neon-blue/20 hover:border-neon-blue transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-5 py-3 text-sm font-medium text-black bg-neon-blue border border-neon-blue rounded-lg shadow-glow-blue hover:bg-white hover:text-neon-blue transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-5 py-3 text-sm font-medium text-white bg-white/5 border border-white/20 rounded-lg hover:bg-neon-red/20 hover:border-neon-red transition-all duration-300"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}