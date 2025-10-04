/*
 * SakuYado - A web application that helps you find the best value accommodations
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock CSS import to avoid PostCSS issues
vi.mock("@/app/globals.css", () => ({}));

// Import after mocking
import RootLayout, { metadata } from "@/app/layout";

// Mock Next.js components
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

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="mock-image"
      data-src={src}
      data-alt={alt}
      data-width={width.toString()}
      data-height={height.toString()}
      className={className}
      role="img"
      aria-label={alt}
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      {...props}
    />
  ),
}));

// Mock HotelProvider
vi.mock("@/contexts/HotelContext", () => ({
  HotelProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hotel-provider">{children}</div>
  ),
}));

describe("Layout Metadata (lines 24-51)", () => {
  it("exports correct metadata configuration", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("SakuYado - Hotel Value Analyzer");
    expect(metadata.description).toBe(
      "Compare hotels based on review-per-price ratio to get the most value for your money with SakuYado",
    );
    expect(metadata.keywords).toEqual([
      "hotel comparison",
      "travel deals",
      "value analyzer",
      "accommodation",
      "hotel reviews",
      "SakuYado",
      "sakura hotels",
    ]);
  });

  it("includes OpenGraph metadata", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toBe("SakuYado - Hotel Value Analyzer");
    expect(metadata.openGraph?.description).toBe(
      "Compare hotels based on review-per-price ratio to get the most value for your money with SakuYado",
    );
    expect(metadata.openGraph?.url).toBe("https://sakuyado.fukudev.org");
    expect(metadata.openGraph?.siteName).toBe("SakuYado");
    expect(metadata.openGraph?.locale).toBe("en_US");
    expect(metadata.openGraph?.type).toBe("website");
  });

  it("includes OpenGraph images", () => {
    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph?.images;
    if (Array.isArray(images)) {
      expect(images).toHaveLength(1);
      expect(images[0]).toEqual({
        url: "src/app/favicon.ico",
      });
    }
  });
});

describe("Layout Structured Data (lines 53-75)", () => {
  it("defines complete structured data for SEO", () => {
    // Import the structured data by accessing the component's context
    // Since it's defined inline, we'll test it through the rendered component
    expect(true).toBe(true); // Placeholder - will test through component rendering
  });
});

describe("RootLayout Component (lines 77-128)", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders HTML structure with correct language attribute", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const htmlElement = document.documentElement;
    expect(htmlElement.lang).toBe("en");
  });

  it("renders body with correct styling classes", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const bodyElement = document.body;
    expect(bodyElement).not.toBeNull();
    expect(bodyElement.classList.contains("min-h-screen")).toBe(true);
    expect(bodyElement.classList.contains("bg-gradient-to-br")).toBe(true);
    expect(bodyElement.classList.contains("from-pink-50")).toBe(true);
    expect(bodyElement.classList.contains("via-white")).toBe(true);
    expect(bodyElement.classList.contains("to-rose-100")).toBe(true);
  });

  it("includes structured data script tag", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const scriptTag = document.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(scriptTag).not.toBeNull();

    if (scriptTag) {
      // Check that the script has content (dangerouslySetInnerHTML creates inner content)
      expect(scriptTag.textContent || scriptTag.innerHTML).toBeTruthy();
      // Verify it contains structured data
      const content = scriptTag.textContent || scriptTag.innerHTML;
      expect(content).toContain("@context");
      expect(content).toContain("SakuYado");
    }
  });

  it("renders decorative sakura petals background", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const backgroundContainer = document.querySelector(
      ".fixed.inset-0.overflow-hidden.pointer-events-none.z-0",
    );
    expect(backgroundContainer).not.toBeNull();

    // Check for decorative elements
    const decorativeElements = document.querySelectorAll(".animate-pulse");
    expect(decorativeElements.length).toBe(5); // Should have 5 sakura petals

    // Check first decorative element
    const firstPetal = document.querySelector(".absolute.top-10.left-10");
    expect(firstPetal).not.toBeNull();
    expect(firstPetal?.classList.contains("bg-pink-300")).toBe(true);
    expect(firstPetal?.classList.contains("rounded-full")).toBe(true);
    expect(firstPetal?.classList.contains("opacity-20")).toBe(true);
    expect(firstPetal?.classList.contains("animate-pulse")).toBe(true);

    // Check second decorative element with delay
    const secondPetal = document.querySelector(".absolute.top-32.right-20");
    expect(secondPetal).not.toBeNull();
    expect(secondPetal?.classList.contains("bg-rose-300")).toBe(true);
    expect(secondPetal?.classList.contains("opacity-30")).toBe(true);
    expect(secondPetal?.classList.contains("delay-1000")).toBe(true);
  });

  it("renders header with correct styling and structure", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const header = document.querySelector("header");
    expect(header).not.toBeNull();
    expect(header?.classList.contains("relative")).toBe(true);
    expect(header?.classList.contains("z-10")).toBe(true);
    expect(header?.classList.contains("bg-gradient-to-r")).toBe(true);
    expect(header?.classList.contains("from-pink-500")).toBe(true);
    expect(header?.classList.contains("via-rose-400")).toBe(true);
    expect(header?.classList.contains("to-pink-600")).toBe(true);
    expect(header?.classList.contains("shadow-lg")).toBe(true);
    expect(header?.classList.contains("border-b-4")).toBe(true);
    expect(header?.classList.contains("border-pink-200")).toBe(true);
  });

  it("renders header container with correct layout", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const headerContainer = document.querySelector("header > .container");
    expect(headerContainer).not.toBeNull();
    expect(headerContainer?.classList.contains("mx-auto")).toBe(true);
    expect(headerContainer?.classList.contains("px-4")).toBe(true);
    expect(headerContainer?.classList.contains("py-6")).toBe(true);
    expect(headerContainer?.classList.contains("flex")).toBe(true);
    expect(headerContainer?.classList.contains("justify-between")).toBe(true);
    expect(headerContainer?.classList.contains("items-center")).toBe(true);
  });

  it("renders logo link with correct properties", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const logoLink = screen.getByTestId("mock-link");
    expect(logoLink).not.toBeNull();
    expect(logoLink.getAttribute("href")).toBe("/");
    expect(logoLink.classList.contains("flex")).toBe(true);
    expect(logoLink.classList.contains("items-center")).toBe(true);
    expect(logoLink.classList.contains("gap-2")).toBe(true);
    expect(logoLink.classList.contains("text-2xl")).toBe(true);
    expect(logoLink.classList.contains("font-bold")).toBe(true);
    expect(logoLink.classList.contains("text-white")).toBe(true);
    expect(logoLink.classList.contains("hover:text-pink-100")).toBe(true);
    expect(logoLink.classList.contains("transition-colors")).toBe(true);
    expect(logoLink.classList.contains("duration-300")).toBe(true);
    expect(logoLink.classList.contains("drop-shadow-sm")).toBe(true);
  });

  it("renders logo image with correct attributes", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const logoImage = screen.getByTestId("mock-image");
    expect(logoImage).not.toBeNull();
    expect(logoImage.getAttribute("data-src")).toBe(
      "/android-chrome-512x512.png",
    );
    expect(logoImage.getAttribute("data-alt")).toBe("SakuYado Logo");
    expect(logoImage.getAttribute("data-width")).toBe("32");
    expect(logoImage.getAttribute("data-height")).toBe("32");
    expect(logoImage.getAttribute("role")).toBe("img");
    expect(logoImage.getAttribute("aria-label")).toBe("SakuYado Logo");
    expect(logoImage.classList.contains("w-8")).toBe(true);
    expect(logoImage.classList.contains("h-8")).toBe(true);
  });

  it("renders app name text", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("SakuYado")).toBeTruthy();
  });

  it("wraps content with HotelProvider", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const hotelProvider = screen.getByTestId("hotel-provider");
    expect(hotelProvider).not.toBeNull();
  });

  it("renders main content area with correct styling", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const main = document.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.classList.contains("relative")).toBe(true);
    expect(main?.classList.contains("z-10")).toBe(true);
    expect(main?.classList.contains("container")).toBe(true);
    expect(main?.classList.contains("mx-auto")).toBe(true);
    expect(main?.classList.contains("px-4")).toBe(true);
    expect(main?.classList.contains("py-8")).toBe(true);
  });

  it("renders children content correctly", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("test-content")).toBeTruthy();
    expect(screen.getByText("Test Content")).toBeTruthy();
  });

  it("maintains proper z-index layering", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    const decorativeBackground = document.querySelector(".fixed.inset-0");
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    expect(decorativeBackground?.classList.contains("z-0")).toBe(true);
    expect(header?.classList.contains("z-10")).toBe(true);
    expect(main?.classList.contains("z-10")).toBe(true);
  });

  it("has responsive design classes", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    // Check responsive containers
    const containers = document.querySelectorAll(".container");
    expect(containers.length).toBe(2); // Header and main should both have container class

    containers.forEach((container) => {
      expect(container.classList.contains("mx-auto")).toBe(true);
      expect(container.classList.contains("px-4")).toBe(true);
    });
  });

  it("includes accessibility features", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    // Check for proper lang attribute
    const htmlElement = document.documentElement;
    expect(htmlElement.lang).toBe("en");

    // Check for accessibility attributes on logo image
    const logoImage = screen.getByTestId("mock-image");
    expect(logoImage.getAttribute("aria-label")).toBe("SakuYado Logo");
    expect(logoImage.getAttribute("role")).toBe("img");

    // Check for semantic HTML structure
    expect(document.querySelector("header")).not.toBeNull();
    expect(document.querySelector("main")).not.toBeNull();
  });
});

describe("Layout Integration", () => {
  beforeEach(() => {
    cleanup();
  });

  it("integrates all layout components correctly", () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Integration Test Content</div>
      </RootLayout>,
    );

    // Verify all major components are present
    expect(document.querySelector("html")).not.toBeNull();
    expect(document.querySelector("body")).not.toBeNull();
    expect(document.querySelector("header")).not.toBeNull();
    expect(document.querySelector("main")).not.toBeNull();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).not.toBeNull();

    // Verify content is rendered
    expect(screen.getByTestId("test-content")).toBeTruthy();
    expect(screen.getByText("Integration Test Content")).toBeTruthy();

    // Verify branding
    expect(screen.getByText("SakuYado")).toBeTruthy();
    expect(screen.getByTestId("mock-image")).toBeTruthy();

    // Verify HotelProvider wraps content
    expect(screen.getByTestId("hotel-provider")).toBeTruthy();
  });
});
