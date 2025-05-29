
import { Brain } from 'lucide-react';

interface VolumeStock {
  symbol: string;
  sector: string;
  volume: string;
  turnover: number;
  prediction: string;
}

interface VolumeLeadersProps {
  topStocks: VolumeStock[];
}

const VolumeLeaders = ({ topStocks }: VolumeLeadersProps) => {
  const getStockPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'BUY': return 'text-green-400 bg-green-400/10';
      case 'SELL': return 'text-red-400 bg-red-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-blue-400/30">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-blue-400" />
        📈 Volume Leaders + AI
      </h3>
      <div className="space-y-3">
        {topStocks.map((stock, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-slate-400">{stock.sector}</div>
              <div className="text-sm text-blue-400">{stock.volume} shares</div>
            </div>
            <div className="text-right">
              <div className="font-medium font-mono">₹{stock.turnover.toFixed(0)}Cr</div>
              <div className="text-sm text-slate-400 mb-1">Turnover</div>
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

export default VolumeLeaders;
