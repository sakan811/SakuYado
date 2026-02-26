/// <reference types="cypress" />

// Custom commands for SakuYado app
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      addHotel(
        name: string,
        price: number,
        rating: number,
        currency?: string,
      ): Chainable<Element>;
    }
  }
}

Cypress.Commands.add(
  "addHotel",
  (name: string, price: number, rating: number, currency = "USD") => {
    cy.visit("/hotels/add");
    cy.get('[data-testid="hotel-name"]').type(name);
    cy.get('[data-testid="hotel-price"]').type(price.toString());
    cy.get('[data-testid="hotel-rating"]').type(rating.toString());
    cy.get('[data-testid="hotel-currency"]').click();
    cy.get(`[role="option"][data-value="${currency}"]`).click();
    cy.get('[data-testid="add-hotel-button"]').click();
  },
);

export { };
