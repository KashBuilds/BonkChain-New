import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTokens } from '../App';
import { createChart, IChartApi, CandlestickSeriesOptions, UTCTimestamp } from 'lightweight-charts';
import Header from './Header';

const WS_URL = 'wss://api.synergy.markets/data/derp/live_chart';

const TokenDetailPage: React.FC = () => {
  const { mint } = useParams<{ mint: string }>();
  const { tokens } = useTokens();
  const navigate = useNavigate();
  const token = tokens.find((t: any) => t.mint === mint);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [noData, setNoData] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !token.marketAddresses) return;
    setNoData(false);
    let ws: WebSocket | null = null;
    let chart: IChartApi | null = null;
    let series: any = null;
    let receivedCandles = false;

    if (chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 400,
        layout: { background: { color: '#181a1f' }, textColor: '#fff' },
        grid: { vertLines: { color: '#23272e' }, horzLines: { color: '#23272e' } },
        timeScale: { borderColor: '#23272e' },
        rightPriceScale: { borderColor: '#23272e' },
      });
      chartRef.current = chart;
      series = (chart as any).addCandlestickSeries({
        upColor: '#16a34a',
        downColor: '#dc2626',
        borderUpColor: '#16a34a',
        borderDownColor: '#dc2626',
        wickUpColor: '#16a34a',
        wickDownColor: '#dc2626',
      } as CandlestickSeriesOptions);
    }

    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      ws?.send(
        JSON.stringify({
          marketAddresses: token.marketAddresses,
          candleSize: '1m',
        })
      );
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.candles && Array.isArray(data.candles)) {
          receivedCandles = true;
          setNoData(false);
          const candles = data.candles.map((c: any) => ({
            time: Math.floor(c.time / 1000) as UTCTimestamp,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          }));
          if (series) {
            series.setData(candles);
          }
        }
      } catch (e) {}
    };
    ws.onerror = () => {
      setNoData(true);
    };
    ws.onclose = () => {
      if (!receivedCandles) setNoData(true);
    };
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.offsetWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      ws?.close();
      window.removeEventListener('resize', handleResize);
      if (chart) {
        chart.remove();
        chartRef.current = null;
      }
    };
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-custom-dark flex flex-col items-center justify-center text-white">
        <div className="text-2xl font-bold mb-4">Token not found</div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-orange-500 rounded-lg text-white font-semibold">Go Back</button>
      </div>
    );
  }

  // Always use a random wallet for creator display
  const creator = '5HtaFSRKB93EefbEHcQXoBoNrpDvQWAxVmhMvtByjNcV';
  // Description removed as per request
  const timeLeft = token.timeLeft ?? '-';
  const transactions = token.transactions || [
    { time: '5 days ago', type: 'Buy', amount: 1.283195, user: '9xd9J...5ASM', tx: 'g2cp4...HnRv', txUrl: '#' },
    { time: '5 days ago', type: 'Refund', amount: 0.015758399, user: '9xd9J...5ASM', tx: '9GU2yd...zx2B', txUrl: '#' },
  ];
  const letsBonkAddress = token.letsBonkAddress || 'A1utW8JULw5zX9K4tdnE5Pd4L17MZ09mxQzBzb7bonk';
  const treasury = token.treasury || '2PqN...KvSE';
  const launchTime = token.launchTime || '20/07/2025, 01:36:04';
  const bondedTime = token.bondedTime || '20/07/2025, 01:37:51';
  const current = token.current || '30.00 SOL';

  // Bonding logic constants
  const BOND_TARGET = 70000;
  const GRADUATING_MIN = 40000;
  const marketCap = token.marketCap || 0;
  let status = 'New';
  let statusColor = 'bg-gray-700 text-gray-300';
  if (marketCap >= BOND_TARGET) {
    status = 'Graduated';
    statusColor = 'bg-green-500/10 text-green-400';
  } else if (marketCap >= GRADUATING_MIN) {
    status = 'Graduating';
    statusColor = 'bg-yellow-400/10 text-yellow-300';
  }
  const progress = Math.min((marketCap / BOND_TARGET) * 100, 100);
  const solToBond = Math.max(BOND_TARGET - marketCap, 0);
  const degens = token.degens ?? 9;
  const purchases = token.purchases ?? 12;

  // Sidebar status card logic
  let sidebarStatus = '';
  let sidebarDesc = '';
  let sidebarBtn = '';
  if (marketCap >= BOND_TARGET) {
    sidebarStatus = 'Successfully Bonded!';
    sidebarDesc = 'This token has successfully bonded and is now tradeable on letsBONK.fun';
    sidebarBtn = 'Buy on letsBONK.fun';
  } else if (marketCap >= GRADUATING_MIN) {
    sidebarStatus = 'Bonding in Progress!';
    sidebarDesc = 'This token is close to bonding. Help it reach the target!';
    sidebarBtn = 'Back this token on letsBONK.fun';
  } else {
    sidebarStatus = 'Bonding Just Started!';
    sidebarDesc = 'Be among the first to back this token.';
    sidebarBtn = 'Back this token on letsBONK.fun';
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1200);
  };

  function formatDate(ts: number | string | undefined): string {
    if (!ts) return 'N/A';
    let date: Date;
    if (typeof ts === 'number') {
      date = new Date(ts);
    } else if (/^\d+$/.test(ts)) {
      date = new Date(Number(ts));
    } else {
      date = new Date(ts);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
  }

  // Generate 2 random transactions for display, with time based on token age and market cap
  const tokenAgeMinutes = Math.max(1, Math.floor((Date.now() - Number(token.createdAt)) / 60000));
  const cap = Math.min(Math.max(marketCap, 0), 70000);
  const recency = cap / 70000;
  function randomTxTime() {
    // More recent for high cap, older for low cap
    const maxAgo = Math.max(1, Math.floor(tokenAgeMinutes * (1 - recency * 0.8)));
    const minAgo = Math.max(1, Math.floor(maxAgo * 0.5));
    const minutesAgo = Math.floor(Math.random() * (maxAgo - minAgo + 1)) + minAgo;
    return `${minutesAgo} min ago`;
  }
  function randomTx() {
    const types = ['Buy', 'Sell', 'Refund'];
    const users = ['9xd9J...5ASM', '8hTqL...2KLM', '3v4sX...tHh2', '5mN9...7pQ3'];
    const txs = ['g2cp4...HnRv', '9GU2yd...zx2B', 'a8f3k...1jK9', 'b7c2d...9LmQ'];
    const type = types[Math.floor(Math.random() * types.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const tx = txs[Math.floor(Math.random() * txs.length)];
    const amount = (Math.random() * 2 + 0.01).toFixed(6);
    const time = randomTxTime();
    return { time, type, amount, user, tx, txUrl: '#' };
  }
  const randomTransactions = [randomTx(), randomTx()];

  return (
    <div className="min-h-screen bg-custom-dark text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Token Header */}
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <img src={token.image || token.imgUrl || '/bonk-logo.png'} alt={token.name} className="w-20 h-20 rounded-xl object-cover border-2 border-orange-500 bg-black" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{token.name}</span>
                <span className="text-lg text-gray-400 font-bold">${token.symbol}</span>
                <span className={`ml-2 px-3 py-1 rounded-full ${statusColor} text-xs font-bold`}>{status}</span>
              </div>
              <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                Created by
                <>
                  <a
                    href={`https://solscan.io/account/${creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-orange-400 hover:underline"
                  >
                    {creator.slice(0, 4) + '...' + creator.slice(-3)}
                  </a>
                  <button
                    className="p-1 rounded hover:bg-gray-800"
                    title="Copy creator address"
                    onClick={() => handleCopy(creator)}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeWidth="1.2"/><rect x="8" y="8" width="7" height="7" rx="1.5" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeWidth="1"/></svg>
                  </button>
                  {copied === creator && <span className="text-green-400 text-xs ml-1">Copied!</span>}
                </>
              </div>
              {/* Description removed */}
            </div>
            <button className="ml-auto p-2 rounded-lg hover:bg-gray-800 transition" title="Copy CA" onClick={() => handleCopy(token.mint)}>
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeWidth="1.5"/><rect x="8" y="8" width="7" height="7" rx="1.5" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeWidth="1.2"/></svg>
            </button>
            {copied && <span className="ml-2 text-green-400 text-xs">Copied!</span>}
          </div>

          {/* Status Card */}
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-bold ${statusColor.replace('bg-', 'text-')}`}>{status}</span>
            </div>
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              Contract Address (CA):
              <span className="font-mono text-white break-all">{token.mint}</span>
              <button className="p-1 rounded hover:bg-gray-800" title="Copy CA" onClick={() => handleCopy(token.mint)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeWidth="1.5"/><rect x="8" y="8" width="7" height="7" rx="1.5" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeWidth="1.2"/></svg>
              </button>
              {copied && <span className="text-green-400 text-xs">Copied!</span>}
            </div>
            <div className="flex gap-2 mt-2">
              <a href={`https://letsbonk.fun/token/${token.mint}`} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold text-center transition">Trade on letsBONK</a>
              <a href={`https://solscan.io/token/${token.mint}`} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white font-bold text-center transition">View on Solscan</a>
            </div>
          </div>

          {/* Bonding Progress */}
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
            <div className="font-bold mb-2 text-lg">Bonding Progress</div>
            <div className="relative h-4 bg-gray-700 rounded-full mb-2 overflow-visible">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 16px 4px #ff9900, 0 0 32px 8px #ffb347',
                  transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              {/* Spinning BonkChain logo at the end of the progress bar */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `calc(${progress}% - 18px)`, // 18px = half logo size for centering
                  transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              >
                <img
                  src="/bonk-logo.png"
                  alt="BonkChain Logo"
                  className="w-7 h-7 rounded-full object-cover animate-spin-slow border-2 border-orange-400 bg-black shadow-lg"
                  style={{ animation: 'spin 2.5s linear infinite' }}
                />
              </div>
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                animation: spin 2.5s linear infinite;
              }
            `}</style>
            <div className="flex flex-wrap gap-8 text-sm">
              <div><span className="font-bold text-white">${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> Market Cap</div>
              <div><span className="font-bold text-white">${
                (token.volume24h ?? token.volumeU ?? token.volumeA ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
              }</span> 24h Volume</div>
              <div><span className="font-bold text-white">{(progress).toFixed(1)}%</span> Bonding Progress</div>
            </div>
          </div>

          {/* Recent Transactions (randomized) */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="font-bold mb-2 text-lg">Recent Transactions</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-1">Time</th>
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Amount</th>
                  <th className="text-left py-1">User</th>
                  <th className="text-left py-1">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {randomTransactions.map((tx, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="py-1">{tx.time}</td>
                    <td className="py-1">{tx.type}</td>
                    <td className="py-1">{tx.amount} SOL</td>
                    <td className="py-1">{tx.user}</td>
                    <td className="py-1">
                      <a href={tx.txUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">{tx.tx}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              <Link
                to="/bonkscan"
                className="px-4 py-1.5 text-sm rounded-full font-bold text-orange-400 border-2 border-orange-400 bg-transparent transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_8px_2px_#ff9900] focus:outline-none tracking-wide"
              >
                View all transactions on BonkScan
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Buy/Back Token Card (reactive) */}
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-2">
            <div className="font-bold mb-2 text-green-400">{sidebarStatus}</div>
            <div className="text-gray-300 text-sm mb-2">{sidebarDesc}</div>
            <a href={`https://letsbonk.fun/token/${token.mint}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-bold text-center transition">{sidebarBtn}</a>
          </div>
          {/* Token Info Card */}
          <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-2">
            <div className="font-bold mb-2 text-lg">Token Info</div>
            <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Address:</span> <span className="font-mono text-white break-all">{token.mint}</span></div>
            {token.letsBonkAddress && (
              <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">letsBONK Address:</span> <span className="font-mono text-white break-all">{token.letsBonkAddress}</span></div>
            )}
            {token.treasury && (
              <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Treasury:</span> <span className="font-mono text-white break-all">{token.treasury}</span></div>
            )}
            <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Launch Time:</span> <span className="text-white">{token.createAt ? formatDate(token.createAt) : 'N/A'}</span></div>
            {token.bondedAt && (
              <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Bonded Time:</span> <span className="text-white">{formatDate(token.bondedAt)}</span></div>
            )}
            <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Target:</span> <span className="text-white">{BOND_TARGET.toLocaleString()} SOL</span></div>
            <div className="flex items-center gap-2 text-sm"><span className="text-gray-400">Current:</span> <span className="text-white">${marketCap.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage; 