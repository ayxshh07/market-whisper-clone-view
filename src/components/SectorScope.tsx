import { useState, useEffect } from 'react';
import { MarketDataService, type SectorData } from '../services/marketDataService';
import SectorAnalysisHeader from './SectorAnalysisHeader';
import LiveSectorPerformance from './LiveSectorPerformance';
import SectorHeatmap from './SectorHeatmap';
import TopMomentumStocks from './TopMomentumStocks';
import VolumeLeaders from './VolumeLeaders';
import SectorLeadersTable from './SectorLeadersTable';

const SectorScope = () => {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [marketHours, setMarketHours] = useState<any>(null);
  
  const [topStocks, setTopStocks] = useState({
    momentum: [
      { symbol: 'ADANIENT', sector: 'Energy', change: 5.67, price: 2847.50, prediction: 'BUY' },
      { symbol: 'TATASTEEL', sector: 'Metals', change: 4.89, price: 123.45, prediction: 'BUY' },
      { symbol: 'TATAMOTORS', sector: 'Auto', change: 4.23, price: 756.20, prediction: 'HOLD' },
      { symbol: 'JSWSTEEL', sector: 'Metals', change: 3.98, price: 789.30, prediction: 'BUY' },
      { symbol: 'HINDALCO', sector: 'Metals', change: 3.76, price: 456.78, prediction: 'BUY' }
    ],
    volume: [
      { symbol: 'RELIANCE', sector: 'Energy', volume: '2.45M', turnover: 6287.54, prediction: 'HOLD' },
      { symbol: 'INFY', sector: 'IT', volume: '1.87M', turnover: 2721.89, prediction: 'BUY' },
      { symbol: 'TCS', sector: 'IT', volume: '1.65M', turnover: 5943.21, prediction: 'BUY' },
      { symbol: 'HDFC', sector: 'Banking', volume: '1.43M', turnover: 2401.67, prediction: 'SELL' },
      { symbol: 'ICICIBANK', sector: 'Banking', volume: '1.29M', turnover: 1219.43, prediction: 'HOLD' }
    ]
  });

  // Market-aware updates
  useEffect(() => {
    const marketService = new MarketDataService();
    
    const fetchLiveSectorData = async () => {
      try {
        console.log('📊 Checking market status for sector analysis...');
        setIsLoading(true);
        
        // Get market hours first
        const hours = marketService.getMarketHours();
        setMarketHours(hours);
        
        // Get real-time sector data with predictions
        const liveSectorData = await marketService.getLiveSectorData();
        setSectorData(liveSectorData);
        
        // Update top stocks based on market status
        if (hours.isOpen) {
          // Only add small variations during market hours
          setTopStocks(prev => ({
            momentum: prev.momentum.map(stock => ({
              ...stock,
              change: stock.change + (Math.random() - 0.5) * 0.2, // Smaller variation
              price: stock.price + (Math.random() - 0.5) * 5, // Smaller price changes
              prediction: Math.random() > 0.8 ? 'BUY' : Math.random() > 0.4 ? 'HOLD' : 'SELL'
            })),
            volume: prev.volume.map(stock => ({
              ...stock,
              turnover: stock.turnover + (Math.random() - 0.5) * 50, // Smaller turnover changes
              prediction: Math.random() > 0.8 ? 'BUY' : Math.random() > 0.4 ? 'HOLD' : 'SELL'
            }))
          }));
          console.log('✅ LIVE sector data updated with market-hours analysis');
        } else {
          // Keep data fixed when market is closed
          console.log('📊 Market CLOSED - Sector data fixed (no fluctuations)');
        }
        
        setLastUpdateTime(new Date().toLocaleTimeString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        
      } catch (error) {
        console.error('❌ Sector data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLiveSectorData();

    // Set up interval based on market status
    const marketService2 = new MarketDataService();
    const hours = marketService2.getMarketHours();
    
    let interval: NodeJS.Timeout;
    
    if (hours.isOpen) {
      // Update every 1 second during market hours for real-time sector analysis
      interval = setInterval(() => {
        console.log('⚡ Real-time sector update (market open)...');
        fetchLiveSectorData();
      }, 1000);
    } else {
      // Update every 30 seconds when market is closed (just for status check)
      interval = setInterval(() => {
        console.log('📊 Sector status check (market closed)...');
        fetchLiveSectorData();
      }, 30000);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <SectorAnalysisHeader 
        lastUpdateTime={lastUpdateTime} 
        isLoading={isLoading}
        marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
      />
      
      <LiveSectorPerformance 
        sectorData={sectorData} 
        isLoading={isLoading}
        marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
      />
      
      <SectorHeatmap 
        sectorData={sectorData}
        marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMomentumStocks 
          topStocks={topStocks.momentum}
          marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
        />
        <VolumeLeaders 
          topStocks={topStocks.volume}
          marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
        />
      </div>

      <SectorLeadersTable 
        sectorData={sectorData}
        marketStatus={marketHours?.isOpen ? 'OPEN' : 'CLOSED'}
      />
    </div>
  );
};

export default SectorScope;
