import {
  StockQuoteData,
  MarketStatus,
} from "../../types/appTypes";
import * as logger from "firebase-functions/logger";
import polygonIoRestClient from "polygon.io";

/* Class to encapsulate Polygon.io API interactions as per PRD section 6.2.1.
 * This class provides methods to fetch market status and stock snapshots
 * using the polygon.io client library.
 */

/**
 * Client for interacting with the Polygon.io API.
 * As per PRD section 6.2.1.
 */
export class PolygonClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any; // Changed type back to any

  private logger: typeof logger; // Add logger property
 

  /**
    * Creates an instance of PolygonClient.
    * Retrieves the Polygon API key from environment variables.
    * @throws {Error} If the Polygon API key is not configured.
    * @param {typeof logger} logger The logger instance to use.
  */
  constructor(logger: typeof logger) {
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      logger.error("Polygon.io API key not found in environment config.");
      throw new Error("Polygon.io API key not configured.");
    }
    // Explicitly cast to any to bypass strict type checks for now
    this.client = polygonIoRestClient(polygonApiKey);
    this.client.debug(true); // Enable debug mode as per PRD
  }

  /**
   * Fetches the current market status from Polygon.io.
   * @return {Promise<MarketStatus>} A promise that resolves with the
   * market status.
   */
  async getMarketStatus(): Promise<MarketStatus> {
    this.logger.info("Fetching market status from Polygon.io");
    try {
      // Assuming the polygon.io client library's marketStatus method
      // returns a structure compatible with our MarketStatus type.
      // If not, specific mapping would be needed.
      const marketStatusResponse = await this.client.markets.status();
      this.logger.info("Successfully fetched market status", {
        status: marketStatusResponse.market, // Assuming 'market' holds status
      });
      // Perform mapping if the response structure differs from MarketStatus
      // For now, assuming direct compatibility or MarketStatus is flexible.
      return {
        market: marketStatusResponse.market, // e.g., 'open', 'closed'
        serverTime: marketStatusResponse.serverTime, // ISO string
        // Add other fields if present and defined in MarketStatus
      } as MarketStatus;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          "Error fetching market status from Polygon.io:",
          err.message
        );
        throw new Error(`Failed to fetch market status: ${err.message}`);
      } else {
        this.logger.error(
          "Unknown error fetching market status from Polygon.io:",
          String(err) // Use String(err) for unknown error types
        );
        throw new Error(
          `Failed to fetch market status: ${String(err)}`
        );
      }
    }
  }

  /**
   * Fetches the stock quote snapshot for a given ticker from Polygon.io.
   * @param {string} ticker The stock ticker symbol.
   * @return {Promise<StockQuoteData | null>} A promise that resolves
   * with the stock quote data or null if not found.
   */
  async getStockQuote(ticker: string): Promise<StockQuoteData | null> {
    this.logger.info(
      `Fetching stock quote for ticker: ${ticker} from Polygon.io`
    );
    if (!ticker) {
      this.logger.error("Ticker not provided for getStockQuote.");
      throw new Error("Ticker is required.");
    }

    try {
      // Using snapshotTicker as specified in the PRD section 6.2.2
      // This provides a snapshot of the last trade and other key
      // metrics, without needing to query multiple endpoints.
      const snapshot = await this.client.stocks.snapshots.ofTicker(ticker);

      if (!snapshot || !snapshot.ticker) {
        this.logger.warn(`No snapshot data found for ticker: ${ticker}`);
        return null;
      }

      // Map snapshot data to StockQuoteData structure
      // as defined in types/appTypes.ts
      const stockQuote: StockQuoteData = {
        ticker: snapshot.ticker.ticker.toUpperCase(),
        price: snapshot.ticker.lastTrade?.price, // Optional chaining
        open: snapshot.ticker.day?.open,
        high: snapshot.ticker.day?.high,
        low: snapshot.ticker.day?.low,
        volume: snapshot.ticker.day?.volume,
        timestamp: snapshot.ticker.lastTrade?.timestamp,
        name: snapshot.ticker.name, // Example
        todaysChange: snapshot.ticker.todaysChange,
        todaysChangePerc: snapshot.ticker.todaysChangePerc,
        updated: snapshot.ticker.updated,
        day: snapshot.ticker.day,
        lastTrade: snapshot.ticker.lastTrade,
      };

      this.logger.info(`Successfully fetched stock quote for ${ticker}`, {
        price: stockQuote.price,
      });
      return stockQuote;
    } catch (err) {
      const baseErrorMsg =
        `Error fetching stock quote for ${ticker} from Polygon.io:`;
      if (err instanceof Error) {
        logger.error(baseErrorMsg, err.message);
        throw new Error(
          `Failed to fetch stock quote for ${ticker}. ${err.message}`
        );
      } else {
        logger.error(baseErrorMsg, String(err)); // For unknown error types
        throw new Error(
          `Failed to fetch stock quote for ${ticker}. ${String(err)}`
        );
      }
    }
  }
}
// Export an instance of the PolygonClient and its relevant methods
const polygonClientInstance = new PolygonClient(logger); // Pass logger instance
export const getMarketStatus =
  polygonClientInstance.getMarketStatus.bind(polygonClientInstance);
export const getStockQuote =
  polygonClientInstance.getStockQuote.bind(polygonClientInstance);
