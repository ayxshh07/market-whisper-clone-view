
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { type SectorData } from '../services/marketDataService';

interface LiveSectorPerformanceProps {
  sectorData: SectorData[];
  isLoading: boolean;
  marketStatus?: 'OPEN' | 'CLOSED';
}

const LiveSectorPerformance = ({ sectorData, isLoading, marketStatus }: LiveSectorPerformanceProps) => {
  const getSectorColor = (change: number) => {
    if (change > 0) return 'text-green-400 bg-green-400/10';
    if (change < 0) return 'text-red-400 bg-red-400/10';
    return 'text-yellow-400 bg-yellow-400/10';
  };

  const getSectorIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'BULLISH': return 'text-green-400 bg-green-400/20';
      case 'BEARISH': return 'text-red-400 bg-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  const formatMarketCap = (value: number) => {
    return `₹${(value / 10000).toFixed(1)}T`;
  };

  const formatVolume = (value: number) => {
    return `₹${value.toFixed(0)}Cr`;
  };

  return (
    <div className={`bg-slate-800 rounded-lg p-6 border ${
      marketStatus === 'OPEN' ? 'border-green-400/30' : 'border-slate-600'
    }`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart3 className={`h-5 w-5 mr-2 ${marketStatus === 'OPEN' ? 'text-green-400' : 'text-slate-400'}`} />
        📊 {marketStatus === 'OPEN' ? 'LIVE' : 'CLOSED'} Sector Performance with AI Predictions
        {isLoading && (
          <div className={`ml-2 flex items-center text-sm ${marketStatus === 'OPEN' ? 'text-blue-400' : 'text-slate-400'}`}>
            <div className={`animate-spin w-4 h-4 border-2 border-t-transparent rounded-full mr-1 ${
              marketStatus === 'OPEN' ? 'border-blue-400' : 'border-slate-400'
            }`}></div>
            {marketStatus === 'OPEN' ? 'Analyzing...' : 'Status check...'}
          </div>
        )}
        {marketStatus === 'CLOSED' && !isLoading && (
          <div className="ml-2 flex items-center text-sm text-slate-400">
            <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
            MARKET CLOSED
          </div>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sectorData.map((sector, index) => (
          <div key={index} className={`bg-slate-700 rounded-lg p-4 border transition-all ${
            marketStatus === 'OPEN' 
              ? 'border-slate-600 hover:border-blue-400/50' 
              : 'border-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{sector.name}</h3>
              <div className="flex items-center space-x-1">
                {getSectorIcon(sector.change)}
                {marketStatus === 'OPEN' && (
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            <div className={`text-2xl font-bold mb-2 font-mono ${getSectorColor(sector.change).split(' ')[0]}`}>
              {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
            </div>
            
            <div className={`text-xs px-2 py-1 rounded mb-2 font-bold ${getPredictionColor(sector.prediction)}`}>
              🤖 AI: {sector.prediction}
            </div>
            
            <div className="space-y-1 text-xs text-slate-400">
              <div>MCap: {formatMarketCap(sector.marketCap)}</div>
              <div>Volume: {formatVolume(sector.volume)}</div>
              <div>Momentum: {sector.momentum?.toFixed(1) || 'N/A'}</div>
              <div>Volatility: {sector.volatility?.toFixed(1) || 'N/A'}</div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {sector.leaders.slice(0, 2).map((leader, idx) => (
                <span key={idx} className={`text-xs px-2 py-1 rounded transition-colors ${
                  marketStatus === 'OPEN' 
                    ? 'bg-slate-600 hover:bg-blue-600' 
                    : 'bg-slate-600'
                }`}>
                  {leader}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSectorPerformance;
