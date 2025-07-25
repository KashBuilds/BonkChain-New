import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import Header from './components/Header';
import TokenGrid from './components/TokenGrid';
import { Token } from './types/token';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BonkScan from './bonkscan';
import BonkSwapApp from './bonkswap/BonkSwapApp';
import BonkStake from './bonkstake/BonkStake';
import ReferralModal from './components/ReferralModal';
import TokenDetailPage from './components/TokenDetailPage';

function mapRaydiumToToken(token: any, idx: number): any {
  return {
    id: token.mint || String(idx),
    mint: token.mint || String(idx),
    name: token.name,
    symbol: token.symbol,
    image: token.imgUrl || '',
    marketCap: token.marketCap || 0,
    volume24h: token.volume24h ?? token.volumeU ?? token.volumeA ?? 0,
    volumeU: token.volumeU ?? 0,
    volumeA: token.volumeA ?? 0,
    price: token.price || 0,
    priceChange24h: token.priceChange24h || 0,
    progress: token.progress || undefined,
    createdAt: token.createAt || new Date().toISOString(),
    creator: token.creator || '',
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
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    <header className="flex items-center px-8 py-4">
      <img src="/bonk-logo.png" alt="Bonk Logo" className="w-9 h-9 rounded-full object-cover" />
      <nav className="flex items-center gap-2 ml-8">
        <a href="/" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkChain</a>
        <a href="/bonkscan" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkscan' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkScan</a>
        <button
          onClick={() => navigate('/bonkswap')}
          className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkswap' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'} focus:outline-none`}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          BonkSwap
        </button>
        <a href="/bonkstake" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkstake' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkStake</a>
        <a href="https://x.com/bonkchainfun" target="_blank" rel="noopener noreferrer" className="text-sm font-light px-3 py-2 rounded-lg text-white hover:text-bonk-orange transition-all duration-200">Twitter</a>
      </nav>
    </header>
  );
}

function App() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralOpen, setReferralOpen] = useState(false);
  // Track market cap history for each token by mint
  const marketCapHistoryRef = useRef<{ [mint: string]: Array<{ time: number; marketCap: number }> }>({});
  const [featuredToken, setFeaturedToken] = useState<any | null>(null);
  // Track the all-time highest market cap token for the session
  const featuredTokenRef = useRef<any | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let firstLoad = true;
    const loadTokens = async () => {
      if (firstLoad) setIsLoading(true);
      try {
        const res = await fetch('/api/bonkscreener');
        const data = await res.json();
        const mapped = (data.data?.rows || []).map(mapRaydiumToToken);
        setTokens(mapped);
        // --- Market cap history tracking ---
        const now = Date.now();
        const history = marketCapHistoryRef.current;
        mapped.forEach((token: any) => {
          if (!token.mint) return;
          if (!history[token.mint]) history[token.mint] = [];
          // Add current market cap
          history[token.mint].push({ time: now, marketCap: token.marketCap });
          // Remove entries older than 5 minutes
          history[token.mint] = history[token.mint].filter(entry => now - entry.time <= 5 * 60 * 1000);
        });
        // --- Stable featured card logic ---
        let currentFeatured = featuredTokenRef.current;
        // If no featured yet, pick the highest market cap graduated token
        if (!currentFeatured) {
          const graduated = mapped.filter((t: any) => t.status === 'graduated' && t.createdAt);
          if (graduated.length > 0) {
            graduated.sort((a: any, b: any) => b.marketCap - a.marketCap);
            currentFeatured = graduated[0];
          } else if (mapped.length > 0) {
            currentFeatured = mapped[0];
          }
        }
        // Fallback: always pick a featured token if none selected
        if (!currentFeatured && mapped.length > 0) {
          // Try highest market cap
          currentFeatured = [...mapped].sort((a, b) => b.marketCap - a.marketCap)[0];
        }
        if (!currentFeatured && mapped.length > 0) {
          // Try most recently launched
          currentFeatured = [...mapped].sort((a, b) => {
            const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
            const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
            return bTime - aTime;
          })[0];
        }
        setFeaturedToken(currentFeatured);
      } catch (e) {
        // handle error
      } finally {
        if (firstLoad) setIsLoading(false);
        firstLoad = false;
      }
    };
    loadTokens();
    interval = setInterval(loadTokens, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
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
                  {/* New Hero Section */}
                  <section className="w-full flex flex-col items-center justify-center py-8 px-4 max-w-7xl mx-auto">
                    {/* BonkChain Title and Intro (Centered) */}
                    <div className="w-full max-w-2xl flex flex-col items-center text-center mb-8">
                      <img src="/bonk-logo.png" alt="Bonk Logo" className="w-16 h-16 mb-4 rounded-full object-cover" />
                      <h1 className="text-4xl md:text-5xl font-extrabold text-bonk-orange mb-4 tracking-tight" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700 }}>
                        BonkChain
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 font-medium mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 300 }}>
                        Your go-to tool for all things Bonk-related on Solana.
                      </p>
                      <p className="text-base text-gray-400 mb-4" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 300 }}>
                        Explore blocks, tokens, transactions, and more. Stay up to date with the latest BonkChain activity and trends.
                      </p>
                    </div>
                    {/* Featured Card (Centered Under Title) */}
                    <div className="w-full max-w-md flex flex-col items-center mb-12">
                      <div className="mb-4 text-lg font-bold text-bonk-orange uppercase tracking-wide text-left w-full">featured</div>
                      <div className="bg-gradient-to-br from-orange-900/80 to-gray-900/80 border-2 border-orange-500 rounded-2xl shadow-xl p-8 flex flex-col items-start gap-4 w-full">
                        {featuredToken ? (
                          <a href={`/token/${featuredToken.mint}`} className="w-full flex flex-col items-start gap-4 cursor-pointer group" style={{ textDecoration: 'none' }}>
                            <div className="flex items-center gap-4">
                              <img src={featuredToken.image || '/bonk-logo.png'} alt={featuredToken.name} className="w-16 h-16 rounded-full object-cover bg-black border-2 border-orange-500 group-hover:border-orange-400 transition" />
                              <div>
                                <div className="text-2xl font-bold text-white leading-tight group-hover:text-orange-400 transition">{featuredToken.name}</div>
                                <div className="text-lg font-semibold text-orange-400">${featuredToken.symbol}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-300">Market Cap: <span className="font-bold text-orange-400">${featuredToken.marketCap.toLocaleString()}</span></div>
                          </a>
                        ) : (
                          <div className="text-gray-400 text-sm">No token data available.</div>
                        )}
                      </div>
                    </div>
                    {/* Color Key/Legend */}
                    <div className="w-full max-w-md flex flex-row items-center justify-center gap-4 mb-8">
                      <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-green-500 border-2 border-green-500"></span><span className="text-sm text-green-400 font-bold">Graduated</span></span>
                      <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-400"></span><span className="text-sm text-yellow-300 font-bold">Graduating</span></span>
                      <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-700"></span><span className="text-sm text-gray-300 font-bold">New</span></span>
                    </div>
                  </section>
                  {/* End Hero Section */}
                  <ReferralModal open={referralOpen} onClose={() => setReferralOpen(false)} />
                  {/* The rest of the page (token grid, etc.) can go here */}
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
              <Route path="/token/:mint" element={<TokenDetailPage />} />
              <Route path="/bonkscan" element={<BonkScan />} />
              <Route path="/bonkscan/tx/:txid" element={<BonkScan />} />
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