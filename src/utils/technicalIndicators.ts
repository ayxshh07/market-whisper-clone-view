
export class TechnicalIndicatorsCalculator {
  calculateRSI(prices: number[]): number {
    if (prices.length < 14) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < Math.min(15, prices.length); i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
    
    const avgGain = gains / 14;
    const avgLoss = losses / 14;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(prices: number[]): number {
    if (prices.length < 26) return 0;
    
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = ((prices[i] - ema) * multiplier) + ema;
    }
    
    return ema;
  }

  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const recentPrices = prices.slice(-period);
    return recentPrices.reduce((sum, price) => sum + price, 0) / period;
  }

  calculateBollingerPosition(prices: number[]): number {
    if (prices.length < 20) return 50;
    
    const sma = this.calculateSMA(prices, 20);
    const currentPrice = prices[prices.length - 1];
    const stdDev = this.calculateStandardDeviation(prices.slice(-20));
    
    const upperBand = sma + (2 * stdDev);
    const lowerBand = sma - (2 * stdDev);
    
    return ((currentPrice - lowerBand) / (upperBand - lowerBand)) * 100;
  }

  calculateStandardDeviation(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
  }

  getSignalColor(signal: string): string {
    switch (signal) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      case 'Overbought': return 'text-orange-400';
      case 'Oversold': return 'text-blue-400';
      case 'Strong Trend': return 'text-purple-400';
      default: return 'text-yellow-400';
    }
  }

  getRSISignal(rsi: number): 'Bullish' | 'Bearish' | 'Overbought' | 'Oversold' | 'Neutral' {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    if (rsi > 50) return 'Bullish';
    return 'Bearish';
  }

  getMACDSignal(macd: number): 'Bullish' | 'Bearish' | 'Neutral' {
    if (macd > 0) return 'Bullish';
    if (macd < 0) return 'Bearish';
    return 'Neutral';
  }

  getMASignal(prices: number[]): 'Bullish' | 'Bearish' | 'Neutral' {
    if (prices.length < 2) return 'Neutral';
    const current = prices[prices.length - 1];
    const sma = this.calculateSMA(prices, 10);
    
    if (current > sma) return 'Bullish';
    if (current < sma) return 'Bearish';
    return 'Neutral';
  }

  getBollingerSignal(position: number): 'Bullish' | 'Bearish' | 'Overbought' | 'Oversold' | 'Neutral' {
    if (position > 80) return 'Overbought';
    if (position < 20) return 'Oversold';
    if (position > 50) return 'Bullish';
    return 'Bearish';
  }

  getMomentumSignal(momentum: number): 'Bullish' | 'Bearish' | 'Strong Trend' | 'Neutral' {
    if (Math.abs(momentum) > 2) return 'Strong Trend';
    if (momentum > 0.5) return 'Bullish';
    if (momentum < -0.5) return 'Bearish';
    return 'Neutral';
  }

  getRSIPrediction(rsi: number): 'BUY' | 'SELL' | 'HOLD' {
    if (rsi < 30) return 'BUY';
    if (rsi > 70) return 'SELL';
    return 'HOLD';
  }

  getMACDPrediction(macd: number): 'BUY' | 'SELL' | 'HOLD' {
    if (macd > 1) return 'BUY';
    if (macd < -1) return 'SELL';
    return 'HOLD';
  }

  getMAPrediction(prices: number[]): 'BUY' | 'SELL' | 'HOLD' {
    const signal = this.getMASignal(prices);
    if (signal === 'Bullish') return 'BUY';
    if (signal === 'Bearish') return 'SELL';
    return 'HOLD';
  }

  getBollingerPrediction(position: number): 'BUY' | 'SELL' | 'HOLD' {
    if (position < 20) return 'BUY';
    if (position > 80) return 'SELL';
    return 'HOLD';
  }

  getMomentumPrediction(momentum: number): 'BUY' | 'SELL' | 'HOLD' {
    if (momentum > 1) return 'BUY';
    if (momentum < -1) return 'SELL';
    return 'HOLD';
  }
}
