
export interface MarketHours {
  isOpen: boolean;
  nextOpen: string;
  nextClose: string;
  timezone: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  momentum: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'Bullish' | 'Bearish' | 'Neutral' | 'Overbought' | 'Oversold' | 'Strong Trend';
  color: string;
  prediction: 'BUY' | 'SELL' | 'HOLD';
}

export interface TradingSignal {
  id: number;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timeframe: string;
  reason: string;
  status: 'active' | 'completed';
  prediction: string;
}

export interface SectorData {
  name: string;
  change: number;
  marketCap: number;
  volume: number;
  leaders: string[];
  prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  momentum: number;
  volatility: number;
}

export interface StockCacheData {
  price: number;
  volume: number;
  change: number;
  sector: string;
}
