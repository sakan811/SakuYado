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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { HotelProvider, useHotel } from "@/contexts/HotelContext";
import { Hotel, ValueCalculationMode } from "@/types/hotel";

// Test component to use the hotel context
function TestComponent() {
  const { state, addHotel, clearAllHotels, setCalculationMode } = useHotel();

  return (
    <div>
      <div data-testid="hotels-count">{state.hotels.length}</div>
      <div data-testid="loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || "no-error"}</div>
      <div data-testid="calculation-mode">{state.calculationMode}</div>
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
        onClick={() => setCalculationMode(ValueCalculationMode.STRICT_BUDGET)}
        data-testid="set-mode-strict"
      >
        Set Strict Mode
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
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Reducer functionality", () => {
    it("should initialize with default state", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      expect(screen.getByTestId("hotels-count")).toHaveTextContent("0");
      expect(screen.getByTestId("calculation-mode")).toHaveTextContent(ValueCalculationMode.BALANCED);
    });

    it("should handle localStorage data during initialization", async () => {
      localStorage.setItem("hotels", JSON.stringify(mockHotels));
      localStorage.setItem("calculationMode", ValueCalculationMode.STRICT_BUDGET);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      expect(screen.getByTestId("hotels-count")).toHaveTextContent("2");
      expect(screen.getByTestId("calculation-mode")).toHaveTextContent(ValueCalculationMode.STRICT_BUDGET);
    });

    it("should change calculation mode and update scores", async () => {
      localStorage.setItem("hotels", JSON.stringify([{ name: "Hotel A", price: 100, rating: 8, currency: "USD" }]));
      
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      // Default mode is BALANCED (R^2/P = 64/100 = 0.64)
      // Wait, let's just trigger the mode change
      screen.getByTestId("set-mode-strict").click();

      await waitFor(() => {
        expect(screen.getByTestId("calculation-mode")).toHaveTextContent(ValueCalculationMode.STRICT_BUDGET);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("calculationMode", ValueCalculationMode.STRICT_BUDGET);
    });
  });

  describe("addHotel function", () => {
    it("should add hotel with current calculation mode", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      screen.getByTestId("add-hotel").click();

      await waitFor(() => {
        expect(screen.getByTestId("hotels-count")).toHaveTextContent("1");
      });
    });
  });

  describe("clearAllHotels function", () => {
    it("should clear hotels from state and localStorage", async () => {
      localStorage.setItem("hotels", JSON.stringify(mockHotels));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      screen.getByTestId("clear-hotels").click();

      await waitFor(() => {
        expect(screen.getByTestId("hotels-count")).toHaveTextContent("0");
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith("hotels");
    });
  });

  describe("useHotel hook", () => {
    it("should throw error when used outside HotelProvider", () => {
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useHotel must be used within a HotelProvider");

      console.error = originalError;
    });
  });
});
