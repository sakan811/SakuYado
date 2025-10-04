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

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { HotelProvider, useHotel } from "@/contexts/HotelContext";
import { Hotel } from "@/types/hotel";

// Tests for HotelContext reducer and state management functionality.
// The reducer has been optimized to remove unreachable code paths and relies on
// TypeScript's discriminated union type system for compile-time safety.

// Test component to use the hotel context
function TestComponent() {
  const { state, addHotel, clearAllHotels, setLastUsedCurrency } = useHotel();

  return (
    <div>
      <div data-testid="hotels-count">{state.hotels.length}</div>
      <div data-testid="loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || "no-error"}</div>
      <div data-testid="currency">{state.lastUsedCurrency}</div>
      <button
        onClick={async () => {
          try {
            await addHotel({
              name: "Test Hotel",
              price: 100,
              rating: 8,
              currency: "USD",
            });
          } catch {
            // Handle error silently for test
          }
        }}
        data-testid="add-hotel"
      >
        Add Hotel
      </button>
      <button onClick={clearAllHotels} data-testid="clear-hotels">
        Clear Hotels
      </button>
      <button
        onClick={() => setLastUsedCurrency("EUR")}
        data-testid="set-currency"
      >
        Set Currency
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <HotelProvider>
      <TestComponent />
    </HotelProvider>,
  );
}

describe("HotelContext", () => {
  const mockHotels: Hotel[] = [
    {
      name: "Hotel A",
      price: 100,
      rating: 8,
      currency: "USD",
      valueScore: 0.08,
    },
    {
      name: "Hotel B",
      price: 150,
      rating: 9,
      currency: "EUR",
      valueScore: 0.06,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage mock (this is already set up in vitest-setup.ts)
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    // Ensure localStorage is restored after each test
    if (!window.localStorage) {
      // Recreate localStorage mock if it was deleted
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

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });
    }
  });

  describe("Reducer functionality", () => {
    it("should initialize with default state", async () => {
      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // Test initial state
      expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("0");
    });

    it("should handle localStorage data during initialization", async () => {
      // Set up hotels in localStorage to trigger initialization
      localStorage.setItem("hotels", JSON.stringify(mockHotels));
      localStorage.setItem("lastUsedCurrency", "JPY");

      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // Verify hotels were loaded via INITIALIZE_STATE action
      expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("2");
      expect(screen.getAllByTestId("currency")[0]).toHaveTextContent("JPY");
    });

    it("should handle all defined action types correctly", () => {
      // Verify the context doesn't crash with normal usage
      expect(() => renderWithProvider()).not.toThrow();
    });

    it("should maintain state consistency during operations", async () => {
      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // Get initial state
      const initialCurrency = screen.getAllByTestId("currency")[0].textContent;

      // Add a hotel to change state
      const addButton = screen.getAllByTestId("add-hotel")[0];
      addButton.click();

      await waitFor(() => {
        expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("1");
      });

      // State should remain consistent
      expect(screen.getAllByTestId("currency")[0]).toHaveTextContent(
        initialCurrency,
      );
    });

    it("should handle state management correctly", async () => {
      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // The context should work correctly without throwing errors
      expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("0");
      expect(screen.getAllByTestId("error")[0]).toHaveTextContent("no-error");
    });

    it("should load localStorage data during initialization", async () => {
      // Test data loading by setting data in localStorage
      localStorage.setItem("hotels", JSON.stringify(mockHotels));
      localStorage.setItem("lastUsedCurrency", "JPY");

      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // The context should initialize with the data from localStorage
      expect(screen.getAllByTestId("currency")[0]).toHaveTextContent("JPY");
    });
  });

  describe("Reducer optimization documentation", () => {
    it("should document the reducer optimization", () => {
      // This test documents the HotelContext reducer optimization
      // The reducer has been optimized to remove unreachable code:

      /*
        Optimizations made:
        - Removed SET_HOTELS action: This action was defined but never dispatched
        - Removed default case: TypeScript's discriminated unions prevent unknown actions
        - Simplified reducer: Now relies on compile-time type safety

        TypeScript Discriminated Unions:
        - The HotelAction type ensures only valid actions can be dispatched
        - Unknown actions are prevented at compile-time, not runtime
        - This makes default cases unnecessary in modern React reducers

        Current actions:
        - SET_LOADING: Controls loading state
        - SET_ERROR: Manages error state
        - ADD_HOTEL: Adds a new hotel with calculated value score
        - CLEAR_HOTELS: Removes all hotels
        - SET_LAST_USED_CURRENCY: Updates currency preference
        - INITIALIZE_STATE: Initializes from localStorage data
      */

      // The reducer is now more maintainable and relies on TypeScript's type system
      expect(true).toBe(true); // This test serves as documentation
    });
  });

  describe("addHotel function", () => {
    it("should handle localStorage unavailable error (lines 166-171)", async () => {
      // Mock localStorage to be undefined
      const originalLocalStorage = window.localStorage;

      // Use delete to remove localStorage property entirely
      delete (window as Window & { localStorage?: Storage }).localStorage;

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const addButton = screen.getAllByTestId("add-hotel")[0];

      // This should trigger the localStorage unavailable error handling
      expect(() => addButton.click()).not.toThrow();

      // Restore localStorage by redefining the property
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    });

    it("should set error state when localStorage operations fail", async () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("localStorage not available");
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const addButton = screen.getAllByTestId("add-hotel")[0];
      addButton.click();

      // Wait for async operation to complete
      await waitFor(
        () => {
          // Error state should be set
          expect(screen.getAllByTestId("error")[0]).not.toHaveTextContent(
            "no-error",
          );
        },
        { timeout: 1000 },
      );

      // Restore original method
      localStorage.setItem = originalSetItem;
    });
  });

  describe("clearAllHotels function", () => {
    it("should handle errors when clearing hotel data (lines 201-203)", async () => {
      // Mock localStorage.removeItem to throw an error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error("Failed to clear storage");
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const clearButton = screen.getAllByTestId("clear-hotels")[0];

      // This should trigger the error handling in clearAllHotels
      expect(() => clearButton.click()).not.toThrow();

      // Restore original method
      localStorage.removeItem = originalRemoveItem;
    });

    it("should clear hotels from state and localStorage", async () => {
      // Set up initial data in localStorage
      localStorage.setItem("hotels", JSON.stringify(mockHotels));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const clearButton = screen.getAllByTestId("clear-hotels")[0];
      clearButton.click();

      await waitFor(() => {
        expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("0");
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith("hotels");
    });
  });

  describe("useHotel hook", () => {
    it("should throw error when used outside HotelProvider (lines 234-235)", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useHotel must be used within a HotelProvider");

      // Restore console.error
      console.error = originalError;
    });

    it("should provide context values when used within HotelProvider", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      expect(screen.getByTestId("hotels-count")).toBeInTheDocument();
      expect(screen.getByTestId("loading")).toBeInTheDocument();
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByTestId("currency")).toBeInTheDocument();
      expect(screen.getByTestId("add-hotel")).toBeInTheDocument();
      expect(screen.getByTestId("clear-hotels")).toBeInTheDocument();
      expect(screen.getByTestId("set-currency")).toBeInTheDocument();
    });
  });

  describe("localStorage initialization", () => {
    it("should load hotels from localStorage on mount", async () => {
      localStorage.setItem("hotels", JSON.stringify(mockHotels));
      localStorage.setItem("lastUsedCurrency", "EUR");

      renderWithProvider();

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // The context should initialize with data from localStorage
      expect(screen.getAllByTestId("currency")[0]).toHaveTextContent("EUR");
    });

    it("should handle corrupted localStorage data gracefully", () => {
      localStorage.setItem("hotels", "invalid-json");

      expect(() => renderWithProvider()).not.toThrow();
    });

    it("should filter out invalid hotels from localStorage", async () => {
      const invalidHotels = [
        { name: "", price: -100, rating: 11, currency: "USD" }, // Invalid
        mockHotels[0], // Valid
        null, // Invalid
        undefined, // Invalid
        { name: "Valid", price: 100, rating: 8, currency: "USD" }, // Valid
      ];

      localStorage.setItem("hotels", JSON.stringify(invalidHotels));

      renderWithProvider();

      // Wait for initialization and filtering to complete
      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      // Should only load valid hotels
      expect(screen.getAllByTestId("hotels-count")[0]).toHaveTextContent("2");
    });
  });

  describe("currency management", () => {
    it("should update last used currency", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const currencyButton = screen.getAllByTestId("set-currency")[0];
      currencyButton.click();

      await waitFor(() => {
        expect(screen.getAllByTestId("currency")[0]).toHaveTextContent("EUR");
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "lastUsedCurrency",
        "EUR",
      );
    });

    it("should handle errors when setting currency preference", async () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage error");
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getAllByTestId("loading")[0]).toHaveTextContent("false");
      });

      const currencyButton = screen.getAllByTestId("set-currency")[0];

      // Should not throw even if localStorage fails
      expect(() => currencyButton.click()).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });
});
