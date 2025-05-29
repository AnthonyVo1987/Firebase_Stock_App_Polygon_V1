import { MarketStatusDisplay } from './components/MarketStatusDisplay.js';
import { StockQuoteDisplay } from './components/StockQuoteDisplay.js';
import { AISimpleInsightsDisplay } from './components/AISimpleInsightsDisplay.js';
import { initializeApp } from 'firebase/app';
// Functions for interacting with Cloud Functions
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
console.log('main.js loaded');

// Get references to the display divs
const marketStatusElement = document.getElementById('market-status');
const stockQuoteElement = document.getElementById('stock-quote');
const aiInsightsElement = document.getElementById('ai-insights');
const tickerInput = document.getElementById('ticker-input');

// Placeholder data
const placeholderMarketStatus = {
  status: 'OPEN',
  delay: 0
};

const placeholderStockQuote = {
  ticker: 'AAPL',
  price: 170.00,
  open: 169.50,
  high: 171.20,
  low: 168.90,
  volume: 1000000,
  timestamp: Date.now()
};

const placeholderAiInsights = [
  "Insight 1: This is a sample insight.",
  "Insight 2: Another interesting observation.",
  "Insight 3: A final thought on the stock."
];

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration object
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Functions
const functions = getFunctions(app);
// Connect to the Functions emulator if running locally
if (window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

// Callable function references
const getMarketStatusAndQuoteCallable = httpsCallable(functions, 'getMarketStatusAndQuote');
const generateStockInsightsCallable = httpsCallable(functions, 'generateStockInsights');
// Call getMarketStatus on page load
const callGetMarketStatus = httpsCallable(functions, 'getMarketStatus');
callGetMarketStatus().then((result) => {
  console.log('Market Status:', result.data);
}).catch((error) => {
  console.error('Error getting market status:', error);
});


// Instantiate components and render placeholder data
if (marketStatusElement) {
  const marketStatusDisplay = new MarketStatusDisplay(marketStatusElement);
  marketStatusDisplay.render(placeholderMarketStatus);
}

if (stockQuoteElement) {
  const stockQuoteDisplay = new StockQuoteDisplay(stockQuoteElement);
  stockQuoteDisplay.render(placeholderStockQuote);
}

if (aiInsightsElement) {
  const aiSimpleInsightsDisplay = new AISimpleInsightsDisplay(aiInsightsElement);
  aiSimpleInsightsDisplay.render(placeholderAiInsights);
}

// Event listeners for buttons
document.getElementById('get-stock-data-button')?.addEventListener('click', handleGetMarketAndQuote);
document.getElementById('generate-insights-button')?.addEventListener('click', handleGenerateAIInsights);

// Handle button clicks
// Function to handle fetching market status and stock quote
async function handleGetMarketAndQuote() {
  // Display loading state
  if (stockQuoteElement) stockQuoteElement.innerHTML = 'Loading stock data...';
  if (marketStatusElement) marketStatusElement.innerHTML = 'Loading market status...';

  const ticker = tickerInput.value.trim();
  if (ticker) {
    try {
      const result = await getMarketStatusAndQuoteCallable({ ticker: ticker.toUpperCase() });
      console.log('Market Status and Quote:', result.data);
      if (stockQuoteElement) {
        const stockQuoteDisplay = new StockQuoteDisplay(stockQuoteElement);
        stockQuoteDisplay.render(result.data.stockQuote);
      }
      if (marketStatusElement) {
        const marketStatusDisplay = new MarketStatusDisplay(marketStatusElement);
        marketStatusDisplay.render(result.data.marketStatus);
      }
    } catch (error) {
      console.error('Error getting market status and quote:', error);
      if (stockQuoteElement) stockQuoteElement.innerHTML = 'Error loading stock data.';
      if (marketStatusElement) marketStatusElement.innerHTML = 'Error loading market status.';
    }
  } else {
    alert('Please enter a ticker symbol.');
  }
}

// Function to handle generating AI insights
async function handleGenerateAIInsights() {
  // Display loading state
  if (aiInsightsElement) aiInsightsElement.innerHTML = 'Generating AI insights...';

  const ticker = tickerInput.value.trim();
  if (ticker) {
  try {
    const result = await generateStockInsightsCallable({ ticker: ticker.toUpperCase() });
    console.log('Stock Insights:', result.data);
    if (aiInsightsElement) {
      const aiSimpleInsightsDisplay = new AISimpleInsightsDisplay(aiInsightsElement);
      aiSimpleInsightsDisplay.render(result.data.insights);
    }
  } catch (error) {
    console.error('Error generating stock insights:', error);
    if (aiInsightsElement) aiInsightsElement.innerHTML = 'Error generating AI insights.';
  }
  } else {
    alert('Please enter a ticker symbol.');
  }
}

// Note: The original `getMarketStatusAndQuote` and `generateStockInsights` functions were removed
// as the logic was moved into the event handler functions.