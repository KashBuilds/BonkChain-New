import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC<{ tokens?: any[] }> = ({ tokens }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isBonkScan = location.pathname === '/bonkscan';

  return (
    <header className="relative z-20 shadow-lg">
      <div className="bg-header-grey/90 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Title + Divider + Nav */}
          <div className="flex items-center gap-6">
            {/* Logo + Title */}
            <button
              className="flex items-center gap-3 group focus:outline-none pr-4"
              onClick={() => navigate('/')}
              title="Go to Dashboard"
            >
              <img src="/bonk-logo.png" alt="Bonk Logo" className="w-10 h-10 rounded-full object-cover object-center group-hover:opacity-80 transition" />
              <div className="flex flex-col leading-tight">
                <h1 className="text-white text-lg font-bold group-hover:text-bonk-orange transition">BonkChain</h1>
                <p className="text-gray-400 text-xs font-medium">Bonk Launchpad Screener</p>
              </div>
            </button>
            {/* Divider */}
            <div className="h-8 w-px bg-gray-700/60 mx-1" />
            {/* Nav Buttons */}
            <nav className="flex items-center gap-2">
              <button
                className={`font-semibold text-sm px-3 py-1 rounded-md border transition-all duration-200 shadow-sm ${isDashboard ? 'bg-bonk-orange text-white border-bonk-orange' : 'text-bonk-orange border-bonk-orange bg-transparent hover:bg-bonk-orange/20 hover:text-white'}`}
                onClick={() => navigate('/')}
              >
                Dashboard
              </button>
              <button
                className={`font-semibold text-sm px-3 py-1 rounded-md border transition-all duration-200 shadow-sm ${isBonkScan ? 'bg-bonk-orange text-white border-bonk-orange' : 'text-bonk-orange border-bonk-orange bg-transparent hover:bg-bonk-orange/20 hover:text-white'}`}
                onClick={() => navigate('/bonkscan', { state: { tokens } })}
              >
                BonkScan
              </button>
              <a
                href="https://x.com/bonkchainfun"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm px-3 py-1 rounded-md border border-bonk-orange text-bonk-orange bg-transparent hover:bg-bonk-orange/20 hover:text-white transition-all duration-200 shadow-sm flex items-center gap-2"
                title="Follow us on X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block" style={{display:'block'}}>
                  <path d="M1199.6 90.6c-44.1 19.6-91.5 32.8-141.3 38.8 50.8-30.4 89.9-78.6 108.3-136-47.6 28.3-100.4 48.9-156.6 60-44.9-47.9-108.8-77.8-179.6-77.8-135.9 0-246.1 110.2-246.1 246.1 0 19.3 2.2 38.1 6.4 56.1C384.1 312.2 203.7 217.2 83.1 70.2c-21.2 36.4-33.3 78.7-33.3 124 0 85.5 43.5 160.9 109.7 205.1-40.4-1.3-78.4-12.4-111.7-30.9v3.1c0 119.5 85 219.2 197.7 241.9-20.7 5.6-42.5 8.6-65 8.6-15.9 0-31.3-1.5-46.3-4.4 31.3 97.7 122.2 168.8 229.9 170.7-84.2 66-190.4 105.3-305.8 105.3-19.9 0-39.5-1.2-58.8-3.5C108.7 1102.2 238.1 1140 377.2 1140c452.6 0 700.4-375.1 700.4-700.4 0-10.7-.2-21.3-.7-31.8 48.1-34.7 89.8-78.1 122.7-127.2z" stroke="currentColor" strokeWidth="60"/>
                </svg>
                <span className="hidden sm:inline">Twitter</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
      {/* Accent bar at bottom */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-bonk-orange via-yellow-400 to-bonk-orange opacity-80 rounded-b" />
    </header>
  );
};

export default Header;
