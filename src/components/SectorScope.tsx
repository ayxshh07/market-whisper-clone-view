
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const SectorScope = () => {
  const [sectorData, setSectorData] = useState([
    { name: 'Information Technology', change: 2.45, marketCap: 12500000, volume: 1234.56, leaders: ['TCS', 'INFY', 'WIPRO'] },
    { name: 'Banking & Financial', change: -1.23, marketCap: 15600000, volume: 2156.78, leaders: ['HDFC', 'ICICI', 'SBI'] },
    { name: 'Pharmaceuticals', change: 1.87, marketCap: 4500000, volume: 567.89, leaders: ['SUNPHARMA', 'DRREDDY', 'CIPLA'] },
    { name: 'Automobile', change: 3.21, marketCap: 3200000, volume: 789.12, leaders: ['TATAMOTORS', 'M&M', 'MARUTI'] },
    { name: 'Energy & Power', change: -0.65, marketCap: 8900000, volume: 1456.23, leaders: ['RELIANCE', 'ONGC', 'NTPC'] },
    { name: 'FMCG', change: 0.89, marketCap: 5400000, volume: 432.67, leaders: ['HUL', 'ITC', 'NESTLEINDIA'] },
    { name: 'Metals & Mining', change: 4.32, marketCap: 2800000, volume: 845.91, leaders: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO'] },
    { name: 'Real Estate', change: -2.14, marketCap: 1200000, volume: 234.45, leaders: ['DLF', 'GODREJPROP', 'BRIGADE'] },
    { name: 'Telecom', change: 1.45, marketCap: 3600000, volume: 567.23, leaders: ['BHARTIARTL', 'IDEA', 'JIOTEL'] },
    { name: 'Infrastructure', change: 2.67, marketCap: 4200000, volume: 678.34, leaders: ['L&T', 'IRCON', 'NBCC'] }
  ]);

  const [topStocks, setTopStocks] = useState({
    momentum: [
      { symbol: 'ADANIENT', sector: 'Energy', change: 5.67, price: 2847.50 },
      { symbol: 'TATASTEEL', sector: 'Metals', change: 4.89, price: 123.45 },
      { symbol: 'TATAMOTORS', sector: 'Auto', change: 4.23, price: 756.20 },
      { symbol: 'JSWSTEEL', sector: 'Metals', change: 3.98, price: 789.30 },
      { symbol: 'HINDALCO', sector: 'Metals', change: 3.76, price: 456.78 }
    ],
    volume: [
      { symbol: 'RELIANCE', sector: 'Energy', volume: '2.45M', turnover: 6287.54 },
      { symbol: 'INFY', sector: 'IT', volume: '1.87M', turnover: 2721.89 },
      { symbol: 'TCS', sector: 'IT', volume: '1.65M', turnover: 5943.21 },
      { symbol: 'HDFC', sector: 'Banking', volume: '1.43M', turnover: 2401.67 },
      { symbol: 'ICICIBANK', sector: 'Banking', volume: '1.29M', turnover: 1219.43 }
    ]
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSectorData(prev => 
        prev.map(sector => ({
          ...sector,
          change: sector.change + (Math.random() - 0.5) * 0.2,
          volume: sector.volume + (Math.random() - 0.5) * 50
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getSectorColor = (change: number) => {
    if (change > 0) return 'text-green-400 bg-green-400/10';
    if (change < 0) return 'text-red-400 bg-red-400/10';
    return 'text-yellow-400 bg-yellow-400/10';
  };

  const getSectorIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const formatMarketCap = (value: number) => {
    return `₹${(value / 10000).toFixed(1)}T`;
  };

  const formatVolume = (value: number) => {
    return `₹${value.toFixed(0)}Cr`;
  };

  return (
    <div className="space-y-6">
      {/* Sector Performance Overview */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
          Sector Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sectorData.map((sector, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{sector.name}</h3>
                {getSectorIcon(sector.change)}
              </div>
              
              <div className={`text-2xl font-bold mb-2 ${getSectorColor(sector.change).split(' ')[0]}`}>
                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
              </div>
              
              <div className="space-y-1 text-xs text-slate-400">
                <div>MCap: {formatMarketCap(sector.marketCap)}</div>
                <div>Volume: {formatVolume(sector.volume)}</div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {sector.leaders.slice(0, 2).map((leader, idx) => (
                  <span key={idx} className="text-xs bg-slate-600 px-2 py-1 rounded">
                    {leader}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Heatmap */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sector Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {sectorData.map((sector, index) => {
            const intensity = Math.abs(sector.change) / 5; // Normalize to 0-1
            const opacity = Math.min(0.8, Math.max(0.2, intensity));
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                  sector.change >= 0 
                    ? 'bg-green-500 border-green-400' 
                    : 'bg-red-500 border-red-400'
                }`}
                style={{ opacity }}
              >
                <div className="text-white font-medium text-sm mb-1">
                  {sector.name.split(' ')[0]}
                </div>
                <div className="text-white font-bold">
                  {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Momentum Stocks */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Top Momentum Stocks
          </h3>
          <div className="space-y-3">
            {topStocks.momentum.map((stock, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">{stock.sector}</div>
                  <div className="text-sm text-slate-300">₹{stock.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-lg">
                    +{stock.change.toFixed(2)}%
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Volume Stocks */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">High Volume Leaders</h3>
          <div className="space-y-3">
            {topStocks.volume.map((stock, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">{stock.sector}</div>
                  <div className="text-sm text-blue-400">{stock.volume} shares</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{stock.turnover.toFixed(0)}Cr</div>
                  <div className="text-sm text-slate-400">Turnover</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Leaders Detail */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sector Leaders Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">Sector</th>
                <th className="text-left py-3 px-4">Top Performer</th>
                <th className="text-left py-3 px-4">Change</th>
                <th className="text-left py-3 px-4">Market Cap</th>
                <th className="text-left py-3 px-4">Volume</th>
              </tr>
            </thead>
            <tbody>
              {sectorData.slice(0, 6).map((sector, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-medium">{sector.name}</td>
                  <td className="py-3 px-4">{sector.leaders[0]}</td>
                  <td className={`py-3 px-4 font-medium ${
                    sector.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">{formatMarketCap(sector.marketCap)}</td>
                  <td className="py-3 px-4">{formatVolume(sector.volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectorScope;
