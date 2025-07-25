import React from 'react';
import BonkTokenCard from './BonkTokenCard';
import { AnimatePresence, motion } from 'framer-motion';

interface TokenGridProps {
  tokens: Array<{
    name: string;
    symbol: string;
    mint: string;
    marketCap: number;
    createdAt: string;
    image: string;
  }>;
}

const TokenGrid: React.FC<TokenGridProps> = ({ tokens }) => {
  // Sort tokens by newest first (descending by createdAt)
  const sortedTokens = [...tokens].sort((a, b) => {
    const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
    const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-3 gap-x-3">
        <AnimatePresence initial={false}>
          {sortedTokens.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8 col-span-full">
            No tokens to display
          </div>
        ) : (
            sortedTokens.map((token) => (
              <motion.div
                key={token.mint}
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.4, type: 'spring', damping: 20, stiffness: 200 }}
                layout
              >
                <BonkTokenCard token={token} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenGrid;