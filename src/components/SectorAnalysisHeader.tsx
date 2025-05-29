
import { Brain } from 'lucide-react';

interface SectorAnalysisHeaderProps {
  lastUpdateTime: string;
  isLoading: boolean;
}

const SectorAnalysisHeader = ({ lastUpdateTime, isLoading }: SectorAnalysisHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg p-4 border border-blue-400/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-400 animate-pulse" />
          <div>
            <span className="font-bold text-blue-400">🤖 AI SECTOR ANALYZER</span>
            <div className="text-sm text-slate-300">Real-time sector predictions • 1-second updates • Live analysis</div>
          </div>
        </div>
        {lastUpdateTime && (
          <div className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded">
            ⚡ {lastUpdateTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorAnalysisHeader;
