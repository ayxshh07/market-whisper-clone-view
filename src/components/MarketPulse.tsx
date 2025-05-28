
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Volume2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { MarketDataService, type MarketHours, type IndexData } from '../services/marketDataService';

const MarketPulse = () => {
  const [marketHours, setMarketHours] = useState<MarketHours | null>(null);
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');
  const [marketData, setMarketData] = useState({
    topGainers: [],
    topLosers: [],
    volumeLeaders: []
  });

  useEffect(() => {
    const marketService = new MarketDataService();
    
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching real Indian market data...');
        
        // Get market hours
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        console.log('Market status:', hours.isOpen ? 'OPEN' : 'CLOSED');
        
        // Get index data
        const indexData = await marketService.getIndexData();
        console.log('Index data updated');
        setIndices(indexData);
        
        // Check if we got real data or fallback
        const hasRealData = indexData.some(index => 
          index.lastUpdated !== 'Live Data Unavailable'
        );
        setDataSource(hasRealData ? 'live' : 'fallback');
        
        // Get stock data
        const gainers = await marketService.getTopGainers();
        const losers = await marketService.getTopLosers();
        const volumeLeaders = await marketService.getVolumeLeaders();
        
        setMarketData({
          topGainers: gainers,
          topLosers: losers,
          volumeLeaders: volumeLeaders
        });
        
      } catch (err) {
        console.error('Market data error:', err);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    // Refresh data every 30 seconds for real data, every 2 minutes for fallback
    const refreshInterval = dataSource === 'live' ? 30000 : 120000;
    const interval = setInterval(fetchMarketData, refreshInterval);

    return () => clearInterval(interval);
  }, [dataSource]);

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
              <span className="font-medium text-white">Indian Market Status: </span>
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
        
        <div className={`mt-3 flex items-center space-x-2 p-3 rounded ${
          dataSource === 'live' 
            ? 'text-green-400 bg-green-400/10' 
            : 'text-orange-400 bg-orange-400/10'
        }`}>
          {dataSource === 'live' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span className="text-sm">
            {dataSource === 'live' 
              ? 'Showing real live market data from NSE India'
              : 'Live data unavailable. Showing fallback data with realistic movements'
            }
          </span>
        </div>
      </div>

      {/* Market Indices */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Indian Market Indices
          {isLoading && <div className="ml-2 text-sm text-slate-400">Updating...</div>}
        </h2>
        
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
                {index.lastUpdated}
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
