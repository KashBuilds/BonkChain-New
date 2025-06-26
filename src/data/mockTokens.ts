import { Token } from '../types/token';

export const mockTokens: Token[] = [
  // Fresh tokens (just launched, low progress)
  {
    id: '1',
    name: 'BonkPepe',
    ticker: 'BPEPE',
    icon: '🐸',
    marketCap: 450000,
    volume24h: 125000,
    price: 0.000045,
    priceChange24h: 12.8,
    progress: 15,
    launchTime: '15m ago',
    creatorWallet: '7xKX...9mF2',
    stage: 'fresh'
  },
  {
    id: '2',
    name: 'BonkCat',
    ticker: 'BCAT',
    icon: '🐱',
    marketCap: 280000,
    volume24h: 89000,
    price: 0.000023,
    priceChange24h: 45.2,
    progress: 8,
    launchTime: '32m ago',
    creatorWallet: '3nF8...5kM9',
    stage: 'fresh'
  },
  {
    id: '3',
    name: 'BonkShiba',
    ticker: 'BSHIB',
    icon: '🐕‍🦺',
    marketCap: 620000,
    volume24h: 180000,
    price: 0.000067,
    priceChange24h: -8.4,
    progress: 22,
    launchTime: '1h ago',
    creatorWallet: '9mL2...7pQ8',
    stage: 'fresh'
  },
  
  // Graduating tokens (mid-progress, building momentum)
  {
    id: '4',
    name: 'MegaBonk',
    ticker: 'MBONK',
    icon: '💥',
    marketCap: 1850000,
    volume24h: 620000,
    price: 0.000089,
    priceChange24h: 67.4,
    progress: 65,
    launchTime: '4h ago',
    creatorWallet: '9aB4...2kL8',
    stage: 'graduating'
  },
  {
    id: '5',
    name: 'BonkDoge',
    ticker: 'BDOGE',
    icon: '🐕',
    marketCap: 2200000,
    volume24h: 840000,
    price: 0.000134,
    priceChange24h: 89.7,
    progress: 78,
    launchTime: '6h ago',
    creatorWallet: '2cF6...8tR1',
    stage: 'graduating'
  },
  {
    id: '6',
    name: 'BonkApe',
    ticker: 'BAPE',
    icon: '🦍',
    marketCap: 1650000,
    volume24h: 520000,
    price: 0.000098,
    priceChange24h: 34.6,
    progress: 58,
    launchTime: '8h ago',
    creatorWallet: '5kN3...9vL4',
    stage: 'graduating'
  },
  
  // Graduated tokens (high progress, established)
  {
    id: '7',
    name: 'BonkRocket',
    ticker: 'BROOK',
    icon: '🚀',
    marketCap: 8200000,
    volume24h: 2400000,
    price: 0.000456,
    priceChange24h: 156.3,
    progress: 100,
    launchTime: '2d ago',
    creatorWallet: '5mN9...7pQ3',
    stage: 'graduated'
  },
  {
    id: '8',
    name: 'BonkMoon',
    ticker: 'BMOON',
    icon: '🌙',
    marketCap: 12600000,
    volume24h: 3800000,
    price: 0.000789,
    priceChange24h: 234.7,
    progress: 100,
    launchTime: '3d ago',
    creatorWallet: '8dH2...4vN7',
    stage: 'graduated'
  },
  {
    id: '9',
    name: 'BonkDiamond',
    ticker: 'BDIAM',
    icon: '💎',
    marketCap: 15400000,
    volume24h: 4200000,
    price: 0.000923,
    priceChange24h: 89.2,
    progress: 100,
    launchTime: '5d ago',
    creatorWallet: '7qR5...3mK6',
    stage: 'graduated'
  },
  {
    id: '10',
    name: 'BonkLion',
    ticker: 'BLION',
    icon: '🦁',
    marketCap: 6800000,
    volume24h: 1900000,
    price: 0.000345,
    priceChange24h: 45.8,
    progress: 100,
    launchTime: '1d ago',
    creatorWallet: '4hG8...2nP9',
    stage: 'graduated'
  }
];