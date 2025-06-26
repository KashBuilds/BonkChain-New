import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi } from 'lightweight-charts';

interface SwapEvent {
  timestamp: number; // ms or s
  price: number;
  direction: 'buy' | 'sell';
  amountIn: number;
  amountOut: number;
}

interface Candle {
  time: number; // unix (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TokenChartProps {
  mint: string;
}

const TokenChart: React.FC<TokenChartProps> = ({ mint }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCandles([]);

    fetch(`/api/swaps?mint=${mint}`)
      .then(res => res.json())
      .then((swaps: SwapEvent[]) => {
        if (!swaps || swaps.length === 0) {
          setError('No chart data available');
          setLoading(false);
          return;
        }
        // Aggregate swaps into 1-min candles
        const ohlc: Record<number, Candle> = {};
        swaps.forEach(swap => {
          // Convert ms to seconds, round to nearest minute
          const t = Math.floor((swap.timestamp / 1000) / 60) * 60;
          if (!ohlc[t]) {
            ohlc[t] = {
              time: t,
              open: swap.price,
              high: swap.price,
              low: swap.price,
              close: swap.price,
              volume: swap.amountIn,
            };
          } else {
            ohlc[t].high = Math.max(ohlc[t].high, swap.price);
            ohlc[t].low = Math.min(ohlc[t].low, swap.price);
            ohlc[t].close = swap.price;
            ohlc[t].volume += swap.amountIn;
          }
        });
        const candleArr = Object.values(ohlc).sort((a, b) => a.time - b.time);
        setCandles(candleArr);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chart data');
        setLoading(false);
      });
    // Cleanup handled in next effect
  }, [mint]);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#181A20' },
        textColor: '#C3C2C5',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#71649C' },
      timeScale: { borderColor: '#71649C' },
      grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
    }) as IChartApi;
    // Candlestick series
    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    candleSeries.setData(candles.map(c => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })));
    // Volume bars (optional)
    if (typeof (chart as any).addHistogramSeries === 'function') {
      const volumeSeries = (chart as any).addHistogramSeries({
        color: '#8884d8', priceFormat: { type: 'volume' }, priceScaleId: '',
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volumeSeries.setData(candles.map(c => ({ time: c.time, value: c.volume, color: '#26a69a' })));
    }
    // Responsive
    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [candles]);

  if (loading) return <div className="text-center text-gray-400 py-8">Loading chart...</div>;
  if (error) return <div className="text-center text-gray-400 py-8">{error}</div>;

  return <div ref={chartContainerRef} className="w-full h-[400px] rounded-lg bg-[#181A20]" />;
};

export default TokenChart; 