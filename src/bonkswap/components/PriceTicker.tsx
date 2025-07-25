import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Token {
  symbol: string;
  price: number;
  change: number;
}

const tokens: Token[] = [
  { symbol: 'BONK', price: 0.000023, change: 5.67 },
  { symbol: 'ANI', price: 0.039, change: 3.21 },
  { symbol: 'USELESS', price: 0.321, change: 5.41 },
  { symbol: 'HOSICO', price: 0.034, change: -1.23 },
  { symbol: 'MEMECOIN', price: 0.052, change: 8.92 },
  { symbol: 'KORI', price: 0.025, change: 0.01 },
  { symbol: 'MOMO', price: 0.033, change: 0.00 },
  { symbol: 'RT', price: 0.019, change: 2.34 },
];

export default function PriceTicker() {
  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 overflow-hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="relative flex animate-scroll">
        <div className="flex space-x-8 py-3 px-4 whitespace-nowrap min-w-full">
          {[...tokens, ...tokens].map((token, index) => (
            <div key={`${token.symbol}-${index}`} className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{token.symbol.charAt(0)}</span>
              </div>
              <span className="text-white font-medium">{token.symbol}</span>
              <span className="text-gray-300">${token.price.toFixed(token.price < 1 ? 6 : 2)}</span>
              <div className={`flex items-center space-x-1 ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}