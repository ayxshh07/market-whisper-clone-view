
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
        console.log('🔄 Fetching market data...');
        setIsLoading(true);
        
        // Get market hours first
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        
        // Store previous indices for comparison (only during market hours)
        if (hours.isOpen) {
          setPreviousIndices(indices);
        }
        
        // Get index data
        const indexData = await marketService.getIndexData();
        
        // Detect price changes and trigger animations (only during market hours)
        if (hours.isOpen) {
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
        } else {
          // Clear animations when market is closed
          setPriceAnimations({});
        }
        
        setIndices(indexData);
        setLastUpdateTime(new Date().toLocaleTimeString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        
        // Check if we got real data
        const hasRealData = indexData.some(index => 
          index.lastUpdated === 'LIVE'
        );
        setDataSource(hasRealData ? 'live' : 'fallback');
        
        // Get stock data
        console.log(`📊 Fetching stock market data... Market Status: ${hours.isOpen ? 'OPEN' : 'CLOSED'}`);
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
        
        if (hours.isOpen) {
          console.log('✅ LIVE market data updated - Real-time trading session');
        } else {
          console.log('📊 Market CLOSED - Showing last closing data (NO fluctuations)');
        }
        
      } catch (err) {
        console.error('❌ Market data error:', err);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval based on market status
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Check market status and set appropriate interval
    const marketService2 = new MarketDataService();
    const hours = marketService2.getMarketHours();
    
    if (hours.isOpen) {
      // Update every 1 second during market hours for live data
      intervalRef.current = setInterval(() => {
        console.log('⚡ LIVE 1-second market update...');
        fetchMarketData();
      }, 1000);
    } else {
      // Update every 30 seconds when market is closed (just to refresh market status)
      intervalRef.current = setInterval(() => {
        console.log('📊 Market closed status check...');
        fetchMarketData();
      }, 30000);
    }

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
      {/* Market Status with Accurate Live Indicator */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className={`h-5 w-5 ${getMarketStatusColor()}`} />
            <div>
              <span className="font-medium text-white">Indian Market Status: </span>
              <span className={`font-bold ${getMarketStatusColor()}`}>
                {marketHours ? (marketHours.isOpen ? 'LIVE TRADING' : 'CLOSED') : 'Loading...'}
              </span>
              {marketHours?.isOpen && (
                <div className="inline-flex items-center ml-2 px-3 py-1 bg-green-400/20 rounded-full text-green-400 text-xs font-bold">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-2"></div>
                  REAL-TIME • 1s UPDATES
                </div>
              )}
              {marketHours && !marketHours.isOpen && (
                <div className="inline-flex items-center ml-2 px-3 py-1 bg-red-400/20 rounded-full text-red-400 text-xs font-bold">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  MARKET CLOSED • NO FLUCTUATIONS
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
          marketHours?.isOpen 
            ? 'text-green-400 bg-green-400/10 border-green-400/30' 
            : 'text-red-400 bg-red-400/10 border-red-400/30'
        }`}>
          <div className="flex items-center space-x-2">
            {marketHours?.isOpen ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  🚀 LIVE DATA • Yahoo Finance API • Real-time Updates
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  📊 MARKET CLOSED • Last Closing Data • No Fluctuations
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

      {/* Market Indices with Accurate Live Updates */}
      <div className={`bg-slate-800 rounded-lg p-6 border-2 ${
        marketHours?.isOpen ? 'border-green-400/20' : 'border-slate-600'
      }`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className={`h-5 w-5 mr-2 ${marketHours?.isOpen ? 'text-green-400' : 'text-slate-400'}`} />
          {marketHours?.isOpen ? '🔥 LIVE Indian Market Indices' : '📊 Indian Market Indices (Closed)'}
          {isLoading && (
            <div className="ml-2 flex items-center text-sm text-slate-400">
              <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full mr-1"></div>
              Updating...
            </div>
          )}
          {marketHours?.isOpen && !isLoading && (
            <div className="ml-2 flex items-center text-sm text-green-400">
              <Zap className="w-4 h-4 mr-1 animate-pulse" />
              REAL-TIME
            </div>
          )}
          {marketHours && !marketHours.isOpen && !isLoading && (
            <div className="ml-2 flex items-center text-sm text-slate-400">
              <Clock className="w-4 h-4 mr-1" />
              CLOSED
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
                  {marketHours?.isOpen && priceAnimations[index.name] && (
                    <div className={`w-2 h-2 rounded-full animate-ping ${
                      priceAnimations[index.name] === 'up' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  )}
                  {marketHours?.isOpen && (
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  )}
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
                {index.lastUpdated === 'LIVE' ? '🔴 LIVE' : 
                 index.lastUpdated === 'Market Closed' ? '⏸️ Closed' : 
                 index.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accurate Stock Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className={`bg-slate-800 rounded-lg p-6 border ${
          marketHours?.isOpen ? 'border-green-400/30' : 'border-slate-600'
        }`}>
          <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            📈 Top Gainers
            {marketHours?.isOpen && (
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
              <div className="text-slate-400 text-center py-4">
                {marketHours?.isOpen ? 'Loading gainers...' : 'Market closed - No new gainers'}
              </div>
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div className={`bg-slate-800 rounded-lg p-6 border ${
          marketHours?.isOpen ? 'border-red-400/30' : 'border-slate-600'
        }`}>
          <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center">
            <TrendingDown className="h-5 w-5 mr-2" />
            📉 Top Losers
            {marketHours?.isOpen && (
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
              <div className="text-slate-400 text-center py-4">
                {marketHours?.isOpen ? 'Loading losers...' : 'Market closed - No new losers'}
              </div>
            )}
          </div>
        </div>

        {/* Volume Leaders */}
        <div className={`bg-slate-800 rounded-lg p-6 border ${
          marketHours?.isOpen ? 'border-blue-400/30' : 'border-slate-600'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Volume2 className={`h-5 w-5 mr-2 ${marketHours?.isOpen ? 'text-blue-400' : 'text-slate-400'}`} />
            📊 Volume Leaders
            {marketHours?.isOpen && (
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
                  <div className={`text-sm font-semibold ${marketHours?.isOpen ? 'text-blue-400' : 'text-slate-400'}`}>{stock.volume}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white font-mono">₹{stock.value.toFixed(2)}Cr</div>
                  <div className="text-xs text-slate-400">Turnover</div>
                </div>
              </div>
            ))}
            {marketData.volumeLeaders.length === 0 && !isLoading && (
              <div className="text-slate-400 text-center py-4">
                {marketHours?.isOpen ? 'Loading volume data...' : 'Market closed - No volume updates'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
