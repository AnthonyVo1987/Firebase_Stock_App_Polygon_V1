/**
 * Renders stock quote data in a designated HTML element.
 */
export class StockQuoteDisplay {
  /**
   * @param {HTMLElement} containerElement The HTML element where the stock quote will be displayed.
   */
  constructor(containerElement) {
        <p><strong>Price:</strong> <span id="quote-price"></span></p>
        <p><strong>Open:</strong> <span id="quote-open"></span></p>
        <p><strong>High:</strong> <span id="quote-high"></span></p>
        <p><strong>Low:</strong> <span id="quote-low"></span></p>
        <p><strong>Volume:</strong> <span id="quote-volume"></span></p>
        <p><strong>Timestamp:</strong> <span id="quote-timestamp"></span></p>
      </div>
    `;
    this.tickerElement = this.containerElement.querySelector('#quote-ticker');
    this.priceElement = this.containerElement.querySelector('#quote-price');
    this.openElement = this.containerElement.querySelector('#quote-open');
    this.highElement = this.containerElement.querySelector('#quote-high');
    this.lowElement = this.containerElement.querySelector('#quote-low');
    this.volumeElement = this.containerElement.querySelector('#quote-volume');
  }

  /**
   * Renders the provided stock quote data.
   * @param {import('../../types/appTypes').StockQuoteData} quoteData The stock quote data to display.
   */
  render(quoteData) {
    if (quoteData) {
      this.priceElement.textContent = quoteData.price.toFixed(2); // Format price to 2 decimal places
      this.openElement.textContent = quoteData.open.toFixed(2);
      this.highElement.textContent = quoteData.high.toFixed(2);
      this.lowElement.textContent = quoteData.low.toFixed(2);
      this.volumeElement.textContent = quoteData.volume.toLocaleString(); // Format volume with commas
    } else {
      // Clear the display if no data is provided
      this.priceElement.textContent = '';
      this.openElement.textContent = '';
      this.highElement.textContent = '';
      this.lowElement.textContent = '';
      this.volumeElement.textContent = '';
      this.timestampElement.textContent = '';
    }
  }
}