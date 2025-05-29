
import { type StockCacheData } from '../types/marketTypes';

export const STOCK_CACHE: { [key: string]: StockCacheData } = {
  // Large Cap Stocks
  'RELIANCE.NS': { price: 2567.35, volume: 24500000, change: 45.20, sector: 'Energy' },
  'TCS.NS': { price: 3654.80, volume: 16500000, change: -12.45, sector: 'IT' },
  'INFY.NS': { price: 1456.90, volume: 18700000, change: 38.75, sector: 'IT' },
  'HDFCBANK.NS': { price: 1678.25, volume: 14300000, change: -23.60, sector: 'Banking' },
  'ICICIBANK.NS': { price: 945.60, volume: 12900000, change: 28.90, sector: 'Banking' },
  'KOTAKBANK.NS': { price: 1789.40, volume: 8600000, change: -15.30, sector: 'Banking' },
  'HINDUNILVR.NS': { price: 2456.70, volume: 7800000, change: 22.15, sector: 'FMCG' },
  'ITC.NS': { price: 456.80, volume: 35600000, change: 18.45, sector: 'FMCG' },
  'SBIN.NS': { price: 567.90, volume: 45200000, change: -8.75, sector: 'Banking' },
  'BHARTIARTL.NS': { price: 1234.50, volume: 16800000, change: 41.20, sector: 'Telecom' },
  'ASIANPAINT.NS': { price: 3287.45, volume: 5400000, change: -19.85, sector: 'Paints' },
  'MARUTI.NS': { price: 9876.30, volume: 3200000, change: 156.80, sector: 'Auto' },
  'TATAMOTORS.NS': { price: 756.20, volume: 28900000, change: 32.15, sector: 'Auto' },
  'TATASTEEL.NS': { price: 123.45, volume: 67800000, change: 6.75, sector: 'Metals' },
  'WIPRO.NS': { price: 445.80, volume: 22100000, change: 19.40, sector: 'IT' },
  
  // Mid Cap High Momentum Stocks
  'ADANIENT.NS': { price: 2847.50, volume: 15600000, change: 125.30, sector: 'Infrastructure' },
  'JSWSTEEL.NS': { price: 789.30, volume: 31200000, change: 89.45, sector: 'Metals' },
  'HINDALCO.NS': { price: 456.78, volume: 28900000, change: 67.89, sector: 'Metals' },
  'TECHM.NS': { price: 1123.45, volume: 12400000, change: 45.67, sector: 'IT' },
  'SUNPHARMA.NS': { price: 987.65, volume: 8900000, change: 34.21, sector: 'Pharma' },
  'DRREDDY.NS': { price: 5432.10, volume: 4500000, change: 78.90, sector: 'Pharma' },
  'CIPLA.NS': { price: 1098.76, volume: 6700000, change: 23.45, sector: 'Pharma' },
  'LUPIN.NS': { price: 876.54, volume: 8900000, change: -45.67, sector: 'Pharma' },
  'BAJFINANCE.NS': { price: 6543.21, volume: 3400000, change: 89.12, sector: 'NBFC' },
  'LT.NS': { price: 2345.67, volume: 7800000, change: 45.89, sector: 'Infrastructure' },
  
  // Small Cap High Growth Stocks
  'ZOMATO.NS': { price: 234.56, volume: 45600000, change: 123.45, sector: 'Food Tech' },
  'PAYTM.NS': { price: 567.89, volume: 67800000, change: -89.12, sector: 'Fintech' },
  'NYKAA.NS': { price: 178.90, volume: 23400000, change: 67.34, sector: 'E-commerce' },
  'POLICYBZR.NS': { price: 876.54, volume: 12300000, change: 45.67, sector: 'Fintech' },
  'CARTRADE.NS': { price: 123.45, volume: 8900000, change: -34.56, sector: 'Auto Tech' },
  'EASEMYTRIP.NS': { price: 456.78, volume: 15600000, change: 78.90, sector: 'Travel Tech' },
  'IRCTC.NS': { price: 789.12, volume: 23400000, change: 56.78, sector: 'Travel' },
  'RPOWER.NS': { price: 12.34, volume: 145600000, change: 234.56, sector: 'Power' },
  'SUZLON.NS': { price: 45.67, volume: 98700000, change: 189.23, sector: 'Renewable Energy' },
  'YESBANK.NS': { price: 23.45, volume: 189000000, change: -45.67, sector: 'Banking' }
};

export const SECTOR_MAPPING: { [key: string]: string } = {
  'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'TECHM': 'IT',
  'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking', 'YESBANK': 'Banking',
  'RELIANCE': 'Energy', 'ONGC': 'Energy', 'RPOWER': 'Power',
  'TATAMOTORS': 'Auto', 'MARUTI': 'Auto', 'CARTRADE': 'Auto Tech',
  'TATASTEEL': 'Metals', 'JSWSTEEL': 'Metals', 'HINDALCO': 'Metals',
  'SUNPHARMA': 'Pharma', 'DRREDDY': 'Pharma', 'CIPLA': 'Pharma', 'LUPIN': 'Pharma',
  'BHARTIARTL': 'Telecom',
  'ZOMATO': 'Food Tech', 'PAYTM': 'Fintech', 'NYKAA': 'E-commerce',
  'SUZLON': 'Renewable Energy'
};
