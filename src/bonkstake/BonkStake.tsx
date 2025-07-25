import React, { useState } from 'react';
import { Globe, FileText, Twitter, Zap, Shield, TrendingUp, X } from 'lucide-react';

export default function BonkStake() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className="min-h-screen bg-custom-dark text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <img src="/bonk-logo.png" alt="Bonk Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-3">
              BonkStake
            </span>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-2 ml-8">
            <a 
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 ${currentPath === '/' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'}`}
            >
              BonkChain
            </a>
            <a 
              href="/bonkscan"
              className={`px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 ${currentPath === '/bonkscan' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'}`}
            >
              BonkScan
            </a>
            <a 
              href="/bonkswap"
              className={`px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 ${currentPath === '/bonkswap' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'}`}
            >
              BonkSwap
            </a>
            <a 
              href="/bonkstake"
              className={`px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 ${currentPath === '/bonkstake' ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'}`}
            >
              BonkStake
            </a>
            <a 
              href="https://x.com/bonkchainfun"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-light text-gray-300 hover:text-orange-400 transition-all duration-200"
            >
              Twitter
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Tag */}
        <div className="text-center mb-8">
          <span className="inline-block bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm">
            In Development
          </span>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>
            Stake BONK.
          </h1>
          <h2 className="text-5xl font-bold text-orange-500" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>
            Earn More.
          </h2>
        </div>

        {/* Description */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 300 }}>
            Advanced collateralized staking protocol for BONK tokens. Participate in catalyst events and maximize your yield through intelligent position management.
          </p>
        </div>

        {/* Feature Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Collateral Staking */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>Collateral Staking</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Lock your BONK tokens as collateral to access leveraged staking positions. Smart contracts automatically manage risk and liquidation thresholds.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Up to 5x leverage on staked positions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Automated risk management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Flexible lock periods
              </li>
            </ul>
          </div>

          {/* Catalyst Events */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>Catalyst Events</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Algorithm detects high-probability market catalysts and automatically allocates staked collateral to maximize returns during volatile periods.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Real-time catalyst detection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Automated position sizing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Risk-adjusted returns
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-16">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>How It Works</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                1
              </div>
              <div>
                                 <h4 className="font-semibold mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>Deposit Collateral</h4>
                <p className="text-gray-300">
                  Stake your BONK tokens as collateral in our audited smart contracts. Minimum stake of 1M BONK required.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                2
              </div>
              <div>
                                 <h4 className="font-semibold mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>Algorithm Monitoring</h4>
                <p className="text-gray-300">
                  Our system continuously monitors on-chain metrics, social sentiment and market conditions to identify catalyst opportunities.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                3
              </div>
              <div>
                                 <h4 className="font-semibold mb-2" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 400 }}>Automated Execution</h4>
                <p className="text-gray-300">
                  When catalysts are detected, the protocol automatically opens leveraged positions using your collateral, with built-in stop-losses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">5x</div>
            <div className="text-gray-300">Maximum Leverage</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
            <div className="text-gray-300">Catalyst Monitoring</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">1M</div>
            <div className="text-gray-300">Min BONK Stake</div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-0" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 350 }}>Coming Soon</h3>
          </div>
        </div>
      </div>
    </div>
  );
} 