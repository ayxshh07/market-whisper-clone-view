
import React from 'react';
import FOExploreTab from './FOExploreTab';
import FOListTab from './FOListTab';
import FOLoader from './FOLoader';

interface FOMainContentProps {
  activeTab: string;
  selectedSegment: string;
  foData: any;
  loading: boolean;
}

const FOMainContent = ({ activeTab, selectedSegment, foData, loading }: FOMainContentProps) => {
  if (loading) {
    return <FOLoader />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <FOExploreTab segment={selectedSegment} data={foData} />;
      case 'gainers':
        return <FOListTab title="Top Gainers" data={foData.topGainers} type="gainers" />;
      case 'losers':
        return <FOListTab title="Top Losers" data={foData.topLosers} type="losers" />;
      case 'active':
        return <FOListTab title="Most Active" data={foData.mostActive} type="active" />;
      case 'volatility':
        return <FOListTab title="High Volatility" data={foData.volatility} type="volatility" />;
      case 'volume':
        return <FOListTab title="High Volume" data={foData.volume} type="volume" />;
      default:
        return <FOExploreTab segment={selectedSegment} data={foData} />;
    }
  };

  return (
    <main className="p-4 pb-20 lg:pb-4">
      {renderContent()}
    </main>
  );
};

export default FOMainContent;
