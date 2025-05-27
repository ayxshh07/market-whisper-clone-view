
import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const InsiderStrategy = () => {
  const [signals, setSignals] = useState([
    {
      id: 1,
      symbol: 'RELIANCE',
      action: 'BUY',
      price: 2567.35,
      target: 2750.00,
      stopLoss: 2450.00,
      confidence: 85,
      timeframe: '1-2 weeks',
      reason: 'Bullish divergence on RSI, Volume breakout',
      status: 'active'
    },
    {
      id: 2,
      symbol: 'INFY',
      action: 'BUY',
      price: 1456.90,
      target: 1580.00,
      stopLoss: 1380.00,
      confidence: 78,
      timeframe: '2-3 weeks',
      reason: 'Golden cross formation, Strong fundamentals',
      status: 'active'
    },
    {
      id: 3,
      symbol: 'HDFC',
      action: 'SELL',
      price: 1678.25,
      target: 1550.00,
      stopLoss: 1720.00,
      confidence: 72,
      timeframe: '1 week',
      reason: 'Head and shoulders pattern, Weak momentum',
      status: 'active'
    },
    {
      id: 4,
      symbol: 'TATAMOTORS',
      action: 'BUY',
      price: 756.20,
      target: 825.00,
      stopLoss: 720.00,
      confidence: 90,
      timeframe: '2-4 weeks',
      reason: 'Ascending triangle breakout, High volume',
      status: 'completed'
    }
  ]);

  const [technicalIndicators, setTechnicalIndicators] = useState([
    { name: 'RSI (14)', value: 67.45, signal: 'Neutral', color: 'text-yellow-400' },
    { name: 'MACD', value: 1.23, signal: 'Bullish', color: 'text-green-400' },
    { name: 'Stochastic', value: 78.90, signal: 'Overbought', color: 'text-red-400' },
    { name: 'Williams %R', value: -25.67, signal: 'Bullish', color: 'text-green-400' },
    { name: 'CCI', value: 145.23, signal: 'Overbought', color: 'text-red-400' },
    { name: 'ADX', value: 32.15, signal: 'Strong Trend', color: 'text-green-400' }
  ]);

  const [marketSentiment, setMarketSentiment] = useState({
    overall: 'Bullish',
    bullish: 65,
    bearish: 35,
    fear_greed: 72
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicalIndicators(prev => 
        prev.map(indicator => ({
          ...indicator,
          value: indicator.value + (Math.random() - 0.5) * 2
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalIcon = (action: string) => {
    if (action === 'BUY') return <TrendingUp className="h-4 w-4 text-green-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  const getSignalColor = (action: string) => {
    return action === 'BUY' ? 'text-green-400' : 'text-red-400';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Market Sentiment */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-400" />
          Market Sentiment Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Overall Sentiment</h3>
            <div className="text-2xl font-bold text-green-400">{marketSentiment.overall}</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Bull vs Bear</h3>
            <div className="flex items-center space-x-4">
              <div className="text-green-400 font-bold">{marketSentiment.bullish}%</div>
              <div className="flex-1 bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${marketSentiment.bullish}%` }}
                />
              </div>
              <div className="text-red-400 font-bold">{marketSentiment.bearish}%</div>
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Fear & Greed Index</h3>
            <div className="text-2xl font-bold text-green-400">{marketSentiment.fear_greed}</div>
            <div className="text-sm text-slate-400">Greed Zone</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Signals */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Active Trading Signals</h3>
          <div className="space-y-4">
            {signals.filter(signal => signal.status === 'active').map((signal) => (
              <div key={signal.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getSignalIcon(signal.action)}
                    <span className="font-bold">{signal.symbol}</span>
                    <span className={`font-medium ${getSignalColor(signal.action)}`}>
                      {signal.action}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}% confidence
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-slate-400">Entry</div>
                    <div className="font-medium">₹{signal.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Target</div>
                    <div className="font-medium text-green-400">₹{signal.target.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Stop Loss</div>
                    <div className="font-medium text-red-400">₹{signal.stopLoss.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 mb-2">
                  <strong>Timeframe:</strong> {signal.timeframe}
                </div>
                <div className="text-sm text-slate-300">
                  <strong>Reason:</strong> {signal.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
          <div className="space-y-4">
            {technicalIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{indicator.name}</div>
                  <div className="text-2xl font-bold">{indicator.value.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${indicator.color}`}>
                    {indicator.signal}
                  </div>
                  {indicator.signal === 'Bullish' && <CheckCircle className="h-5 w-5 text-green-400 ml-auto mt-1" />}
                  {indicator.signal === 'Bearish' && <AlertTriangle className="h-5 w-5 text-red-400 ml-auto mt-1" />}
                  {indicator.signal === 'Overbought' && <AlertTriangle className="h-5 w-5 text-yellow-400 ml-auto mt-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Completed Signals */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Completed Signals</h3>
        <div className="space-y-3">
          {signals.filter(signal => signal.status === 'completed').map((signal) => (
            <div key={signal.id} className="bg-slate-700 rounded-lg p-4 opacity-75">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="font-bold">{signal.symbol}</span>
                  <span className={`font-medium ${getSignalColor(signal.action)}`}>
                    {signal.action}
                  </span>
                  <span className="text-slate-400">@ ₹{signal.price.toFixed(2)}</span>
                </div>
                <div className="text-green-400 font-medium">
                  Target Achieved
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsiderStrategy;
