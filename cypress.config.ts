import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      viewports: [
        { name: "mobile", width: 375, height: 667 },
        { name: "desktop", width: 1280, height: 720 },
      ],
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
