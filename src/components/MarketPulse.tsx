
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Volume2, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { MarketDataService, type MarketHours, type IndexData } from '../services/marketDataService';

const MarketPulse = () => {
  const [marketHours, setMarketHours] = useState<MarketHours | null>(null);
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [previousIndices, setPreviousIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [marketData, setMarketData] = useState({
    topGainers: [],
    topLosers: [],
    volumeLeaders: []
  });
  const [priceAnimations, setPriceAnimations] = useState<{[key: string]: 'up' | 'down' | null}>({});

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const marketService = new MarketDataService();
    
    const fetchMarketData = async () => {
      try {
        console.log('🔄 Fetching fresh market data...');
        
        // Get market hours
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        
        // Store previous indices for comparison
        setPreviousIndices(indices);
        
        // Get fresh index data
        const indexData = await marketService.getIndexData();
        
        // Detect price changes and trigger animations
        const animations: {[key: string]: 'up' | 'down' | null} = {};
        indexData.forEach((current, index) => {
          const previous = indices[index];
          if (previous && previous.value !== current.value) {
            animations[current.name] = current.value > previous.value ? 'up' : 'down';
          }
        });
        setPriceAnimations(animations);
        
        // Clear animations after 2 seconds
        setTimeout(() => setPriceAnimations({}), 2000);
        
        setIndices(indexData);
        setLastUpdateTime(new Date().toLocaleTimeString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        
        // Check if we got real data
        const hasRealData = indexData.some(index => 
          index.lastUpdated !== 'Live Data Unavailable'
        );
        setDataSource(hasRealData ? 'live' : 'fallback');
        
        // Get stock data
        const [gainers, losers, volumeLeaders] = await Promise.all([
          marketService.getTopGainers(),
          marketService.getTopLosers(),
          marketService.getVolumeLeaders()
        ]);
        
        setMarketData({
          topGainers: gainers,
          topLosers: losers,
          volumeLeaders: volumeLeaders
        });
        
        console.log('✅ Market data updated successfully');
        
      } catch (err) {
        console.error('❌ Market data error:', err);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval for live updates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      console.log('⏰ Auto-refreshing market data...');
      fetchMarketData();
    }, 15000); // Update every 15 seconds for more frequent updates

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatValue = (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formatChange = (change: number) => (change >= 0 ? '+' : '') + formatValue(change);
  const formatPercent = (percent: number) => (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';

  const getMarketStatusColor = () => {
    if (!marketHours) return 'text-gray-400';
    return marketHours.isOpen ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeAnimation = (indexName: string) => {
    const animation = priceAnimations[indexName];
    if (animation === 'up') return 'animate-pulse bg-green-400/20 border-green-400';
    if (animation === 'down') return 'animate-pulse bg-red-400/20 border-red-400';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Market Status with Live Indicator */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className={`h-5 w-5 ${getMarketStatusColor()}`} />
            <div>
              <span className="font-medium text-white">Indian Market Status: </span>
              <span className={`font-bold ${getMarketStatusColor()}`}>
                {marketHours ? (marketHours.isOpen ? 'OPEN' : 'CLOSED') : 'Loading...'}
              </span>
              {dataSource === 'live' && marketHours?.isOpen && (
                <div className="inline-flex items-center ml-2 px-2 py-1 bg-green-400/10 rounded text-green-400 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                  LIVE
                </div>
              )}
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
        
        <div className={`mt-3 flex items-center justify-between p-3 rounded ${
          dataSource === 'live' 
            ? 'text-green-400 bg-green-400/10' 
            : 'text-orange-400 bg-orange-400/10'
        }`}>
          <div className="flex items-center space-x-2">
            {dataSource === 'live' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Real-time data from Yahoo Finance • Updates every 15 seconds
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Live data unavailable • Using fallback data
                </span>
              </>
            )}
          </div>
          {lastUpdateTime && (
            <div className="text-xs opacity-75">
              Last update: {lastUpdateTime}
            </div>
          )}
        </div>
      </div>

      {/* Market Indices with Live Updates */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Indian Market Indices
          {isLoading && (
            <div className="ml-2 flex items-center text-sm text-slate-400">
              <div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full mr-1"></div>
              Updating...
            </div>
          )}
          {dataSource === 'live' && !isLoading && (
            <div className="ml-2 flex items-center text-sm text-green-400">
              <Zap className="w-4 h-4 mr-1" />
              Live Data
            </div>
          )}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div 
              key={index.name} 
              className={`bg-slate-700 rounded-lg p-4 transition-all duration-500 ${getPriceChangeAnimation(index.name)}`}
            >
              <h3 className="font-medium text-slate-300 mb-2 flex items-center justify-between">
                {index.name}
                {priceAnimations[index.name] && (
                  <div className={`w-2 h-2 rounded-full ${
                    priceAnimations[index.name] === 'up' ? 'bg-green-400' : 'bg-red-400'
                  } animate-ping`}></div>
                )}
              </h3>
              <div className="text-2xl font-bold mb-1">₹{formatValue(index.value)}</div>
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
                {dataSource === 'live' ? index.lastUpdated : 'Simulated data'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Gainers
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </h3>
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
          <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center">
            <TrendingDown className="h-5 w-5 mr-2" />
            Top Losers
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
          </h3>
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
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
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
