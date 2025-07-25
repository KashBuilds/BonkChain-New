import React from 'react';

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Geometric SVG background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" className="w-full h-full animate-slow-float" style={{ opacity: 0.12 }}>
          <polygon points="40,10 70,80 10,80" fill="#fbbf24" />
          <polygon points="160,30 200,100 120,100" fill="#f87171" />
          <polygon points="300,60 340,140 260,140" fill="#38bdf8" />
          <polygon points="500,100 540,180 460,180" fill="#a78bfa" />
        </svg>
      </div>
      <div className="relative bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-8 flex flex-col items-center animate-fade-in" style={{ fontFamily: 'Rubik, sans-serif' }}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none">×</button>
        {/* Bonk logo */}
        <img src="/bonk-logo.png" alt="Bonk Logo" className="w-12 h-12 mb-2 rounded-full object-cover" />
        {/* Title */}
        <h2 className="text-3xl font-bold mb-2 text-white text-center w-full">Invite Friends, Earn Fragments</h2>
        {/* Description */}
        <p className="text-gray-300 mb-6 text-center">
          Share your unique link. When friends join BonkChain, you both earn Fragments!
        </p>
        {/* Referral Link */}
        <div className="flex items-center w-full bg-gray-800 rounded-lg px-4 py-3 mb-4 border border-gray-700">
          <span className="font-mono text-bonk-orange text-base select-all flex-1" style={{ fontFamily: 'Rubik, monospace' }}>
            bonkchain.fun/r/8f2k1z7w
          </span>
          <button className="ml-3 px-3 py-1 bg-bonk-orange text-black rounded font-semibold text-sm hover:bg-orange-400 transition-colors">
            Copy
          </button>
        </div>
        {/* Stats */}
        <div className="flex w-full justify-between mb-6">
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-bold text-white">0</span>
            <span className="text-xs text-gray-400">Referrals</span>
          </div>
          <div className="w-px bg-gray-700 mx-4" style={{ height: '32px' }}></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-bold text-white">0</span>
            <span className="text-xs text-gray-400">Fragments Earned</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Referral system coming soon. Stay tuned!
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1); }
        @keyframes slow-float { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
        .animate-slow-float { animation: slow-float 8s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default ReferralModal; 