import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getMarketStatus as getPolygonMarketStatus, getStockQuote } from "./polygonClient"; // Import from the new module
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define and export getMarketStatus callable function
export const getMarketStatus = onCall(async (request) => {
  logger.info("getMarketStatus callable function called.", { structuredData: true });

  try {
    const marketStatus = await getPolygonMarketStatus(); // Call the function from the module
    logger.info("Successfully fetched market status.", { structuredData: true });
    return marketStatus;
  } catch (error) {
    logger.error("Error in getMarketStatus callable function:", error);
    // Rethrow the error to be sent back to the client
    throw new onCall.HttpsError('internal', 'Failed to fetch market status.', error);
  }
});

// Define and export getStockDataAndInsights callable function
export const getStockDataAndInsights = onCall(async (request) => {
  logger.info("getStockDataAndInsights callable function called.", { structuredData: true });

  const ticker = request.data.ticker;
  if (!ticker) {
    logger.error("Ticker not provided in request data for getStockDataAndInsights.");
    throw new onCall.HttpsError('invalid-argument', 'Ticker is required.');
  }

  // Retrieve Gemini API key from environment configuration (as per PRD section 6.2.3)
  const geminiApiKey = process.env.API_KEY;
   if (!geminiApiKey) {
    logger.error("Gemini API key not found in environment configuration.");
    throw new onCall.HttpsError('internal', 'Gemini API key not configured.');
  }


  try {
    // Call the getStockQuote function from the polygonClient module
    const stockQuote = await getStockQuote(ticker);
    logger.info(`Successfully fetched stock quote for ${ticker}.`, { structuredData: true });

    // Use @google/generative-ai library and Gemini API to generate insights
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    // Use the model specified in PRD section 6.4.3
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17"});

    try {
      // Based on PRD section 6.4.3
      const prompt = `Generate three simple insights based on the following stock data in a concise list format:\\n${JSON.stringify(stockQuote)}. Focus on key metrics like price change, volume, and daily range.`;
      const result = await model.generateContent(prompt);
      const insightsText = result.response.text();

      // Assuming insights are returned as newline-separated strings or similar
      const insights = insightsText.split('\\n').filter(line => line.trim() !== '').slice(0, 3);
      logger.info(`Successfully generated AI insights for ${ticker}.`, { structuredData: true });

      return { stockQuote, insights };

    } catch (aiError) {
      logger.error("Error generating insights from Gemini API:", aiError);
      // Continue with stock data even if insights generation fails, return a placeholder insight
      return { stockQuote, insights: ["Failed to generate insights."] };
    }

  } catch (error) {
    logger.error("Error in getStockDataAndInsights callable function:", error);
    // Rethrow the error to be sent back to the client
    throw new onCall.HttpsError('internal', 'Failed to get stock data or insights.', error);
  }
});