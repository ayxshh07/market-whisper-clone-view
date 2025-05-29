
import { Brain } from 'lucide-react';

interface SectorAnalysisHeaderProps {
  lastUpdateTime: string;
  isLoading: boolean;
  marketStatus?: 'OPEN' | 'CLOSED';
}

const SectorAnalysisHeader = ({ lastUpdateTime, isLoading, marketStatus }: SectorAnalysisHeaderProps) => {
  return (
    <div className={`rounded-lg p-4 border ${
      marketStatus === 'OPEN' 
        ? 'bg-gradient-to-r from-blue-400/10 to-purple-400/10 border-blue-400/30' 
        : 'bg-gradient-to-r from-slate-600/10 to-slate-500/10 border-slate-400/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className={`h-6 w-6 ${marketStatus === 'OPEN' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
          <div>
            <span className={`font-bold ${marketStatus === 'OPEN' ? 'text-blue-400' : 'text-slate-400'}`}>
              🤖 AI SECTOR ANALYZER {marketStatus === 'CLOSED' ? '(MARKET CLOSED)' : ''}
            </span>
            <div className={`text-sm ${marketStatus === 'OPEN' ? 'text-slate-300' : 'text-slate-400'}`}>
              {marketStatus === 'OPEN' 
                ? 'Real-time sector predictions • 1-second updates • Live analysis'
                : 'Market closed • No real-time updates • Last closing analysis'
              }
            </div>
          </div>
        </div>
        {lastUpdateTime && (
          <div className={`text-xs font-mono px-2 py-1 rounded ${
            marketStatus === 'OPEN' 
              ? 'text-blue-400 bg-blue-400/10' 
              : 'text-slate-400 bg-slate-400/10'
          }`}>
            {marketStatus === 'OPEN' ? '⚡' : '⏸️'} {lastUpdateTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorAnalysisHeader;
