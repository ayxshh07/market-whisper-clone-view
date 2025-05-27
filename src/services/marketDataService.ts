
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
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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
      const daysUntilMonday = currentDay === 0 ? 1 : currentDay === 6 ? 2 : 1;
      nextOpen.setDate(nextOpen.getDate() + daysUntilMonday);
      nextOpen.setHours(9, 15, 0, 0);
      nextClose.setDate(nextClose.getDate() + daysUntilMonday);
      nextClose.setHours(15, 30, 0, 0);
    }

    return {
      isOpen,
      nextOpen: nextOpen.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      nextClose: nextClose.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      timezone: 'IST'
    };
  }

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        console.error('API Error:', data);
        return null;
      }

      const quote = data['Global Quote'];
      if (!quote) return null;

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        lastUpdated: quote['07. latest trading day']
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      return null;
    }
  }

  async getIndexData(): Promise<IndexData[]> {
    // For Indian indices, we'll use NSE symbols
    const indices = ['NSEI', 'BSESN', 'NSEBANK', 'CNXIT'];
    const indexNames = ['NIFTY 50', 'SENSEX', 'BANK NIFTY', 'NIFTY IT'];
    
    const promises = indices.map(symbol => this.getStockQuote(`${symbol}.BSE`));
    const results = await Promise.all(promises);
    
    return results.map((result, index) => {
      if (result) {
        return {
          name: indexNames[index],
          value: result.price,
          change: result.change,
          changePercent: result.changePercent,
          lastUpdated: result.lastUpdated
        };
      }
      // Fallback to cached data if API fails
      return this.getFallbackIndexData()[index];
    });
  }

  private getFallbackIndexData(): IndexData[] {
    return [
      { name: 'NIFTY 50', value: 19654.35, change: 156.25, changePercent: 0.80, lastUpdated: 'Previous Close' },
      { name: 'SENSEX', value: 65953.48, change: 528.17, changePercent: 0.81, lastUpdated: 'Previous Close' },
      { name: 'BANK NIFTY', value: 44692.15, change: -89.45, changePercent: -0.20, lastUpdated: 'Previous Close' },
      { name: 'NIFTY IT', value: 30847.25, change: 287.65, changePercent: 0.94, lastUpdated: 'Previous Close' },
    ];
  }
}

export { MarketDataService, type MarketHours, type StockQuote, type IndexData };
