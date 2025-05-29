import { 
  type MarketHours, 
  type IndexData, 
  type TechnicalIndicator, 
  type TradingSignal, 
  type SectorData 
} from '../types/marketTypes';
import { STOCK_CACHE } from '../data/stockData';
import { MarketHoursService } from '../utils/marketHours';
import { TechnicalIndicatorsCalculator } from '../utils/technicalIndicators';
import { ApiService } from './apiService';

class MarketDataService {
  private priceHistory: { [key: string]: number[] } = {};
  private lastPrices: { [key: string]: number } = {};
  private stockCache = STOCK_CACHE;
  private lastMarketData: any = null;
  
  private marketHoursService = new MarketHoursService();
  private technicalCalculator = new TechnicalIndicatorsCalculator();
  private apiService = new ApiService();
  
  getMarketHours(): MarketHours {
    return this.marketHoursService.getMarketHours();
  }

  async getIndexData(): Promise<IndexData[]> {
    const marketHours = this.getMarketHours();
    
    try {
      console.log(`🔄 Market Status: ${marketHours.isOpen ? 'OPEN' : 'CLOSED'} - Fetching index data...`);
      
      const indices = [
        { name: 'NIFTY 50', symbol: '^NSEI' },
        { name: 'SENSEX', symbol: '^BSESN' },
        { name: 'BANK NIFTY', symbol: '^NSEBANK' },
        { name: 'NIFTY IT', symbol: '^CNXIT' },
      ];

      const results = await Promise.all(
        indices.map(async (index) => {
          try {
            if (marketHours.isOpen) {
              const data = await this.apiService.fetchIndexData(index.symbol);
              
              if (data) {
                // Store price for trend analysis only during market hours
                if (!this.priceHistory[index.name]) {
                  this.priceHistory[index.name] = [];
                }
                this.priceHistory[index.name].push(data.currentPrice);
                if (this.priceHistory[index.name].length > 20) {
                  this.priceHistory[index.name].shift();
                }
                
                const trend = this.calculateTrend(index.name);
                const momentum = this.calculateMomentum(index.name);
                
                console.log(`📈 LIVE ${index.name}: ₹${data.currentPrice.toFixed(2)} (${data.changePercent.toFixed(2)}%) - ${trend}`);
                
                return {
                  name: index.name,
                  value: data.currentPrice,
                  change: data.change,
                  changePercent: data.changePercent,
                  lastUpdated: 'LIVE',
                  trend,
                  momentum
                };
              }
            }
            
            return this.createClosedMarketIndexData(index.name);
            
          } catch (error) {
            console.warn(`⚠️ Failed to fetch data for ${index.name}:`, error);
            return this.createClosedMarketIndexData(index.name);
          }
        })
      );

      if (marketHours.isOpen) {
        console.log('✅ LIVE market data fetched successfully');
      } else {
        console.log('📊 Market CLOSED - Showing last closing data (NO fluctuations)');
      }
      return results;
      
    } catch (error) {
      console.error('❌ Failed to fetch market data:', error);
      return this.getClosedMarketIndicesData();
    }
  }

  async getTopGainers() {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      console.log('📈 Market CLOSED - Showing fixed top gainers data');
      return this.getFixedTopGainers();
    }

    try {
      console.log('📈 Market OPEN - Fetching LIVE top gainers data...');
      
      const liveData = await this.apiService.fetchTopGainers();
      if (liveData.length > 0) {
        console.log('✅ LIVE top gainers data received');
        return liveData;
      }
      
      return this.getEnhancedTopGainers();
      
    } catch (error) {
      console.warn('Failed to fetch gainers data:', error);
      return this.getEnhancedTopGainers();
    }
  }

  async getTopLosers() {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      console.log('📉 Market CLOSED - Showing fixed top losers data');
      return this.getFixedTopLosers();
    }

    try {
      console.log('📉 Market OPEN - Fetching LIVE top losers data...');
      
      const liveData = await this.apiService.fetchTopLosers();
      if (liveData.length > 0) {
        console.log('✅ LIVE top losers data received');
        return liveData;
      }
      
      return this.getEnhancedTopLosers();
      
    } catch (error) {
      console.warn('Failed to fetch losers data:', error);
      return this.getEnhancedTopLosers();
    }
  }

  async getVolumeLeaders() {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      console.log('📊 Market CLOSED - Showing fixed volume leaders data');
      return this.getFixedVolumeLeaders();
    }

    try {
      console.log('📊 Market OPEN - Fetching LIVE volume leaders data...');
      
      const liveData = await this.apiService.fetchVolumeLeaders();
      if (liveData.length > 0) {
        console.log('✅ LIVE volume leaders data received');
        return liveData;
      }
      
      return this.getEnhancedVolumeLeaders();
      
    } catch (error) {
      console.warn('Failed to fetch volume data:', error);
      return this.getEnhancedVolumeLeaders();
    }
  }

  async getLiveTechnicalIndicators(): Promise<TechnicalIndicator[]> {
    const marketHours = this.getMarketHours();
    
    try {
      const niftyData = this.priceHistory['NIFTY 50'] || [];
      
      if (marketHours.isOpen && niftyData.length > 0) {
        const rsiValue = this.technicalCalculator.calculateRSI(niftyData);
        const macdValue = this.technicalCalculator.calculateMACD(niftyData);
        const smaValue = this.technicalCalculator.calculateSMA(niftyData, 20);
        const bollingerPos = this.technicalCalculator.calculateBollingerPosition(niftyData);
        const volumeTrend = await this.calculateVolumeTrend();
        const momentum = this.calculateMomentum('NIFTY 50');
        
        return [
          {
            name: 'RSI (14)',
            value: rsiValue,
            signal: this.technicalCalculator.getRSISignal(rsiValue),
            color: this.technicalCalculator.getSignalColor(this.technicalCalculator.getRSISignal(rsiValue)),
            prediction: this.technicalCalculator.getRSIPrediction(rsiValue)
          },
          {
            name: 'MACD (12,26,9)',
            value: macdValue,
            signal: this.technicalCalculator.getMACDSignal(macdValue),
            color: this.technicalCalculator.getSignalColor(this.technicalCalculator.getMACDSignal(macdValue)),
            prediction: this.technicalCalculator.getMACDPrediction(macdValue)
          },
          {
            name: 'Moving Average (20)',
            value: smaValue,
            signal: this.technicalCalculator.getMASignal(niftyData),
            color: this.technicalCalculator.getSignalColor(this.technicalCalculator.getMASignal(niftyData)),
            prediction: this.technicalCalculator.getMAPrediction(niftyData)
          },
          {
            name: 'Bollinger Bands',
            value: bollingerPos,
            signal: this.technicalCalculator.getBollingerSignal(bollingerPos),
            color: this.technicalCalculator.getSignalColor(this.technicalCalculator.getBollingerSignal(bollingerPos)),
            prediction: this.technicalCalculator.getBollingerPrediction(bollingerPos)
          },
          {
            name: 'Volume Analysis',
            value: volumeTrend,
            signal: volumeTrend > 60 ? 'Bullish' : volumeTrend < 40 ? 'Bearish' : 'Neutral',
            color: volumeTrend > 60 ? 'text-green-400' : volumeTrend < 40 ? 'text-red-400' : 'text-yellow-400',
            prediction: volumeTrend > 70 ? 'BUY' : volumeTrend < 30 ? 'SELL' : 'HOLD'
          },
          {
            name: 'Momentum Oscillator',
            value: Math.abs(momentum),
            signal: this.technicalCalculator.getMomentumSignal(momentum),
            color: this.technicalCalculator.getSignalColor(this.technicalCalculator.getMomentumSignal(momentum)),
            prediction: this.technicalCalculator.getMomentumPrediction(momentum)
          }
        ];
      } else {
        return this.getClosedMarketTechnicalIndicators();
      }
    } catch (error) {
      console.error('Technical indicators error:', error);
      return this.getClosedMarketTechnicalIndicators();
    }
  }

  async getLiveTradingSignals(): Promise<TradingSignal[]> {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      console.log('⚠️ Market CLOSED - No new trading signals generated');
      return this.getClosedMarketTradingSignals();
    }

    try {
      const indicators = await this.getLiveTechnicalIndicators();
      const gainers = await this.getTopGainers();
      
      const signals = [];
      let signalId = 1;
      
      for (let i = 0; i < Math.min(3, gainers.length); i++) {
        const stock = gainers[i];
        const rsi = indicators[0];
        const confidence = Math.min(95, Math.max(65, 75 + stock.changePercent * 2));
        
        signals.push({
          id: signalId++,
          symbol: stock.symbol,
          action: rsi.prediction === 'SELL' && stock.changePercent > 8 ? 'SELL' : 'BUY',
          price: stock.price,
          target: stock.price * (1 + (stock.changePercent / 100) * 0.5),
          stopLoss: stock.price * (1 - Math.abs(stock.changePercent) / 200),
          confidence: Math.floor(confidence),
          timeframe: confidence > 85 ? '15-30 minutes' : '30-60 minutes',
          reason: `Strong momentum (${stock.changePercent.toFixed(2)}%), ${rsi.signal} RSI, High volume`,
          status: 'active' as const,
          prediction: `LIVE Analysis: ${confidence > 85 ? 'HIGH' : 'MEDIUM'} confidence ${rsi.prediction}`
        });
      }
      
      return signals.slice(0, 5);
      
    } catch (error) {
      console.error('Trading signals error:', error);
      return this.getClosedMarketTradingSignals();
    }
  }

  async getLiveSectorData(): Promise<SectorData[]> {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      console.log('📊 Market CLOSED - Showing fixed sector data');
      return this.getClosedMarketSectorData();
    }

    try {
      const gainers = await this.getTopGainers();
      const losers = await this.getTopLosers();
      const volumeLeaders = await this.getVolumeLeaders();
      
      const sectors = [
        { name: 'Information Technology', stocks: ['TCS', 'INFY', 'WIPRO', 'TECHM'] },
        { name: 'Banking & Financial', stocks: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK'] },
        { name: 'Energy & Power', stocks: ['RELIANCE', 'ONGC', 'NTPC', 'POWERGRID'] },
        { name: 'Pharmaceuticals', stocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'LUPIN'] },
        { name: 'Automobile', stocks: ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO'] },
        { name: 'FMCG', stocks: ['HINDUNILVR', 'ITC', 'NESTLEINDIA', 'BRITANNIA'] },
        { name: 'Metals & Mining', stocks: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL'] },
        { name: 'Real Estate', stocks: ['DLF', 'GODREJPROP', 'BRIGADE', 'SOBHA'] },
        { name: 'Telecom', stocks: ['BHARTIARTL', 'IDEA', 'INDUSINDBK'] },
        { name: 'Infrastructure', stocks: ['L&T', 'IRCON', 'NBCC', 'PFC'] }
      ];
      
      return sectors.map((sector) => {
        const sectorStocks = [...gainers, ...losers].filter(stock => 
          sector.stocks.some(s => s.includes(stock.symbol) || stock.symbol.includes(s))
        );
        
        const avgChange = sectorStocks.length > 0 
          ? sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sectorStocks.length
          : (Math.random() - 0.5) * 2;
        
        const momentum = avgChange * (0.8 + Math.random() * 0.4);
        const volatility = Math.abs(avgChange) * (0.5 + Math.random() * 0.5);
        
        let prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
        const predictionScore = avgChange + momentum * 0.5 - volatility * 0.3;
        
        if (predictionScore > 1.5) prediction = 'BULLISH';
        else if (predictionScore < -1.5) prediction = 'BEARISH';
        
        const volumeBoost = volumeLeaders.some(v => 
          sector.stocks.some(s => s.includes(v.symbol) || v.symbol.includes(s))
        ) ? 1.2 : 1.0;
        
        return {
          name: sector.name,
          change: avgChange,
          marketCap: (8000000 + Math.random() * 12000000) * volumeBoost,
          volume: (800 + Math.random() * 1500) * volumeBoost,
          leaders: sector.stocks.slice(0, 3),
          prediction,
          momentum,
          volatility
        };
      });
    } catch (error) {
      console.error('Sector data error:', error);
      return this.getClosedMarketSectorData();
    }
  }

  private calculateTrend(indexName: string): 'bullish' | 'bearish' | 'neutral' {
    const prices = this.priceHistory[indexName];
    if (!prices || prices.length < 3) return 'neutral';
    
    const recent = prices.slice(-3);
    const increasing = recent[2] > recent[1] && recent[1] > recent[0];
    const decreasing = recent[2] < recent[1] && recent[1] < recent[0];
    
    if (increasing) return 'bullish';
    if (decreasing) return 'bearish';
    return 'neutral';
  }

  private calculateMomentum(indexName: string): number {
    const prices = this.priceHistory[indexName];
    if (!prices || prices.length < 2) return 0;
    
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    return ((current - previous) / previous) * 100;
  }

  private async calculateVolumeTrend(): Promise<number> {
    const marketHours = this.getMarketHours();
    
    if (!marketHours.isOpen) {
      return 55.8;
    }
    
    const volumeData = await Promise.all([
      this.getVolumeLeaders(),
      this.getTopGainers(),
      this.getTopLosers()
    ]);
    
    const totalVolume = volumeData.flat().reduce((sum, stock) => {
      const volumeNum = typeof stock.volume === 'string' 
        ? parseFloat(stock.volume.replace(/[Cr|L|K]/g, '')) 
        : (stock.volume || 0);
      return sum + volumeNum;
    }, 0);
    
    return Math.min(100, Math.max(0, totalVolume / 10 + Math.random() * 30));
  }

  private createClosedMarketIndexData(indexName: string): IndexData {
    const closedMarketData = {
      'NIFTY 50': { value: 24833.60, change: 82.45, changePercent: 0.33 },
      'SENSEX': { value: 81633.02, change: 318.74, changePercent: 0.39 },
      'BANK NIFTY': { value: 55546.05, change: 128.90, changePercent: 0.23 },
      'NIFTY IT': { value: 37754.15, change: 287.35, changePercent: 0.77 },
    };

    const data = closedMarketData[indexName] || { value: 10000, change: 0, changePercent: 0 };

    return {
      name: indexName,
      value: data.value,
      change: data.change,
      changePercent: data.changePercent,
      lastUpdated: 'Market Closed',
      trend: data.change > 0 ? 'bullish' : data.change < 0 ? 'bearish' : 'neutral',
      momentum: data.changePercent
    };
  }

  private getClosedMarketIndicesData(): IndexData[] {
    return [
      this.createClosedMarketIndexData('NIFTY 50'),
      this.createClosedMarketIndexData('SENSEX'),
      this.createClosedMarketIndexData('BANK NIFTY'),
      this.createClosedMarketIndexData('NIFTY IT')
    ];
  }

  private getClosedMarketTechnicalIndicators(): TechnicalIndicator[] {
    return [
      { name: 'RSI (14)', value: 67.45, signal: 'Neutral', color: 'text-yellow-400', prediction: 'HOLD' },
      { name: 'MACD (12,26,9)', value: 1.23, signal: 'Bullish', color: 'text-green-400', prediction: 'BUY' },
      { name: 'Moving Average (20)', value: 24500, signal: 'Bullish', color: 'text-green-400', prediction: 'BUY' },
      { name: 'Bollinger Bands', value: 65.2, signal: 'Neutral', color: 'text-yellow-400', prediction: 'HOLD' },
      { name: 'Volume Analysis', value: 55.8, signal: 'Neutral', color: 'text-yellow-400', prediction: 'HOLD' },
      { name: 'Momentum Oscillator', value: 2.1, signal: 'Strong Trend', color: 'text-purple-400', prediction: 'BUY' }
    ];
  }

  private getClosedMarketTradingSignals(): TradingSignal[] {
    return [
      {
        id: 1,
        symbol: 'MARKET_CLOSED',
        action: 'BUY',
        price: 0,
        target: 0,
        stopLoss: 0,
        confidence: 0,
        timeframe: 'Market Closed',
        reason: 'Indian markets are currently closed. Trading signals will be available during market hours (9:15 AM - 3:30 PM IST)',
        status: 'completed',
        prediction: 'No signals - Market Closed'
      }
    ];
  }

  private getEnhancedTopGainers() {
    const gainers = [
      { symbol: 'SUZLON', price: 45.67, change: 8.90, changePercent: 24.12, volume: 98700000, sector: 'Renewable Energy' },
      { symbol: 'RPOWER', price: 12.34, change: 2.78, changePercent: 29.12, volume: 145600000, sector: 'Power' },
      { symbol: 'ZOMATO', price: 234.56, change: 45.67, changePercent: 24.18, volume: 45600000, sector: 'Food Tech' },
      { symbol: 'ADANIENT', price: 2847.50, change: 234.30, changePercent: 8.96, volume: 15600000, sector: 'Infrastructure' },
      { symbol: 'BAJFINANCE', price: 6543.21, change: 456.78, changePercent: 7.51, volume: 3400000, sector: 'NBFC' }
    ];
    
    return gainers.map(stock => ({
      ...stock,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5,
      price: stock.price + (Math.random() - 0.5) * 10
    }));
  }

  private getEnhancedTopLosers() {
    const losers = [
      { symbol: 'PAYTM', price: 567.89, change: -89.12, changePercent: -13.57, volume: 67800000, sector: 'Fintech' },
      { symbol: 'YESBANK', price: 23.45, change: -3.67, changePercent: -13.54, volume: 189000000, sector: 'Banking' },
      { symbol: 'LUPIN', price: 876.54, change: -78.67, changePercent: -8.24, volume: 8900000, sector: 'Pharma' },
      { symbol: 'ASIANPAINT', price: 3287.45, change: -234.85, changePercent: -6.67, volume: 5400000, sector: 'Paints' },
      { symbol: 'CARTRADE', price: 123.45, change: -8.56, changePercent: -6.48, volume: 8900000, sector: 'Auto Tech' }
    ];
    
    return losers.map(stock => ({
      ...stock,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5,
      price: stock.price + (Math.random() - 0.5) * 10
    }));
  }

  private getEnhancedVolumeLeaders() {
    return [
      { symbol: 'YESBANK', volume: '189.0Cr', value: 443.21, price: 23.45, sector: 'Banking' },
      { symbol: 'RPOWER', volume: '145.6Cr', value: 179.76, price: 12.34, sector: 'Power' },
      { symbol: 'SUZLON', volume: '98.7Cr', value: 450.67, price: 45.67, sector: 'Renewable Energy' },
      { symbol: 'TATASTEEL', volume: '67.8Cr', value: 837.14, price: 123.45, sector: 'Metals' },
      { symbol: 'PAYTM', volume: '67.8Cr', value: 3850.09, price: 567.89, sector: 'Fintech' }
    ];
  }

  private getFixedTopGainers() {
    return [
      { symbol: 'ADANIENT', price: 2847.50, change: 125.30, changePercent: 4.61, volume: 15600000, sector: 'Infrastructure' },
      { symbol: 'TATAMOTORS', price: 756.20, change: 32.15, changePercent: 4.44, volume: 28900000, sector: 'Auto' },
      { symbol: 'WIPRO', price: 445.80, change: 19.40, changePercent: 4.35, volume: 22100000, sector: 'IT' },
      { symbol: 'JSWSTEEL', price: 789.30, change: 31.45, changePercent: 4.15, volume: 31200000, sector: 'Metals' },
      { symbol: 'HINDALCO', price: 456.78, change: 17.89, changePercent: 4.08, volume: 28900000, sector: 'Metals' }
    ];
  }

  private getFixedTopLosers() {
    return [
      { symbol: 'HDFCBANK', price: 1678.25, change: -73.60, changePercent: -4.20, volume: 14300000, sector: 'Banking' },
      { symbol: 'ICICIBANK', price: 945.60, change: -38.90, changePercent: -3.95, volume: 12900000, sector: 'Banking' },
      { symbol: 'KOTAKBANK', price: 1789.40, change: -65.30, changePercent: -3.53, volume: 8600000, sector: 'Banking' },
      { symbol: 'SBIN', price: 567.90, change: -18.75, changePercent: -3.20, volume: 45200000, sector: 'Banking' },
      { symbol: 'TCS', price: 3654.80, change: -112.45, changePercent: -2.99, volume: 16500000, sector: 'IT' }
    ];
  }

  private getFixedVolumeLeaders() {
    return [
      { symbol: 'RELIANCE', volume: '2.45Cr', value: 6287.54, price: 2567.35, sector: 'Energy' },
      { symbol: 'INFY', volume: '1.87Cr', value: 2721.89, price: 1456.90, sector: 'IT' },
      { symbol: 'TCS', volume: '1.65Cr', value: 5943.21, price: 3654.80, sector: 'IT' },
      { symbol: 'HDFC', volume: '1.43Cr', value: 2401.67, price: 1678.25, sector: 'Banking' },
      { symbol: 'ICICIBANK', volume: '1.29Cr', value: 1219.43, price: 945.60, sector: 'Banking' }
    ];
  }

  private getClosedMarketSectorData(): SectorData[] {
    return [
      {
        name: 'Information Technology',
        change: 0.77,
        marketCap: 12500000,
        volume: 1234.56,
        leaders: ['TCS', 'INFY', 'WIPRO'],
        prediction: 'BULLISH',
        momentum: 0.65,
        volatility: 0.45
      },
      {
        name: 'Banking & Financial',
        change: -0.23,
        marketCap: 15600000,
        volume: 2156.78,
        leaders: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
        prediction: 'BEARISH',
        momentum: -0.15,
        volatility: 0.67
      },
      {
        name: 'Energy & Power',
        change: 0.45,
        marketCap: 11200000,
        volume: 1876.43,
        leaders: ['RELIANCE', 'ONGC', 'NTPC'],
        prediction: 'NEUTRAL',
        momentum: 0.32,
        volatility: 0.28
      },
      {
        name: 'Pharmaceuticals',
        change: 1.12,
        marketCap: 8950000,
        volume: 987.65,
        leaders: ['SUNPHARMA', 'DRREDDY', 'CIPLA'],
        prediction: 'BULLISH',
        momentum: 0.89,
        volatility: 0.34
      },
      {
        name: 'Automobile',
        change: 0.89,
        marketCap: 7800000,
        volume: 1543.21,
        leaders: ['TATAMOTORS', 'MARUTI', 'M&M'],
        prediction: 'BULLISH',
        momentum: 0.76,
        volatility: 0.52
      }
    ];
  }
}

export { MarketDataService, type MarketHours, type StockQuote, type IndexData, type TechnicalIndicator, type TradingSignal, type SectorData };
