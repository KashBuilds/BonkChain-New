import React, { useState, useEffect, createContext, useContext } from 'react';
import Header from './components/Header';
import TokenGrid from './components/TokenGrid';
import { Token } from './types/token';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BonkScan from './bonkscan';
import BonkSwapApp from './bonkswap/BonkSwapApp';
import BonkStake from './bonkstake/BonkStake';
import ReferralModal from './components/ReferralModal';

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

// Token context setup
export const TokenContext = createContext<{ tokens: any[]; isLoading: boolean }>({ tokens: [], isLoading: true });
export const useTokens = () => useContext(TokenContext);

// Add DashboardHeader component
function DashboardHeader() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-8 px-8 py-4">
      <img src="/bonk-logo.png" alt="Bonk Logo" className="w-9 h-9" />
      <nav className="flex items-center gap-6">
        <a href="/" className="text-white font-extralight hover:text-bonk-orange transition">BonkChain</a>
        <a href="/bonkscan" className="text-white font-extralight hover:text-bonk-orange transition">BonkScan</a>
        <button
          onClick={() => navigate('/bonkswap')}
          className="text-white font-extralight hover:text-bonk-orange transition focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          BonkSwap
        </button>
        <a href="/bonkstake" className="text-white font-extralight hover:text-bonk-orange transition">BonkStake</a>
        <a href="https://x.com/bonkchainfun" target="_blank" rel="noopener noreferrer" className="text-white font-extralight hover:text-bonk-orange transition">Twitter</a>
      </nav>
    </header>
  );
}

function App() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralOpen, setReferralOpen] = useState(false);

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
    <TokenContext.Provider value={{ tokens, isLoading }}>
      <div className="min-h-screen bg-custom-dark">
        {/* Background effects removed for solid grey */}
      <div className="relative">
        <main>
            <Routes>
              <Route path="/" element={
                <>
                  <DashboardHeader />
                  {/* BonkChain Info Section (dashboard only) */}
                  <section className="w-full flex flex-col items-center py-8 mb-4 bg-gradient-to-r from-bonk-orange/10 via-transparent to-bonk-orange/10 border-b border-bonk-orange/20">
                    <div className="max-w-2xl text-center">
                      <div className="flex justify-center mb-2">
                        <img src="/bonk-logo.png" alt="BonkChain Logo" className="w-12 h-12" />
                      </div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-bonk-orange mb-2 tracking-tight" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>
                        BonkChain
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 font-medium mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 300 }}>
                        Your go-to tool for all things Bonk-related on Solana.
                      </p>
                      <p className="text-base text-gray-400" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 300 }}>
                        Explore blocks, tokens, transactions, and more. Stay up to date with the latest BonkChain activity and trends.
                      </p>
                      <button
                        onClick={() => setReferralOpen(true)}
                        className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 focus:outline-none"
                        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}
                      >
                        Refer & Earn Fragments
                      </button>
                    </div>
                  </section>
                  <ReferralModal open={referralOpen} onClose={() => setReferralOpen(false)} />
          {isLoading ? (
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
          )}
                </>
              } />
              <Route path="/bonkscan" element={<BonkScan />} />
              <Route path="/bonkswap" element={<BonkSwapApp />} />
              <Route path="/bonkstake" element={<BonkStake />} />
            </Routes>
        </main>
      </div>
    </div>
    </TokenContext.Provider>
  );
}

export default App;