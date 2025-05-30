
export class GrowwDataService {
  private futuresData = [
    {
      symbol: 'NIFTY25JAN24850CE',
      expiry: '30-Jan-2025',
      ltp: 1247.50,
      change: 12.45,
      volume: '2.5M',
      oi: '1.2M',
      type: 'futures'
    },
    {
      symbol: 'BANKNIFTY25JAN51500CE',
      expiry: '30-Jan-2025',
      ltp: 876.25,
      change: -8.75,
      volume: '1.8M',
      oi: '950K',
      type: 'futures'
    },
    {
      symbol: 'RELIANCE25JAN2850CE',
      expiry: '30-Jan-2025',
      ltp: 45.50,
      change: 5.25,
      volume: '500K',
      oi: '250K',
      type: 'futures'
    },
    {
      symbol: 'TCS25JAN3700CE',
      expiry: '30-Jan-2025',
      ltp: 89.75,
      change: -3.25,
      volume: '350K',
      oi: '180K',
      type: 'futures'
    },
    {
      symbol: 'INFY25JAN1500CE',
      expiry: '30-Jan-2025',
      ltp: 67.50,
      change: 8.90,
      volume: '420K',
      oi: '210K',
      type: 'futures'
    },
    {
      symbol: 'HDFCBANK25JAN1700CE',
      expiry: '30-Jan-2025',
      ltp: 134.25,
      change: -5.50,
      volume: '680K',
      oi: '340K',
      type: 'futures'
    },
    {
      symbol: 'ICICIBANK25JAN950CE',
      expiry: '30-Jan-2025',
      ltp: 78.90,
      change: 4.75,
      volume: '520K',
      oi: '260K',
      type: 'futures'
    },
    {
      symbol: 'ADANIENT25JAN2900CE',
      expiry: '30-Jan-2025',
      ltp: 156.75,
      change: 15.25,
      volume: '380K',
      oi: '190K',
      type: 'futures'
    },
    {
      symbol: 'BAJFINANCE25JAN6600CE',
      expiry: '30-Jan-2025',
      ltp: 298.50,
      change: 22.75,
      volume: '290K',
      oi: '145K',
      type: 'futures'
    },
    {
      symbol: 'TATAMOTORS25JAN780CE',
      expiry: '30-Jan-2025',
      ltp: 89.25,
      change: 7.50,
      volume: '450K',
      oi: '225K',
      type: 'futures'
    }
  ];

  private optionsData = [
    {
      symbol: 'NIFTY25JAN24850CE',
      expiry: '30-Jan-2025',
      ltp: 125.50,
      change: 8.75,
      volume: '5.2M',
      oi: '2.8M',
      type: 'options'
    },
    {
      symbol: 'NIFTY25JAN24800PE',
      expiry: '30-Jan-2025',
      ltp: 89.25,
      change: -12.50,
      volume: '4.1M',
      oi: '2.1M',
      type: 'options'
    },
    {
      symbol: 'BANKNIFTY25JAN51500CE',
      expiry: '30-Jan-2025',
      ltp: 234.75,
      change: 18.25,
      volume: '3.8M',
      oi: '1.9M',
      type: 'options'
    },
    {
      symbol: 'BANKNIFTY25JAN51000PE',
      expiry: '30-Jan-2025',
      ltp: 187.50,
      change: -15.75,
      volume: '3.2M',
      oi: '1.6M',
      type: 'options'
    },
    {
      symbol: 'RELIANCE25JAN2850CE',
      expiry: '30-Jan-2025',
      ltp: 34.50,
      change: 6.25,
      volume: '1.2M',
      oi: '600K',
      type: 'options'
    },
    {
      symbol: 'RELIANCE25JAN2800PE',
      expiry: '30-Jan-2025',
      ltp: 28.75,
      change: -4.50,
      volume: '980K',
      oi: '490K',
      type: 'options'
    },
    {
      symbol: 'TCS25JAN3700CE',
      expiry: '30-Jan-2025',
      ltp: 45.25,
      change: 7.75,
      volume: '850K',
      oi: '425K',
      type: 'options'
    },
    {
      symbol: 'TCS25JAN3650PE',
      expiry: '30-Jan-2025',
      ltp: 38.90,
      change: -5.25,
      volume: '720K',
      oi: '360K',
      type: 'options'
    },
    {
      symbol: 'INFY25JAN1500CE',
      expiry: '30-Jan-2025',
      ltp: 52.75,
      change: 9.50,
      volume: '1.1M',
      oi: '550K',
      type: 'options'
    },
    {
      symbol: 'INFY25JAN1450PE',
      expiry: '30-Jan-2025',
      ltp: 41.25,
      change: -6.75,
      volume: '890K',
      oi: '445K',
      type: 'options'
    }
  ];

  async getFOData(segment: 'futures' | 'options') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = segment === 'futures' ? this.futuresData : this.optionsData;

    // Add some random variations for live effect
    const liveData = data.map(item => ({
      ...item,
      ltp: parseFloat((item.ltp + (Math.random() - 0.5) * 5).toFixed(2)),
      change: parseFloat((item.change + (Math.random() - 0.5) * 2).toFixed(2))
    }));

    // Sort by different criteria
    const topGainers = [...liveData].sort((a, b) => b.change - a.change).slice(0, 10);
    const topLosers = [...liveData].sort((a, b) => a.change - b.change).slice(0, 10);
    const mostActive = [...liveData].sort(() => Math.random() - 0.5).slice(0, 10);
    const volatility = [...liveData].sort(() => Math.random() - 0.5).slice(0, 10);
    const volume = [...liveData].sort(() => Math.random() - 0.5).slice(0, 10);

    return {
      topGainers,
      topLosers,
      mostActive,
      volatility,
      volume,
      stocks: liveData,
      totalContracts: liveData.length,
      indices: [
        { name: 'NIFTY 50', value: 24850.75, change: 2.45 },
        { name: 'BANK NIFTY', value: 51234.50, change: -1.25 },
        { name: 'NIFTY IT', value: 37890.25, change: 1.85 }
      ]
    };
  }

  async getIndicesData() {
    return [
      { name: 'NIFTY 50', value: 24850.75, change: 2.45 },
      { name: 'BANK NIFTY', value: 51234.50, change: -1.25 },
      { name: 'NIFTY IT', value: 37890.25, change: 1.85 },
      { name: 'NIFTY PHARMA', value: 18450.30, change: 0.95 }
    ];
  }
}
