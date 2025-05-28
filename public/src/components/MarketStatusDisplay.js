import { MarketStatusDisplay } from './components/MarketStatusDisplay.js';
import { StockQuoteDisplay } from './components/StockQuoteDisplay.js';
import { AISimpleInsightsDisplay } from './components/AISimpleInsightsDisplay.js';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
console.log('main.js loaded');

// Get references to the display divs
const marketStatusElement = document.getElementById('market-status');
const stockQuoteElement = document.getElementById('stock-quote');
const aiInsightsElement = document.getElementById('ai-insights');

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
const functions = getFunctions(app);

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

// Function to call getStockDataAndInsights (will be called later)
const callGetStockDataAndInsights = (ticker) => {
  const getStockDataAndInsightsCallable = httpsCallable(functions, 'getStockDataAndInsights');
  getStockDataAndInsightsCallable({ ticker: ticker }).then((result) => {
    console.log('Stock Data and Insights:', result.data);
  }).catch((error) => {
    console.error('Error getting stock data and insights:', error);
  });
};