
import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Search, Bell, User, Menu } from 'lucide-react';
import FOHeader from '../components/groww/FOHeader';
import FOSidebar from '../components/groww/FOSidebar';
import FOMainContent from '../components/groww/FOMainContent';
import FOBottomTabs from '../components/groww/FOBottomTabs';
import { GrowwDataService } from '../services/growwDataService';

const GrowwClone = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedSegment, setSelectedSegment] = useState('futures');
  const [foData, setFoData] = useState<any>({
    topGainers: [],
    topLosers: [],
    mostActive: [],
    indices: [],
    stocks: []
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const growwService = new GrowwDataService();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await growwService.getFOData(selectedSegment);
        setFoData(data);
      } catch (error) {
        console.error('Error fetching F&O data:', error);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedSegment]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <FOHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        selectedSegment={selectedSegment}
        onSegmentChange={setSelectedSegment}
      />

      <div className="flex">
        {/* Sidebar */}
        <FOSidebar 
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <FOMainContent
            activeTab={activeTab}
            selectedSegment={selectedSegment}
            foData={foData}
            loading={loading}
          />
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <FOBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default GrowwClone;
