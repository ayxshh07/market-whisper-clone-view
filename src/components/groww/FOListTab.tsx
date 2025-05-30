
import React from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Users } from 'lucide-react';

interface FOListTabProps {
  title: string;
  data: any[];
  type: string;
}

const FOListTab = ({ title, data, type }: FOListTabProps) => {
  const getIcon = () => {
    switch (type) {
      case 'gainers': return TrendingUp;
      case 'losers': return TrendingDown;
      case 'active': return Activity;
      case 'volatility': return Zap;
      case 'volume': return Users;
      default: return Activity;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'gainers': return 'green';
      case 'losers': return 'red';
      case 'active': return 'blue';
      case 'volatility': return 'yellow';
      case 'volume': return 'purple';
      default: return 'blue';
    }
  };

  const Icon = getIcon();
  const color = getColor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 text-${color}-600`} />
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expiry</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">LTP</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Change</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-600">#{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{item.symbol}</td>
                  <td className="py-3 px-4 text-gray-600">{item.expiry}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{item.ltp}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">{item.volume}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{item.oi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FOListTab;
