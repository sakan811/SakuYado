/**
 * E2E: Core Hotel Journey
 *
 * Covers user flows that jsdom-based unit tests cannot verify:
 * - Real Next.js navigation and URL changes
 * - Actual browser localStorage persistence across reloads
 * - Viewport-aware layout (desktop table / mobile cards)
 *
 * Validation logic, value score math, and edge-case inputs
 * are fully covered by Vitest unit tests — not duplicated here.
 */

interface Viewport {
  name: string;
  width: number;
  height: number;
}

describe("Hotel Journey", () => {
  const viewports: Viewport[] = Cypress.env("viewports") || [
    { name: "default", width: 1280, height: 720 },
  ];

  viewports.forEach((viewport: Viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.clearLocalStorage();
      });

      // ─── 1. Full user journey ──────────────────────────────────────
      it("completes the main flow: home → add → compare → add again", () => {
        cy.visit("/");
        cy.contains("SakuYado").should("be.visible");
        cy.contains("Find the Best Value Hotels").should("be.visible");

        // Navigate to add-hotel page via CTA
        cy.get('[data-testid="add-hotel-link"]').click();
        cy.url().should("include", "/hotels/add");

        // Add first hotel — redirects to compare
        cy.addHotel("Tokyo Hotel", 150, 8.5, "USD");
        cy.url().should("include", "/hotels/compare");
        cy.contains("Hotel Value Comparison").should("be.visible");
        cy.get('[data-testid="hotel-name-0"]').should("contain", "Tokyo Hotel");

        // Add a second hotel from compare page
        cy.get('[data-testid="add-another-hotel"]').click();
        cy.url().should("include", "/hotels/add");

        cy.addHotel("Osaka Hotel", 100, 7.0, "USD");
        cy.url().should("include", "/hotels/compare");

        // Both hotels present
        cy.get('[data-testid="hotel-name-0"]').should("be.visible");
        cy.get('[data-testid="hotel-name-1"]').should("be.visible");

        // Osaka (0.07) ranked above Tokyo (0.0567) — best value first
        cy.get('[data-testid="hotel-name-0"]').should("contain", "Osaka Hotel");
        cy.get('[data-testid="hotel-name-1"]').should("contain", "Tokyo Hotel");
      });

      // ─── 2. localStorage persistence across real page reload ───────
      it("persists hotels across a page reload", () => {
        cy.addHotel("Persistent Hotel", 200, 9.0);

        cy.get('[data-testid="hotel-name-0"]').should(
          "contain",
          "Persistent Hotel",
        );

        // Reload — real browser storage must survive
        cy.reload();

        cy.get('[data-testid="hotel-name-0"]').should(
          "contain",
          "Persistent Hotel",
        );
        cy.get('[data-testid="hotel-price-0"]').should("contain", "200.00 USD");
        cy.get('[data-testid="hotel-rating-0"]').should("contain", "9.0");
      });

      // ─── 3. Empty state on compare page ────────────────────────────
      it("shows empty state and navigates to add-hotel page", () => {
        cy.visit("/hotels/compare");
        cy.contains("No Hotels Added Yet").should("be.visible");

        cy.get('[data-testid="add-first-hotel"]').click();
        cy.url().should("include", "/hotels/add");
      });

      // ─── 4. Viewport-aware layout ──────────────────────────────────
      it("renders the correct layout for this viewport", () => {
        cy.addHotel("Layout Hotel", 120, 8.0);

        if (viewport.width < 1024) {
          cy.get('[data-testid="hotel-card-mobile"]').should("be.visible");
        } else {
          cy.get('[data-testid="hotel-row-desktop"]').should("be.visible");
        }
      });
    });
  });
});
