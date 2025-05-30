import {
  StockQuoteData,
  MarketStatus,
} from "../../types/appTypes";
import * as logger from "firebase-functions/logger";
import polygonIoRestClient, {IRestClient} from "polygon.io"; // Assuming IRestClient is a valid export

/* Class to encapsulate Polygon.io API interactions as per PRD section 6.2.1.
 * This class provides methods to fetch market status and stock snapshots
 * using the polygon.io client library.
 */

/**
 * Client for interacting with the Polygon.io API.
 * As per PRD section 6.2.1.
 */
export class PolygonClient {
  // Using IRestClient if available and compatible, otherwise 'any' might be needed
  // if the library's typings are not precise or lead to other issues.
  // For now, let's assume IRestClient is appropriate or revert to 'any' if it causes problems.
  private client: IRestClient;
  private logger: typeof logger; // Logger property

  // Line 22: Ensured this area is clean (no trailing spaces on empty lines)
  /**
   * Creates an instance of PolygonClient.
   * Retrieves the Polygon API key from environment variables.
   * @throws {Error} If the Polygon API key is not configured.
   * @param {object} loggerInstance The logger instance to use (JSDoc type as object).
   */
  constructor(loggerInstance: typeof logger) { // TypeScript type is specific
    this.logger = loggerInstance; // Initialize the logger property
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      this.logger.error("Polygon.io API key not found in environment config.");
      throw new Error("Polygon.io API key not configured.");
    }
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
      const marketStatusResponse = await this.client.markets.status();
      this.logger.info("Successfully fetched market status", {
        status: marketStatusResponse.market,
      });
      return {
        market: marketStatusResponse.market,
        serverTime: marketStatusResponse.serverTime,
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
          String(err)
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
      const snapshot = await this.client.stocks.snapshots.ofTicker(ticker);

      if (!snapshot || !snapshot.ticker) {
        this.logger.warn(`No snapshot data found for ticker: ${ticker}`);
        return null;
      }

      const stockQuote: StockQuoteData = {
        ticker: snapshot.ticker.ticker.toUpperCase(),
        price: snapshot.ticker.lastTrade?.price,
        open: snapshot.ticker.day?.open,
        high: snapshot.ticker.day?.high,
        low: snapshot.ticker.day?.low,
        volume: snapshot.ticker.day?.volume,
        timestamp: snapshot.ticker.lastTrade?.timestamp,
        name: snapshot.ticker.name,
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
        this.logger.error(baseErrorMsg, err.message); // Ensured this.logger
        throw new Error(
          `Failed to fetch stock quote for ${ticker}. ${err.message}`
        );
      } else {
        this.logger.error(baseErrorMsg, String(err)); // Ensured this.logger
        throw new Error(
          `Failed to fetch stock quote for ${ticker}. ${String(err)}`
        );
      }
    }
  }
}

const polygonClientInstance = new PolygonClient(logger); // Pass logger
export const getMarketStatus =
  polygonClientInstance.getMarketStatus.bind(polygonClientInstance);
export const getStockQuote =
  polygonClientInstance.getStockQuote.bind(polygonClientInstance);
