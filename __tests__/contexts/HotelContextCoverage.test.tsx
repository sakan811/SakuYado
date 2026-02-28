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

import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { HotelProvider, useHotel } from "@/contexts/HotelContext";
import { ValueCalculationMode } from "@/types/hotel";

describe("HotelContext Coverage", () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HotelProvider>{children}</HotelProvider>
  );

  it("handles error in clearAllHotels when localStorage throws", async () => {
    const mockStorage = {
      getItem: vi.fn(() => "[]"),
      setItem: vi.fn(),
      removeItem: vi.fn(() => {
        throw new Error("Remove failed");
      }),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useHotel(), { wrapper });

    await act(async () => {
      result.current.clearAllHotels();
    });

    expect(result.current.state.error).toBe("Failed to clear hotel data");
    expect(console.error).toHaveBeenCalled();
  });

  it("handles error in setCalculationMode when localStorage throws", async () => {
    const mockStorage = {
      getItem: vi.fn(() => "[]"),
      setItem: vi.fn(() => {
        throw new Error("Set failed");
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useHotel(), { wrapper });

    await act(async () => {
      result.current.setCalculationMode(ValueCalculationMode.STRICT_BUDGET);
    });

    expect(result.current.state.error).toBe("Failed to save calculation mode");
    expect(console.error).toHaveBeenCalled();
  });

  it("successfully updates calculation mode", async () => {
    const { result } = renderHook(() => useHotel(), { wrapper });

    await act(async () => {
      result.current.setCalculationMode(ValueCalculationMode.QUALITY_FIRST);
    });

    expect(result.current.state.calculationMode).toBe(
      ValueCalculationMode.QUALITY_FIRST,
    );
    expect(localStorage.getItem("calculationMode")).toBe(
      ValueCalculationMode.QUALITY_FIRST,
    );
  });

  it("handles error in setLastCurrency when localStorage throws", async () => {
    const mockStorage = {
      getItem: vi.fn(() => "[]"),
      setItem: vi.fn(() => {
        throw new Error("Set failed");
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useHotel(), { wrapper });

    await act(async () => {
      result.current.setLastCurrency("THB");
    });

    // setLastCurrency doesn't set state error but logs to console
    expect(console.error).toHaveBeenCalledWith(
      "Error saving last selected currency:",
      expect.any(Error),
    );
  });

  it("updates lastSelectedCurrency and persists to localStorage", async () => {
    const { result } = renderHook(() => useHotel(), { wrapper });

    await act(async () => {
      result.current.setLastCurrency("JPY");
    });

    expect(result.current.state.lastSelectedCurrency).toBe("JPY");
    expect(localStorage.getItem("lastSelectedCurrency")).toBe("JPY");
  });

  it("handles unavailable localStorage in addHotel", async () => {
    // Completely remove localStorage
    Object.defineProperty(window, "localStorage", {
      value: null,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useHotel(), { wrapper });

    const newHotel = {
      name: "Test Hotel",
      price: 100,
      rating: 8,
      currency: "USD",
    };

    await act(async () => {
      try {
        await result.current.addHotel(newHotel);
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(result.current.state.error).not.toBeNull();
      expect(result.current.state.error).toMatch(/Unable to save hotel data/i);
    });
  });
});
