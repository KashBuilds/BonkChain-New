import React, { useState } from 'react';
import Header from './components/Header';
import SwapInterface from './components/SwapInterface';
import Liquidity from './components/Liquidity';
import Portfolio from './components/Portfolio';
import PriceTicker from './components/PriceTicker';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

function App() {
  const [activeTab, setActiveTab] = useState('Swap');
  // Use Helius RPC endpoint with API key
  const endpoint = 'https://mainnet.helius-rpc.com/?api-key=a003f693-5638-463c-9d97-29d90ccc3105';
  const wallets = [new PhantomWalletAdapter()];

  const renderContent = () => {
    switch (activeTab) {
      case 'Liquidity':
        return <Liquidity />;
      case 'Portfolio':
        return <Portfolio />;

      default:
        return <SwapInterface />;
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="min-h-screen bg-custom-dark">
            <Header
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="w-full flex justify-center">
              <div className="max-w-2xl w-full text-center mt-6 mb-6 px-4">
                <img src="/bonk-logo.png" alt="Bonk Logo" className="w-12 h-12 mx-auto mb-4 rounded-full object-cover" />
                <p className="text-gray-300 text-base sm:text-lg" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>
                  BonkSwap is a decentralized exchange for BonkChain. Swap tokens, provide liquidity and manage your portfolio with ease on the Bonk network.
                </p>
              </div>
            </div>
            
            {/* Yield Earning Banner */}
            <div className="w-full flex justify-center mb-6 px-4">
              <div className="max-w-4xl w-full">
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-700/10 border border-orange-500/20 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-base sm:text-lg">💰</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white">Earn Yield</h3>
                        <p className="text-gray-300 text-sm">Provide liquidity and earn up to</p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-400">16.7%</div>
                      <div className="text-xs sm:text-sm text-gray-400">APR</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-orange-500/20">
                    <p className="text-gray-300 text-xs sm:text-sm">
                      Stake your tokens in liquidity pools and earn trading fees plus bonus rewards. 
                      Higher volume pools offer better yields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <main className="container mx-auto px-4 py-4 sm:py-8">
              <div className="flex justify-center items-start sm:items-center min-h-[calc(100vh-300px)] sm:min-h-[calc(100vh-200px)] w-full">
                {renderContent()}
              </div>
            </main>
            <PriceTicker />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;