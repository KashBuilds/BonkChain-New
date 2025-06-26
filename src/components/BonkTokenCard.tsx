import React, { useRef, useEffect, useState } from 'react';

interface BonkTokenCardProps {
  token: {
    name: string;
    symbol: string;
    mint: string;
    marketCap: number;
    createdAt: string;
    image: string;
  };
  graduated?: boolean;
}

function shortenAddress(addr: string) {
  return addr.slice(0, 4) + '...' + addr.slice(-4);
}

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const diff = Math.max(0, now - created);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
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

const BonkTokenCard: React.FC<BonkTokenCardProps> = ({ token, graduated }) => {
  const [copied, setCopied] = useState(false);
  const [displayMC, setDisplayMC] = useState(token.marketCap);
  const [displayProgress, setDisplayProgress] = useState(Math.min(token.marketCap / 60000, 1));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const prevMC = useRef(token.marketCap);
  const [imgError, setImgError] = useState(false);

  // Convert IPFS to gateway URL if needed
  const imageUrl = token.image?.startsWith('ipfs://')
    ? token.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : token.image;

  // Animate market cap and progress bar
  useEffect(() => {
    if (token.marketCap !== prevMC.current) {
      setIsUpdating(true);
      setIsDecreasing(token.marketCap < prevMC.current);
      const start = prevMC.current;
      const end = token.marketCap;
      const duration = 800;
      const startTime = performance.now();
      
      function animate(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentMC = Math.round(start + (end - start) * progress);
        setDisplayMC(currentMC);
        setDisplayProgress(Math.min(currentMC / 60000, 1));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          prevMC.current = end;
          setTimeout(() => {
            setIsUpdating(false);
            setIsDecreasing(false);
          }, 500); // Keep pulse for a bit after animation
        }
      }
      requestAnimationFrame(animate);
    }
  }, [token.marketCap]);

  const progress = displayProgress;
  const percent = Math.round(progress * 100);

  // Determine if this is a 'graduating' token (not graduated, marketCap >= 12000 && < 60000)
  const isGraduating = !graduated && token.marketCap >= 12000 && token.marketCap < 60000;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`flex flex-col bg-bonk-card border border-bonk-border rounded-lg px-3 py-2 shadow-sm w-full mb-2 ${isUpdating ? 'animate-pulse' : ''}`}
      style={{ minHeight: 0 }}>
      <div className="flex items-center w-full gap-2">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={token.name}
              className="w-8 h-8 rounded-full object-cover border border-bonk-border bg-bonk-dark"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-bonk-dark border border-bonk-border text-bonk-orange text-base font-bold select-none">
              {token.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-white text-sm font-semibold truncate max-w-[120px]">{token.name}</span>
            <span className="text-bonk-orange text-xs font-mono truncate">${token.symbol}</span>
            <span className="text-gray-400 text-xs ml-1 truncate">{getRelativeTime(token.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-bonk-yellow text-xs">MC:</span>
            <span className={`text-base font-bold font-mono transition-all duration-300 ${
              isUpdating 
                ? isDecreasing 
                  ? 'text-red-400' 
                  : 'text-bonk-yellow'
                : 'text-bonk-orange'
            }`}>
              ${formatCompactNumber(displayMC)}
            </span>
          </div>
        </div>
        {/* Actions: Contract Address and Copy */}
        <div className="flex flex-col items-end gap-1 ml-2">
          <div className="flex items-center gap-1 relative">
            <span className="text-bonk-yellow text-xs font-mono truncate max-w-[80px]">{shortenAddress(token.mint)}</span>
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-bonk-orange p-1 relative"
              title={copied ? 'Copied!' : 'Copy contract address'}
            >
              {/* Copied popup */}
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-bonk-dark text-bonk-orange px-2 py-1 rounded text-xs shadow z-10 animate-fadeIn">
                  Copied!
                </span>
              )}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16 8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2"/><rect width="8" height="8" x="12" y="4" rx="2"/></svg>
            </button>
          </div>
          <div className="flex gap-1">
            <a
              href={`https://birdeye.so/token/${token.mint}?chain=solana`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bonk-orange p-1 rounded transition-all duration-200 border border-transparent hover:border-bonk-orange"
              title="View on Birdeye"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg>
            </a>
          </div>
        </div>
      </div>
      {/* Progress Bar or Graduated Label */}
      <div className="w-full mt-2">
        {graduated ? (
          <div className="flex items-center justify-end w-full">
            <span className="text-bonk-orange font-bold text-base px-2 py-1 rounded">Graduated</span>
          </div>
        ) : (
          <>
            <div className={`w-full bg-bonk-border rounded-full h-1.5 relative overflow-hidden ${isGraduating ? 'graduating-glow-bar' : ''}`}>
              <div
                className={`h-1.5 rounded-full transition-all duration-500 relative ${
                  progress > 0.9
                    ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500'
                    : progress > 0.2
                    ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                } ${isGraduating ? 'glow-animate-bar' : ''}`}
                style={{ width: `${percent}%` }}
              />
              {/* Animated shimmer overlay for graduating tokens */}
              {isGraduating && (
                <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
                  <div className="glow-shimmer w-full h-full" />
                </div>
              )}
            </div>
            <div className="text-xs text-bonk-yellow mt-0.5 text-right">
              {percent}%
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BonkTokenCard; 