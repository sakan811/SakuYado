/**
 * E2E: Responsive Viewport Check
 * 
 * Automatically verifies layout integrity across multiple standard viewports.
 * Checks for:
 * 1. Horizontal overflow (the most common responsive failure)
 * 2. Basic page visibility and presence of main containers
 * 3. Accessibility of core navigation elements
 */

interface ViewportDefinition {
  name: string;
  width: number;
  height: number;
}

const viewports: ViewportDefinition[] = [
  { name: "Mobile (iPhone SE)", width: 375, height: 667 },
  { name: "Mobile (iPhone 12 Pro)", width: 390, height: 844 },
  { name: "Tablet (iPad Mini)", width: 768, height: 1024 },
  { name: "Tablet (iPad Pro)", width: 1024, height: 1366 },
  { name: "Desktop", width: 1280, height: 720 },
  { name: "Wide Screen", width: 1920, height: 1080 },
];

const routes = [
  "/",
  "/hotels/add",
  "/hotels/compare",
  "/docs",
  "/docs/architecture",
  "/docs/features",
];

describe("Responsive Viewport Verification", () => {
  viewports.forEach((viewport) => {
    context(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
      });

      routes.forEach((route) => {
        it(`should have no horizontal overflow on ${route}`, () => {
          cy.visit(route);
          
          // Wait for any dynamic content or animations
          cy.wait(500);

          // 1. Check for horizontal overflow
          // window.innerWidth should be equal to the scrollWidth of the root element
          cy.window().then((win) => {
            const scrollWidth = win.document.documentElement.scrollWidth;
            const innerWidth = win.innerWidth;
            
            // We allow 1px margin for rounding errors in some browsers
            expect(scrollWidth).to.be.at.most(innerWidth + 1, `Horizontal scroll detected on ${route} at ${viewport.width}px. Element width: ${scrollWidth}, Window width: ${innerWidth}`);
          });

          // 2. Ensure main content is visible and doesn't disappear
          cy.get("main").should("be.visible");
          
          // 3. Ensure header logo/title is visible
          cy.contains("SakuYado").should("be.visible");
        });
      });
    });
  });
});
