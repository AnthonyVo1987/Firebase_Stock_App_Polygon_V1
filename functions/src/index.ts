import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getMarketStatus as getPolygonMarketStatus, getStockQuote}
  from "./polygonClient"; // Import from the new module
import {GoogleGenerativeAI} from "@google/generative-ai";

// Define and export getMarketStatus callable function
export const getMarketStatus = onCall(
  async () => {
    logger.info("getMarketStatus callable function called.",
      {structuredData: true});

    try {
      // Call the function from the module to get the latest market status
      // from Polygon.io as specified in PRD section 6.2.2
      const marketStatus = await getPolygonMarketStatus();
      logger.info("Successfully fetched market status.",
        {structuredData: true});
      return marketStatus;
    } catch (error) {
      logger.error("Error in getMarketStatus callable function:", error);
      // Rethrow the error to be sent back to the client
      throw new onCall.HttpsError(
        "internal",
        "Failed to fetch market status.",
        error
      );
    }
  });


// Define and export getStockDataAndInsights callable function
export const getStockDataAndInsights = onCall(
  async (request) => {
    // Log function call with structured data
    logger.info("getStockDataAndInsights callable function called.",
      {structuredData: true});

    // Extract ticker from request data
    const ticker = request.data?.ticker;

    if (!ticker) {
      logger.error(
        "Ticker not provided in request data for getStockDataAndInsights."
      );
      // Throw a HttpsError with a clear code and message
      throw new onCall.HttpsError("invalid-argument", "Ticker is required.");
    }

    // Retrieve Gemini API key from environment configuration
    // (as per PRD section 6.2.3)
    // Ensure API key is configured for accessing Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY; // Corrected env var name
    if (!geminiApiKey) {
      logger.error(
        "Gemini API key not found in environment configuration."
      );
      throw new onCall.HttpsError("internal",
        "Gemini API key not configured.");
    }

    // Use @google/generative-ai library and Gemini API to generate insights
    // Initialize the Generative AI client with the API key
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    // Use the specific model for generating insights as per PRD section 6.4.3
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
    });

    try {
      // Call the getStockQuote function from the polygonClient module
      // to fetch stock data from Polygon.io
      const stockQuote = await getStockQuote(ticker);
      logger.info(
        `Successfully fetched stock quote for ${ticker}.`,
        {structuredData: true}
      );

      try {
        // Generate simple insights using Gemini API based on stock data
        // Based on PRD section 6.4.3
        // Craft a detailed prompt for the AI to generate relevant 
        // stock insights
        const prompt =
          "Generate three simple insights based on the following " +
          "stock data in a concise list format:\\n" +
          `${JSON.stringify(stockQuote)}. Focus on key metrics like ` +
          "price change, volume, and daily range.";
        const result = await model.generateContent(prompt);
        const insightsText = result.response.text();

        // Assuming insights are returned as newline-separated strings or similar,
        // filter empty lines and take the first 3.
        const insights = insightsText
          .split("\\n")
          .filter((line) => line.trim() !== "")
          .slice(0, 3);
        logger.info(
          `Successfully generated AI insights for ${ticker}.`,
          {structuredData: true}
        );

        return {stockQuote, insights};
      } catch (aiError) {
        logger.error("Error generating insights from Gemini API:", aiError);
        // Continue with stock data even if insights generation fails,
        // return a placeholder insight
        return {stockQuote, insights: ["Failed to generate insights."]};
      }
    } catch (error) {
      logger.error("Error in getStockDataAndInsights callable function:",
        error);
      // Rethrow the error to be sent back to the client
      // as per Firebase callable functions error handling
      throw new onCall.HttpsError(
        "internal",
        "Failed to get stock data or insights.",
        error
      );
    }
  });