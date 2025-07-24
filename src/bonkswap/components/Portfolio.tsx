import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface PortfolioProps {
  // No props needed - using wallet adapter state
}

export default function Portfolio({}: PortfolioProps) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const connected = wallet.connected;
  const publicKey = wallet.publicKey;

  const [hideBalances, setHideBalances] = React.useState(false);
  const [walletData, setWalletData] = React.useState<{
    solBalance: number;
    tokenAccounts: Array<{
      mint: string;
      symbol: string;
      name: string;
      balance: number;
      decimals: number;
    }>;
    totalValue: number;
  }>({
    solBalance: 0,
    tokenAccounts: [],
    totalValue: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const hasFetchedData = React.useRef(false);

  const handleConnect = () => {
    if (!connected) {
      setVisible(true);
    }
  };

  // Fetch wallet data when connected
  React.useEffect(() => {
    const fetchWalletData = async () => {
      if (!connected || !publicKey || hasFetchedData.current) return;

      setLoading(true);
      setError(null);
      hasFetchedData.current = true;
      
      try {
        // Get SOL balance
        const solBalance = await connection.getBalance(publicKey);
        const solBalanceInSol = solBalance / LAMPORTS_PER_SOL;

        // Get token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        // Process token accounts
        const processedTokens = tokenAccounts.value
          .filter(account => account.account.data.parsed.info.tokenAmount.uiAmount > 0)
          .map(account => {
            const info = account.account.data.parsed.info;
            return {
              mint: info.mint,
              symbol: getTokenSymbol(info.mint),
              name: getTokenName(info.mint),
              balance: info.tokenAmount.uiAmount,
              decimals: info.tokenAmount.decimals,
            };
          });

        // Calculate total value (simplified)
        const totalValue = solBalanceInSol * 200 + processedTokens.reduce((sum, token) => sum + (token.balance || 0), 0);

        setWalletData({
          solBalance: solBalanceInSol,
          tokenAccounts: processedTokens,
          totalValue,
        });
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Failed to load wallet data. Please try again.');
        hasFetchedData.current = false; // Reset flag on error so retry can work
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [connected, publicKey, connection]);

  // Helper functions to get token symbols and names
  const getTokenSymbol = (mint: string) => {
    const knownTokens: { [key: string]: string } = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
      // Add more known tokens as needed
    };
    return knownTokens[mint] || mint.slice(0, 4);
  };

  const getTokenName = (mint: string) => {
    const knownTokens: { [key: string]: string } = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USD Coin',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'Tether',
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'Bonk',
      // Add more known tokens as needed
    };
    return knownTokens[mint] || 'Unknown Token';
  };

  if (!connected) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400">Connect your Phantom wallet to view your portfolio</p>
        </div>

        <div className="bg-gray-800/80 rounded-2xl border border-gray-600 shadow-xl p-12">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Connect Your Phantom Wallet</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Connect your Solana wallet to view your token balances, transaction history, and portfolio performance.
              </p>
            </div>
            <div className="space-y-4">
            <button
                onClick={handleConnect}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/25 flex items-center space-x-2 mx-auto"
            >
              <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              <ExternalLink className="w-4 h-4" />
            </button>
              {connected && (
                <div className="text-center text-sm text-gray-400">
                  Wallet Connected: {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>Don't have Phantom wallet? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-medium">Download here</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!connected ? (
        <div className="bg-gray-800/80 border border-gray-600 rounded-2xl shadow-xl p-8 text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your portfolio</p>
          <button
            onClick={handleConnect}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-500/25"
          >
            Connect Wallet
          </button>
      </div>
      ) : (
        <>
          {/* Total Portfolio Value */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Total Portfolio Value</h2>
          </div>
          <button
            onClick={() => setHideBalances(!hideBalances)}
                className="text-white hover:text-gray-200 transition-colors"
          >
            {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${hideBalances ? '***' : walletData.totalValue.toFixed(2)}
          </div>
            <div className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+4.32% (24h)</span>
        </div>
      </div>

          {/* Holdings */}
          <div className="bg-gray-800/80 border border-gray-600 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Holdings</h2>
        
        {loading ? (
              <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-400">Loading wallet data...</span>
          </div>
        ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">{error}</div>
            <button
              onClick={() => {
                setError(null);
                    hasFetchedData.current = false;
                if (connected && publicKey) {
                  const fetchWalletData = async () => {
                    setLoading(true);
                    setError(null);
                    
                    try {
                      const solBalance = await connection.getBalance(publicKey);
                      const solBalanceInSol = solBalance / LAMPORTS_PER_SOL;
                      
                      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                      });
                      
                      const processedTokens = tokenAccounts.value
                        .filter(account => account.account.data.parsed.info.tokenAmount.uiAmount > 0)
                        .map(account => {
                          const info = account.account.data.parsed.info;
                          return {
                            mint: info.mint,
                            symbol: getTokenSymbol(info.mint),
                            name: getTokenName(info.mint),
                            balance: info.tokenAmount.uiAmount,
                            decimals: info.tokenAmount.decimals,
                          };
                        });
                      
                      const totalValue = solBalanceInSol * 200 + processedTokens.reduce((sum, token) => sum + (token.balance || 0), 0);
                      
                      setWalletData({
                        solBalance: solBalanceInSol,
                        tokenAccounts: processedTokens,
                        totalValue,
                      });
                          hasFetchedData.current = true;
                    } catch (error) {
                      console.error('Error fetching wallet data:', error);
                      setError('Failed to load wallet data. Please try again.');
                          hasFetchedData.current = false;
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchWalletData();
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Retry
            </button>
          </div>
        ) : (
        <div className="space-y-4">
            {/* SOL Balance */}
            {walletData.solBalance > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                        <div className="font-medium text-white">SOL</div>
                        <div className="text-sm text-gray-400">Solana</div>
                  </div>
                </div>
                <div className="text-center">
                      <div className="font-medium text-white">{walletData.solBalance.toFixed(4)} SOL</div>
                      <div className="text-sm text-gray-400">${(walletData.solBalance * 200).toFixed(2)}</div>
                </div>
                    <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+3.21%</span>
                </div>
              </div>
            )}
            
            {/* Token Accounts */}
            {walletData.tokenAccounts.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white font-bold">{token.symbol.charAt(0)}</span>
                </div>
                <div>
                        <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                </div>
              </div>
                <div className="text-center">
                      <div className="font-medium text-white">{token.balance.toLocaleString()} {token.symbol}</div>
                      <div className="text-sm text-gray-400">${(token.balance || 0).toFixed(2)}</div>
                </div>
                    <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+0.00%</span>
                </div>
              </div>
            ))}
            
            {walletData.tokenAccounts.length === 0 && walletData.solBalance === 0 && (
                  <div className="text-center py-12 text-gray-400">
                No tokens found in wallet
              </div>
            )}
            </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}