Product Requirements Document: Firebase Polygon Stock Options WebApp \- Phase 1 (AI-First, Scratch Build)

**Version:** 1.1 (Corrected for True Scratch Implementation)  
 **Date:** October 26, 2023  
 **Target Implementer:** AI-Assisted Coding Platform (e.g., Firebase Station AI)

**1\. Introduction**

* **1.1. Project Overview:**  
   This document outlines the requirements for Phase 1 of the "AI Powered Stock & Options Analysis WebApp." The application will leverage Polygon.io for stock market data and Google's Gemini API for AI-generated insights. The entire stack will be built **from scratch** and deployed within the Firebase ecosystem.  
* **1.2. Document Purpose:**  
   This PRD serves as the complete specification for an AI-assisted coding platform to implement Phase 1 of the web application **from a blank slate**. All instructions and details are provided to enable full-stack code generation and implementation without manual coding intervention from a human user, and without reference to any pre-existing application code or structure (except for the specified Polygon API library).  
* **1.3. Phase 1 Goals:**  
  1. Establish a functional web application capable of retrieving and displaying market status and stock quotes from Polygon.io.  
  2. Integrate Google's Gemini API to provide basic AI-driven insights based on stock quote data.  
  3. Implement a user-friendly interface with essential controls, data display panels, and a developer debug console.  
  4. Ensure robust data export (JSON, CSV) and copy-to-clipboard functionality for all relevant data sections.  
  5. Build the application with modularity, debuggability, and clear logging in mind, utilizing Firebase for backend services and hosting.  
  6. Strictly use the provided polygon\_api\_libraries\_client-js-master JavaScript library for all Polygon.io API interactions, with its debug mode enabled. **No other pre-existing application code or files are to be used or referenced.**

**2\. Guiding Principles**

* **2.1. AI-Driven Development:** The AI implementer will generate all code based on this PRD, defining its own file structure and component architecture.  
* **2.2. Modularity & Reusability:** Design components and services as "black boxes" with clear inputs and outputs. Prefer smaller, focused source files as determined by the AI for optimal organization.  
* **2.3. Debuggability & Logging:** Implement comprehensive client-side and server-side logging. The Polygon API library's debug mode MUST be enabled.  
* **2.4. User Experience (Simplicity for Novice End-User):** The web app should be intuitive and easy to use for individuals new to stock analysis.  
* **2.5. Data Integrity:** Primarily use structured JSON for API interactions and internal data handling.

**3\. Target End-User (of the WebApp)**

* Beginner stock market enthusiasts or retail investors looking for quick access to stock information and simple AI-generated takeaways.

**4\. Functional Requirements (Phase 1\)**

* **4.1. User Input & Controls**  
  * **4.1.1. Ticker Input Element:**  
    * A text input field for users to enter a stock ticker symbol (e.g., "AAPL"). Input should be automatically converted to uppercase. Placeholder text: "Enter Stock Ticker (e.g., AAPL)".  
  * **4.1.2. "Get Market & Quote" Button:**  
    * A button that initiates data retrieval. Text: "Get Market & Quote".  
    * If ticker input is empty, default to "NVDA". Becomes disabled during data fetching.  
  * **4.1.3. "Generate AI Insights" Button:**  
    * A button that becomes enabled *only after* both market status and stock quote data are successfully retrieved and displayed. Text: "Generate AI Insights". Triggers AI analysis. Becomes disabled during AI insight generation.  
  * **4.1.4. Developer Debug Console Toggle Button:**  
    * A button (e.g., in the page header) to show/hide the Developer Debug Console. Text toggles: "Show Console" / "Hide Console".  
* **4.2. Data Display Sections (Panels/Cards)**  
  * Each display panel MUST include its own set of "Copy to Clipboard (JSON)", "Export to JSON File", "Copy to Clipboard (CSV)", and "Export to CSV File" controls.  
  * **4.2.1. Market Status Display Area:**  
    * Displays current market status from Polygon.io (e.g., "open", "closed"), Server Time.  
    * Title: "Market Status". Initial text: "Market status will appear here."  
  * **4.2.2. Stock Quote Display Area:**  
    * Displays stock quote details from Polygon.io for the requested ticker (e.g., Ticker, Company Name, Current Price, Previous Close, Change, Day's Range).  
    * Title: "Stock Quote". Initial text: "Stock quote will appear here."  
    * CSV format should be a key-value pair list or a flat structure.  
  * **4.2.3. AI Insights Display Area:**  
    * Displays AI-generated insights. Content: Three single-statement key takeaways in bullet-point format.  
    * Title: "AI Insights". Initial text: "AI insights will appear here after generation."  
    * CSV format: Each bullet point as a row, one column.  
  * **4.2.4. Developer Debug Console UI:**  
    * A hideable/showable panel (e.g., at the bottom). Displays timestamped application logs (log, info, warn, error).  
    * Includes "Copy Logs" (plaintext), "Export Logs" (plaintext .txt file), and "Clear Logs" buttons.  
* **4.3. Core Logic Flow**  
  * **4.3.1. Initial Data Retrieval (via "Get Market & Quote" button):**

1\.                  User provides ticker, clicks button.

2\.                  Frontend calls a Firebase Cloud Function (e.g., getMarketStatusAndQuote).

3\.                  Cloud Function, using polygon\_api\_libraries\_client-js-master (debug mode enabled):

* Fetches market status from Polygon. If fails, return error. Frontend displays error.  
  * If success, fetches stock quote (snapshot) from Polygon. If fails, return market status data and quote error. Frontend displays both.  
    * If success, return both market status and stock quote data.

4\.                  Frontend updates respective display areas.

5\.                  If both successful, enable "Generate AI Insights" button.

* **4.3.2. AI Insight Generation (via "Generate AI Insights" button):**

1\.                  User clicks button.

2\.                  Frontend calls a Firebase Cloud Function (e.g., generateStockInsights), sending structured JSON stock quote.

3\.                  Cloud Function:

* Constructs prompt for Gemini API (gemini-2.5-flash-preview-04-17) asking for "three concise, single-statement key takeaways, formatted as bullet points, based on the following stock quote data: \[JSON data\]".  
  * Calls Gemini API. Parses response for three bullet points.  
    * Returns bullet points or error.

4\.                  Frontend updates "AI Insights" display area.

* **4.4. Data Export and Copy Functionality**  
  * Each display panel (Market Status, Stock Quote, AI Insights) will have identical export/copy controls.  
  * **4.4.1. Copy to Clipboard (JSON):** Copies panel's data as formatted JSON.  
  * **4.4.2. Export to File (JSON):** Downloads panel's data as .json. Filename: \[panelName\]\_\[ticker\]\_\[date\].json.  
  * **4.4.3. Copy to Clipboard (CSV):** Copies data as CSV string.  
    * Market Status/Stock Quote: Key-value pairs.  
    * AI Insights: Each bullet point as a separate row.  
  * **4.4.4. Export to File (CSV):** Downloads data as .csv. Filename: \[panelName\]\_\[ticker\]\_\[date\].csv.  
* **4.5. Error Handling & User Feedback**  
  * Display user-friendly error messages for API failures.  
  * Clear loading indicators when operations complete/fail.  
  * Log detailed errors to Developer Debug Console and Firebase Function logs.

**5\. Non-Functional Requirements**

* **5.1. Performance:** Web application responsive; API calls with reasonable timeouts.  
* **5.2. Security:** API keys (Polygon, Gemini) stored as Firebase environment variables, accessed ONLY from Cloud Functions.  
* **5.3. Maintainability:** Code must be clean, well-organized into modules/components (as determined by the AI), with JSDoc/TSDoc for public APIs/complex logic.  
* **5.4. Accessibility:** Use ARIA attributes for forms, buttons, dynamic content.  
* **5.5. Cross-Browser Compatibility:** Latest Chrome, Firefox, Safari, Edge.

**6\. Technical Specifications & Architecture (High-Level Guidance for AI)**

* **6.1. Frontend (React with TypeScript)**  
  * **6.1.1. UI Library:** React.  
  * **6.1.2. Language:** TypeScript.  
  * **6.1.3. Styling:** Tailwind CSS (AI to set up and use).  
  * **6.1.4. State Management:** React Hooks (useState, useCallback, useEffect).  
  * **6.1.5. Module System:** ES Modules.  
  * **6.1.6. Key Frontend Functional Blocks (AI to name and structure files/components):**  
    * Main application orchestrator.  
    * UI for ticker input and "Get Market & Quote" button.  
    * Reusable UI container for data display areas.  
    * Dedicated UI display for Market Status data.  
    * Dedicated UI display for Stock Quote data.  
    * Dedicated UI display for AI-generated 3 bullet points.  
    * Reusable UI for copy/export buttons.  
    * UI for the Developer Debug Console.  
    * UI for loading indication.  
    * UI for error messages.  
    * A frontend module/service for making calls to Firebase Cloud Functions.  
* **6.2. Backend (Firebase Cloud Functions \- Node.js/TypeScript)**  
  * All backend logic, including external API calls, MUST reside in Cloud Functions.  
  * Language: TypeScript.  
  * **6.2.1. getMarketStatusAndQuote (example name for AI) Cloud Function:**  
    * Receives ticker. Uses Polygon client module to fetch market status, then stock quote. Returns data or errors.  
  * **6.2.2. generateStockInsights (example name for AI) Cloud Function:**  
    * Receives stock quote JSON. Uses Gemini client module to call Gemini. Returns insights or error.  
  * **6.2.3. API Key Management:**  
    * Polygon API Key: process.env.POLYGON\_API\_KEY.  
    * Gemini API Key: process.env.API\_KEY. (Assumed configured in Firebase environment).  
* **6.3. Polygon.io API Integration (within Firebase Functions)**  
  * **6.3.1. Mandatory Library:** Integrate and use polygon\_api\_libraries\_client-js-master. AI to determine placement (e.g., within a lib folder in functions) and import method.

// Example conceptual initialization in a Polygon client module created by the AI:

// const { PolygonRestClient } \= require('path/to/polygon\_api\_libraries\_client-js-master/mainExport'); // AI determines path

// const polygon \= new PolygonRestClient(process.env.POLYGON\_API\_KEY);

// polygon.debug(true);

* **6.3.2. Debug Mode:** Library's debug mode MUST be enabled.  
  * **6.3.3. Endpoints (via library):** Market Status (e.g., /v1/marketstatus/now), Stock Quote (e.g., snapshot API like /v2/snapshot/locale/us/markets/stocks/tickers/{ticker}).  
  * **6.3.4. Data Format:** JSON.  
  * **6.3.5. Polygon Client Module (AI to create):** A backend module encapsulating Polygon API interactions, exposing functions like getMarketStatus() and getStockQuote(ticker: string).  
* **6.4. Google Gemini API Integration (within Firebase Functions)**  
  * **6.4.1. SDK:** @google/genai.  
  * **6.4.2. Model:** gemini-2.5-flash-preview-04-17.  
  * **6.4.3. Prompt Engineering:**  
     "Analyze the following stock quote data for ticker ${tickerSymbol\_from\_data} and provide exactly three concise, single-statement key takeaways. Format your response as a JSON array of three strings. Stock Quote Data: ${JSON.stringify(stockQuoteJson)}"  
     AI to parse response for three strings.  
  * **6.4.4. Gemini Client Module (AI to create):** A backend module encapsulating Gemini API interactions, exposing a function like getInsightsFromQuote(stockQuoteJson: StockQuoteData): Promise\<string\[\]\>.  
* **6.5. Data Structures (AI to define in appropriate TypeScript files, e.g., a shared types file)**  
  * **MarketStatus:**

export interface MarketStatus {

  market: 'open' | 'closed' | 'extended-hours' | 'pre-market' | 'unknown' | string;

  serverTime: string; // ISO string

}

* **StockQuoteData (Based on Polygon Snapshot):**  
  export interface StockQuoteData {  
    ticker: string;  
    name?: string;  
    todaysChange?: number;  
    todaysChangePerc?: number;  
    updated?: number; // unix ms  
    day?: { open?: number; high?: number; low?: number; close?: number; volume?: number; };  
    lastTrade?: { price?: number; };  
    // AI to map Polygon snapshot response to this structure.  
  }


}

* **AISimpleInsights:**  
  export interface AISimpleInsights {  
    takeaways: string\[\]; // Array of 3 strings  
  }


}

content\_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript

**7\. UI/UX Guidelines (Phase 1 \- Simplicity)**

* **7.1. Layout:** Single-page application. Header (Title, Debug Toggle). Input section. Main content area for display panels.  
* **7.2. Styling:** Consistent Tailwind CSS. Clean, professional, uncluttered.  
* **7.3. Responsiveness:** Adapt to mobile, tablet, desktop.  
* **7.4. Feedback:** Loading indicators, error messages, clear button disabled states. Copy/Export feedback.

**8\. Logging & Debugging**

* **8.1. Client-Side:**  
  * All console.log/warn/error/info calls captured and displayed in the Developer Debug Console UI.  
  * Log key events: component actions, API calls (initiation, success, failure), data received.  
* **8.2. Server-Side (Firebase Functions):**  
  * Use functions.logger for logging. Log requests, parameters, external API details (debug mode), outcomes.  
  * Ensure Polygon library's debug output is logged.

**9\. Deployment**

* **9.1. Platform:** Firebase (Hosting for frontend, Cloud Functions for backend).  
* **9.2. Build Process:** AI to implement standard React/TypeScript build for frontend, TypeScript compilation for Cloud Functions.

**10\. File Structure (Guidance for AI)**

* The AI will determine the optimal file structure. A common pattern includes:  
  * A directory for frontend source code (containing components, services, main app logic, types).  
  * A directory for Firebase Functions source code (containing function definitions, API client modules, types, and the polygon\_api\_libraries\_client-js-master placed in an accessible sub-directory like lib/).  
* The AI should prioritize modularity and clarity in its chosen structure. **No specific file names or paths from any previous project should be assumed or used.**

**11\. Phase 1 Implementation Plan & Task Breakdown (Instructions for AI to Interpret Functionally)**

1. **Project Setup:**  
   * Configure Firebase project for Hosting and Cloud Functions (Node.js with TypeScript).  
   * Ensure Firebase environment variables POLYGON\_API\_KEY and API\_KEY (for Gemini) are accessible.  
2. **Type Definitions:**  
   * Define MarketStatus, StockQuoteData (for Polygon snapshot), and AISimpleInsights (array of 3 strings) as specified in section 6.5, placing them in an appropriately structured TypeScript file(s).  
3. **Backend \- Firebase Cloud Functions (AI to structure internal files):**  
   * **3.1. Polygon API Interaction Module:**  
     * Create a module to encapsulate Polygon API logic.  
     * Import and initialize polygon\_api\_libraries\_client-js-master with process.env.POLYGON\_API\_KEY. Enable debug mode.  
     * Implement functions: async function getMarketStatus(): Promise\<MarketStatus\> and async function getStockQuote(ticker: string): Promise\<StockQuoteData\>. These call Polygon APIs via the library and return typed data or errors.  
   * **3.2. Gemini API Interaction Module:**  
     * Create a module to encapsulate Gemini API logic.  
     * Initialize GoogleGenAI client with process.env.API\_KEY.  
     * Implement async function getInsightsFromQuote(stockQuoteJson: StockQuoteData, tickerSymbol: string): Promise\<string\[\]\>:  
       * Constructs prompt (section 6.4.3). Calls ai.models.generateContent (gemini-2.5-flash-preview-04-17, consider responseMimeType: "application/json"). Parses response for three strings.  
   * **3.3. Cloud Function Definitions:**  
     * Define a callable Cloud Function (e.g., getMarketStatusAndQuote): Takes ticker. Uses Polygon module for market status and quote. Returns { marketStatus, stockQuote } or errors.  
     * Define a callable Cloud Function (e.g., generateStockInsights): Takes stockQuoteJson, tickerSymbol. Uses Gemini module. Returns { insights: string\[\] } or error.  
4. **Frontend \- Core Structure & Services (AI to structure internal files):**  
   * **4.1. API Service Module:**  
     * Create a frontend module to call Firebase Cloud Functions using Firebase SDK.  
   * **4.2. Main Application Logic & State Management:**  
     * Initialize states for marketStatus, stockQuote, aiInsights (as string\[\]), loading states, error state, tickerSymbol.  
     * Implement handleGetMarketAndQuote function: Sets loading, clears old data/errors. Calls backend. Updates state. Enables "Generate AI Insights" button on success.  
     * Implement handleGenerateAIInsights function: Sets loading. Calls backend. Updates state.  
     * Manage Developer Debug Console visibility.  
5. **Frontend \- UI Components (AI to create and name components):**  
   * **5.1. Ticker Input UI:** Component for ticker entry and "Get Market & Quote" button, calling handleGetMarketAndQuote.  
   * **5.2. Market Status UI:** Component displaying MarketStatus data. Integrates copy/export controls.  
   * **5.3. Stock Quote UI:** Component displaying StockQuoteData. Integrates copy/export controls.  
   * **5.4. AI Insights UI:** Component displaying the three AI-generated bullet points. Integrates copy/export controls.  
   * **5.5. Export Controls UI:** Reusable component for copy/export buttons, handling JSON and CSV for data structures.  
   * **5.6. Debug Console UI, Loading Spinner UI, Error Message UI:** Implement and integrate these visual elements.  
6. **Frontend \- Main Layout & Orchestration:**  
   * Structure the page: header (title, debug toggle), ticker input section, "Generate AI Insights" button (conditional), error display, loading display.  
   * Render the Market Status, Stock Quote, and AI Insights display components. Render Debug Console UI.  
7. **Styling and Final Touches:**  
   * Apply Tailwind CSS for a clean, responsive, professional look.  
   * Ensure interactive elements have focus states and ARIA attributes.  
   * Thoroughly test all functionalities.

**12\. Future Considerations (Out of Scope for Phase 1\)**

* User authentication, data persistence, advanced options, real-time data, mobile/desktop porting.

 

\#\#\#\#\#\#\#\#\#\#\#

The PRD (Version 1.1, "AI-First, Scratch Build") has been audited for 100% compliance with the "start from scratch" requirement, where the Firebase Station AI is intended to define its own file structure and modularity for the new full-stack implementation, with the polygon\_api\_libraries\_client-js-master being the only pre-existing code element to be integrated.

**Audit Findings:**

1. **No References to Existing Application Files:**  
   * The PRD (Version 1.1) successfully avoids any direct or indirect references to the specific filenames provided (App.tsx, components/TickerInput.tsx, services/polygonService.ts, etc.).  
   * Instead of naming existing components, it describes functional UI blocks (e.g., "UI for ticker input," "Market Status Display Area") and backend modules (e.g., "Polygon Client Module," "Gemini Client Module"), explicitly stating that the AI is to create and name these.  
   * This adheres to the "start from scratch" principle, allowing the AI full freedom in naming and structuring the new codebase.  
2. **AI-Defined Structure and Modularity:**  
   * Sections like 6.1.6 ("Key Frontend Functional Blocks (AI to name and structure files/components)"), 6.3.5 ("Polygon Client Module (AI to create)"), 6.4.4 ("Gemini Client Module (AI to create)"), and especially Section 10 ("File Structure \- Guidance for AI") explicitly empower the AI to determine the file organization and component architecture.  
   * The PRD provides high-level guidance on common patterns (e.g., separate frontend/backend directories) but mandates that the AI makes the final structural decisions.  
3. **Type Definitions:**  
   * Section 6.5 of the PRD defines new, simplified TypeScript interfaces (MarketStatus, StockQuoteData, AISimpleInsights) specifically tailored for Phase 1\. This correctly instructs the AI to define *new* types based on the PRD's requirements, rather than reusing or being bound by the more extensive and complex types in the provided types.ts. This is crucial for a "from scratch" data model for the new application.  
4. **Integration of Polygon API Library:**  
   * The PRD correctly identifies polygon\_api\_libraries\_client-js-master as a pre-existing element that *must* be integrated, as per your original scoping notes. It instructs the AI to handle its placement (e.g., in a lib folder within Firebase Functions) and import mechanism, which is appropriate for a backend library.  
5. **Handling of index.html, index.tsx, metadata.json:**  
   * **index.html**: The PRD specifies React and Tailwind CSS. The provided index.html sets up this environment, including a root div and import maps. The AI, when building a React/Tailwind app from scratch, would naturally create a similar HTML entry point. The "start from scratch" primarily applies to the dynamic application code (.tsx, .ts files for components, services, and Firebase functions) rather than this basic HTML shell, especially since the PRD's technical choices align with it.  
   * **index.tsx**: The PRD describes building a React application. The AI will generate the necessary root rendering logic for the React app, effectively creating its own index.tsx equivalent.  
   * **metadata.json**: The PRD does not require camera/microphone permissions, so an empty requestFramePermissions array is appropriate. The name and description can be considered static metadata related to the overall project idea, which the PRD embodies. The core "start from scratch" applies to the application's codebase.

**Conclusion:**

PRD Version 1.1 is **100% compliant** with the requirement to be a "start from scratch" specification. It successfully avoids referencing the existing application's file names or component structure, explicitly granting the AI the responsibility to define the new architecture, file names, and modularity based on the functional and technical requirements outlined. The data types are also defined fresh for the new Phase 1 scope.

The document is well-structured to guide an AI in building the application from a blank slate, using only the specified Polygon API library as a pre-existing asset.

thumb\_upthumb\_down

 

