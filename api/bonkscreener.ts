// API route to fetch Bonk tokens from Raydium and map to frontend format
const BONK_API_URL =
  'https://launch-mint-v1.raydium.io/get/list?platformId=FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1,BuM6KDpWiTcxvrpXywWFiw45R2RNH8WURdvqoTDV1BW4&sort=new&size=100&mintType=default&includeNsfw=false';

function getStatus(token) {
  // Map Raydium status to frontend stages
  if (token.status === 'new') return 'fresh';
  if (token.status === 'graduating') return 'graduating';
  return 'graduated';
}

function getRelativeTime(dateString) {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const diff = Math.max(0, now - created);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(BONK_API_URL);
    const data = await response.json();
    const tokens = (data?.data || []).map((token, idx) => ({
      id: token.mint || String(idx),
      mint: token.mint || String(idx),
      name: token.name,
      ticker: token.symbol,
      icon: token.image || '',
      marketCap: token.marketCap || 0,
      volume24h: token.volume24h || 0,
      price: token.price || 0,
      priceChange24h: token.priceChange24h || 0,
      progress: token.progress || undefined,
      launchTime: token.createdAt ? getRelativeTime(token.createdAt) : undefined,
      creatorWallet: token.creator || undefined,
      status: token.status || 'graduated',
    }));
    res.status(200).json({ tokens, lastUpdated: new Date().toISOString(), totalTokens: tokens.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Bonk tokens' });
  }
} 