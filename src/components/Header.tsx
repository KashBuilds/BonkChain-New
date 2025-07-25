import React from 'react';
import WalletConnect from './WalletConnect';

export default function Header() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className="flex items-center justify-between w-full px-8 py-4 gap-8">
      <div className="flex items-center gap-8 min-w-0">
        <div className="flex items-center space-x-3">
          <img src="/bonk-logo.png" alt="Bonk Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            BonkChain
          </span>
        </div>
        <nav className="flex items-center gap-2 ml-8">
          <a href="/" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkChain</a>
          <a href="/bonkscan" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkscan' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkScan</a>
          <a href="/bonkswap" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkswap' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkSwap</a>
          <a href="/bonkstake" className={`text-sm font-light px-3 py-2 rounded-lg transition-all duration-200${currentPath === '/bonkstake' ? ' text-orange-400' : ' text-white hover:text-bonk-orange'}`}>BonkStake</a>
          <a href="https://x.com/bonkchainfun" target="_blank" rel="noopener noreferrer" className="text-sm font-light px-3 py-2 rounded-lg text-white hover:text-bonk-orange transition-all duration-200">Twitter</a>
        </nav>
      </div>
      <WalletConnect />
    </div>
  );
}
