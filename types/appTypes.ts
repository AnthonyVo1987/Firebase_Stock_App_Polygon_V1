export interface MarketStatus {
  market: string;
  serverTime: string;
}

export interface StockQuoteData {
  ticker: string;
  price?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp?: number;
  name?: string;
  todaysChange?: number;
  todaysChangePerc?: number;
  updated?: number;
  day?: {
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
  };
  lastTrade?: { price?: number; timestamp?: number };
}

export type AISimpleInsights = [string, string, string];