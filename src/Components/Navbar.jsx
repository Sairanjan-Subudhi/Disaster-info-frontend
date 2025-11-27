import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState('user');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or saved theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

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

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  }

  const marqueeText = "SYSTEM ONLINE • CONNECTED TO SATELLITE NETWORK • WAITING FOR INPUT • NDRF PROTOCOL ACTIVE • ";

  return (
    <>
      {/* Top Bar Marquee */}
      <div className="bg-black text-white text-xs font-mono py-1 overflow-hidden whitespace-nowrap border-b-2 border-black z-50 relative">
        <div className="animate-marquee inline-block">
          <span className="mx-4">{marqueeText.repeat(10)}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-neoDark border-b-4 border-neoBlack transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-1 group cursor-pointer">
                <span className="text-2xl font-black text-neoBlack dark:text-white tracking-tighter">
                  DISASTER
                </span>
                <div className="bg-gBlue text-white px-2 py-1 -skew-x-12 border-2 border-neoBlack shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-3 transition-transform duration-300">
                  <span className="font-bold text-lg skew-x-12 block">WATCH</span>
                </div>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-2">
              {['Home', 'Dashboard', 'About', 'Docs', 'Contact'].map((item) => (
                <NavLink
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `px-4 py-2 font-bold border-2 transition-all duration-200 ${isActive
                      ? "bg-gYellow text-neoBlack border-neoBlack shadow-neo-sm"
                      : "border-transparent text-neoBlack dark:text-neoWhite hover:bg-gYellow hover:text-neoBlack hover:border-neoBlack hover:shadow-neo-sm"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}

              {/* Admin Link */}
              {isAuthenticated && userRole === 'admin' && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `px-4 py-2 font-bold border-2 transition-all duration-200 ${isActive
                      ? "bg-gRed text-white border-neoBlack shadow-neo-sm"
                      : "border-transparent text-gRed hover:bg-red-50"
                    }`
                  }
                >
                  Manage Users
                </NavLink>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full border-2 border-neoBlack dark:border-neoWhite flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-gYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neoBlack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="font-bold text-neoBlack dark:text-neoWhite hover:underline decoration-2 underline-offset-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-gGreen text-white border-2 border-neoBlack shadow-neo px-6 py-2 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm tracking-wide"
                  >
                    LAUNCH CONSOLE
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-gRed text-white border-2 border-neoBlack shadow-neo px-6 py-2 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm tracking-wide"
                >
                  LOGOUT
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full border-2 border-neoBlack dark:border-neoWhite flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-gYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neoBlack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border-2 border-neoBlack dark:border-neoWhite bg-white dark:bg-neoBlack text-neoBlack dark:text-neoWhite shadow-neo dark:shadow-neo-dark active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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
          <div className="md:hidden bg-neoWhite dark:bg-neoDark border-b-4 border-neoBlack dark:border-neoWhite">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {['Home', 'Dashboard', 'About', 'Docs', 'Contact'].map((item) => (
                <NavLink
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-lg font-bold border-2 border-neoBlack dark:border-neoWhite shadow-neo-sm dark:shadow-neo-dark transition-all ${isActive
                      ? "bg-gYellow text-neoBlack transform -rotate-1"
                      : "bg-white dark:bg-neoBlack text-neoBlack dark:text-neoWhite hover:bg-gBlue hover:text-white"
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
                    `block px-4 py-3 text-lg font-black border-2 border-neoBlack dark:border-neoWhite shadow-neo-sm dark:shadow-neo-dark transition-all ${isActive
                      ? "bg-gRed text-white transform -rotate-1"
                      : "bg-white dark:bg-neoBlack text-gRed hover:bg-gRed hover:text-white"
                    }`
                  }
                >
                  Manage Users
                </NavLink>
              )}

              <div className="pt-4 mt-4 border-t-2 border-neoBlack dark:border-neoWhite space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 font-bold text-neoBlack bg-white border-2 border-neoBlack shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 font-bold text-white bg-gGreen border-2 border-neoBlack shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      LAUNCH CONSOLE
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-3 font-bold text-white bg-gRed border-2 border-neoBlack shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    LOGOUT
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}