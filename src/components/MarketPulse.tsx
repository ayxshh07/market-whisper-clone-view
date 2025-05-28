import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Volume2, Clock, AlertCircle } from 'lucide-react';
import { MarketDataService, type MarketHours, type IndexData } from '../services/marketDataService';

const MarketPulse = () => {
  const [marketHours, setMarketHours] = useState<MarketHours | null>(null);
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('alpha_vantage_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const [marketData, setMarketData] = useState({
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

  useEffect(() => {
    if (!apiKey) return; // Don't fetch if no API key

    const marketService = new MarketDataService(apiKey);
    
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching market data with API key:', apiKey);
        
        // Get market hours
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        console.log('Market hours:', hours);
        
        // Get index data
        const indexData = await marketService.getIndexData();
        console.log('Index data received:', indexData);
        setIndices(indexData);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error('Market data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    // Refresh data every 30 seconds if market is open
    const interval = setInterval(() => {
      if (marketHours?.isOpen) {
        fetchMarketData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [apiKey, marketHours?.isOpen]);

  const formatValue = (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formatChange = (change: number) => (change >= 0 ? '+' : '') + formatValue(change);
  const formatPercent = (percent: number) => (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';

  const getMarketStatusColor = () => {
    if (!marketHours) return 'text-gray-400';
    return marketHours.isOpen ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Market Status */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className={`h-5 w-5 ${getMarketStatusColor()}`} />
            <div>
              <span className="font-medium text-white">Market Status: </span>
              <span className={`font-bold ${getMarketStatusColor()}`}>
                {marketHours ? (marketHours.isOpen ? 'OPEN' : 'CLOSED') : 'Loading...'}
              </span>
            </div>
          </div>
          {marketHours && (
            <div className="text-sm text-slate-400">
              {marketHours.isOpen 
                ? `Closes at ${marketHours.nextClose} ${marketHours.timezone}`
                : `Opens at ${marketHours.nextOpen} ${marketHours.timezone}`
              }
            </div>
          )}
        </div>
        
        {!apiKey && (
          <div className="mt-3 flex items-center space-x-2 text-yellow-400 bg-yellow-400/10 p-3 rounded">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Please configure your Alpha Vantage API key above to get real market data.
            </span>
          </div>
        )}
      </div>

      {/* Market Indices */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Market Indices
          {isLoading && <div className="ml-2 text-sm text-slate-400">Updating...</div>}
        </h2>
        
        {error && (
          <div className="mb-4 text-red-400 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error} - Showing cached data
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
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
              <div className="text-xs text-slate-500 mt-1">
                {marketHours?.isOpen ? 'Live' : index.lastUpdated}
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
