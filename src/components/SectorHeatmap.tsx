
import { Target } from 'lucide-react';
import { type SectorData } from '../services/marketDataService';

interface SectorHeatmapProps {
  sectorData: SectorData[];
}

const SectorHeatmap = ({ sectorData }: SectorHeatmapProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="h-5 w-5 mr-2 text-purple-400" />
        🔥 Live Sector Heatmap
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {sectorData.map((sector, index) => {
          const intensity = Math.abs(sector.change) / 5;
          const opacity = Math.min(0.9, Math.max(0.3, intensity));
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
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
              <div className="text-white text-xs mt-1">
                {sector.prediction}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorHeatmap;
