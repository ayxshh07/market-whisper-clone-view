
import React from 'react';
import { Search, Bell, User, Menu, TrendingUp } from 'lucide-react';

interface FOHeaderProps {
  onMenuClick: () => void;
  selectedSegment: 'futures' | 'options';
  onSegmentChange: (segment: 'futures' | 'options') => void;
}

const FOHeader = ({ onMenuClick, selectedSegment, onSegmentChange }: FOHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">Groww F&O</span>
          </div>
        </div>

        {/* Center - Segment Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onSegmentChange('futures')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedSegment === 'futures'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Futures
          </button>
          <button
            onClick={() => onSegmentChange('options')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedSegment === 'options'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Options
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default FOHeader;
