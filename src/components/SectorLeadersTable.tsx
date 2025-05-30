
import { Target } from 'lucide-react';
import { type SectorData } from '../services/marketDataService';

interface SectorLeadersTableProps {
  sectorData: SectorData[];
  marketStatus?: string;
}

const SectorLeadersTable = ({ sectorData }: SectorLeadersTableProps) => {
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
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="h-5 w-5 mr-2 text-green-400" />
        🏆 Live Sector Leaders Performance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4">Sector</th>
              <th className="text-left py-3 px-4">Top Performer</th>
              <th className="text-left py-3 px-4">Change</th>
              <th className="text-left py-3 px-4">Market Cap</th>
              <th className="text-left py-3 px-4">Volume</th>
              <th className="text-left py-3 px-4">AI Prediction</th>
            </tr>
          </thead>
          <tbody>
            {sectorData.slice(0, 6).map((sector, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium">{sector.name}</td>
                <td className="py-3 px-4">{sector.leaders[0]}</td>
                <td className={`py-3 px-4 font-medium font-mono ${
                  sector.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-mono">{formatMarketCap(sector.marketCap)}</td>
                <td className="py-3 px-4 font-mono">{formatVolume(sector.volume)}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded font-bold ${getPredictionColor(sector.prediction)}`}>
                    🤖 {sector.prediction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorLeadersTable;
