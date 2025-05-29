import {restClient} from "polygon.io";
import * as logger from "firebase-functions/logger";
import {StockQuoteData, MarketStatus} from "../types/appTypes";

/**
* Class to encapsulate Polygon.io API interactions as per PRD section 6.2.1.
* This class provides methods to fetch market status and stock snapshots
* using the polygon.io client library.*/

/**
 * Client for interacting with the Polygon.io API.
 * As per PRD section 6.2.1.
 */

/**
 * Client for interacting with the Polygon.io API.
 * As per PRD section 6.2.1.
 */

export class PolygonClient {
  private client: restClient;

  /**
   * Creates an instance of PolygonClient.
   * Retrieves the Polygon API key from environment variables.
   * @throws {Error} If the Polygon API key is not configured.
   */
  constructor() {
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      logger.error("Polygon.io API key not found in environment config.");
      throw new Error("Polygon.io API key not configured.");
    }
    this.client = new restClient(polygonApiKey);
    this.client.debug(true); // Enable debug mode as per PRD
  }

  /**
   * Fetches the current market status from Polygon.io.
   * @returns {Promise<MarketStatus>} A promise that resolves
   *   with the market status.
   */
  /**
   * Fetches the current market status from Polygon.io.
    * Fetches the current market status from Polygon.io.
    * @return {Promise<MarketStatus>} A promise that resolves with the market status.
    */
  async getMarketStatus(): Promise<MarketStatus> {
    logger.info("Fetching market status from Polygon.io");
    try {
      const marketStatus = await this.client.markets.status();
      logger.info(
        "Successfully fetched market status",
        {status: marketStatus.status}
      );
      // Assuming MarketStatus structure from types/appTypes.ts matches Polygon response
      return marketStatus as MarketStatus;
    } catch (error) {
      logger.error("Error fetching market status from Polygon.io:", error);
      throw new Error("Failed to fetch market status.");
    }
  }

  /**
   * Fetches the stock quote snapshot for a given ticker from Polygon.io.
   * @param {string} ticker The stock ticker symbol.
 * @return {Promise<StockQuoteData | null>} A promise that resolves
   *   with the stock quote data or null if not found.
  */
  async getStockQuote(
    ticker: string):
  Promise<StockQuoteData | null> {
    logger.info(
      `Fetching stock quote snapshot for ticker: ${ticker} from ` +
      "Polygon.io"
    );
    if (!ticker) {
      logger.error("Ticker not provided for getStockQuote.");
      throw new Error("Ticker is required.");
    }

    try {
      // Using snapshotTicker as specified in the PRD section 6.2.2
      // This provides a snapshot of the last trade and other key
      // metrics, without needing to query multiple endpoints. The
      // .ofTicker() method is used to get a snapshot for a specific ticker.
      const snapshot =
        await this.client.stocks.snapshots.ofTicker(ticker);

      if (!snapshot || !snapshot.ticker) {
        logger.warn(`No snapshot data found for ticker: ${ticker}`);
        return null;
      }

      // Map snapshot data to StockQuoteData structure
      // as defined in types/appTypes.ts
      const stockQuote: StockQuoteData = {
        ticker: snapshot.ticker.ticker.toUpperCase(), // Ensure ticker is uppercase
        price: snapshot.ticker.lastTrade.price, // Assuming price is available here
        open: snapshot.ticker.day.open,
        high: snapshot.ticker.day.high,
        low: snapshot.ticker.day.low,
        volume: snapshot.ticker.day.volume,
        timestamp: snapshot.ticker.lastTrade.timestamp, // Using timestamp from lastTrade
      };

      logger.info(
        `Successfully fetched stock quote snapshot for ${ticker}`,
        {price: stockQuote.price}

      );
      return stockQuote;
    } catch (error) {
      logger.error(
        `Error fetching stock quote snapshot for ticker ${ticker} from Polygon.io:`,
        error);
      throw new Error(`Failed to fetch stock quote for ${ticker}.`);
    }
  }
}
