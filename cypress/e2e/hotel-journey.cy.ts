interface Viewport {
  name: string;
  width: number;
  height: number;
}

describe("Hotel Management Journey", () => {
  const viewports: Viewport[] = Cypress.env("viewports") || [
    { name: "default", width: 1280, height: 720 },
  ];

  viewports.forEach((viewport: Viewport) => {
    describe(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
      });

      it("should complete the main user journey: add hotel and view comparison", () => {
        // Test homepage load
        cy.contains("SakuYado").should("be.visible");
        cy.contains("Find the Best Value Hotels").should("be.visible");

        // Navigate to add hotel page
        cy.get('[data-testid="add-hotel-link"]').click();
        cy.url().should("include", "/hotels/add");

        // Add first hotel
        cy.addHotel("Tokyo Hotel", 150, 8.5, "USD");

        // Should redirect to compare page
        cy.url().should("include", "/hotels/compare");
        cy.contains("Hotel Value Comparison").should("be.visible");

        // Verify hotel appears in comparison
        cy.get('[data-testid="hotel-name-0"]').should("contain", "Tokyo Hotel");
        cy.get('[data-testid="hotel-price-0"]').should("contain", "150.00 USD");
        cy.get('[data-testid="hotel-rating-0"]').should("contain", "8.5");

        // Verify value score calculation (8.5 / 150 = 0.0567)
        cy.get('[data-testid="hotel-value-score-0"]').should(
          "contain",
          "0.0567",
        );

        // Add another hotel from the comparison page
        cy.get('[data-testid="add-another-hotel"]').click();
        cy.url().should("include", "/hotels/add");

        cy.addHotel("Osaka Hotel", 100, 7.0, "USD");

        // Back to comparison page
        cy.url().should("include", "/hotels/compare");

        // Verify both hotels are displayed
        cy.get('[data-testid="hotel-name-0"]').should("be.visible");
        cy.get('[data-testid="hotel-name-1"]').should("be.visible");

        // Verify hotels are sorted by value score (Osaka: 0.07, Tokyo: 0.0567)
        cy.get('[data-testid="hotel-name-0"]').should("contain", "Osaka Hotel");
        cy.get('[data-testid="hotel-name-1"]').should("contain", "Tokyo Hotel");
      });

      it("should handle form validation on add hotel page", () => {
        cy.visit("/hotels/add");

        // Try to submit empty form
        cy.get('[data-testid="add-hotel-button"]').click();

        // Should show validation errors
        cy.contains("Hotel name is required").should("be.visible");
        cy.contains("Price must be a positive number").should("be.visible");
        cy.contains("Rating must be between 0 and 10").should("be.visible");

        // Test invalid price
        cy.get('[data-testid="hotel-name"]').type("Test Hotel");
        cy.get('[data-testid="hotel-price"]').type("-10");
        cy.get('[data-testid="hotel-rating"]').type("5");
        cy.get('[data-testid="add-hotel-button"]').click();

        cy.contains("Price must be a positive number").should("be.visible");

        // Test invalid rating
        cy.get('[data-testid="hotel-price"]').clear().type("100");
        cy.get('[data-testid="hotel-rating"]').clear().type("15");
        cy.get('[data-testid="add-hotel-button"]').click();

        cy.contains("Rating must be between 0 and 10").should("be.visible");

        // Test valid form
        cy.get('[data-testid="hotel-rating"]').clear().type("8.5");
        cy.get('[data-testid="add-hotel-button"]').click();

        // Should successfully redirect
        cy.url().should("include", "/hotels/compare");
      });

      it("should persist hotels in localStorage", () => {
        // Add a hotel
        cy.addHotel("Persistent Hotel", 200, 9.0);

        // Verify it's in comparison
        cy.get('[data-testid="hotel-name-0"]').should(
          "contain",
          "Persistent Hotel",
        );

        // Refresh the page
        cy.reload();

        // Hotel should still be there
        cy.get('[data-testid="hotel-name-0"]').should(
          "contain",
          "Persistent Hotel",
        );
        cy.get('[data-testid="hotel-price-0"]').should("contain", "200.00 USD");
        cy.get('[data-testid="hotel-rating-0"]').should("contain", "9.0");
      });

      it("should handle empty state on comparison page", () => {
        cy.visit("/hotels/compare");

        // Should show empty state message
        cy.contains("No Hotels Added Yet").should("be.visible");
        cy.get('[data-testid="add-first-hotel"]').should("be.visible");

        // Clicking should navigate to add hotel page
        cy.get('[data-testid="add-first-hotel"]').click();
        cy.url().should("include", "/hotels/add");
      });

      it("should display currency comparison disclaimer on add hotel page", () => {
        cy.visit("/hotels/add");

        // Should display the currency comparison disclaimer
        cy.contains("Please compare hotels within the same currency").should(
          "be.visible",
        );

        // Should have warning styling (amber color)
        cy.contains("Please compare hotels within the same currency").should(
          "have.class",
          "text-amber-600",
        );

        // Should contain warning icon
        cy.contains("⚠️ Please compare hotels within the same currency").should(
          "be.visible",
        );
      });
    });
  });
});
