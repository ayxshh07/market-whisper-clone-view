
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Volume2 } from 'lucide-react';

const MarketPulse = () => {
  const [marketData, setMarketData] = useState({
    indices: [
      { name: 'NIFTY 50', value: 19654.35, change: 156.25, changePercent: 0.80 },
      { name: 'SENSEX', value: 65953.48, change: 528.17, changePercent: 0.81 },
      { name: 'BANK NIFTY', value: 44692.15, change: -89.45, changePercent: -0.20 },
      { name: 'NIFTY IT', value: 30847.25, change: 287.65, changePercent: 0.94 },
    ],
    topGainers: [
      { symbol: 'ADANIENT', price: 2847.50, change: 12.45, changePercent: 4.56 },
      { symbol: 'TATAMOTORS', price: 756.20, change: 28.15, changePercent: 3.87 },
      { symbol: 'WIPRO', price: 445.80, change: 15.25, changePercent: 3.54 },
      { symbol: 'INFY', price: 1456.90, change: 47.80, changePercent: 3.39 },
      { symbol: 'RELIANCE', price: 2567.35, change: 78.45, changePercent: 3.15 },
    ],
    topLosers: [
      { symbol: 'HDFC', price: 1678.25, change: -67.85, changePercent: -3.89 },
      { symbol: 'ICICIBANK', price: 945.60, change: -34.20, changePercent: -3.49 },
      { symbol: 'KOTAKBANK', price: 1789.40, change: -58.95, changePercent: -3.19 },
      { symbol: 'AXISBANK', price: 1023.75, change: -31.45, changePercent: -2.98 },
      { symbol: 'SBIN', price: 567.90, change: -15.85, changePercent: -2.71 },
    ],
    volumeLeaders: [
      { symbol: 'RELIANCE', volume: '2.45M', value: 6287.54 },
      { symbol: 'INFY', volume: '1.87M', value: 2721.89 },
      { symbol: 'TCS', volume: '1.65M', value: 5943.21 },
      { symbol: 'HDFC', volume: '1.43M', value: 2401.67 },
      { symbol: 'ICICIBANK', volume: '1.29M', value: 1219.43 },
    ]
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        indices: prev.indices.map(index => ({
          ...index,
          value: index.value + (Math.random() - 0.5) * 10,
          change: index.change + (Math.random() - 0.5) * 2,
          changePercent: parseFloat((index.changePercent + (Math.random() - 0.5) * 0.1).toFixed(2))
        }))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formatChange = (change: number) => (change >= 0 ? '+' : '') + formatValue(change);
  const formatPercent = (percent: number) => (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Market Indices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.indices.map((index) => (
            <div key={index.name} className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium text-slate-300 mb-2">{index.name}</h3>
              <div className="text-2xl font-bold mb-1">{formatValue(index.value)}</div>
              <div className={`flex items-center space-x-1 text-sm ${
                index.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {index.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{formatChange(index.change)}</span>
                <span>({formatPercent(index.changePercent)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Top Gainers</h3>
          <div className="space-y-3">
            {marketData.topGainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">₹{formatValue(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">
                    +{formatValue(stock.change)}
                  </div>
                  <div className="text-green-400 text-sm">
                    +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">Top Losers</h3>
          <div className="space-y-3">
            {marketData.topLosers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">₹{formatValue(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium">
                    {formatValue(stock.change)}
                  </div>
                  <div className="text-red-400 text-sm">
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume Leaders */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Volume2 className="h-5 w-5 mr-2 text-blue-400" />
            Volume Leaders
          </h3>
          <div className="space-y-3">
            {marketData.volumeLeaders.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-blue-400">{stock.volume}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{stock.value.toFixed(2)}Cr</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
