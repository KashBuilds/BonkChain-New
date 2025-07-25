import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BonkTokenCardProps {
  token: {
    name: string;
    symbol: string;
    mint: string;
    marketCap: number;
    createdAt: string;
    image: string;
  };
}

function getRelativeTime(createdAt: string | number): string {
  let created: number;
  if (typeof createdAt === 'number' || (typeof createdAt === 'string' && /^\d+$/.test(createdAt))) {
    created = Number(createdAt);
  } else {
    created = new Date(createdAt).getTime();
  }
  const now = Date.now();
  const diff = Math.max(0, now - created);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

const BonkTokenCard: React.FC<BonkTokenCardProps> = ({ token }) => {
  const navigate = useNavigate();
  // Convert IPFS to gateway URL if needed
  const imageUrl = token.image?.startsWith('ipfs://')
    ? token.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : token.image;

  // Border color and label logic
  let borderColor = 'border-gray-700';
  let label = null;
  if (token.marketCap >= 70000) {
    borderColor = 'border-green-500';
    label = <span className="ml-4 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">Graduated</span>;
  } else if (token.marketCap >= 40000) {
    borderColor = 'border-yellow-400';
    label = <span className="ml-4 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-300 text-xs font-bold">Graduating</span>;
  }

  return (
    <div
      className={`flex items-center bg-gradient-to-br from-[#181a1f] to-[#101215] border-2 ${borderColor} rounded-xl shadow-2xl px-4 py-3 w-full min-h-[64px] cursor-pointer transition-transform duration-150 hover:scale-[1.025] hover:border-orange-400`}
      style={{ minHeight: 0 }}
      onClick={() => navigate(`/token/${token.mint}`)}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/token/${token.mint}`); }}
      aria-label={`View details for ${token.name}`}
    >
      {/* Large Icon */}
      <div className="flex-shrink-0 mr-5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={token.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-gray-800 bg-black"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400">?</div>
        )}
      </div>
      {/* Token Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="text-lg font-extrabold text-white truncate">{token.name}</span>
          <span className="ml-2 text-sm font-bold text-gray-400">${token.symbol}</span>
          {label}
        </div>
        <div className="text-xs text-gray-400 mt-1">Launched {token.createdAt ? getRelativeTime(token.createdAt) : 'N/A'}</div>
        <div className="text-xs text-orange-400 font-bold mt-1">MC: ${token.marketCap ? formatCompactNumber(token.marketCap) : 'N/A'}</div>
      </div>
    </div>
  );
};

export default BonkTokenCard; 