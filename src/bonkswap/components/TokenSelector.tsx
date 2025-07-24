import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon?: string;
  logoURI?: string;
}

interface TokenSelectorProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

export default function TokenSelector({ selectedToken, onTokenSelect, tokens }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
      >
        {selectedToken.logoURI ? (
          <img
            src={selectedToken.logoURI}
            alt={selectedToken.symbol}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => { e.currentTarget.src = '/default-token.png'; }}
          />
        ) : (
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{selectedToken.symbol.charAt(0)}</span>
        </div>
        )}
        <span className="font-medium text-white">{selectedToken.symbol}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-gray-900 rounded-xl border border-gray-700 shadow-xl z-50 max-h-80 min-w-[260px] max-w-[320px] w-[320px] overflow-y-auto overflow-x-hidden">
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onTokenSelect(token);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors duration-150"
              >
                <div className="flex items-center space-x-3">
                  {token.logoURI ? (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/default-token.png'; }}
                    />
                  ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{token.symbol.charAt(0)}</span>
                  </div>
                  )}
                  <div className="text-left">
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">${token.price.toFixed(4)}</div>
                  <div className={`text-sm ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}