/**
 * Class to render AI simple insights.
 */
export class AISimpleInsightsDisplay {
  /**
   * @param {HTMLElement} containerElement - The HTML element where the insights will be displayed.
   */
  constructor(containerElement) {
    if (!containerElement) {
      console.error('Container element not provided for AI insights display.');
    }
    this.containerElement = containerElement;
  }

  /**
   * Renders the AI simple insights.
   * @param {string[]} insights - An array of three strings representing the AI insights (AISimpleInsights).
   */
  render(insights) {
    if (!this.containerElement || !Array.isArray(insights) || insights.length !== 3) {
      console.error('Invalid data or container element for AI insights display.');
      this.containerElement.innerHTML = '<p>Could not load AI insights.</p>';
      return;
    }
    this.containerElement.innerHTML = `<h3>AI Simple Insights</h3><ul>${insights.map(insight => `<li>${insight}</li>`).join('')}</ul>`;
  }
}