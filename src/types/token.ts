export interface Token {
  id: string;
  mint: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;
  volume24h: number;
  price: number;
  priceChange24h: number;
  progress?: number;
  createdAt: string;
  creator: string;
  status: 'new' | 'graduating' | 'graduated';
  marketAddresses?: string[];
  ticker?: string;
  icon?: string;
  launchTime?: string;
}

export interface TokenListResponse {
  tokens: Token[];
  lastUpdated: string;
  totalTokens: number;
}