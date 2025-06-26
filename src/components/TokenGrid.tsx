import React, { useState, useEffect } from 'react';
import BonkTokenCard from './BonkTokenCard';

interface TokenGridProps {
  tokens: Array<{
    name: string;
    symbol: string;
    mint: string;
    marketCap: number;
    createdAt: string;
    image: string;
  }>;
}

const TokenGrid: React.FC<TokenGridProps> = ({ tokens }) => {
  const [graduatedTokens, setGraduatedTokens] = useState<Set<string>>(new Set());

  // Track graduation status when tokens reach 60k
  useEffect(() => {
    setGraduatedTokens(prev => {
      const newGraduated = new Set(prev);
      tokens.forEach(token => {
        if (token.marketCap >= 60000) {
          newGraduated.add(token.mint);
        }
      });
      return newGraduated;
    });
  }, [tokens]);

  // Filter tokens based on graduation status and current market cap
  const graduated = tokens.filter(t => graduatedTokens.has(t.mint));
  const graduating = tokens.filter(t => !graduatedTokens.has(t.mint) && t.marketCap >= 12000 && t.marketCap < 60000);
  const newlyCreated = tokens.filter(t => !graduatedTokens.has(t.mint) && t.marketCap < 12000);

  const renderSection = (title: string, sectionTokens: typeof tokens, graduatedSection = false) => (
    <div className="flex flex-col w-full">
      <h2 className="text-bonk-orange text-lg font-bold mb-3 tracking-wide uppercase pl-2">{title}</h2>
      <div className="flex flex-col gap-4">
        {sectionTokens.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8 col-span-full">
            No tokens to display
          </div>
        ) : (
          sectionTokens.map((token) => (
            <BonkTokenCard key={token.mint} token={token} graduated={graduatedSection} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-6">
        <div className="w-full lg:w-1/3">{renderSection('Newly Created', newlyCreated)}</div>
        <div className="w-full lg:w-1/3">{renderSection('Graduating', graduating)}</div>
        <div className="w-full lg:w-1/3">{renderSection('Graduated', graduated, true)}</div>
      </div>
    </div>
  );
};

export default TokenGrid;