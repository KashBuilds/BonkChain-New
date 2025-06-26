import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Wallet, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  ExternalLink,
  Twitter,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface TransactionProps {
  type: 'buy' | 'sell' | 'transfer';
  time: string;
  amount: string;
  from: string;
  to: string;
  signature: string;
}

interface LocalTransaction extends TransactionProps {
  mint: string;
  symbol: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive }) => (
  <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:bg-gray-900/80 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group">
    <div className="flex flex-col">
      <span className="text-gray-400 text-sm font-medium mb-1">{title}</span>
      <span className="text-white text-xl font-bold font-mono">{value}</span>
      {change && (
        <span className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      )}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
  </div>
);

const BONK_MINT = 'DezX1PzKz7xnJ2B2K2uAHzb1xQ3VQh7Wi7QdBjc7h4uF';
const HELIUS_API_KEY = '7595b575-bcc9-4291-9a5d-8c41742a065f';
const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

function App() {
  const location = useLocation();
  const tokens = location.state?.tokens || [];

  const metrics = [
    { title: 'Market Cap', value: '$1.22B', change: '+1.12%', isPositive: true },
    { title: 'Price', value: '$0.041', change: '+0.47%', isPositive: true },
    { title: 'Liquidity', value: '$39.7K', change: '-0.88%', isPositive: false },
    { title: 'Supply', value: '88.8T' },
    { title: 'Holders', value: '945,730', change: '-0.64%', isPositive: false },
  ];

  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [newSignatures, setNewSignatures] = useState<string[]>([]);

  useEffect(() => {
    if (!tokens.length) return;
    let timeout: NodeJS.Timeout;
    function addTransactions() {
      setTransactions(prev => {
        const burst = Math.random() < 0.35; // 35% chance for a burst
        const count = burst ? Math.floor(Math.random() * 6) + 3 : 1; // 3-8 or 1
        const newTxs: LocalTransaction[] = Array.from({ length: count })
          .map(() => {
            const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
            if (!randomToken) return null;
            const type = Math.random() > 0.5 ? 'buy' : 'sell';
            const solAmount = (Math.random() * 9.8 + 0.2).toFixed(2); // 0.2 - 10 SOL
            const price = randomToken.price || 0.00002;
            const bonkAmount = price ? (Number(solAmount) / price) : 0;
            const amountStr = bonkAmount > 1_000_000 ? (bonkAmount / 1_000_000).toFixed(2) + 'M ' + randomToken.symbol : bonkAmount.toFixed(0) + ' ' + randomToken.symbol;
            const from = randomWallet();
            const to = randomWallet();
            return {
              type,
              time: 'just now',
              amount: amountStr,
              from,
              to,
              signature: Math.random().toString(36).slice(2, 10),
              mint: randomToken.mint,
              symbol: randomToken.symbol,
            };
          })
          .filter((tx): tx is LocalTransaction => !!tx);
        // Track new signatures for pop animation
        setNewSignatures(newTxs.map(tx => tx.signature));
        return [
          ...newTxs,
          ...prev.slice(0, 20 - newTxs.length),
        ];
      });
      // Next interval: random between 200ms and 1200ms
      const next = Math.floor(Math.random() * 1000) + 200;
      timeout = setTimeout(addTransactions, next);
    }
    addTransactions();
    return () => clearTimeout(timeout);
  }, [tokens]);

  // Clear newSignatures after animation
  useEffect(() => {
    if (newSignatures.length === 0) return;
    const timeout = setTimeout(() => setNewSignatures([]), 500);
    return () => clearTimeout(timeout);
  }, [newSignatures]);

  function randomWallet() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return (
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('') +
      '...' +
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    );
  }

  function getRelativeTime(dateValue: number): string {
    const now = Date.now();
    const diff = Math.max(0, now - dateValue);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function formatBonkAmount(amount: number): string {
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(2) + 'B BONK';
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(2) + 'M BONK';
    if (amount >= 1_000) return (amount / 1_000).toFixed(2) + 'K BONK';
    return amount + ' BONK';
  }

  function shorten(addr: string) {
    if (!addr) return '';
    return addr.slice(0, 3) + '...' + addr.slice(-3);
  }

  return (
    <div className="min-h-screen bg-gray-950" style={{ backgroundColor: '#0d0d0d' }}>
      {/* BonkScan Logo Hero */}
      <div className="flex flex-col items-center justify-center mb-10 mt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <span className="text-white text-3xl font-extrabold tracking-tight drop-shadow-lg">BonkScan</span>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Metrics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <span>BONK Token Metrics</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Activity className="w-6 h-6 text-orange-500" />
              <span>Recent BONK Transactions</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.signature}
                className={`transaction-row-animated ${newSignatures.includes(transaction.signature) ? 'transaction-pop' : ''}`}
              >
                <TransactionRow {...transaction} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-orange-500/30">
              Load More Transactions
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-400 text-sm">BonkScan - Solana Blockchain Explorer</span>
            </div>
            <div className="text-gray-500 text-sm">
              Built with ❤️ for the BONK community
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TransactionRow: React.FC<LocalTransaction> = ({ type, time, amount, from, to, signature, mint, symbol }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'buy':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'sell':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'transfer':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'buy':
        return <ArrowUpRight size={16} />;
      case 'sell':
        return <ArrowDownRight size={16} />;
      case 'transfer':
        return <ArrowRightLeft size={16} />;
    }
  };

  const getRowBg = () => {
    switch (type) {
      case 'buy':
        return 'hover:bg-green-500/5 border-green-500/10';
      case 'sell':
        return 'hover:bg-red-500/5 border-red-500/10';
      case 'transfer':
        return 'hover:bg-blue-500/5 border-blue-500/10';
    }
  };

  return (
    <div className={`bg-gray-900/40 border border-gray-800 rounded-lg p-4 transition-all duration-200 ${getRowBg()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getTypeStyles()}`}>
            {getTypeIcon()}
            <span className="text-sm font-medium capitalize">{type}</span>
          </div>
          <span className="text-gray-400 text-sm font-mono">{time}</span>
          {symbol && (
            <span className="text-bonk-orange text-xs font-mono font-bold">${symbol}</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white font-mono font-bold">{amount}</span>
          <a
            href={`https://birdeye.so/token/${mint || BONK_MINT}?chain=solana`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Birdeye"
            className="pointer-events-auto z-10"
            tabIndex={0}
          >
            <ExternalLink size={16} className="text-gray-400 hover:text-orange-400 transition-colors" />
          </a>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2 text-sm">
        <span className="text-gray-400">From:</span>
        <span className="text-gray-300 font-mono">{from}</span>
      </div>
    </div>
  );
};

export default App;