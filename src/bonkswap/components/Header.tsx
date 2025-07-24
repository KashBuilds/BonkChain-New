import React from 'react';
import { Menu, Wallet, X } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = ['Swap', 'Liquidity', 'Portfolio'];
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

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'BonkChain':
        window.location.href = '/';
        break;
      case 'BonkScan':
        window.location.href = '/bonkscan';
        break;
      case 'BonkSwap':
        // Stay on current page or navigate to swap
        onTabChange('Swap');
        break;
      case 'BonkStake':
        // Navigate to BonkStake page
        window.location.href = '/bonkstake';
        break;
      case 'Twitter':
        window.open('https://x.com/bonkchainfun', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <header className="w-full bg-custom-dark sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 relative">
        {/* Logo and Main Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <img src="/bonk-logo.png" alt="Bonk Logo" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              BonkSwap
            </span>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('BonkChain')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200"
            >
              BonkChain
            </button>
            <button 
              onClick={() => handleNavigation('BonkScan')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200"
            >
              BonkScan
            </button>
            <button 
              onClick={() => handleNavigation('BonkSwap')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200"
            >
              BonkSwap
            </button>
            <button 
              onClick={() => handleNavigation('BonkStake')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200"
            >
              BonkStake
            </button>
            <button 
              onClick={() => handleNavigation('Twitter')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200"
            >
              Twitter
            </button>
          </nav>
        </div>

        {/* App Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
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
          <button className="md:hidden p-2 text-gray-300 hover:text-orange-400">
              <Menu className="w-5 h-5" />
            </button>
        </div>
      </div>
    </header>
  );
}