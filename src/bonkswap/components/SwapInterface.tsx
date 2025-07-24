import React, { useState } from 'react';
import { ArrowUpDown, Settings, Zap } from 'lucide-react';
import TokenSelector from './TokenSelector';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { mockTokens } from '../data/mockTokens';

interface SwapToken {
  symbol: string;
  name: string;
  marketCap: number;
  totalSupply: number;
  change: number;
  icon: string;
  price: number;
  logoURI?: string;
}

interface SwapInterfaceProps {
  // No props needed - using wallet adapter state
}

const tokens = mockTokens;

export default function SwapInterface({}: SwapInterfaceProps) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const connected = wallet.connected;
  const publicKey = wallet.publicKey;

  const handleConnect = () => {
    if (!connected) {
      setVisible(true);
    }
  };

  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  const getTokenPrice = (token: SwapToken) => token.marketCap / token.totalSupply;

  const calculateRate = () => {
    if (!sellAmount || !sellToken || !buyToken) return 0;
    const sellPrice = getTokenPrice(sellToken);
    const buyPrice = getTokenPrice(buyToken);
    return (parseFloat(sellAmount) * sellPrice) / buyPrice;
  };

  const getTokenGlowColor = (token: SwapToken) => {
    switch (token.symbol) {
      case 'USELESS':
        return 'shadow-yellow-400/50';
      case 'USDC':
        return 'shadow-blue-400/50';
      case 'USDT':
        return 'shadow-green-400/50';
      case 'CRYBB':
        return 'shadow-purple-400/50';
      case 'IKUN':
        return 'shadow-pink-400/50';
      case 'BLUECHIP':
        return 'shadow-cyan-400/50';
      case 'MOMO':
        return 'shadow-orange-400/50';
      case 'KORI':
        return 'shadow-indigo-400/50';
      case 'HOSICO':
        return 'shadow-emerald-400/50';
      case 'ANI':
        return 'shadow-purple-400/50';
      case 'BONK':
        return 'shadow-orange-400/50';
      case 'SOL':
        return 'shadow-green-400/50';
      default:
        return 'shadow-gray-400/50';
    }
  };

  const getTokenBorderColor = (token: SwapToken) => {
    switch (token.symbol) {
      case 'USELESS':
        return 'border-yellow-400';
      case 'USDC':
        return 'border-blue-400';
      case 'USDT':
        return 'border-green-400';
      case 'CRYBB':
        return 'border-purple-400';
      case 'IKUN':
        return 'border-pink-400';
      case 'BLUECHIP':
        return 'border-cyan-400';
      case 'MOMO':
        return 'border-orange-400';
      case 'KORI':
        return 'border-indigo-400';
      case 'HOSICO':
        return 'border-emerald-400';
      case 'ANI':
        return 'border-purple-400';
      case 'BONK':
        return 'border-orange-400';
      case 'SOL':
        return 'border-green-400';
      default:
        return 'border-gray-400';
    }
  };

  const getTokenGlowStyle = (token: SwapToken) => {
    switch (token.symbol) {
      case 'USELESS':
        return {
          boxShadow: '0 0 20px 0 rgba(255, 255, 0, 0.6), 0 0 40px 0 rgba(255, 255, 0, 0.3), inset 0 0 20px 0 rgba(255, 255, 0, 0.1)'
        };
      case 'USDC':
        return {
          boxShadow: '0 0 20px 0 rgba(59, 130, 246, 0.6), 0 0 40px 0 rgba(59, 130, 246, 0.3), inset 0 0 20px 0 rgba(59, 130, 246, 0.1)'
        };
      case 'USDT':
        return {
          boxShadow: '0 0 20px 0 rgba(34, 197, 94, 0.6), 0 0 40px 0 rgba(34, 197, 94, 0.3), inset 0 0 20px 0 rgba(34, 197, 94, 0.1)'
        };
      case 'CRYBB':
        return {
          boxShadow: '0 0 20px 0 rgba(168, 85, 247, 0.6), 0 0 40px 0 rgba(168, 85, 247, 0.3), inset 0 0 20px 0 rgba(168, 85, 247, 0.1)'
        };
      case 'IKUN':
        return {
          boxShadow: '0 0 20px 0 rgba(236, 72, 153, 0.6), 0 0 40px 0 rgba(236, 72, 153, 0.3), inset 0 0 20px 0 rgba(236, 72, 153, 0.1)'
        };
      case 'BLUECHIP':
        return {
          boxShadow: '0 0 20px 0 rgba(34, 211, 238, 0.6), 0 0 40px 0 rgba(34, 211, 238, 0.3), inset 0 0 20px 0 rgba(34, 211, 238, 0.1)'
        };
      case 'MOMO':
        return {
          boxShadow: '0 0 20px 0 rgba(249, 115, 22, 0.6), 0 0 40px 0 rgba(249, 115, 22, 0.3), inset 0 0 20px 0 rgba(249, 115, 22, 0.1)'
        };
      case 'KORI':
        return {
          boxShadow: '0 0 20px 0 rgba(99, 102, 241, 0.6), 0 0 40px 0 rgba(99, 102, 241, 0.3), inset 0 0 20px 0 rgba(99, 102, 241, 0.1)'
        };
      case 'HOSICO':
        return {
          boxShadow: '0 0 20px 0 rgba(16, 185, 129, 0.6), 0 0 40px 0 rgba(16, 185, 129, 0.3), inset 0 0 20px 0 rgba(16, 185, 129, 0.1)'
        };
      case 'ANI':
        return {
          boxShadow: '0 0 20px 0 rgba(168, 85, 247, 0.6), 0 0 40px 0 rgba(168, 85, 247, 0.3), inset 0 0 20px 0 rgba(168, 85, 247, 0.1)'
        };
      case 'BONK':
        return {
          boxShadow: '0 0 20px 0 rgba(249, 115, 22, 0.6), 0 0 40px 0 rgba(249, 115, 22, 0.3), inset 0 0 20px 0 rgba(249, 115, 22, 0.1)'
        };
      case 'SOL':
        return {
          boxShadow: '0 0 20px 0 rgba(34, 197, 94, 0.6), 0 0 40px 0 rgba(34, 197, 94, 0.3), inset 0 0 20px 0 rgba(34, 197, 94, 0.1)'
        };
      default:
        return {
          boxShadow: '0 0 20px 0 rgba(156, 163, 175, 0.6), 0 0 40px 0 rgba(156, 163, 175, 0.3), inset 0 0 20px 0 rgba(156, 163, 175, 0.1)'
        };
    }
  };

  React.useEffect(() => {
    if (sellAmount) {
      setBuyAmount(calculateRate().toFixed(6));
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, sellToken, buyToken]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        {/* Bonk Logo Peeking Out */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 border-4 border-gray-800">
            <img 
              src="/bonk-logo.png" 
              alt="Bonk" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="text-white font-bold text-lg hidden">B</span>
          </div>
        </div>
        
        <div className="bg-gray-800/80 border border-gray-600 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Swap</h2>
            <span className="text-xs text-gray-400 font-medium">Powered by BonkChain</span>
        </div>

        {/* Sell Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Sell</label>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Balance: 0</span>
              <button className="text-cyan-400 hover:text-cyan-300 font-medium">Max</button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-xl"></div>
            <div className={`relative bg-gray-800 rounded-xl border-2 ${getTokenBorderColor(sellToken)} p-4`} 
                 style={getTokenGlowStyle(sellToken)}>
              <div className="flex items-center justify-between">
                <TokenSelector
                  selectedToken={sellToken}
                  onTokenSelect={setSellToken}
                  tokens={tokens}
                />
                <div className="flex flex-col items-end">
                  <input
                    type="text"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="0"
                    className="text-right text-2xl font-bold text-white bg-transparent border-none outline-none w-32"
                  />
                  <span className="text-sm text-gray-400">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapTokens}
            className="p-2 bg-gray-800 rounded-full border-2 border-gray-700 hover:border-orange-500/50 hover:bg-gray-700 transition-all duration-200"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Buy Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Buy</label>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Balance: 0</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl"></div>
            <div className={`relative bg-gray-800 rounded-xl border-2 ${getTokenBorderColor(buyToken)} p-4`}
                 style={getTokenGlowStyle(buyToken)}>
            <div className="flex items-center justify-between">
              <TokenSelector
                selectedToken={buyToken}
                onTokenSelect={setBuyToken}
                tokens={tokens}
              />
              <div className="flex flex-col items-end">
                <input
                  type="text"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0"
                    className="text-right text-2xl font-bold text-white bg-transparent border-none outline-none w-32"
                />
                  <span className="text-sm text-gray-400">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Information */}
        <div className="text-sm text-gray-400">
          Rate: 1 {sellToken?.symbol} = {calculateRate().toFixed(6)} {buyToken?.symbol}
        </div>

        {/* Wallet Connection Status */}
        {connected && (
          <div className="text-sm text-gray-400">
              Wallet Connected: {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </div>
        )}

        {/* Swap Button */}
          <button
            onClick={handleConnect}
          disabled={connected}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
            connected
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          >
          {connected ? 'Swap' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}