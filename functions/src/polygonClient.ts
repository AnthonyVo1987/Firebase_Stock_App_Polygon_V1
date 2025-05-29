import { restClient } from "polygon.io";
import * as logger from "firebase-functions/logger";
import { StockQuoteData, MarketStatus } from "../types/appTypes"; // Assuming types are defined here

class PolygonClient {
  private client: restClient;

  constructor() {
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      logger.error("Polygon.io API key not found in environment configuration.");
      throw new Error("Polygon.io API key not configured.");
    }
    this.client = new restClient(polygonApiKey);
    this.client.debug(true); // Enable debug mode as per PRD
  }

  async getMarketStatus(): Promise<MarketStatus> {
    logger.info("Fetching market status from Polygon.io");
    try {
      const marketStatus = await this.client.markets.status();
      logger.info("Successfully fetched market status", { status: marketStatus.status });
      // Assuming MarketStatus structure from types/appTypes.ts matches Polygon response
      return marketStatus as MarketStatus;
    } catch (error) {
      logger.error("Error fetching market status from Polygon.io:", error);
      throw new Error("Failed to fetch market status.");
    }
  }

  async getStockQuote(ticker: string): Promise<StockQuoteData | null> {
    logger.info(`Fetching stock quote snapshot for ticker: ${ticker} from Polygon.io`);
    if (!ticker) {
      logger.error("Ticker not provided for getStockQuote.");
      throw new Error("Ticker is required.");
    }

    try {
      // Using snapshotTicker as specified in the PRD
      const snapshot = await this.client.stocks.snapshots.ofTicker(ticker);

      if (!snapshot || !snapshot.ticker) {
        logger.warn(`No snapshot data found for ticker: ${ticker}`);
        return null;
      }

      // Map snapshot data to StockQuoteData structure
      const stockQuote: StockQuoteData = {
        ticker: snapshot.ticker.ticker.toUpperCase(),
        price: snapshot.ticker.lastTrade.price, // Assuming price is available here
        open: snapshot.ticker.day.open,
        high: snapshot.ticker.day.high,
        low: snapshot.ticker.day.low,
        volume: snapshot.ticker.day.volume,
        timestamp: snapshot.ticker.lastTrade.timestamp, // Using timestamp from lastTrade
      };

      logger.info(`Successfully fetched stock quote snapshot for ${ticker}`, { price: stockQuote.price });
      return stockQuote;

    } catch (error) {
      logger.error(`Error fetching stock quote snapshot for ticker ${ticker} from Polygon.io:`, error);
      throw new Error(`Failed to fetch stock quote for ${ticker}.`);
    }
  }
}

export const polygonClient = new PolygonClient();