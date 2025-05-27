
import { useState } from 'react';
import { TrendingUp, BarChart3, Target, Activity } from 'lucide-react';
import MarketPulse from '../components/MarketPulse';
import InsiderStrategy from '../components/InsiderStrategy';
import SectorScope from '../components/SectorScope';

const Index = () => {
  const [activeTab, setActiveTab] = useState('market-pulse');

  const tabs = [
    { id: 'market-pulse', label: 'Market Pulse', icon: Activity },
    { id: 'insider-strategy', label: 'Insider Strategy', icon: Target },
    { id: 'sector-scope', label: 'Sector Scope', icon: BarChart3 },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'market-pulse':
        return <MarketPulse />;
      case 'insider-strategy':
        return <InsiderStrategy />;
      case 'sector-scope':
        return <SectorScope />;
      default:
        return <MarketPulse />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <h1 className="text-2xl font-bold">TradeFinder Clone</h1>
          </div>
          <div className="text-sm text-slate-400">
            Live Market Analysis • Free Personal Use
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-green-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default Index;
