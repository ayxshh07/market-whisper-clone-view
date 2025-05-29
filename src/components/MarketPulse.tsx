
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
        console.log('🔄 Fetching LIVE market data every second...');
        setIsLoading(true);
        
        // Get market hours
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        
        // Store previous indices for comparison
        setPreviousIndices(indices);
        
        // Get ultra-fresh index data
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
        
        // Get enhanced stock data with better accuracy
        console.log('📊 Fetching enhanced stock market data...');
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
        
        console.log('✅ Enhanced market data updated - Real-time stock lists');
        
      } catch (err) {
        console.error('❌ Market data error:', err);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval for ULTRA-FAST live updates (1 second)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      console.log('⚡ LIVE 1-second market update...');
      fetchMarketData();
    }, 1000); // Update every 1 second for real-time trading

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
      {/* Market Status with Ultra-Live Indicator */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className={`h-5 w-5 ${getMarketStatusColor()}`} />
            <div>
              <span className="font-medium text-white">Indian Market Status: </span>
              <span className={`font-bold ${getMarketStatusColor()}`}>
                {marketHours ? (marketHours.isOpen ? 'LIVE TRADING' : 'CLOSED') : 'Loading...'}
              </span>
              {dataSource === 'live' && marketHours?.isOpen && (
                <div className="inline-flex items-center ml-2 px-3 py-1 bg-green-400/20 rounded-full text-green-400 text-xs font-bold">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-2"></div>
                  REAL-TIME • 1s UPDATES
                </div>
              )}
            </div>
          </div>
          {marketHours && (
            <div className="text-sm text-slate-400">
              {marketHours.isOpen 
                ? `Live until ${marketHours.nextClose} ${marketHours.timezone}`
                : `Opens at ${marketHours.nextOpen} ${marketHours.timezone}`
              }
            </div>
          )}
        </div>
        
        <div className={`mt-3 flex items-center justify-between p-3 rounded-lg border-2 ${
          dataSource === 'live' 
            ? 'text-green-400 bg-green-400/10 border-green-400/30' 
            : 'text-orange-400 bg-orange-400/10 border-orange-400/30'
        }`}>
          <div className="flex items-center space-x-2">
            {dataSource === 'live' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  🚀 ENHANCED LIVE DATA • Yahoo Finance API • Enhanced Stock Lists
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Enhanced fallback data • Realistic simulations
                </span>
              </>
            )}
          </div>
          {lastUpdateTime && (
            <div className="text-xs opacity-75 font-mono bg-black/20 px-2 py-1 rounded">
              ⚡ {lastUpdateTime}
            </div>
          )}
        </div>
      </div>

      {/* Market Indices with Ultra-Live Updates */}
      <div className="bg-slate-800 rounded-lg p-6 border-2 border-green-400/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          🔥 LIVE Indian Market Indices
          {isLoading && (
            <div className="ml-2 flex items-center text-sm text-slate-400">
              <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full mr-1"></div>
              Fetching...
            </div>
          )}
          {dataSource === 'live' && !isLoading && (
            <div className="ml-2 flex items-center text-sm text-green-400">
              <Zap className="w-4 h-4 mr-1 animate-pulse" />
              REAL-TIME
            </div>
          )}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div 
              key={index.name} 
              className={`bg-slate-700 rounded-lg p-4 transition-all duration-300 border-2 ${
                getPriceChangeAnimation(index.name) || 'border-slate-600'
              }`}
            >
              <h3 className="font-medium text-slate-300 mb-2 flex items-center justify-between">
                {index.name}
                <div className="flex items-center space-x-1">
                  {priceAnimations[index.name] && (
                    <div className={`w-2 h-2 rounded-full animate-ping ${
                      priceAnimations[index.name] === 'up' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  )}
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </h3>
              <div className="text-2xl font-bold mb-1 font-mono">₹{formatValue(index.value)}</div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${
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
              <div className="text-xs text-slate-500 mt-1 font-mono">
                {dataSource === 'live' ? `Live • ${index.lastUpdated}` : 'Enhanced data'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Stock Lists with Better Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-slate-800 rounded-lg p-6 border border-green-400/30">
          <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            📈 Top Gainers
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
            {isLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
            )}
          </h3>
          <div className="space-y-3">
            {marketData.topGainers.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors">
                <div>
                  <div className="font-medium text-white">{stock.symbol}</div>
                  <div className="text-sm text-slate-400 font-mono">₹{formatValue(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    +{formatValue(stock.change)}
                  </div>
                  <div className="text-green-400 text-sm font-semibold">
                    +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
            {marketData.topGainers.length === 0 && !isLoading && (
              <div className="text-slate-400 text-center py-4">Loading gainers...</div>
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-slate-800 rounded-lg p-6 border border-red-400/30">
          <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center">
            <TrendingDown className="h-5 w-5 mr-2" />
            📉 Top Losers
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
            {isLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
            )}
          </h3>
          <div className="space-y-3">
            {marketData.topLosers.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors">
                <div>
                  <div className="font-medium text-white">{stock.symbol}</div>
                  <div className="text-sm text-slate-400 font-mono">₹{formatValue(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold">
                    {formatValue(stock.change)}
                  </div>
                  <div className="text-red-400 text-sm font-semibold">
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
            {marketData.topLosers.length === 0 && !isLoading && (
              <div className="text-slate-400 text-center py-4">Loading losers...</div>
            )}
          </div>
        </div>

        {/* Volume Leaders */}
        <div className="bg-slate-800 rounded-lg p-6 border border-blue-400/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Volume2 className="h-5 w-5 mr-2 text-blue-400" />
            📊 Volume Leaders
            {dataSource === 'live' && (
              <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
            {isLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            )}
          </h3>
          <div className="space-y-3">
            {marketData.volumeLeaders.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors">
                <div>
                  <div className="font-medium text-white">{stock.symbol}</div>
                  <div className="text-sm text-blue-400 font-semibold">{stock.volume}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white font-mono">₹{stock.value.toFixed(2)}Cr</div>
                  <div className="text-xs text-slate-400">Turnover</div>
                </div>
              </div>
            ))}
            {marketData.volumeLeaders.length === 0 && !isLoading && (
              <div className="text-slate-400 text-center py-4">Loading volume data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
