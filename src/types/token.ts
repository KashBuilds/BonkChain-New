export interface Token {
  id: string;
  mint: string;
  name: string;
  ticker: string;
  icon: string;
  marketCap: number;
  volume24h: number;
  price: number;
  priceChange24h: number;
  progress?: number;
  launchTime?: string;
  creator: string;
  status: 'new' | 'graduating' | 'graduated';
  marketAddresses?: string[];
}

export interface TokenListResponse {
  tokens: Token[];
  lastUpdated: string;
  totalTokens: number;
}