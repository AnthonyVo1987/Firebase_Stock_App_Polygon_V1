/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";
import { restClient } from '@polygon.io/client-js';
import { MarketStatus } from "../../types/appTypes";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const getMarketStatus = onCall(async (request) => {
  // Retrieve Polygon.io API key from environment configuration
  const polygonApiKey = process.env.POLYGON_API_KEY;
  const polygonClient = restClient(polygonApiKey);
  const marketStatus = await polygonClient.stocks.marketsStatus();
  // The structure of marketStatus from the API might vary slightly,
  // assuming it has a 'marketStatus' property which is an object
  // with 'status' and 'delay' properties for US market.
  return marketStatus.results.markets.us as MarketStatus;
});

export const getStockDataAndInsights = onCall(async (request) => {
  // Retrieve Polygon.io API key from environment configuration
  const polygonApiKey = process.env.POLYGON_API_KEY;
  // Retrieve Gemini API key from environment configuration
  // Placeholder data for now
  return {
    stockQuote: { ticker: 'AAPL', price: 150.00, open: 148.00, high: 152.00, low: 147.00, volume: 1000000, timestamp: Date.now() },
    aiInsights: ['Insight 1', 'Insight 2', 'Insight 3']
  };
});
