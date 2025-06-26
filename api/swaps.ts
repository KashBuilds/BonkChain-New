export default function handler(req, res) {
    // You can use req.query.mint to customize per token if you want
    const now = Date.now();
    // Generate 60 minutes of fake data
    const swaps = Array.from({ length: 60 }, (_, i) => {
      const price = 0.0001 + Math.sin(i / 10) * 0.00001 + Math.random() * 0.000005;
      return {
        timestamp: now - (60 - i) * 60 * 1000,
        price,
        direction: Math.random() > 0.5 ? 'buy' : 'sell',
        amountIn: Math.floor(Math.random() * 1000) + 100,
        amountOut: Math.floor(Math.random() * 1000) + 100,
      };
    });
    res.status(200).json(swaps);
  }