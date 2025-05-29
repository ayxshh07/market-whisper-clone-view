
import { Zap, TrendingUp } from 'lucide-react';

interface MomentumStock {
  symbol: string;
  sector: string;
  change: number;
  price: number;
  prediction: string;
}

interface TopMomentumStocksProps {
  topStocks: MomentumStock[];
}

const TopMomentumStocks = ({ topStocks }: TopMomentumStocksProps) => {
  const getStockPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'BUY': return 'text-green-400 bg-green-400/10';
      case 'SELL': return 'text-red-400 bg-red-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-yellow-400/30">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-yellow-400 animate-pulse" />
        🚀 Top Momentum Stocks + AI
      </h3>
      <div className="space-y-3">
        {topStocks.map((stock, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-slate-400">{stock.sector}</div>
              <div className="text-sm text-slate-300 font-mono">₹{stock.price.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">
                +{stock.change.toFixed(2)}%
              </div>
              <div className="flex items-center text-green-400 mb-1">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className={`text-xs px-2 py-1 rounded font-bold ${getStockPredictionColor(stock.prediction)}`}>
                🤖 {stock.prediction}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMomentumStocks;
