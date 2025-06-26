import React from 'react';
import TokenCard from './TokenCard';
import { Token } from '../types/token';
import { Sparkles, TrendingUp, Trophy } from 'lucide-react';

interface TokenSectionProps {
  title: string;
  tokens: Token[];
  status: 'new' | 'graduating' | 'graduated';
  animateNew?: boolean;
}

const TokenSection: React.FC<TokenSectionProps> = ({ title, tokens, status, animateNew }) => {
  const getHeaderColor = () => {
    switch (status) {
      case 'new':
        return 'text-orange-400';
      case 'graduating':
        return 'text-orange-400';
      case 'graduated':
        return 'text-orange-400';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'new':
        return 'border-gray-700';
      case 'graduating':
        return 'border-gray-700';
      case 'graduated':
        return 'border-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`border-b ${getBorderColor()} pb-3 mb-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${getHeaderColor()} text-sm font-semibold uppercase tracking-wide`}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">||</span>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 space-y-3">
        {tokens.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No tokens to display
          </div>
        ) : (
          tokens.map((token) => (
            <div key={token.id} className={animateNew ? 'animate-fadeIn' : ''}>
              <TokenCard token={token} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TokenSection;