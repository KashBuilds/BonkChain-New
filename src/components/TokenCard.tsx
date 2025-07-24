import React from 'react';
import { Star } from 'lucide-react';
import { Token } from '../types/token';

interface TokenCardProps {
  token: Token;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(0)}`;
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(6)}`;
  };

  const isPositive = token.priceChange24h > 0;

  return (
    <div className="flex flex-col gap-4 p-4 overflow-hidden transition-colors duration-200 ease-in-out border rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 sm:flex-row hover:bg-gray-50 dark:hover:bg-gray-700 group">
      {/* Card Header: Image, Name, Ticker */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={token.icon}
          alt={token.name}
          className="w-16 h-16 rounded bg-gray-100 object-contain border border-gray-300"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
        <div className="flex-1 min-w-0 flex items-center">
          <div
            className="text-xl font-semibold text-black truncate md:text-2xl dark:text-white max-w-xs"
            title={token.name}
          >
            {token.name}
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <button className="text-gray-500 hover:text-yellow-400 p-1">
              <Star size={16} />
            </button>
          </div>
          </div>
        </div>

        {/* Launch time */}
        {token.launchTime && (
        <div className="text-gray-500 text-xs font-mono mb-1">{token.launchTime}</div>
        )}

        {/* Market cap */}
        <div>
        <div className="text-gray-500 text-xs">Market Cap:</div>
        <div className="text-yellow-400 text-base font-semibold font-mono">{formatNumber(token.marketCap)}</div>
        </div>

        {/* Progress bar */}
        {token.progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{token.progress}%</span>
            </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                  token.progress < 30 ? 'bg-blue-500' :
                  token.progress < 90 ? 'bg-gradient-to-r from-yellow-500 to-red-500' :
                  'bg-gradient-to-r from-yellow-500 via-red-500 to-red-600'
                }`}
                style={{ width: `${token.progress}%` }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default TokenCard;