// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Clear localStorage before each test
beforeEach(() => {
  cy.clearLocalStorage();
});
