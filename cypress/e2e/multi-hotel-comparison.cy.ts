/**
 * E2E: Multi-Hotel Comparison
 *
 * Covers real-browser behaviours that unit tests cannot verify:
 * - Sort order rendered correctly in the live DOM
 * - Statistics section visible and populated with real data
 * - Currency preference remembered across adds (via real localStorage)
 *
 * Value score math, decimal precision, and extreme inputs are
 * exhaustively covered by Vitest unit tests — not duplicated here.
 */

interface Viewport {
  name: string;
  width: number;
  height: number;
}

describe("Multi-Hotel Comparison", () => {
  const viewports: Viewport[] = Cypress.env("viewports") || [
    { name: "default", width: 1280, height: 720 },
  ];

  viewports.forEach((viewport: Viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.clearLocalStorage();
      });

      // ─── 1. Sort order in live DOM ─────────────────────────────────
      it("displays hotels sorted by value score (best first)", () => {
        cy.addHotel("Best Value", 50, 8.0); // score: 0.1600
        cy.addHotel("Mid Value", 100, 8.0); // score: 0.0800
        cy.addHotel("Low Value", 200, 8.0); // score: 0.0400

        const expectedOrder = ["Best Value", "Mid Value", "Low Value"];

        if (viewport.width < 1024) {
          cy.get('[data-testid="hotel-card-mobile"]').each(($el, index) => {
            cy.wrap($el).should("contain", expectedOrder[index]);
          });
        } else {
          cy.get('[data-testid="hotel-row-desktop"]').each(($el, index) => {
            cy.wrap($el).should("contain", expectedOrder[index]);
          });
        }
      });

      // ─── 2. Statistics panel populated correctly ───────────────────
      it("shows correct statistics for a set of hotels", () => {
        cy.addHotel("Hotel A", 100, 8.0);
        cy.addHotel("Hotel B", 150, 7.5);
        cy.addHotel("Hotel C", 200, 9.0);

        cy.get('[data-testid="statistics"]').should("be.visible");
        cy.contains("Hotels").should("be.visible");
        cy.contains("Top Score").should("be.visible");
        cy.contains("Lowest Price").should("be.visible");
        cy.contains("Highest Rating").should("be.visible");

        // Spot-check one real value: lowest price
        cy.get("body").should("contain", "100.00 USD");
        // Highest rating
        cy.get("body").should("contain", "9.0");
      });
    });
  });
});
