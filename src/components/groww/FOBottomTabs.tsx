
import React from 'react';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';

interface FOBottomTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FOBottomTabs = ({ activeTab, onTabChange }: FOBottomTabsProps) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: BarChart3 },
    { id: 'gainers', label: 'Gainers', icon: TrendingUp },
    { id: 'losers', label: 'Losers', icon: Activity },
    { id: 'active', label: 'Active', icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FOBottomTabs;
