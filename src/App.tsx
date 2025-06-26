import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TokenGrid from './components/TokenGrid';
import { Token } from './types/token';
import { Routes, Route } from 'react-router-dom';
import BonkScan from './bonkscan';

function mapRaydiumToToken(token: any, idx: number): any {
  return {
    id: token.mint || String(idx),
    mint: token.mint || String(idx),
    name: token.name,
    symbol: token.symbol,
    image: token.imgUrl || '',
    marketCap: token.marketCap || 0,
    volume24h: token.volume24h || 0,
    price: token.price || 0,
    priceChange24h: token.priceChange24h || 0,
    progress: token.progress || undefined,
    createdAt: token.createAt || new Date().toISOString(),
    creatorWallet: token.creator || undefined,
    status: token.status || 'graduated',
  };
}

function getRelativeTime(dateValue: string | number): string {
  const now = Date.now();
  const created = typeof dateValue === 'number' ? dateValue : new Date(dateValue).getTime();
  const diff = Math.max(0, now - created);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function App() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let firstLoad = true;
    const loadTokens = async () => {
      if (firstLoad) setIsLoading(true);
      try {
        const res = await fetch('/api/bonkscreener');
        const data = await res.json();
        // Raydium API returns { data: { rows: [...] } }
        const mapped = (data.data?.rows || []).map(mapRaydiumToToken);
        setTokens(mapped);
      } catch (e) {
        setTokens([]);
      }
      if (firstLoad) {
        setIsLoading(false);
        firstLoad = false;
      }
    };
    loadTokens(); // Initial load
    interval = setInterval(loadTokens, 1000); // Poll every 1s for fast updates
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-custom-dark">
      {/* Background effects removed for solid grey */}
      <div className="relative">
        <Header tokens={tokens} />
        <main>
          <Routes>
            <Route path="/" element={
              isLoading ? (
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-700/50 rounded-lg p-3 animate-pulse">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-700 rounded"></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                              <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-700 rounded"></div>
                            <div className="h-1 bg-gray-800 rounded"></div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="h-8 bg-gray-800 rounded"></div>
                              <div className="h-8 bg-gray-800 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <TokenGrid tokens={tokens} />
              )
            } />
            <Route path="/bonkscan" element={<BonkScan />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;