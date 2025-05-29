/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { restClient } from "polygon.io";
import { GoogleGenerativeAI } from "@google/generative-ai";




// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const getMarketStatus = onCall(async (request) => {
 logger.info("getMarketStatus function called.", { structuredData: true });

 // Retrieve Polygon.io API key from environment configuration
  const polygonApiKey = process.env.POLYGON_API_KEY;
  if (!polygonApiKey) {
    logger.error("Polygon.io API key not found in environment configuration.");
    throw new Error("Polygon.io API key not configured.");
  }

  const polygonClient = new restClient(polygonApiKey);

  try {
    const marketStatus = await polygonClient.markets.status();
    return marketStatus;
  } catch (error) {
    logger.error("Error fetching market status from Polygon.io:", error);
    throw new Error("Failed to fetch market status.");
  }
});

export const getStockDataAndInsights = onCall(async (request) => {
 logger.info("getStockDataAndInsights function called", { structuredData: true });

  // Retrieve Polygon.io and Gemini API keys from environment configuration
  const polygonApiKey = process.env.POLYGON_API_KEY;
  const geminiApiKey = process.env.API_KEY; // According to PRD section 6.2.3

 if (!polygonApiKey) {
    logger.error("Polygon.io API key not found in environment configuration.");
    throw new Error("Polygon.io API key not configured.");

  }
  if (!geminiApiKey) {
    logger.error("Gemini API key not found in environment configuration.");
    throw new Error("Gemini API key not configured.");
  }

  const ticker = request.data.ticker;
  if (!ticker) {
 logger.error("Ticker not provided in request data.");
    throw new Error("Ticker is required.");
  }

  const polygonClient = new restClient(polygonApiKey);
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17"}); // As per PRD section 6.4.3

 try {
    // Use polygon.io library to fetch stock data for the given ticker
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const stockData = await polygonClient.stocks.aggregates(ticker, 1, "day", date, date);

    if (!stockData || !stockData.results || stockData.results.length === 0) {
 logger.warn(`No daily data found for ticker: ${ticker} on ${date}`);
      // Return partial data or throw an error as per your application's needs
      return { stockQuote: null, aiInsights: ["No data available for this ticker."] };
    }

    // Extract the relevant data for the stockQuote structure
    const dailyData = stockData.results[0];
    const stockQuote = {
      ticker: ticker.toUpperCase(), // Ensure ticker is uppercase
      price: dailyData.c, // Closing price
      open: dailyData.o, // Opening price
      high: dailyData.h, // High price
      low: dailyData.l, // Low price
      volume: dailyData.v, // Volume
      timestamp: Date.now(), // Use current timestamp or dailyData.t if available and accurate
    };

    // Use @google/generative-ai library and Gemini API to generate insights
 try {
      const prompt = `Generate three simple insights based on the following stock data in a concise list format:\n${JSON.stringify(stockQuote)}. Focus on key metrics like price change, volume, and daily range.`; // Based on PRD section 6.4.3
      const result = await model.generateContent(prompt)
      const insightsText = result.response.text();

      // Assuming insights are returned as newline-separated strings or similar
      const insights = insightsText.split('\\n').filter(line => line.trim() !== '').slice(0, 3);

      return { stockQuote, insights };
 } catch (aiError) {
 logger.error("Error generating insights from Gemini API:", aiError);
 // Continue with stock data even if insights generation fails
 return { stockQuote, aiInsights: ["Failed to generate insights."] };
 }
  } catch (error) {
    logger.error("Error fetching stock data or generating insights:", error);
    throw new Error("Failed to get stock data or insights.");
  }
});