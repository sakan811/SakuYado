import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "../test-utils";
import Home from "../../src/app/page";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} className={className} data-testid="mock-link" {...props}>
      {children}
    </a>
  ),
}));

describe("Home Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the hero section with correct title parts", () => {
    render(<Home />);

    // Test both parts of the title since they're in separate elements
    expect(screen.getByText("Find the Best Value Hotels")).toBeTruthy();
    expect(screen.getByText("with SakuYado")).toBeTruthy();
  });

  it("renders the description text", () => {
    render(<Home />);
    const descriptionElement = screen.getByText(
      /Compare hotels based on review-per-price ratio to get the most value for your money/,
    );
    expect(descriptionElement).toBeTruthy();
  });

  // ✅ Enhanced: Test both navigation buttons
  it("includes a link to add hotels with correct href", () => {
    render(<Home />);
    const addLink = screen.getByText("🌸 Add a Hotel");
    expect(addLink).toBeTruthy();

    const link = addLink.closest("a");
    expect(link).not.toBeNull();
    if (link) {
      expect(link.getAttribute("href")).toBe("/hotels/add");
    }
  });

  // ✅ NEW: Test compare hotels button
  it("includes a link to compare hotels with correct href", () => {
    render(<Home />);
    const compareLink = screen.getByText("Compare Hotels");
    expect(compareLink).toBeTruthy();

    const link = compareLink.closest("a");
    expect(link).not.toBeNull();
    if (link) {
      expect(link.getAttribute("href")).toBe("/hotels/compare");
    }
  });

  it("has the correct UI layout and styling", () => {
    render(<Home />);

    const titleElement = screen.getByText("Find the Best Value Hotels");
    const heroSection = titleElement.closest("[data-slot='card']");

    expect(heroSection).not.toBeNull();
    if (heroSection) {
      expect(heroSection.classList.contains("relative")).toBe(true);
      // Check for the correct gradient classes
      expect(heroSection.classList.contains("bg-gradient-to-br")).toBe(true);
      expect(heroSection.classList.contains("from-pink-500")).toBe(true);
    }
  });

  it("displays sakura emoji decorations", () => {
    render(<Home />);

    // Check for sakura emojis in the hero section
    const heroSection = document.querySelector("[data-slot='card']");
    expect(heroSection).not.toBeNull();

    // The hero section should contain sakura emojis as decorative elements
    if (heroSection) {
      expect(heroSection.textContent).toContain("🌸");
    }
  });

  it("has proper responsive design classes", () => {
    render(<Home />);

    const titleElement = screen.getByText("Find the Best Value Hotels");
    // Check for refined fluid typography classes
    expect(titleElement.classList.contains("text-[clamp(1rem,5.5vw,3.75rem)]"))
      .toBe(true);
    expect(titleElement.classList.contains("whitespace-nowrap")).toBe(true);
    // Ensure it doesn't have w-full text-center which was causing issues
    expect(titleElement.classList.contains("w-full")).toBe(false);

    const subtitleElement = screen.getByText("with SakuYado");
    expect(
      subtitleElement.classList.contains("text-[clamp(0.875rem,4vw,1.875rem)]"),
    ).toBe(true);

    // Check button container has responsive classes
    const addButton = screen.getByText("🌸 Add a Hotel");
    const buttonContainer = addButton.closest("div");

    // The button container should have flex classes for responsive layout
    let hasFlexClasses = false;
    let currentElement: HTMLElement | null = buttonContainer;

    while (currentElement && !hasFlexClasses) {
      if (currentElement.classList.contains("flex")) {
        hasFlexClasses = true;
      }
      currentElement = currentElement.parentElement;
    }

    expect(hasFlexClasses).toBe(true);
  });

  it("has proper button styling and hover effects", () => {
    render(<Home />);

    const addButton = screen.getByText("🌸 Add a Hotel");
    const compareButton = screen.getByText("Compare Hotels");

    // Check add button styling
    expect(addButton).not.toBeNull();
    expect(addButton.classList.contains("bg-white")).toBe(true);
    expect(addButton.classList.contains("text-pink-600")).toBe(true);

    // Check compare button styling (should be primary variant)
    expect(compareButton).not.toBeNull();
    expect(compareButton.classList.contains("bg-pink-600")).toBe(true);
    expect(compareButton.classList.contains("text-white")).toBe(true);
  });
});
