
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-black/40 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-white/5">
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity">
        <Logo className="w-9 h-9" textSize="text-xl" lightMode={true} />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4 sm:ml-auto">
        <Link
          to="/"
          className="text-white hover:text-teal-400 font-semibold text-sm sm:text-base transition-colors py-2 px-1"
        >
          Home
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/how-it-works"
            className="text-white hover:text-teal-400 font-semibold transition-colors"
          >
            How it Works
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-teal-400 font-semibold transition-colors"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-teal-400 font-semibold transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
                <span className="text-sm text-white font-medium">Hello, {user.name}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="bg-white/5 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 border border-white/10 transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white font-semibold hover:text-teal-400 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-teal-500 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl md:hidden">
          <div className="p-6 flex flex-col gap-4">
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-bold text-white p-2 hover:text-teal-400"
            >
              How it Works
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-bold text-white p-2 hover:text-teal-400"
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white p-2 hover:text-teal-400"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                  className="w-full bg-white/5 text-white border border-white/10 py-3 rounded-xl font-bold text-center"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white p-2 hover:text-teal-400"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-teal-500 text-black py-3.5 rounded-xl font-bold text-center shadow-lg shadow-teal-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

