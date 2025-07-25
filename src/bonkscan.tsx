import React, { useState, useEffect, useRef } from 'react';
import { useTokens } from './App';
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
  ArrowRightLeft,
  Clipboard,
  X,
  Search as SearchIcon
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import type { ChartOptions } from 'chart.js';
import WalletConnect from './components/WalletConnect';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler, Legend);

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

const CARD_BG = '#101624';
const CARD_BORDER = '#232a3a';

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive }) => (
  <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:bg-gray-900/80 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group">
    <div className="flex flex-col">
      <span className="text-gray-400 text-sm font-medium mb-1">{title}</span>
      <span className="text-white text-xl font-bold font-sans">{value}</span>
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

// --- StatsHeader Component ---
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Animated, realistic stats state ---
const realisticInitialStats = {
  totalBlocks: 4567123,
  totalTx: 457,
  walletAddresses: 246,
  avgBlockTime: 3.0,
  dailyTx: 56,
  dailyTxHistory: [42, 51, 56, 48, 60, 54, 59, 62, 58, 56, 53, 57, 61, 55, 56, 54, 60, 62, 59, 56],
};

function useRealisticStats() {
  const [stats, setStats] = useState(realisticInitialStats);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function updateStats() {
      setStats(prev => {
        // Blocks: up or down by 1-10, sometimes a burst
        const blockBurst = Math.random() < 0.15;
        const blockDelta = (Math.random() < 0.5 ? 1 : -1) * (blockBurst ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3) + 1);
        const newBlocks = Math.max(0, prev.totalBlocks + blockDelta);
        // Transactions: only up, by 1-10, sometimes a burst
        const txBurst = Math.random() < 0.1;
        const txDelta = txBurst ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3) + 1;
        const newTx = prev.totalTx + txDelta;
        // Wallet addresses: up or down by 1-3
        const walletDelta = (Math.random() < 0.6 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        const newWallets = Math.max(0, prev.walletAddresses + walletDelta);
        // Avg block time: random float between 2.5 and 4.5
        const newBlockTime = Math.max(2.5, Math.min(4.5, prev.avgBlockTime + (Math.random() - 0.5) * 0.2));
        // Daily tx: only up, by 1-7
        const dailyTxDelta = Math.floor(Math.random() * 7) + 1;
        const newDaily = prev.dailyTx + dailyTxDelta;
        // Daily tx history: shift and add new value (always increasing)
        const newHistory = [...prev.dailyTxHistory.slice(1), newDaily];
        return {
          totalBlocks: newBlocks,
          totalTx: newTx,
          walletAddresses: newWallets,
          avgBlockTime: parseFloat(newBlockTime.toFixed(2)),
          dailyTx: newDaily,
          dailyTxHistory: newHistory,
        };
      });
      timeout = setTimeout(updateStats, Math.floor(Math.random() * 1200) + 800);
    }
    updateStats();
    return () => clearTimeout(timeout);
  }, []);
  return stats;
}

const StatsHeader: React.FC = () => {
  const stats = useRealisticStats();

  // Animated numbers for each stat
  const animatedBlocks = useAnimatedNumber(stats.totalBlocks);
  const animatedTx = useAnimatedNumber(stats.totalTx);
  const animatedWallets = useAnimatedNumber(stats.walletAddresses);
  const animatedBlockTime = useAnimatedNumber(stats.avgBlockTime, 400);
  const animatedDailyTx = useAnimatedNumber(stats.dailyTx);

  // Chart.js data
  const chartData = {
    labels: stats.dailyTxHistory.map((_: unknown, i: number) => i + 1),
    datasets: [
      {
        data: stats.dailyTxHistory,
        fill: true,
        backgroundColor: 'rgba(59,130,246,0.08)',
        borderColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* 2x2 stat cards */}
        <div className="grid grid-cols-2 gap-6 col-span-2">
          <StatCard icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#fff" strokeWidth="2"/><rect x="7" y="7" width="10" height="10" rx="2" stroke="#fbbf24" strokeWidth="2"/></svg>} label="Total blocks" value={animatedBlocks.toLocaleString()} />
          <StatCard icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 17H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" stroke="#fff" strokeWidth="2"/><path d="M7 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="#fbbf24" strokeWidth="2"/></svg>} label="Total transactions" value={animatedTx.toLocaleString()} />
          <StatCard icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" stroke="#fff" strokeWidth="2"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Z" stroke="#fbbf24" strokeWidth="2"/></svg>} label="Wallet addresses" value={animatedWallets.toLocaleString()} />
          <StatCard icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#fbbf24" strokeWidth="2"/></svg>} label="Average block time" value={animatedBlockTime + 's'} />
        </div>
        {/* Chart */}
        <div className="rounded-xl p-6 flex flex-col justify-between shadow" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 font-semibold text-lg">Daily transactions <span className="align-super text-xs text-gray-500" title="Fake data, updates randomly">ⓘ</span></span>
            <span className="text-3xl font-bold text-white">{animatedDailyTx}</span>
          </div>
          <div className="h-24 w-full">
            <Line data={chartData} options={chartOptions} height={96} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="rounded-xl p-6 flex items-center gap-4 shadow" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
    <div className="flex-shrink-0 flex items-center justify-center" style={{ minWidth: 40, minHeight: 40 }}>
      {icon}
    </div>
    <div>
      <div className="text-gray-400 text-base font-normal mb-0.5" style={{ fontFamily: 'DM Sans, Rubik, sans-serif' }}>{label}</div>
      <div className="text-3xl font-bold text-white -mt-1" style={{ fontFamily: 'DM Sans, Rubik, sans-serif', letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  </div>
);
// --- End StatsHeader ---

// Helper to generate a random Solana address (44 chars, base58)
function randomSolAddress() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let addr = '';
  for (let i = 0; i < 44; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
}

// --- Fake blocks data generator with full history and fade-in ---
function useFakeBlocksWithHistory(visibleCount: number = 5) {
  const [blocks, setBlocks] = useState(() => Array.from({ length: visibleCount }, (_, i) => ({
    number: 5524447 - i,
    createdAt: Date.now() - i * 4000,
    miner: randomSolAddress(),
    txn: Math.floor(Math.random() * 11),
    reward: (Math.random() * 2).toFixed(2),
    fadeIn: false,
  })));
  const [allBlocks, setAllBlocks] = useState(() => [...blocks]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function addBlock() {
      setBlocks(prev => {
        const newBlock = {
          number: prev[0].number + 1,
          createdAt: Date.now(),
          miner: randomSolAddress(),
          txn: Math.floor(Math.random() * 11),
          reward: (Math.random() * 2).toFixed(2),
          fadeIn: true,
        };
        const updated = [newBlock, ...prev].slice(0, visibleCount).map((b, i) => ({
          ...b,
          fadeIn: i === 0,
        }));
        setAllBlocks(all => [newBlock, ...all]);
        return updated;
      });
      timeout = setTimeout(addBlock, 2000);
    }
    timeout = setTimeout(addBlock, 2000);
    return () => clearTimeout(timeout);
  }, [visibleCount]);
  return { blocks, allBlocks };
}

// --- Animated number hook ---
function useAnimatedNumber(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number>();
  useEffect(() => {
    const start = display;
    const end = value;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (end - start) * progress);
      setDisplay(current);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    }
    animate(performance.now());
    return () => {
      if (raf.current !== undefined) {
        cancelAnimationFrame(raf.current);
      }
    };
    // eslint-disable-next-line
  }, [value]);
  return display;
}

// --- LatestBlocks component ---
const LatestBlocks: React.FC<{ onShowAllBlocks: () => void }> = ({ onShowAllBlocks }) => {
  const { blocks } = useFakeBlocksWithHistory(5);
  // Timer to force re-render every second for dynamic time ago
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  function getTimeAgo(createdAt: number) {
    const seconds = Math.floor((Date.now() - createdAt) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
  return (
    <div className="rounded-xl p-4 shadow mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white">Latest blocks</span>
        <span className="text-xs text-gray-400">Network utilization: <span className="text-blue-400">0.00%</span></span>
      </div>
      <div className="space-y-3">
        {blocks.map((block, idx) => {
          const animatedNumber = useAnimatedNumber(block.number);
          return (
            <div key={block.number} className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-transparent border border-blue-500/20 hover:bg-blue-500/5 transition-colors duration-200 ${block.fadeIn ? 'animate-fadeIn' : ''}`} style={{ animationDuration: '0.7s' }}>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-sans font-bold cursor-pointer hover:underline">{animatedNumber}</span>
                <span className="text-gray-500">{getTimeAgo(block.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>Txn {block.txn}</span>
                <span>Reward {block.reward}</span>
                <span>Miner <span className="text-gray-300 font-sans">{block.miner}</span></span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pt-2 text-center">
        <a href="#" className="text-blue-400 text-xs hover:underline" onClick={e => { e.preventDefault(); onShowAllBlocks(); }}>View all blocks</a>
      </div>
    </div>
  );
};

// --- Sidebar component ---
const Sidebar: React.FC<{ onShowAllTransactions: () => void; onShowTokenTransfers: () => void; onShowChartAndStats: () => void }> = ({ onShowAllTransactions, onShowTokenTransfers, onShowChartAndStats }) => (
  <aside className="hidden md:flex flex-col items-center bg-[#101624] border-r border-[#232a3a] min-h-screen w-20 py-6 gap-6">
    {/* Logo */}
    <div className="mb-8">
      <img src="/bonk-logo.png" alt="BonkScan Logo" className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow" />
    </div>
    {/* Menu */}
    <nav className="flex flex-col gap-4 w-full items-center">
      <SidebarItem icon={<Activity size={24} />} label="Transactions" onClick={onShowAllTransactions} />
      <SidebarItem icon={<ArrowRightLeft size={24} />} label="Token transfers" onClick={onShowTokenTransfers} />
      <SidebarItem icon={<BarChart3 size={24} />} label="Chart & stats" onClick={onShowChartAndStats} />
    </nav>
  </aside>
);

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center w-full py-2 px-2 rounded-lg hover:bg-orange-400/10 transition group focus:outline-none">
    <span className="text-gray-300 group-hover:text-orange-400 mb-1">{icon}</span>
    <span className="text-xs text-gray-400 group-hover:text-orange-400 font-medium tracking-wide">{label}</span>
  </button>
);
// --- End Sidebar ---

// --- AllTransactionsPage component ---
const AllTransactionsPage: React.FC<{ transactions: any[]; newSignatures: string[]; onBack: () => void }> = ({ transactions, newSignatures, onBack }) => (
  <div className="flex flex-col w-full max-w-6xl mx-auto py-10 px-2">
    <div className="flex items-center gap-4 mb-8">
      <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-orange-500/30">
        ← Back to dashboard
      </button>
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Activity className="w-8 h-8 text-orange-500" />
        All Transactions
      </h1>
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
  </div>
);
// --- End AllTransactionsPage ---

// --- TokenTransfersPage component ---
const mockTokenTransfers = Array.from({ length: 20 }, (_, i) => ({
  hash: randomSolAddress().slice(0, 16),
  method: ['Transfer', 'Mint', 'Burn'][Math.floor(Math.random() * 3)],
  block: 5524400 + i,
  from: randomSolAddress(),
  to: randomSolAddress(),
  tokenId: Math.floor(Math.random() * 10000),
  amount: (Math.random() * 1000).toFixed(2),
}));

const TokenTransfersPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex flex-col w-full max-w-7xl mx-auto py-10 px-2">
    <div className="flex items-center gap-4 mb-8">
      <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-orange-500/30">
        ← Back to dashboard
      </button>
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <ArrowRightLeft className="w-8 h-8 text-orange-500" />
        Token Transfers
      </h1>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#101624] rounded-xl overflow-hidden text-left text-sm text-gray-300 shadow-lg">
        <thead className="sticky top-0 z-10 bg-[#101624]">
          <tr className="border-b border-[#232a3a]">
            <th className="px-4 py-3 font-semibold text-gray-200">Txn hash</th>
            <th className="px-4 py-3 font-semibold text-gray-200">Method</th>
            <th className="px-4 py-3 font-semibold text-gray-200">Block</th>
            <th className="px-4 py-3 font-semibold text-gray-200">From</th>
            <th className="px-4 py-3 font-semibold text-gray-200">To</th>
          </tr>
        </thead>
        <tbody>
          {mockTokenTransfers.map((tx, i) => (
            <tr key={i} className="border-b border-[#232a3a] hover:bg-[#181c2a] transition group">
              <td className="px-4 py-2 text-blue-400 font-sans cursor-pointer hover:underline">{tx.hash}</td>
              <td className="px-4 py-2 font-sans bg-[#181c2a] rounded text-xs">{tx.method}</td>
              <td className="px-4 py-2 font-sans">{tx.block}</td>
              <td className="px-4 py-2 text-blue-400 font-sans group-hover:underline cursor-pointer">{tx.from}</td>
              <td className="px-4 py-2 text-blue-400 font-sans group-hover:underline cursor-pointer">{tx.to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
// --- End TokenTransfersPage ---

// --- ChartAndStatsPage component ---
const fakeStats = [
  { label: 'Average block time', value: '3s' },
  { label: 'Completed txns', value: '74,266K' },
  { label: 'Number of contracts today', value: '0' },
  { label: 'Total accounts', value: '125' },
  { label: 'Total addresses', value: '404' },
  { label: 'Total blocks', value: '5.525M' },
  { label: 'Total tokens', value: '20' },
  { label: 'Total txns', value: '74,301K' },
  { label: 'Total contracts', value: '21' },
  { label: 'Transactions (24h)', value: '47' },
  { label: 'Pending transactions (30m)', value: '0' },
  { label: 'Transaction fees (24h)', value: '0 BONK' },
  { label: 'Avg. transaction fee (24h)', value: '0 BONK' },
  { label: 'Total verified contracts', value: '0' },
  { label: 'Number of verified contracts today', value: '0' },
  { label: 'Total volume (24h)', value: '1.2M BONK' },
  { label: 'Largest holder', value: '0xA1B2...C3D4' },
  { label: 'Top token', value: 'BONK' },
  { label: 'Active wallets (24h)', value: '1,234' },
  { label: 'New tokens (24h)', value: '7' },
];

// Animated/interactive chart data
const chartConfigs = [
  {
    title: 'Number of accounts',
    data: Array.from({ length: 30 }, (_, i) => 100 + i * 2 + Math.round(Math.random() * 10)),
    color: '#fbbf24',
  },
  {
    title: 'Active accounts',
    data: Array.from({ length: 30 }, () => Math.round(Math.random() * 10)),
    color: '#3b82f6',
  },
  {
    title: 'New accounts',
    data: Array.from({ length: 30 }, () => Math.random() * 2 + 1),
    color: '#f472b6',
  },
  {
    title: 'Token volume (24h)',
    data: Array.from({ length: 30 }, () => Math.round(Math.random() * 100000) + 50000),
    color: '#34d399',
    isBonk: true,
  },
  {
    title: 'Transaction fees (BONK)',
    data: Array.from({ length: 30 }, () => Math.random() * 1000 + 500),
    color: '#f87171',
    isBonk: true,
  },
];

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context: import('chart.js').TooltipItem<'line'>) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += context.parsed.y;
          if ((context.dataset as any).isBonk) label += ' BONK';
          return label;
        },
      },
      backgroundColor: '#232a3a',
      titleColor: '#fff',
      bodyColor: '#fbbf24',
      borderColor: '#fbbf24',
      borderWidth: 1,
      cornerRadius: 6,
      displayColors: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: { display: false },
    },
    y: {
      display: false,
      grid: { display: false },
    },
  },
  elements: {
    line: { tension: 0.4, borderWidth: 3 },
    point: { radius: 0, hoverRadius: 5 },
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutCubic',
  },
};

const ChartAndStatsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex flex-col w-full max-w-7xl mx-auto py-12 px-4 sm:px-8">
    <div className="flex items-center gap-4 mb-10">
      <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-orange-500/30">
        ← Back to dashboard
      </button>
      <h1 className="text-4xl font-bold text-white flex items-center gap-3 tracking-tight">
        <BarChart3 className="w-10 h-10 text-orange-500" />
        Chart & stats
      </h1>
    </div>
    {/* Stats Section */}
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-bonk-orange mb-6 tracking-wide">Network & Token Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {fakeStats.map((stat, i) => (
          <div key={i} className="rounded-2xl p-8 flex flex-col gap-3 shadow bg-[#181c24] border border-[#232a3a] min-h-[110px]">
            <div className="text-gray-400 text-base font-normal mb-0.5">{stat.label}</div>
            <div className="text-3xl font-extrabold text-white -mt-1 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
    {/* Charts Section */}
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-bonk-orange mb-6 tracking-wide">Activity & Growth Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {chartConfigs.map((chart, i) => {
          const labels = Array.from({ length: chart.data.length }, (_, idx) => `Day ${idx + 1}`);
          const data = {
            labels,
            datasets: [
              {
                label: chart.title,
                data: chart.data,
                borderColor: chart.color,
                backgroundColor: chart.color + '33',
                fill: true,
                isBonk: chart.isBonk,
              },
            ],
          };
          return (
            <div key={i} className="rounded-2xl p-8 shadow bg-[#181c24] border border-[#232a3a] flex flex-col min-h-[320px]">
              <div className="text-gray-300 font-semibold text-lg mb-4">{chart.title}</div>
              <div className="flex-1 flex items-end">
                <Line data={data} options={chartOptions} height={120} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {/* Search/filter bar (fake) */}
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8 mt-8">
      <select className="bg-[#101624] border border-[#232a3a] text-gray-300 rounded-lg px-3 py-2 w-full md:w-auto">
        <option>All stats</option>
      </select>
      <div className="flex gap-2 w-full md:w-auto">
        <button className="px-3 py-1 rounded bg-[#232a3a] text-gray-300 font-medium w-full md:w-auto">All time</button>
        <button className="px-3 py-1 rounded bg-[#232a3a] text-gray-300 font-medium w-full md:w-auto">1M</button>
        <button className="px-3 py-1 rounded bg-[#232a3a] text-gray-300 font-medium w-full md:w-auto">3M</button>
        <button className="px-3 py-1 rounded bg-[#232a3a] text-gray-300 font-medium w-full md:w-auto">6M</button>
        <button className="px-3 py-1 rounded bg-[#232a3a] text-gray-300 font-medium w-full md:w-auto">1Y</button>
      </div>
      <input className="flex-1 bg-[#101624] border border-[#232a3a] text-gray-300 rounded-lg px-3 py-2 min-w-[200px]" placeholder="Find chart, metric..." />
    </div>
  </div>
);

// Add DashboardHeader component
interface DashboardHeaderWithSearchProps {
  blockSearch: string;
  handleBlockInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlockKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  blockResults: any[];
  handleSelectBlock: (num: number) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
function DashboardHeaderWithSearch() {
  return null;
}

// Fade-in animation CSS
const fadeInStyle = `
@keyframes fadeInRow {
  from { background: #ff990033; }
  to { background: transparent; }
}
.animate-fadeInRow {
  animation: fadeInRow 1s ease;
}
`;

// BonkScan header with logo, word, and nav links (left-aligned)
function BonkScanHeader() {
  const navigate = useNavigate();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    <div className="flex items-center justify-between w-full px-8 py-4 gap-8">
      <div className="flex items-center gap-8 min-w-0">
        <div className="flex items-center space-x-3">
          <img src="/bonk-logo.png" alt="Bonk Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            BonkScan
          </span>
        </div>
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
      </div>
      <WalletConnect />
    </div>
  );
}

// Simple header/nav bar for BonkChain
function BonkHeader() {
  const navigate = useNavigate();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    <div className="flex items-center w-full px-8 py-4 gap-8">
      <div className="flex items-center gap-8 flex-1 min-w-0">
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
      </div>
    </div>
  );
}

function App() {
  const { txid = undefined } = useParams();
  // --- Stat Card Data for Solana Explorer style ---
  const supply = 605600000;
  const circulating = 537900000;
  const circulatingPercent = ((circulating / supply) * 100).toFixed(1);
  const activeStake = 400000000;
  const delinquentStake = 0.2;
  const { tokens } = useTokens();
  // --- End new data ---

  // Updated values from user
  const coinSupply = 48821087841;
  const difficulty = 26547586.6949971;
  const priceUsd = 0.00000218;
  const marketCapUsd = 106429.97149338;

  // If you want to show these as stat cards at the top:
  const metrics = [
    {
      title: 'Coin Supply (BONC)',
      value: coinSupply.toLocaleString(),
      unit: '',
    },
    {
      title: 'Price (USD)',
      value: `$${priceUsd.toFixed(8)}`,
      unit: '',
    },
    {
      title: 'Difficulty',
      value: difficulty.toLocaleString(undefined, { maximumFractionDigits: 6 }),
      unit: '',
    },
  ];

  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [newSignatures, setNewSignatures] = useState<string[]>([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showTokenTransfers, setShowTokenTransfers] = useState(false);
  const [showChartAndStats, setShowChartAndStats] = useState(false);
  const { blocks: latestBlocks, allBlocks } = useFakeBlocksWithHistory(5);
  const [blockSearch, setBlockSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [latestTxid, setLatestTxid] = useState<string | null>(null);

  // Filter blocks for dropdown (unique results only)
  const blockResults = blockSearch.length > 0
    ? Array.from(new Set(
        allBlocks
          .filter(b => b.number.toString().includes(blockSearch))
          .map(b => b.number)
      ))
      .slice(0, 5)
      .map(num => allBlocks.find(b => b.number === num))
      .filter(Boolean)
    : [];

  // Handle input change
  function handleBlockInput(e: React.ChangeEvent<HTMLInputElement>) {
    setBlockSearch(e.target.value);
    setShowDropdown(true);
  }

  // Handle dropdown selection
  function handleSelectBlock(num: number) {
    const found = allBlocks.find(b => b.number === num);
    if (found) setSelectedBlock(found);
    setBlockSearch("");
    setShowDropdown(false);
  }

  // Handle Enter key
  function handleBlockKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && blockResults.length > 0) {
      if (blockResults[0] && blockResults[0].number !== undefined) {
        handleSelectBlock(blockResults[0].number);
      }
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  // Handle clear
  function handleClearSearch() {
    setBlockSearch("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  // Generate realistic Solana transaction hashes
  function randomSolanaHash() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  useEffect(() => {
    if (!tokens.length) return;
    let timeout: NodeJS.Timeout;
    let extraTimeout: NodeJS.Timeout;
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
              signature: randomSolanaHash(),
              mint: randomToken.mint,
              symbol: randomToken.symbol,
            };
          })
          .filter((tx): tx is LocalTransaction => !!tx);
        // Track new signatures for pop animation
        setNewSignatures(newTxs.map(tx => tx.signature));
        return [
          ...newTxs,
          ...prev.slice(0, 100 - newTxs.length),
        ];
      });
      // Next interval: random between 200ms and 1200ms
      const next = Math.floor(Math.random() * 1000) + 200;
      timeout = setTimeout(addTransactions, next);
    }
    function addExtraFakeTransactions() {
      setTransactions(prev => {
        const count = Math.floor(Math.random() * 2) + 1; // 1-2 extra
        const newTxs: LocalTransaction[] = Array.from({ length: count })
          .map(() => {
            const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
            if (!randomToken) return null;
            const type = Math.random() > 0.5 ? 'buy' : 'sell';
            const solAmount = (Math.random() * 9.8 + 0.2).toFixed(2);
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
              signature: randomSolanaHash(),
              mint: randomToken.mint,
              symbol: randomToken.symbol,
            };
          })
          .filter((tx): tx is LocalTransaction => !!tx);
        setNewSignatures(newTxs.map(tx => tx.signature));
        return [
          ...newTxs,
          ...prev.slice(0, 100 - newTxs.length),
        ];
      });
      // Add extra fakes every 2-4 seconds
      extraTimeout = setTimeout(addExtraFakeTransactions, Math.floor(Math.random() * 2000) + 2000);
    }
    addTransactions();
    addExtraFakeTransactions();
    return () => { clearTimeout(timeout); clearTimeout(extraTimeout); };
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

  // Custom fast-incrementing transaction count and fixed TPS
  const [customTxCount, setCustomTxCount] = useState(430630211548);
  const TPS = 4032;
  useEffect(() => {
    // Increase by a random amount between 10 and 100 every 100ms
    const interval = setInterval(() => {
      setCustomTxCount(prev => prev + Math.floor(Math.random() * 91) + 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  // Use customTxCount for transaction count everywhere
  const stats = {
    ...useRealisticStats(),
    totalTx: customTxCount,
  };
  // txStats for the UI
  const txStats = [
    { label: 'Transaction count', value: customTxCount.toLocaleString() },
    { label: 'Transactions per second (TPS)', value: TPS.toLocaleString() },
  ];

  // --- New: Cluster and Transaction Stats Data ---
  const clusterStats = [
    { label: 'Slot', value: latestBlocks[0]?.number.toLocaleString(), copy: latestBlocks[0]?.number.toString() },
    { label: 'Block height', value: latestBlocks[0]?.number.toLocaleString(), copy: latestBlocks[0]?.number.toString() },
    { label: 'Cluster time', value: new Date(latestBlocks[0]?.createdAt).toUTCString() },
    { label: 'Slot time (1min avg)', value: `${(Math.random() * 100 + 350).toFixed(0)}ms` },
    { label: 'Slot time (1hr avg)', value: `${(Math.random() * 100 + 350).toFixed(0)}ms` },
    { label: 'Epoch', value: (820 + Math.floor(Math.random() * 10)).toString(), copy: (820 + Math.floor(Math.random() * 10)).toString() },
    { label: 'Epoch progress', value: `${(Math.random() * 100).toFixed(1)}%` },
    { label: 'Epoch time remaining (approx.)', value: `~${Math.floor(Math.random() * 6)}h ${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s` },
  ];

  // TPS bar chart data, responsive to range
  const [tpsRange, setTpsRange] = useState<'30m' | '2h' | '6h'>('30m');
  const getBarCount = (range: string) => (range === '30m' ? 30 : range === '2h' ? 60 : 120);
  const [tpsBarData, setTpsBarData] = useState<number[]>(Array.from({ length: getBarCount('30m') }, () => 2000 + Math.floor(Math.random() * 200)));

  // Animate the bar chart by shifting in new data every second (gentle random walk)
  useEffect(() => {
    const interval = setInterval(() => {
      setTpsBarData(prev => {
        const last = prev[prev.length - 1] || 2000;
        let nextVal = last + Math.floor(Math.random() * 81) - 40;
        nextVal = Math.max(1200, Math.min(4000, nextVal));
        const next = prev.slice(1);
        next.push(nextVal);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // When range changes, reset the bar data with new mock data
  useEffect(() => {
    setTpsBarData(Array.from({ length: getBarCount(tpsRange) }, () => 2000 + Math.floor(Math.random() * 200)));
  }, [tpsRange]);

  const tpsBarLabels = Array.from({ length: tpsBarData.length }, (_, i) => i + 1);
  const tpsBarChartData = {
    labels: tpsBarLabels,
    datasets: [
      {
        label: 'Transactions this moment',
        data: tpsBarData,
        backgroundColor: '#ff9900',
        borderColor: '#ff9900',
      },
    ],
  };

  const tpsBarChartOptions = {
    responsive: true,
    animation: { duration: 500 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: true,
        grid: { color: '#232a3a' },
        ticks: {
          color: '#b0b8c1',
          font: { family: 'Rubik, sans-serif', size: 13 },
          stepSize: 500,
        },
      },
    },
  };

  // Raydium poolId for demo (replace with dynamic if needed)
  const [raydiumTrades, setRaydiumTrades] = useState<any[]>([]);
  const [tradeSearch, setTradeSearch] = useState('');
  const [poolIds, setPoolIds] = useState<string[]>([]);
  const [raydiumTokens, setRaydiumTokens] = useState<any[]>([]);
  const [mergedTransactions, setMergedTransactions] = useState<LocalTransaction[]>([]);
  const navigate = useNavigate();

  // Fetch all tokens and extract poolIds
  useEffect(() => {
    fetch('https://launch-mint-v1.raydium.io/get/list?platformId=FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1,BuM6KDpWiTcxvrpXywWFiw45R2RNH8WURdvqoTDV1BW4&sort=lastTrade&size=100&mintType=default&includeNsfw=false')
      .then(res => res.json())
      .then(data => {
        const rows = data.data && Array.isArray(data.data.rows) ? data.data.rows : [];
        setRaydiumTokens(rows);
        const ids = rows.map((t: any) => t.poolId).filter(Boolean);
        setPoolIds(Array.from(new Set(ids)));
      });
  }, []);

  // Fetch trades for all poolIds every 13 seconds
  useEffect(() => {
    if (!poolIds.length) return;
    let interval: NodeJS.Timeout;
    const fetchAllTrades = async () => {
      const allTrades = await Promise.all(
        poolIds.map(poolId =>
          fetch(`https://launch-history-v1.raydium.io/trade?poolId=${poolId}&limit=20`)
            .then(res => res.json())
            .then(data => (data.data && Array.isArray(data.data.rows) ? data.data.rows : []))
        )
      );
      const trades = allTrades.flat().sort((a, b) => b.blockTime - a.blockTime);
      setRaydiumTrades(trades);
      if (trades.length > 0 && trades[0].txid !== latestTxid) {
        setLatestTxid(trades[0].txid);
      }
    };
    fetchAllTrades();
    interval = setInterval(fetchAllTrades, 13000);
    return () => clearInterval(interval);
  }, [poolIds.join(','), latestTxid]);

  // Merge Raydium trades with fake transactions for dashboard display
  useEffect(() => {
    // Convert Raydium trades to LocalTransaction format
    const raydiumAsLocal: LocalTransaction[] = (raydiumTrades || []).map((tx: any) => ({
      type: tx.type === 'buy' || tx.type === 'sell' ? tx.type : 'transfer',
      time: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleTimeString() : 'recent',
      amount: tx.amountIn && tx.symbol ? `${tx.amountIn} ${tx.symbol}` : (tx.amountIn || 'N/A'),
      from: tx.owner ? tx.owner.slice(0, 4) + '...' + tx.owner.slice(-4) : 'unknown',
      to: '',
      signature: tx.txid,
      mint: tx.mint || '',
      symbol: tx.symbol || '',
    }));
    // Deduplicate by signature (txid)
    const all = [...raydiumAsLocal, ...transactions];
    const seen = new Set<string>();
    const deduped = all.filter(tx => {
      if (seen.has(tx.signature)) return false;
      seen.add(tx.signature);
      return true;
    });
    // Sort by most recent (Raydium trades have blockTime, fakes have 'just now')
    deduped.sort((a, b) => {
      // Prefer Raydium blockTime if available, else fallback to fake
      const aTime = (raydiumTrades.find(t => t.txid === a.signature)?.blockTime || 0) || (a.time === 'just now' ? Date.now() : 0);
      const bTime = (raydiumTrades.find(t => t.txid === b.signature)?.blockTime || 0) || (b.time === 'just now' ? Date.now() : 0);
      return bTime - aTime;
    });
    setMergedTransactions(deduped);
  }, [raydiumTrades, transactions]);

  // Filter trades by search
  const filteredTrades = Array.isArray(raydiumTrades)
    ? (tradeSearch
        ? raydiumTrades.filter(tx => tx.txid && tx.txid.toLowerCase().includes(tradeSearch.toLowerCase()))
        : raydiumTrades)
    : [];

  if (txid) {
    return <TransactionDetailPage transactions={mergedTransactions} />;
  }

  return (
    <div className="min-h-screen bg-[#101315] flex flex-col items-center">
      <BonkScanHeader />
      <div className="w-full flex justify-center">
        <div className="max-w-2xl w-full text-center mt-6 mb-6">
          <img src="/bonk-logo.png" alt="Bonk Logo" className="w-12 h-12 mx-auto mb-4 rounded-full object-cover" />
          <p className="text-gray-300 text-lg" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>
            BonkScan is a real-time Solana explorer for BonkChain. Track live transactions, view token stats, and explore the latest activity on the BonkChain network.
          </p>
        </div>
      </div>
      {/* Removed DashboardHeaderWithSearch and block search input. Only transaction hash search remains below. */}
      {/* Transaction search bar */}
      <div className="w-full max-w-3xl mx-auto mt-6 mb-4 flex flex-col items-center">
        <input
          className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white text-sm"
          placeholder="Search by transaction hash..."
          value={tradeSearch}
          onChange={e => setTradeSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && tradeSearch.trim()) {
              navigate(`/bonkscan/tx/${tradeSearch.trim()}`);
            }
          }}
        />
      </div>
      {/* Main content columns start here */}
      {selectedBlock ? (
        <BlockDetailsPage block={selectedBlock} onBack={() => setSelectedBlock(null)} />
      ) : (
        <>
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8 mb-4">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="card w-full px-8 py-7 flex flex-col items-start justify-center rounded-xl shadow-sm bg-[#101624] border border-[#232a3a]"
                  style={{ minHeight: 120 }}
                >
                  <div className="text-base font-medium mb-2 tracking-wide text-orange-400" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500, letterSpacing: '0.01em' }}>{m.title}</div>
                  <div className="text-4xl text-orange-400 mb-1" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400, letterSpacing: '-0.01em' }}>
                    {m.value}
                    {m.unit && <span className="text-lg text-orange-400 ml-1">{m.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Main Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
              {/* Live Cluster Stats */}
              <div className="card w-full px-0 py-0 overflow-hidden rounded-xl shadow-sm">
                <div className="px-6 py-4 text-base font-bold text-white border-b border-[#232a3a]">Live Cluster Stats</div>
                <table className="w-full text-left text-base">
                  <tbody>
                    {clusterStats.map((row, i) => (
                      <tr key={i} className="table-row group hover:bg-[#232a3a]/30 transition">
                        <td className="py-3 px-6 text-gray-400 font-medium w-1/2 flex items-center gap-2">{row.label}{row.copy && (<button onClick={() => copyToClipboard(row.copy!)} className="ml-1 text-bonk-orange opacity-70 hover:opacity-100" title="Copy"><Clipboard size={16} /></button>)}</td>
                        <td className="py-3 px-6 text-bonk-orange font-sans font-bold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Live Transaction Stats */}
              <div className="card w-full px-0 py-0 overflow-hidden rounded-xl shadow-sm">
                <div className="px-6 pt-6 pb-2">
                  <div className="text-base font-medium mb-4 tracking-wide text-orange-400" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500, letterSpacing: '0.01em' }}>
                    Live Transaction Stats
                  </div>
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-base" style={{ fontFamily: 'Rubik, sans-serif' }}>Transaction count</span>
                      <span className="text-3xl text-orange-400" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>{customTxCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-base" style={{ fontFamily: 'Rubik, sans-serif' }}>Transactions per second (TPS)</span>
                      <span className="text-3xl text-orange-400" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>{TPS.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-base font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>TPS history</div>
                    <div className="flex gap-2">
                      <button className={`px-3 py-1 rounded bg-[#181c24] font-medium text-xs border border-[#232a3a] ${tpsRange==='30m'?'text-white':'text-gray-400'}`} onClick={()=>setTpsRange('30m')}>30m</button>
                      <button className={`px-3 py-1 rounded bg-[#181c24] font-medium text-xs border border-[#232a3a] ${tpsRange==='2h'?'text-white':'text-gray-400'}`} onClick={()=>setTpsRange('2h')}>2h</button>
                      <button className={`px-3 py-1 rounded bg-[#181c24] font-medium text-xs border border-[#232a3a] ${tpsRange==='6h'?'text-white':'text-gray-400'}`} onClick={()=>setTpsRange('6h')}>6h</button>
                    </div>
                  </div>
                  <div className="h-[400px] w-full">
                    <Bar
                      data={tpsBarChartData}
                      options={tpsBarChartOptions}
                      height={400}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    For transaction confirmation time statistics, please visit
                    {' '}<a href="https://validators.app" className="text-[#14f1c6] underline" target="_blank" rel="noopener noreferrer">validators.app</a>
                    {' '}or{' '}
                    <a href="https://solscan.io" className="text-[#14f1c6] underline" target="_blank" rel="noopener noreferrer">solscan.io</a>
                  </div>
                </div>
              </div>
            </div>
            {/* --- Insert LatestTransactionsDashboard here --- */}
            <div className="w-full max-w-4xl mx-auto mt-8 mb-8">
              <LatestTransactionsDashboard
                onShowAllTransactions={() => setShowAllTransactions(true)}
                transactions={mergedTransactions}
                newSignatures={newSignatures}
              />
            </div>
            {/* Footer Card: Kickstart your development journey */}
            <div className="card w-full mt-2 mb-8 px-0 py-0 overflow-hidden rounded-xl shadow-sm">
              <div className="px-6 py-4 text-base font-bold text-white border-b border-[#232a3a]">Kickstart your development journey on BonkChain</div>
              <div className="flex flex-row gap-4 px-6 py-4 items-start">
                <div className="flex-1 flex flex-col gap-2 group cursor-pointer hover:scale-105 transition-transform duration-200">
                  <div className="bg-[#232a3a] rounded-lg h-24 w-full flex items-center justify-center overflow-hidden relative group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                </div>
                </div>
                  <div className="text-white font-semibold text-base mt-2 group-hover:text-blue-400 transition-colors">Setup Your BonkChain Environment</div>
                  <div className="text-gray-400 text-sm">Install CLI tools, configure RPC endpoints, and deploy your first smart contract</div>
                </div>
                <div className="flex-1 flex flex-col gap-2 group cursor-pointer hover:scale-105 transition-transform duration-200">
                  <div className="bg-[#232a3a] rounded-lg h-24 w-full flex items-center justify-center overflow-hidden relative group-hover:shadow-lg group-hover:shadow-green-500/20 transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-white font-semibold text-base mt-2 group-hover:text-green-400 transition-colors">Quick Start Guide</div>
                  <div className="text-gray-400 text-sm">Learn account creation, token transfers, and basic transaction structure</div>
                </div>
                <div className="flex-1 flex flex-col gap-2 group cursor-pointer hover:scale-105 transition-transform duration-200">
                  <div className="bg-[#232a3a] rounded-lg h-24 w-full flex items-center justify-center overflow-hidden relative group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-white font-semibold text-base mt-2 group-hover:text-orange-400 transition-colors">BonkChain Developer Bootcamp</div>
                  <div className="text-gray-400 text-sm">Master advanced concepts: DEX development, yield farming, and DeFi protocols</div>
                </div>
                <div className="flex-1 flex flex-col gap-2 group cursor-pointer hover:scale-105 transition-transform duration-200">
                  <div className="bg-[#232a3a] rounded-lg h-24 w-full flex items-center justify-center overflow-hidden relative group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-white font-semibold text-base mt-2 group-hover:text-purple-400 transition-colors">60 Days of BonkChain</div>
                  <div className="text-gray-400 text-sm">Daily challenges: build a DEX, create NFTs, and deploy complex DeFi protocols</div>
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Live Network Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Online</span>
                </div>
              </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                    <span>Blocks: 2,847,392</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <span>TPS: 65,432</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <span>Validators: 1,847</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Transaction Detail Route */}
      <Routes>
        <Route path="/tx/:txid" element={<TransactionDetailPage transactions={mergedTransactions} />} />
      </Routes>
      {/* Fade-in animation style for new trades */}
      <style>{fadeInStyle}</style>
    </div>
  );
}

// Transaction Detail Page
function TransactionDetailPage({ transactions }: { transactions: any[] }) {
  const { txid } = useParams();
  const navigate = useNavigate();
  // Support both Raydium and fake txs (signature or txid)
  const tx = transactions.find(t => t.signature === txid || t.txid === txid);
  if (!tx) return <div className="text-center py-8 text-white">Transaction not found.</div>;
  return (
    <div className="max-w-xl mx-auto py-16 fade-in-slow">
      <button
        onClick={() => navigate('/bonkscan')}
        className="mb-6 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 text-white font-medium shadow hover:from-orange-400 hover:to-orange-600 transition-colors duration-300 text-sm"
        style={{ fontFamily: 'Rubik, sans-serif', letterSpacing: '0.01em' }}
      >
        ← Back to BonkScan
      </button>
      <h2 className="text-3xl mb-6 text-white tracking-tight" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700 }}>Transaction Details</h2>
      <div className="relative rounded-2xl shadow-2xl bg-[#0c1017] border border-[#232a3a] px-8 py-8 flex flex-col gap-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Geometric accent (triangle) */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute right-0 top-0 opacity-10" style={{zIndex:0}}><polygon points="80,0 80,80 0,80" fill="#fff" /></svg>
        <div className="flex flex-col gap-2 z-10">
          <div><b className="text-gray-300">Tx Hash:</b> <span className="font-mono text-orange-300 break-all" style={{ fontFamily: 'Space Mono, monospace' }}>{tx.signature || tx.txid}</span></div>
          {tx.blockTime && <div><b className="text-gray-300">Time:</b> <span className="text-white">{new Date(tx.blockTime * 1000).toLocaleString()}</span></div>}
          {tx.time && !tx.blockTime && <div><b className="text-gray-300">Time:</b> <span className="text-white">{tx.time}</span></div>}
          <div><b className="text-gray-300">Type:</b> <span className="capitalize text-white">{tx.type}</span></div>
          {tx.amountIn && <div><b className="text-gray-300">Amount In:</b> <span className="text-white">{tx.amountIn}</span></div>}
          {tx.amountOut && <div><b className="text-gray-300">Amount Out:</b> <span className="text-white">{tx.amountOut}</span></div>}
          {tx.amount && <div><b className="text-gray-300">Amount:</b> <span className="text-white">{tx.amount}</span></div>}
          {tx.price && <div><b className="text-gray-300">Price:</b> <span className="text-white">{tx.price}</span></div>}
          {tx.owner && <div><b className="text-gray-300">User:</b> <span className="font-mono text-white" style={{ fontFamily: 'Space Mono, monospace' }}>{tx.owner}</span></div>}
          {tx.from && <div><b className="text-gray-300">From:</b> <span className="font-mono text-white" style={{ fontFamily: 'Space Mono, monospace' }}>{tx.from}</span></div>}
          {tx.to && <div><b className="text-gray-300">To:</b> <span className="font-mono text-white" style={{ fontFamily: 'Space Mono, monospace' }}>{tx.to}</span></div>}
          {tx.fee && <div><b className="text-gray-300">Fee:</b> <span className="text-white">{tx.fee}</span></div>}
          {tx.symbol && <div><b className="text-gray-300">Token:</b> <span className="text-white">{tx.symbol}</span></div>}
          {tx.mint && <div><b className="text-gray-300">Mint:</b> <span className="font-mono text-white" style={{ fontFamily: 'Space Mono, monospace' }}>{tx.mint}</span></div>}
        </div>
        <div className="mt-4 z-10">
          <a
            href={`https://solscan.io/token/${tx.mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow hover:from-orange-400 hover:to-orange-600 transition-colors duration-300 text-sm"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}
          >
            View on Solscan
          </a>
        </div>
      </div>
      <style>{`
        .fade-in-slow {
          animation: fadeInSlow 1.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
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
          <span className="text-gray-400 text-sm font-sans">{time}</span>
          {symbol && (
            <span className="text-bonk-orange text-xs font-sans font-bold">${symbol}</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white font-sans font-bold">{amount}</span>
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
        <span className="text-gray-300 font-sans">{from}</span>
      </div>
    </div>
  );
};

const DashboardStatsRow: React.FC<{ stats: {
  totalBlocks: number;
  totalTx: number;
  walletAddresses: number;
  avgBlockTime: number;
  dailyTx: number;
  dailyTxHistory: number[];
} }> = ({ stats }) => {
  const animatedBlocks = useAnimatedNumber(stats.totalBlocks);
  const animatedTx = useAnimatedNumber(stats.totalTx);
  const animatedWallets = useAnimatedNumber(stats.walletAddresses);
  const animatedBlockTime = useAnimatedNumber(stats.avgBlockTime, 400);
  const animatedDailyTx = useAnimatedNumber(stats.dailyTx);
  // Chart.js data for daily tx
  const chartData = {
    labels: stats.dailyTxHistory.map((_: unknown, i: number) => i + 1),
    datasets: [
      {
        data: stats.dailyTxHistory,
        fill: true,
        backgroundColor: 'rgba(59,130,246,0.08)',
        borderColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="rounded-xl p-6 flex items-center gap-4 shadow bg-[#181c24] border border-[#232a3a] h-full min-h-[120px]">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#fff" strokeWidth="2"/><rect x="7" y="7" width="10" height="10" rx="2" stroke="#fbbf24" strokeWidth="2"/></svg>
        <div>
          <div className="text-gray-400 text-base font-normal mb-0.5">Total blocks</div>
          <div className="text-2xl font-bold text-white -mt-1">{animatedBlocks.toLocaleString()}</div>
        </div>
      </div>
      <div className="rounded-xl p-6 flex items-center gap-4 shadow bg-[#181c24] border border-[#232a3a] h-full min-h-[120px]">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 17H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" stroke="#fff" strokeWidth="2"/><path d="M7 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="#fbbf24" strokeWidth="2"/></svg>
        <div>
          <div className="text-gray-400 text-base font-normal mb-0.5">Total transactions</div>
          <div className="text-2xl font-bold text-white -mt-1">{animatedTx.toLocaleString()}</div>
        </div>
      </div>
      <div className="rounded-xl p-6 flex items-center gap-4 shadow bg-[#181c24] border border-[#232a3a] h-full min-h-[120px]">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" stroke="#fff" strokeWidth="2"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Z" stroke="#fbbf24" strokeWidth="2"/></svg>
        <div>
          <div className="text-gray-400 text-base font-normal mb-0.5">Wallet addresses</div>
          <div className="text-2xl font-bold text-white -mt-1">{animatedWallets.toLocaleString()}</div>
        </div>
      </div>
      <div className="rounded-xl p-6 flex flex-col justify-between shadow bg-[#181c24] border border-[#232a3a] h-full min-h-[120px]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-400 text-base font-normal">Daily transactions</div>
          <div className="text-2xl font-bold text-white">{animatedDailyTx}</div>
        </div>
        <div className="h-12 w-full flex items-end">
          <Line data={chartData} options={chartOptions} height={48} />
        </div>
        <div className="mt-2 text-gray-400 text-xs">Average block time: <span className="text-white font-bold">{animatedBlockTime}s</span></div>
      </div>
    </div>
  );
};

// --- LatestBlocksDashboard ---
const LatestBlocksDashboard: React.FC<{ onShowAllBlocks: () => void }> = ({ onShowAllBlocks }) => {
  // Show 7 blocks to fill the section visually
  const { blocks } = useFakeBlocksWithHistory(7);
  // Timer to force re-render every second for dynamic time ago
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  function getTimeAgo(createdAt: number) {
    const seconds = Math.floor((Date.now() - createdAt) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
  return (
    <div className="bg-[#181c24] border border-[#232a3a] rounded-xl p-4 flex flex-col h-full min-w-[260px]">
      <div className="text-lg font-bold text-white mb-2">Latest blocks</div>
      <div className="text-xs text-gray-400 mb-3">Network utilization: <span className="text-blue-400">0.00%</span></div>
      <div className="flex-1 flex flex-col gap-3">
        {blocks.map((block, idx) => (
          <div key={block.number} className={`rounded-lg px-3 py-2 bg-[#101624] border border-[#232a3a] flex flex-col gap-1 ${block.fadeIn ? 'transaction-pop' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-sans font-bold text-base">{block.number}</span>
              <span className="text-gray-400 text-xs">{getTimeAgo(block.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Txn {block.txn}</span>
              <span>Reward {block.reward}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Miner</span>
              <span className="text-gray-300 font-sans truncate max-w-[120px]">{block.miner.slice(0, 6)}...{block.miner.slice(-4)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-3 text-center">
        <a href="#" className="text-blue-400 text-xs hover:underline" onClick={e => { e.preventDefault(); onShowAllBlocks(); }}>View all blocks</a>
      </div>
    </div>
  );
};

// --- LatestTransactionsDashboard ---
const LatestTransactionsDashboard: React.FC<{ onShowAllTransactions: () => void, transactions: LocalTransaction[], newSignatures: string[] }> = ({ onShowAllTransactions, transactions, newSignatures }) => {
  return (
    <div className="bg-[#181c24] border border-[#232a3a] rounded-xl p-4 flex flex-col h-full min-w-[340px]">
      <div className="text-lg font-bold text-white mb-2">Latest transactions</div>
      <div className="flex items-center gap-2 bg-[#232a3a] text-xs px-3 py-2 rounded mb-3">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
        <span className="text-green-400 font-semibold">Live</span>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {transactions.slice(0, 6).map((tx) => (
          <Link
            key={tx.signature}
            to={`/bonkscan/tx/${tx.signature}`}
            className={`transaction-row-animated ${newSignatures.includes(tx.signature) ? 'transaction-pop' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <TransactionRow {...tx} />
          </Link>
        ))}
      </div>
    </div>
  );
};

interface BlockDetailsPageProps {
  block: any;
  onBack: () => void;
}
function BlockDetailsPage({ block, onBack }: BlockDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'rewards' | 'programs' | 'accounts'>('transactions');

  // Mock block details
  const blockDetails = [
    { label: 'Blockhash', value: block.hash || '9MoyK3pozdYxsDYz97DUpYt82kzQvqz9744BmJr3PJz', copy: block.hash || '9MoyK3pozdYxsDYz97DUpYt82kzQvqz9744BmJr3PJz' },
    { label: 'Slot', value: block.number?.toLocaleString(), copy: block.number?.toString() },
    { label: 'Slot Leader', value: 'fotby1ABxpei2EVH9uXJ6bKHYgPjbg4Sny9eRzQjtRN', copy: 'fotby1ABxpei2EVH9uXJ6bKHYgPjbg4Sny9eRzQjtRN', color: 'text-green-400' },
    { label: 'Timestamp (Local)', value: new Date(block.createdAt).toLocaleString() },
    { label: 'Timestamp (UTC)', value: new Date(block.createdAt).toUTCString() },
    { label: 'Epoch', value: '820', copy: '820', color: 'text-green-400' },
    { label: 'Parent Blockhash', value: 'ExTdqgreuPsZPkxvrvG5M2BMhMBn763Yy5vEPPNDVCr', copy: 'ExTdqgreuPsZPkxvrvG5M2BMhMBn763Yy5vEPPNDVCr' },
    { label: 'Parent Slot', value: (block.number - 1)?.toLocaleString(), copy: (block.number - 1)?.toString() },
    { label: 'Parent Slot Leader', value: 'fotby1ABxpei2EVH9uXJ6bKHYgPjbg4Sny9eRzQjtRN', copy: 'fotby1ABxpei2EVH9uXJ6bKHYgPjbg4Sny9eRzQjtRN', color: 'text-green-400' },
    { label: 'Child Slot', value: (block.number + 1)?.toLocaleString(), copy: (block.number + 1)?.toString() },
    { label: 'Child Slot Leader', value: 'DrpBCbVkVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy', copy: 'DrpBCbVkVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy', color: 'text-green-400' },
    { label: 'Processed Transactions', value: '1518' },
    { label: 'Successful Transactions', value: '1320' },
    { label: 'Compute Unit Utilization', value: '43,334,464 / 50,000,000 (87%)' },
    { label: 'Successful Compute Unit Utilization', value: '28,627,109 / 50,000,000 (57%)' },
  ];

  // Mock transactions
  const mockTxs = Array.from({ length: 10 }, (_, i) => ({
    idx: 229 + i,
    result: 'Success',
    signature: Math.random().toString(36).slice(2, 18),
    fee: '◎0.000005',
    compute: (Math.random() * 35000 + 1000).toFixed(0),
    programs: ['System Program', 'Raydium AMM Program', 'Compute Budget Program', 'Token Program'],
  }));

  // Mock rewards
  const mockRewards = [
    {
      address: 'fotby1ABxpei2EVH9uXJ6bKHYgPjbg4Sny9eRzQjtRN',
      type: 'Fee',
      amount: '◎0.03287356',
      newBalance: '◎70.524498248',
      percent: '0.046634703%'
    }
  ];

  // Mock programs
  const mockProgramStats = [
    { label: 'Unique Programs Count', value: 103 },
    { label: 'Total Instructions', value: 4659 }
  ];
  const mockPrograms = [
    { program: 'Vote Program', txCount: 869, pctTx: '57.25%', instrCount: 869, pctInstr: '18.65%', success: '100%' },
    { program: 'Compute Budget Program', txCount: 594, pctTx: '39.13%', instrCount: 1184, pctInstr: '25.41%', success: '67%' },
    { program: 'System Program', txCount: 274, pctTx: '18.05%', instrCount: 669, pctInstr: '14.36%', success: '85%' },
    { program: 'Token Program', txCount: 152, pctTx: '10.01%', instrCount: 847, pctInstr: '18.18%', success: '84%' },
    { program: 'Associated Token Program', txCount: 71, pctTx: '4.68%', instrCount: 102, pctInstr: '2.19%', success: '85%' },
    { program: 'MEV1enscUm6tsQRoGd9h6nLQaQspKj7DB2M5FwM3Xvz', txCount: 67, pctTx: '4.41%', instrCount: 67, pctInstr: '1.44%', success: '30%' },
  ];

  // Mock accounts
  const mockAccounts = [
    { account: 'Token Program', rw: 50, ro: 438, total: 488, pct: '32.15%' },
    { account: 'Sol11111111111111111111111111111111111111112', rw: 57, ro: 398, total: 455, pct: '29.97%' },
    { account: 'System Program', rw: 0, ro: 326, total: 326, pct: '21.48%' },
    { account: 'GpMzbSM2GgvTKHjrzEGfMFoaZ8UR2XF4v8vHTvxFbL', rw: 7, ro: 316, total: 323, pct: '21.28%' },
    { account: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9VuAPwxo', rw: 59, ro: 256, total: 315, pct: '20.75%' },
  ];

  // Helper for explorer links
  const explorerUrl = (type: 'tx' | 'address' | 'program', id: string) => {
    if (type === 'tx') return `https://explorer.solana.com/tx/${id}`;
    if (type === 'address' || type === 'program') return `https://explorer.solana.com/address/${id}`;
    return '#';
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-10">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-orange-500/30"
      >
        ← Back to dashboard
      </button>
      {/* Header */}
      <div className="mb-2 text-xs text-gray-400 uppercase tracking-widest font-semibold">Details</div>
      <div className="text-3xl font-bold text-white mb-2">Block</div>
      <div className="border-b border-[#232a3a] mb-8" />
      {/* Overview Card */}
      <div className="rounded-2xl shadow-lg bg-[#181c24] border border-orange-400/30 p-0 overflow-hidden mb-10">
        <div className="bg-[#101624] px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a]">Overview</div>
        <table className="w-full text-left text-base">
          <tbody>
            {blockDetails.map((row, i) => (
              <tr key={i} className="border-b border-[#232a3a] last:border-0 group hover:bg-[#232a3a]/30 transition">
                <td className="py-3 px-6 text-gray-400 font-medium w-1/2">{row.label}</td>
                <td className={`py-3 px-6 font-sans font-bold text-right ${row.color || 'text-orange-400'}`}>{row.value} {row.copy && (
                  <button onClick={() => copyToClipboard(row.copy!)} className="ml-2 text-orange-400 opacity-70 hover:opacity-100" title="Copy">
                    <Clipboard size={16} />
                  </button>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-[#232a3a] mb-2 px-2">
        {['transactions', 'rewards', 'programs', 'accounts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-3 px-1 text-base font-semibold capitalize border-b-2 transition-all duration-150 ${activeTab === tab ? 'border-orange-400 text-white' : 'border-transparent text-gray-400 hover:text-orange-400'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl bg-[#181c24] border border-orange-400/30 shadow-lg mt-6 overflow-x-auto">
          <div className="px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a] flex items-center justify-between">
            <span>Filtered Block Transactions (649/1518)</span>
            <select className="bg-[#232a3a] border border-orange-400/30 text-gray-300 rounded px-3 py-1 text-sm">
              <option>All Except Votes</option>
              <option>All</option>
              <option>Only Success</option>
              <option>Only Failed</option>
            </select>
          </div>
          <table className="w-full text-left text-base">
            <thead className="bg-[#101624]">
              <tr>
                <th className="py-3 px-6 font-semibold text-gray-400">#</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Result</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Transaction Signature</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Fee</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Compute</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Invoked Programs</th>
              </tr>
            </thead>
            <tbody>
              {mockTxs.map((tx, i) => (
                <tr key={i} className="border-b border-[#232a3a] last:border-0 group hover:bg-[#232a3a]/30 transition">
                  <td className="py-3 px-6 text-gray-400 font-sans">{tx.idx}</td>
                  <td className="py-3 px-6"><span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-bold">{tx.result}</span></td>
                  <td className="py-3 px-6 font-sans text-blue-400 flex items-center gap-2">
                    {tx.signature}
                    <button onClick={() => copyToClipboard(tx.signature)} className="text-orange-400 opacity-70 hover:opacity-100" title="Copy">
                      <Clipboard size={16} />
                    </button>
                  </td>
                  <td className="py-3 px-6 font-sans text-orange-400">{tx.fee}</td>
                  <td className="py-3 px-6 font-sans text-orange-400">{tx.compute}</td>
                  <td className="py-3 px-6 text-green-400 font-sans">
                    {tx.programs.map((p, j) => (
                      <span key={j} className="block text-xs font-sans">{p}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'rewards' && (
        <div className="rounded-2xl bg-[#181c24] border border-orange-400/30 shadow-lg mt-6 overflow-x-auto">
          <div className="px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a]">Block Rewards</div>
          <table className="w-full text-left text-base">
            <thead className="bg-[#101624]">
              <tr>
                <th className="py-3 px-6 font-semibold text-gray-400">Address</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Type</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Amount</th>
                <th className="py-3 px-6 font-semibold text-gray-400">New Balance</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Percent Change</th>
              </tr>
            </thead>
            <tbody>
              {mockRewards.map((r, i) => (
                <tr key={i} className="border-b border-[#232a3a] last:border-0 group hover:bg-[#232a3a]/30 transition">
                  <td className="py-3 px-6 font-sans text-green-400 flex items-center gap-2">
                    <button onClick={() => copyToClipboard(r.address)} className="text-orange-400 opacity-70 hover:opacity-100" title="Copy"><Clipboard size={16} /></button>
                    <a href={explorerUrl('address', r.address)} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.address}</a>
                  </td>
                  <td className="py-3 px-6 text-gray-300 font-sans">{r.type}</td>
                  <td className="py-3 px-6 font-sans text-orange-400">{r.amount}</td>
                  <td className="py-3 px-6 font-sans text-orange-400">{r.newBalance}</td>
                  <td className="py-3 px-6 font-sans text-yellow-300 font-bold">{r.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'programs' && (
        <>
          <div className="rounded-2xl bg-[#181c24] border border-orange-400/30 shadow-lg mt-6 mb-6 overflow-x-auto">
            <div className="px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a]">Block Program Stats</div>
            <table className="w-full text-left text-base">
              <tbody>
                {mockProgramStats.map((row, i) => (
                  <tr key={i} className="border-b border-[#232a3a] last:border-0">
                    <td className="py-3 px-6 text-gray-400 font-medium w-1/2">{row.label}</td>
                    <td className="py-3 px-6 text-orange-400 font-sans font-bold">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl bg-[#181c24] border border-orange-400/30 shadow-lg mb-6 overflow-x-auto">
            <div className="px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a]">Block Programs</div>
            <table className="w-full text-left text-base">
              <thead className="bg-[#101624]">
                <tr>
                  <th className="py-3 px-6 font-semibold text-gray-400">Program</th>
                  <th className="py-3 px-6 font-semibold text-gray-400">Transaction Count</th>
                  <th className="py-3 px-6 font-semibold text-gray-400">% of Total</th>
                  <th className="py-3 px-6 font-semibold text-gray-400">Instruction Count</th>
                  <th className="py-3 px-6 font-semibold text-gray-400">% of Total</th>
                  <th className="py-3 px-6 font-semibold text-gray-400">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {mockPrograms.map((p, i) => (
                  <tr key={i} className="border-b border-[#232a3a] last:border-0 group hover:bg-[#232a3a]/30 transition">
                    <td className="py-3 px-6 font-sans text-green-400 flex items-center gap-2">
                      <button onClick={() => copyToClipboard(p.program)} className="text-orange-400 opacity-70 hover:opacity-100" title="Copy"><Clipboard size={16} /></button>
                      <a href={explorerUrl('program', p.program)} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.program}</a>
                    </td>
                    <td className="py-3 px-6 font-sans text-orange-400">{p.txCount}</td>
                    <td className="py-3 px-6 font-sans text-orange-400">{p.pctTx}</td>
                    <td className="py-3 px-6 font-sans text-orange-400">{p.instrCount}</td>
                    <td className="py-3 px-6 font-sans text-orange-400">{p.pctInstr}</td>
                    <td className="py-3 px-6 font-sans text-yellow-300 font-bold">{p.success}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {activeTab === 'accounts' && (
        <div className="rounded-2xl bg-[#181c24] border border-orange-400/30 shadow-lg mt-6 overflow-x-auto">
          <div className="px-6 py-4 text-lg font-bold text-white border-b border-[#232a3a]">Block Account Usage</div>
          <table className="w-full text-left text-base">
            <thead className="bg-[#101624]">
              <tr>
                <th className="py-3 px-6 font-semibold text-gray-400">Account</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Read-Write Count</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Read-Only Count</th>
                <th className="py-3 px-6 font-semibold text-gray-400">Total Count</th>
                <th className="py-3 px-6 font-semibold text-gray-400">% of Transactions</th>
              </tr>
            </thead>
            <tbody>
              {mockAccounts.map((a, i) => (
                <tr key={i} className="border-b border-[#232a3a] last:border-0 group hover:bg-[#232a3a]/30 transition">
                  <td className="py-3 px-6 font-sans text-green-400 flex items-center gap-2">
                    <button onClick={() => copyToClipboard(a.account)} className="text-orange-400 opacity-70 hover:opacity-100" title="Copy"><Clipboard size={16} /></button>
                    <a href={explorerUrl('address', a.account)} target="_blank" rel="noopener noreferrer" className="hover:underline">{a.account}</a>
                  </td>
                  <td className="py-3 px-6 font-sans text-orange-400">{a.rw}</td>
                  <td className="py-3 px-6 font-sans text-orange-400">{a.ro}</td>
                  <td className="py-3 px-6 font-sans text-orange-400">{a.total}</td>
                  <td className="py-3 px-6 font-sans text-yellow-300 font-bold">{a.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center py-6">
            <button className="bg-green-400 hover:bg-green-500 text-black font-bold px-8 py-3 rounded-lg text-lg transition">Load More</button>
          </div>
        </div>
      )}
    </div>
  );
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default App;