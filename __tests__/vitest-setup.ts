import { beforeEach, vi, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers);

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
}));

// Create a mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Set up global mocks
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});


// Reset localStorage between tests
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

// Polyfills for Radix UI in JSDOM
if (typeof window !== "undefined") {
  if (!window.PointerEvent) {
    class PointerEvent extends MouseEvent {
      pointerId: number;
      pointerType: string;
      isPrimary: boolean;
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId || 0;
        this.pointerType = params.pointerType || "mouse";
        this.isPrimary = params.isPrimary || true;
      }
    }
    window.PointerEvent = PointerEvent as any;
  }
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  if (!window.ResizeObserver) {
    class ResizeObserver {
      observe() { }
      unobserve() { }
      disconnect() { }
    }
    window.ResizeObserver = ResizeObserver;
  }
}
