import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export default function WalletConnect() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const connected = wallet.connected;
  const publicKey = wallet.publicKey;

  // Auto-connect when wallet is selected
  React.useEffect(() => {
    if (wallet.wallet && !connected) {
      wallet.connect();
    }
  }, [wallet.wallet, connected, wallet]);

  const handleConnect = () => {
    if (!connected) {
      setVisible(true);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {!connected ? (
        <button
          onClick={handleConnect}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded-lg text-gray-300">
            {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </span>
          <button
            onClick={() => wallet.disconnect()}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-red-900/50 hover:text-red-400 transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 