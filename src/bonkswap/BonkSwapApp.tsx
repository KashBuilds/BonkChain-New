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
            <main className="container mx-auto px-4 py-8">
              <div className="flex justify-center items-center min-h-[calc(100vh-200px)] w-full">
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