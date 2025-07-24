import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Info, RotateCcw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  version: string;
  fee: string;
  liquidity: string;
  volume24h: string;
  fees24h: string;
  apr: string;
}

interface DepositModalProps {
  pool: LiquidityPool | null;
  isOpen: boolean;
  onClose: () => void;
  isWalletConnected: boolean;
  onWalletConnect: () => void;
}

const liquidityPools: LiquidityPool[] = [
  {
    id: '1',
    tokenA: 'HYPE',
    tokenB: 'kHYPE',
    version: 'V3',
    fee: '0.01%',
    liquidity: '$7,464,722',
    volume24h: '$1,634,530',
    fees24h: '$1,566',
    apr: '0.8%'
  },
  {
    id: '2',
    tokenA: 'HYPE',
    tokenB: 'PURR',
    version: 'V3',
    fee: '0.3%',
    liquidity: '$5,959,394',
    volume24h: '$958,917',
    fees24h: '$17,434',
    apr: '17.62%'
  },
  {
    id: '3',
    tokenA: 'HYPE',
    tokenB: 'USD₮0',
    version: 'V3',
    fee: '0.3%',
    liquidity: '$5,050,531',
    volume24h: '$5,175,104',
    fees24h: '$171,781',
    apr: '112.2%'
  },
  {
    id: '4',
    tokenA: 'HYPE',
    tokenB: 'LHYPE',
    version: 'V3',
    fee: '0.01%',
    liquidity: '$3,738,503',
    volume24h: '$3,538,086',
    fees24h: '$2,255',
    apr: '3.45%'
  },
  {
    id: '5',
    tokenA: 'feUSD',
    tokenB: 'USD₮0',
    version: 'V3',
    fee: '0.01%',
    liquidity: '$3,501,382',
    volume24h: '$915,316',
    fees24h: '$1,001',
    apr: '0.95%'
  },
  {
    id: '6',
    tokenA: 'HYPE',
    tokenB: 'UBTC',
    version: 'V3',
    fee: '0.3%',
    liquidity: '$2,292,788',
    volume24h: '$1,460,449',
    fees24h: '$32,067',
    apr: '69.75%'
  },
  {
    id: '7',
    tokenA: 'HYPE',
    tokenB: 'UETH',
    version: 'V3',
    fee: '0.3%',
    liquidity: '$2,005,959',
    volume24h: '$1,004,160',
    fees24h: '$13,753',
    apr: '54.81%'
  },
  {
    id: '8',
    tokenA: 'USDHL',
    tokenB: 'USD₮0',
    version: 'V3',
    fee: '0.01%',
    liquidity: '$1,862,522',
    volume24h: '$1,507,146',
    fees24h: '$2,030',
    apr: '2.95%'
  }
];

// Notification component
function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-lg flex items-center space-x-2 animate-fade-in">
      <span>{message}</span>
    </div>
  );
}

function DepositModal({ pool, isOpen, onClose, onSimulatedSubmit }: Omit<DepositModalProps, 'isWalletConnected' | 'onWalletConnect'> & { onSimulatedSubmit?: () => void }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const isWalletConnected = wallet.connected;
  const handleWalletConnect = () => setVisible(true);
  const [priceRange, setPriceRange] = useState({ min: 0.8, max: 1.2 });
  const [currentPrice, setCurrentPrice] = useState(1.0);
  const [estimatedAPY, setEstimatedAPY] = useState(0.00);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isDraggingChart, setIsDraggingChart] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartScale, setChartScale] = useState(1);
  const [minPrice, setMinPrice] = useState('0.799964');
  const [maxPrice, setMaxPrice] = useState('1.19984');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  
  // Default values for reset
  const defaultPriceRange = { min: 0.8, max: 1.2 };
  const defaultCurrentPrice = 1.0;
  const defaultChartScale = 1;
  
  // Calculate zoomed price values
  const getZoomedValues = () => {
    const baseMin = 37.33;
    const baseMax = 63.78;
    const baseCurrent = 47.33;
    const range = baseMax - baseMin;
    const zoomFactor = 1 / chartScale;
    
    const newMin = baseCurrent - (range * zoomFactor) / 2;
    const newMax = baseCurrent + (range * zoomFactor) / 2;
    
    return {
      min: Math.max(0.1, newMin),
      max: Math.min(200, newMax),
      current: baseCurrent
    };
  };
  
  const handleZoomIn = () => {
    setChartScale(prev => Math.min(3, prev * 1.5));
  };
  
  const handleZoomOut = () => {
    setChartScale(prev => Math.max(0.2, prev / 1.5));
  };
  
  const handleReset = () => {
    setChartScale(defaultChartScale);
    setPriceRange(defaultPriceRange);
    setCurrentPrice(defaultCurrentPrice);
  };

  // Calculate APY based on price range and recent fees
  useEffect(() => {
    const range = priceRange.max - priceRange.min;
    const currentPriceInRange = (currentPrice - priceRange.min) / range;
    
    // Base APY from pool fees
    const baseAPY = parseFloat(pool?.apr.replace('%', '') || '0');
    
    // Adjust based on price range width (narrower range = higher APY)
    const rangeMultiplier = Math.max(0.1, 1 - (range / 2));
    
    // Adjust based on current price position in range
    const positionMultiplier = currentPriceInRange > 0.3 && currentPriceInRange < 0.7 ? 1.2 : 0.8;
    
    const calculatedAPY = baseAPY * rangeMultiplier * positionMultiplier;
    setEstimatedAPY(Math.max(0, calculatedAPY));
  }, [priceRange, currentPrice, pool]);

  const handleMouseDown = (e: React.MouseEvent, type: 'left' | 'right' | 'chart') => {
    e.preventDefault();
    if (type === 'left') setIsDraggingLeft(true);
    else if (type === 'right') setIsDraggingRight(true);
    else setIsDraggingChart(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!chartRef.current || (!isDraggingLeft && !isDraggingRight && !isDraggingChart)) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    if (isDraggingLeft) {
      // Calculate new min price based on mouse position
      const newMin = 0.1 + (percentage * 1.9);
      const clampedMin = Math.max(0.1, Math.min(priceRange.max - 0.1, newMin));
      setPriceRange(prev => ({ ...prev, min: clampedMin }));
    } else if (isDraggingRight) {
      // Calculate new max price based on mouse position
      const newMax = 0.1 + (percentage * 1.9);
      const clampedMax = Math.max(priceRange.min + 0.1, Math.min(2.0, newMax));
      setPriceRange(prev => ({ ...prev, max: clampedMax }));
    } else if (isDraggingChart) {
      // Move the entire range
      const newCurrentPrice = 0.1 + (percentage * 1.9);
      const range = priceRange.max - priceRange.min;
      const newMin = Math.max(0.1, newCurrentPrice - range / 2);
      const newMax = Math.min(2.0, newCurrentPrice + range / 2);
      setPriceRange({ min: newMin, max: newMax });
      setCurrentPrice(newCurrentPrice);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
    setIsDraggingChart(false);
  };

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight || isDraggingChart) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDraggingLeft, isDraggingRight, isDraggingChart, priceRange, currentPrice]);

  if (!isOpen || !pool) return null;

  const adjustPriceRange = (direction: 'decrease' | 'increase') => {
    const adjustment = direction === 'decrease' ? -0.2 : 0.2;
    setPriceRange(prev => ({
      min: Math.max(0.1, prev.min + adjustment),
      max: prev.max + adjustment
    }));
    setCurrentPrice(prev => prev + adjustment);
  };

  // Use the center price for conversion (e.g., 47.33)
  const centerPrice = 47.33;

  // Handle input for HYPE
  const handleTokenAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setTokenAAmount(value);
    if (value === '' || isNaN(Number(value))) {
      setTokenBAmount('');
      return;
    }
    const converted = (parseFloat(value) * centerPrice).toFixed(6);
    setTokenBAmount(converted);
  };

  // Handle input for kHYPE
  const handleTokenBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setTokenBAmount(value);
    if (value === '' || isNaN(Number(value))) {
      setTokenAAmount('');
      return;
    }
    const converted = (parseFloat(value) / centerPrice).toFixed(6);
    setTokenAAmount(converted);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Pool Info Header */}
        <div className="p-6 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{pool.tokenA.charAt(0)}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center -ml-2 border-2 border-gray-800">
                  <span className="text-white text-sm font-bold">{pool.tokenB.charAt(0)}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{pool.tokenA}/{pool.tokenB}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{pool.version}</span>
                  <span>{pool.fee}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <div>
                <span className="text-gray-300">TVL </span>
                <span className="font-semibold text-white">{pool.liquidity}</span>
              </div>
              <div>
                <span className="text-gray-300">Volume 24h </span>
                <span className="font-semibold text-white">{pool.volume24h}</span>
              </div>
              <div>
                <span className="text-gray-300">Fees 24h </span>
                <span className="font-semibold text-white">{pool.fees24h}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-6">
          {/* Price Range Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Set price range</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Rate:</span>
                <span className="font-medium text-white">47.33 ⚡</span>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Price Range Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => adjustPriceRange('decrease')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
              >
                <span className="font-medium">-20.0%</span>
              </button>
              <button className="p-2 bg-gray-600 text-white rounded">
                <div className="w-4 h-6 bg-white/20 rounded-sm"></div>
              </button>
              <button
                onClick={() => adjustPriceRange('increase')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
              >
                <span className="font-medium">+20.0%</span>
              </button>
            </div>

            {/* Interactive Price Range Visualization */}
            <div 
              ref={chartRef}
              className="relative h-32 bg-gray-700 rounded-lg p-4 cursor-pointer"
              onMouseDown={(e) => handleMouseDown(e, 'chart')}
            >
              <div className="absolute inset-4">
                {/* Green histogram representing liquidity distribution */}
                <div className="h-full relative">
                  {/* Histogram bars */}
                  <div className="absolute inset-0 flex items-end justify-between px-2">
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '20%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '35%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '50%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '70%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '90%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '100%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '95%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '85%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '75%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '60%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '45%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '30%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '20%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '15%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '10%' }}></div>
                    <div className="w-1 bg-green-400 rounded-t" style={{ height: '5%' }}></div>
                  </div>
                  
                  {/* Current price indicator (dashed line) - always centered */}
                  <div 
                    className="absolute top-0 w-0.5 h-full border-l-2 border-dashed border-gray-400"
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                  
                  {/* Left draggable bar */}
                  <div 
                    className="absolute top-0 w-1 h-full bg-gray-400 rounded cursor-ew-resize"
                    style={{ 
                      left: `${((priceRange.min - 0.1) / 1.9) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'left')}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                      {((priceRange.min - currentPrice) / currentPrice * 100).toFixed(1)}%
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gray-400 rounded-sm cursor-ew-resize hover:bg-gray-300"></div>
                  </div>
                  
                  {/* Right draggable bar */}
                  <div 
                    className="absolute top-0 w-1 h-full bg-gray-400 rounded cursor-ew-resize"
                    style={{ 
                      left: `${((priceRange.max - 0.1) / 1.9) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'right')}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                      +{((priceRange.max - currentPrice) / currentPrice * 100).toFixed(1)}%
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gray-400 rounded-sm cursor-ew-resize hover:bg-gray-300"></div>
                  </div>
                </div>
                
                {/* Price scale */}
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{getZoomedValues().min.toFixed(2)}</span>
                  <span>{getZoomedValues().current.toFixed(2)}</span>
                  <span>{getZoomedValues().max.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Control buttons in top-right */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button 
                  onClick={handleReset}
                  className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500"
                >
                  <RotateCcw className="w-3 h-3 text-gray-300" />
                </button>
                <button 
                  onClick={handleZoomIn}
                  className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500"
                >
                  <Plus className="w-3 h-3 text-gray-300" />
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500"
                >
                  <Minus className="w-3 h-3 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Min/Max Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min</label>
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      const newMin = parseFloat(e.target.value) || 0.1;
                      setPriceRange(prev => ({ ...prev, min: newMin }));
                    }}
                    className="w-full text-lg font-semibold text-white bg-transparent border-none outline-none"
                  />
                  <div className="text-sm text-gray-400 mt-1">{pool.tokenA} per {pool.tokenB}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max</label>
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      const newMax = parseFloat(e.target.value) || 2.0;
                      setPriceRange(prev => ({ ...prev, max: newMax }));
                    }}
                    className="w-full text-lg font-semibold text-white bg-transparent border-none outline-none"
                  />
                  <div className="text-sm text-gray-400 mt-1">{pool.tokenA} per {pool.tokenB}</div>
                </div>
              </div>
            </div>

            {/* Estimated APY */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">Estimated APY</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white">{estimatedAPY.toFixed(2)}%</span>
                <div className="w-4 h-4 rounded-full border-2 border-green-400"></div>
              </div>
            </div>
          </div>

          {/* Deposit Amount Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add deposit amount</h3>
              <select className="px-3 py-1 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white">
                <option>1%</option>
                <option>5%</option>
                <option>10%</option>
                <option>25%</option>
                <option>50%</option>
                <option>100%</option>
              </select>
            </div>

            {/* Token A Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Balance: 0</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">50%</span>
                  <span className="text-gray-400">Max</span>
                </div>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{pool.tokenA.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-white">{pool.tokenA}</span>
                  </div>
                  <div className="text-right">
                    <input
                      type="text"
                      value={tokenAAmount}
                      onChange={handleTokenAChange}
                      placeholder="0"
                      className="bg-transparent text-right text-xl font-semibold text-white placeholder-gray-400 border-none outline-none w-20"
                    />
                    <div className="text-sm text-gray-400">
                      ${tokenAAmount && !isNaN(Number(tokenAAmount)) ? (parseFloat(tokenAAmount) * centerPrice).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-300" />
              </div>
            </div>

            {/* Token B Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Balance: 0</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">50%</span>
                  <span className="text-gray-400">Max</span>
                </div>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{pool.tokenB.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-white">{pool.tokenB}</span>
                  </div>
                  <div className="text-right">
                    <input
                      type="text"
                      value={tokenBAmount}
                      onChange={handleTokenBChange}
                      placeholder="0"
                      className="bg-transparent text-right text-xl font-semibold text-white placeholder-gray-400 border-none outline-none w-20"
                    />
                    <div className="text-sm text-gray-400">
                      ${tokenBAmount && !isNaN(Number(tokenBAmount)) ? (parseFloat(tokenBAmount) * centerPrice).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Summary */}
            <div className="space-y-3 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total deposit</span>
                <span className="font-semibold text-white">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Deposit ratio</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    <span className="text-sm font-medium text-white">0%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span className="text-sm font-medium text-white">0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect Wallet Button */}
            {isWalletConnected ? (
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                onClick={onSimulatedSubmit}
                disabled={!onSimulatedSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleWalletConnect}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all duration-200 text-lg"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat card with interactive Chart.js line chart
function StatCard({ label, value, color, data, labels }: { label: string; value: string; color: string; data: number[]; labels: string[] }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color + '22',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: any) => `$${ctx.parsed.y.toLocaleString()}`,
        },
        displayColors: false,
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    maintainAspectRatio: false,
    elements: { line: { borderWidth: 2 } },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  };
  return (
    <div className="flex-1 bg-gray-800/80 rounded-2xl shadow-xl border border-gray-600 p-6 flex flex-col justify-between min-w-[240px] max-w-[340px]">
      <div>
        <div className="text-gray-400 text-sm mb-1">{label}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
      <div className="h-20 w-full flex items-center justify-center">
        <div className="w-full h-full">
        <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

// Sample data for stat cards
const tvlData = [37_000_000, 37_200_000, 37_500_000, 37_800_000, 37_897_121, 37_600_000, 37_700_000];
const volumeData = [25_000_000, 25_500_000, 26_000_000, 26_153_291, 25_800_000, 26_000_000, 26_100_000];
const feesData = [50_000, 51_000, 52_000, 52_727, 52_200, 52_500, 52_600];
const statLabels = ['Jul 13', 'Jul 15', 'Jul 17', 'Jul 19', 'Jul 21', 'Jul 23', 'Jul 25'];

export default function Liquidity() {
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleDeposit = (pool: LiquidityPool) => {
    setSelectedPool(pool);
    setIsDepositModalOpen(true);
  };

  // Simulated transaction handler
  const handleSimulatedSubmit = () => {
    setIsDepositModalOpen(false);
    // Generate a random tx id (simulate Solana tx hash)
    const txId = Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setNotification(`Transaction sent! TX ID: ${txId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Title Section */}
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-bold text-white">Liquidity Pools</h1>
        <p className="text-gray-400">Provide liquidity to earn trading fees and rewards</p>
      </div>

      {/* Stat Cards Row */}
      <div className="flex gap-6 mb-6 justify-center">
        <StatCard label="TVL" value="$37,897,121" color="#7c3aed" data={tvlData} labels={statLabels} />
        <StatCard label="24h Volume" value="$26,153,291" color="#22c55e" data={volumeData} labels={statLabels} />
        <StatCard label="24h Fees" value="$52,727" color="#2563eb" data={feesData} labels={statLabels} />
      </div>

      {/* Pools Table */}
      <div className="bg-gray-800/80 rounded-2xl border border-gray-600 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-white">Pool</th>
                <th className="text-right py-4 px-6 font-semibold text-white">Liquidity</th>
                <th className="text-right py-4 px-6 font-semibold text-white">24h Volume</th>
                <th className="text-right py-4 px-6 font-semibold text-white">24h Fees</th>
                <th className="text-right py-4 px-6 font-semibold text-white">APR</th>
                <th className="text-center py-4 px-6 font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {liquidityPools.map((pool) => (
                <tr key={pool.id} className="hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{pool.tokenA.charAt(0)}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center -ml-2 border-2 border-gray-800">
                          <span className="text-white text-sm font-bold">{pool.tokenB.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{pool.tokenA}/{pool.tokenB}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{pool.version}</span>
                          <span>{pool.fee}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-white">{pool.liquidity}</td>
                  <td className="py-4 px-6 text-right font-semibold text-white">{pool.volume24h}</td>
                  <td className="py-4 px-6 text-right font-semibold text-white">{pool.fees24h}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-semibold ${
                      parseFloat(pool.apr) > 50 ? 'text-green-400' : 
                      parseFloat(pool.apr) > 10 ? 'text-orange-400' : 'text-white'
                    }`}>
                      {pool.apr}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDeposit(pool)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105"
                    >
                      Deposit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        pool={selectedPool}
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSimulatedSubmit={handleSimulatedSubmit}
      />
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}