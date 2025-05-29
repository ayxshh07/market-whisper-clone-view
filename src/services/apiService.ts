
import { SECTOR_MAPPING } from '../data/stockData';

export class ApiService {
  private formatVolume(volume: number): string {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(2)}Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(2)}L`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
  }

  getSectorForStock(symbol: string): string {
    return SECTOR_MAPPING[symbol] || 'Others';
  }

  async fetchYahooFinanceData(apiUrl: string): Promise<any> {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const encodedUrl = encodeURIComponent(apiUrl);
    
    try {
      const response = await fetch(`${proxyUrl}${encodedUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Yahoo Finance API failed:', error);
    }
    
    return null;
  }

  async fetchTopGainers(): Promise<any[]> {
    const apiUrl = 'https://query1.finance.yahoo.com/v1/finance/screener?crumb=xyz&formatted=true&region=IN&lang=en-US&count=20&offset=0&quoteType=EQUITY&sortType=PERCENT_CHANGE&sortField=percentchange&topOperator=GT&topValue=2';
    
    const data = await this.fetchYahooFinanceData(apiUrl);
    const quotes = data?.finance?.result?.[0]?.quotes || [];
    
    if (quotes.length > 0) {
      return quotes.slice(0, 10).map((stock: any) => ({
        symbol: stock.symbol?.replace('.NS', '') || 'N/A',
        price: stock.regularMarketPrice?.raw || stock.regularMarketPrice || 0,
        change: stock.regularMarketChange?.raw || stock.regularMarketChange || 0,
        changePercent: stock.regularMarketChangePercent?.raw || stock.regularMarketChangePercent || 0,
        volume: stock.regularMarketVolume?.raw || stock.regularMarketVolume || 0,
        sector: this.getSectorForStock(stock.symbol?.replace('.NS', '') || 'N/A')
      }));
    }
    
    return [];
  }

  async fetchTopLosers(): Promise<any[]> {
    const apiUrl = 'https://query1.finance.yahoo.com/v1/finance/screener?crumb=xyz&formatted=true&region=IN&lang=en-US&count=20&offset=0&quoteType=EQUITY&sortType=PERCENT_CHANGE&sortField=percentchange&topOperator=LT&topValue=-1';
    
    const data = await this.fetchYahooFinanceData(apiUrl);
    const quotes = data?.finance?.result?.[0]?.quotes || [];
    
    if (quotes.length > 0) {
      return quotes.slice(0, 10).map((stock: any) => ({
        symbol: stock.symbol?.replace('.NS', '') || 'N/A',
        price: stock.regularMarketPrice?.raw || stock.regularMarketPrice || 0,
        change: stock.regularMarketChange?.raw || stock.regularMarketChange || 0,
        changePercent: stock.regularMarketChangePercent?.raw || stock.regularMarketChangePercent || 0,
        volume: stock.regularMarketVolume?.raw || stock.regularMarketVolume || 0,
        sector: this.getSectorForStock(stock.symbol?.replace('.NS', '') || 'N/A')
      }));
    }
    
    return [];
  }

  async fetchVolumeLeaders(): Promise<any[]> {
    const apiUrl = 'https://query1.finance.yahoo.com/v1/finance/screener?crumb=xyz&formatted=true&region=IN&lang=en-US&count=20&offset=0&quoteType=EQUITY&sortType=VOLUME&sortField=volume';
    
    const data = await this.fetchYahooFinanceData(apiUrl);
    const quotes = data?.finance?.result?.[0]?.quotes || [];
    
    if (quotes.length > 0) {
      return quotes.slice(0, 10).map((stock: any) => ({
        symbol: stock.symbol?.replace('.NS', '') || 'N/A',
        volume: this.formatVolume(stock.regularMarketVolume?.raw || stock.regularMarketVolume || 0),
        value: ((stock.regularMarketVolume?.raw || 0) * (stock.regularMarketPrice?.raw || 0)) / 10000000 || 0,
        price: stock.regularMarketPrice?.raw || stock.regularMarketPrice || 0,
        sector: this.getSectorForStock(stock.symbol?.replace('.NS', '') || 'N/A')
      }));
    }
    
    return [];
  }

  async fetchIndexData(symbol: string): Promise<any> {
    const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    
    const data = await this.fetchYahooFinanceData(apiUrl);
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    
    if (meta) {
      const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
      const previousClose = meta.previousClose || currentPrice;
      const change = currentPrice - previousClose;
      const changePercent = previousClose ? (change / previousClose) * 100 : 0;
      
      return {
        currentPrice,
        change,
        changePercent
      };
    }
    
    return null;
  }
}
