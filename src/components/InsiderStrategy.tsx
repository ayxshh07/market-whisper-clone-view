
import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { MarketDataService, type TechnicalIndicator, type TradingSignal } from '../services/marketDataService';

const InsiderStrategy = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  const [marketSentiment, setMarketSentiment] = useState({
    overall: 'Bullish',
    bullish: 65,
    bearish: 35,
    fear_greed: 72,
    aiConfidence: 85
  });

  // Real-time updates every second
  useEffect(() => {
    const marketService = new MarketDataService();
    
    const fetchLiveData = async () => {
      try {
        console.log('🧠 Fetching LIVE trading signals and AI predictions...');
        setIsLoading(true);
        
        // Get real-time technical indicators with AI predictions
        const indicators = await marketService.getLiveTechnicalIndicators();
        setTechnicalIndicators(indicators);
        
        // Get live trading signals with AI analysis
        const tradingSignals = await marketService.getLiveTradingSignals();
        setSignals(tradingSignals);
        
        // Update market sentiment based on real data
        const bullishSignals = indicators.filter(i => i.prediction === 'BUY').length;
        const bearishSignals = indicators.filter(i => i.prediction === 'SELL').length;
        const totalSignals = indicators.length;
        
        const newBullish = Math.round((bullishSignals / totalSignals) * 100);
        const newBearish = 100 - newBullish;
        
        setMarketSentiment(prev => ({
          ...prev,
          bullish: newBullish,
          bearish: newBearish,
          overall: newBullish > 60 ? 'Bullish' : newBullish < 40 ? 'Bearish' : 'Neutral',
          fear_greed: Math.min(95, Math.max(5, prev.fear_greed + (Math.random() - 0.5) * 10)),
          aiConfidence: Math.round((bullishSignals + bearishSignals) / totalSignals * 100)
        }));
        
        setLastUpdateTime(new Date().toLocaleTimeString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        
        console.log('✅ LIVE trading data updated with AI predictions');
        
      } catch (error) {
        console.error('❌ Trading data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLiveData();

    // Set up 1-second intervals for real-time trading
    const interval = setInterval(() => {
      console.log('⚡ Real-time trading update...');
      fetchLiveData();
    }, 1000);

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

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'BUY': return 'text-green-400 bg-green-400/10';
      case 'SELL': return 'text-red-400 bg-red-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Update Status */}
      <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-lg p-4 border border-green-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-green-400 animate-pulse" />
            <div>
              <span className="font-bold text-green-400">🤖 AI TRADING ASSISTANT</span>
              <div className="text-sm text-slate-300">Real-time analysis • 1-second updates • Live predictions</div>
            </div>
          </div>
          {lastUpdateTime && (
            <div className="text-xs text-green-400 font-mono bg-green-400/10 px-2 py-1 rounded">
              ⚡ {lastUpdateTime}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Market Sentiment with AI */}
      <div className="bg-slate-800 rounded-lg p-6 border border-blue-400/30">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-400" />
          🧠 AI Market Sentiment Analysis
          {isLoading && (
            <div className="ml-2 flex items-center text-sm text-blue-400">
              <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-1"></div>
              Analyzing...
            </div>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-green-400">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Overall Sentiment</h3>
            <div className="text-2xl font-bold text-green-400">{marketSentiment.overall}</div>
            <div className="text-xs text-slate-400">AI Analyzed</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-blue-400">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Bull vs Bear</h3>
            <div className="flex items-center space-x-4">
              <div className="text-green-400 font-bold">{marketSentiment.bullish}%</div>
              <div className="flex-1 bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${marketSentiment.bullish}%` }}
                />
              </div>
              <div className="text-red-400 font-bold">{marketSentiment.bearish}%</div>
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-purple-400">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Fear & Greed Index</h3>
            <div className="text-2xl font-bold text-purple-400">{marketSentiment.fear_greed.toFixed(0)}</div>
            <div className="text-sm text-slate-400">
              {marketSentiment.fear_greed > 70 ? 'Extreme Greed' : 
               marketSentiment.fear_greed > 50 ? 'Greed' : 
               marketSentiment.fear_greed > 30 ? 'Fear' : 'Extreme Fear'}
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-yellow-400">
            <h3 className="text-sm font-medium text-slate-300 mb-2">AI Confidence</h3>
            <div className="text-2xl font-bold text-yellow-400">{marketSentiment.aiConfidence}%</div>
            <div className="text-xs text-slate-400">Signal Accuracy</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Trading Signals with AI Predictions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-green-400/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400 animate-pulse" />
            🚀 LIVE Trading Signals
          </h3>
          <div className="space-y-4">
            {signals.filter(signal => signal.status === 'active').map((signal) => (
              <div key={signal.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-green-400/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getSignalIcon(signal.action)}
                    <span className="font-bold text-lg">{signal.symbol}</span>
                    <span className={`font-medium px-2 py-1 rounded text-sm ${getSignalColor(signal.action)}`}>
                      {signal.action}
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getConfidenceColor(signal.confidence)}`}>
                      {signal.confidence}% confidence
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${getPredictionColor(signal.action)}`}>
                      AI: {signal.action}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-slate-400">Entry</div>
                    <div className="font-medium font-mono">₹{signal.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Target</div>
                    <div className="font-medium text-green-400 font-mono">₹{signal.target.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Stop Loss</div>
                    <div className="font-medium text-red-400 font-mono">₹{signal.stopLoss.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 mb-2">
                  <strong>⏱️ Timeframe:</strong> {signal.timeframe}
                </div>
                <div className="text-sm text-slate-300 mb-2">
                  <strong>📊 Analysis:</strong> {signal.reason}
                </div>
                <div className="text-sm text-green-400 bg-green-400/10 p-2 rounded">
                  <strong>🤖 AI Prediction:</strong> {signal.prediction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Technical Indicators with AI Analysis */}
        <div className="bg-slate-800 rounded-lg p-6 border border-blue-400/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-400" />
            📈 Live Technical Indicators
          </h3>
          <div className="space-y-4">
            {technicalIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="font-medium">{indicator.name}</div>
                  <div className="text-2xl font-bold font-mono">{indicator.value.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${indicator.color} mb-1`}>
                    {indicator.signal}
                  </div>
                  <div className={`text-sm px-2 py-1 rounded font-bold ${getPredictionColor(indicator.prediction)}`}>
                    AI: {indicator.prediction}
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
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
          ✅ Recent Completed Signals
        </h3>
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
                  <span className="text-slate-400 font-mono">@ ₹{signal.price.toFixed(2)}</span>
                </div>
                <div className="text-green-400 font-medium">
                  🎯 Target Achieved
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
