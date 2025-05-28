
interface MarketHours {
  isOpen: boolean;
  nextOpen: string;
  nextClose: string;
  timezone: string;
}

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

class MarketDataService {
  private baseData = {
    indices: [
      { name: 'NIFTY 50', baseValue: 21731.40, symbol: 'NIFTY' },
      { name: 'SENSEX', baseValue: 71595.49, symbol: 'SENSEX' },
      { name: 'BANK NIFTY', baseValue: 46816.55, symbol: 'BANKNIFTY' },
      { name: 'NIFTY IT', baseValue: 30847.25, symbol: 'NIFTYIT' },
    ],
    stocks: {
      topGainers: [
        { symbol: 'ADANIENT', basePrice: 2847.50 },
        { symbol: 'TATAMOTORS', basePrice: 756.20 },
        { symbol: 'WIPRO', basePrice: 445.80 },
        { symbol: 'INFY', basePrice: 1456.90 },
        { symbol: 'RELIANCE', basePrice: 2567.35 },
      ],
      topLosers: [
        { symbol: 'HDFC', basePrice: 1678.25 },
        { symbol: 'ICICIBANK', basePrice: 945.60 },
        { symbol: 'KOTAKBANK', basePrice: 1789.40 },
        { symbol: 'AXISBANK', basePrice: 1023.75 },
        { symbol: 'SBIN', basePrice: 567.90 },
      ]
    }
  };

  constructor(apiKey?: string) {
    // No API key needed for offline mode
  }

  // Check if Indian markets are open
  getMarketHours(): MarketHours {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0 = Sunday, 6 = Saturday

    // Indian markets are open Monday-Friday, 9:15 AM to 3:30 PM IST
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isMarketTime = (currentHour === 9 && currentMinute >= 15) || 
                        (currentHour >= 10 && currentHour <= 14) || 
                        (currentHour === 15 && currentMinute <= 30);
    
    const isOpen = isWeekday && isMarketTime;

    // Calculate next open/close times
    let nextOpen = new Date(istTime);
    let nextClose = new Date(istTime);

    if (isOpen) {
      // Market is open, next close is today at 3:30 PM
      nextClose.setHours(15, 30, 0, 0);
    } else if (isWeekday && currentHour < 9) {
      // Today before market opens
      nextOpen.setHours(9, 15, 0, 0);
      nextClose.setHours(15, 30, 0, 0);
    } else {
      // After market hours or weekend, next open is next weekday at 9:15 AM
      let daysToAdd = 1;
      if (currentDay === 0) daysToAdd = 1; // Sunday -> Monday
      else if (currentDay === 6) daysToAdd = 2; // Saturday -> Monday
      else if (currentHour >= 15 && currentMinute > 30) daysToAdd = 1; // After market close
      
      nextOpen.setDate(nextOpen.getDate() + daysToAdd);
      nextOpen.setHours(9, 15, 0, 0);
      nextClose.setDate(nextClose.getDate() + daysToAdd);
      nextClose.setHours(15, 30, 0, 0);
    }

    return {
      isOpen,
      nextOpen: nextOpen.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      }),
      nextClose: nextClose.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timezone: 'IST'
    };
  }

  private generateRealisticChange(isOpen: boolean): number {
    if (!isOpen) {
      // Market closed - return small random change from previous close
      return (Math.random() - 0.5) * 0.5;
    }
    
    // Market open - more volatile movements
    const timeBasedVolatility = this.getTimeBasedVolatility();
    return (Math.random() - 0.5) * 4 * timeBasedVolatility;
  }

  private getTimeBasedVolatility(): number {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();

    // Higher volatility during opening and closing hours
    if ((currentHour === 9 && currentMinute >= 15) || currentHour === 10) {
      return 1.5; // Opening hour volatility
    } else if (currentHour === 15) {
      return 1.3; // Closing hour volatility
    } else if (currentHour >= 11 && currentHour <= 14) {
      return 0.8; // Mid-day lower volatility
    }
    
    return 1.0; // Normal volatility
  }

  async getIndexData(): Promise<IndexData[]> {
    const marketHours = this.getMarketHours();
    const currentTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit'
    });

    return this.baseData.indices.map(index => {
      const changePercent = this.generateRealisticChange(marketHours.isOpen);
      const change = (index.baseValue * changePercent) / 100;
      const currentValue = index.baseValue + change;

      return {
        name: index.name,
        value: currentValue,
        change: change,
        changePercent: changePercent,
        lastUpdated: marketHours.isOpen ? `Live ${currentTime}` : 'Previous Close'
      };
    });
  }

  getTopGainers() {
    const marketHours = this.getMarketHours();
    
    return this.baseData.stocks.topGainers.map(stock => {
      const changePercent = Math.abs(this.generateRealisticChange(marketHours.isOpen)) + 1; // Ensure positive
      const change = (stock.basePrice * changePercent) / 100;
      const currentPrice = stock.basePrice + change;

      return {
        symbol: stock.symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent
      };
    });
  }

  getTopLosers() {
    const marketHours = this.getMarketHours();
    
    return this.baseData.stocks.topLosers.map(stock => {
      const changePercent = -(Math.abs(this.generateRealisticChange(marketHours.isOpen)) + 1); // Ensure negative
      const change = (stock.basePrice * changePercent) / 100;
      const currentPrice = stock.basePrice + change;

      return {
        symbol: stock.symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent
      };
    });
  }

  getVolumeLeaders() {
    return [
      { symbol: 'RELIANCE', volume: '2.45M', value: 6287.54 + (Math.random() - 0.5) * 500 },
      { symbol: 'INFY', volume: '1.87M', value: 2721.89 + (Math.random() - 0.5) * 300 },
      { symbol: 'TCS', volume: '1.65M', value: 5943.21 + (Math.random() - 0.5) * 400 },
      { symbol: 'HDFC', volume: '1.43M', value: 2401.67 + (Math.random() - 0.5) * 200 },
      { symbol: 'ICICIBANK', volume: '1.29M', value: 1219.43 + (Math.random() - 0.5) * 150 },
    ];
  }
}

export { MarketDataService, type MarketHours, type StockQuote, type IndexData };
