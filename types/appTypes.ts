export interface MarketStatus {
  status: string;
  delay: number;
}

export interface StockQuoteData {
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export type AISimpleInsights = [string, string, string];