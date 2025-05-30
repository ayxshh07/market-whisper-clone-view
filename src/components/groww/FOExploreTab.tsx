
import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface FOExploreTabProps {
  segment: string;
  data: any;
}

const FOExploreTab = ({ segment, data }: FOExploreTabProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {segment === 'futures' ? 'Futures' : 'Options'} Explorer
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Top Gainer</p>
              <p className="text-lg font-bold text-green-900">
                {data.topGainers?.[0]?.symbol || 'NIFTY'}
              </p>
              <p className="text-sm text-green-700">
                +{data.topGainers?.[0]?.change || '2.45'}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Top Loser</p>
              <p className="text-lg font-bold text-red-900">
                {data.topLosers?.[0]?.symbol || 'BANKNIFTY'}
              </p>
              <p className="text-sm text-red-700">
                -{data.topLosers?.[0]?.change || '1.85'}%
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Most Active</p>
              <p className="text-lg font-bold text-blue-900">
                {data.mostActive?.[0]?.symbol || 'RELIANCE'}
              </p>
              <p className="text-sm text-blue-700">
                {data.mostActive?.[0]?.volume || '12.5M'} Vol
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Contracts</p>
              <p className="text-lg font-bold text-purple-900">
                {data.totalContracts || '2,847'}
              </p>
              <p className="text-sm text-purple-700">Active Today</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 px-4 py-3">
            <h3 className="font-semibold text-green-900 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Top Gainers
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {(data.topGainers || []).slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.symbol}</p>
                    <p className="text-sm text-gray-500">{item.expiry}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{item.ltp}</p>
                    <p className="text-sm text-green-600 font-medium">
                      +{item.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <h3 className="font-semibold text-red-900 flex items-center">
              <TrendingDown className="h-4 w-4 mr-2" />
              Top Losers
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {(data.topLosers || []).slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.symbol}</p>
                    <p className="text-sm text-gray-500">{item.expiry}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{item.ltp}</p>
                    <p className="text-sm text-red-600 font-medium">
                      -{item.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Contracts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">All {segment === 'futures' ? 'Futures' : 'Options'} Contracts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expiry</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">LTP</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Change</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(data.stocks || []).map((stock: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{stock.symbol}</td>
                  <td className="py-3 px-4 text-gray-600">{stock.expiry}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{stock.ltp}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">{stock.volume}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{stock.oi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FOExploreTab;
