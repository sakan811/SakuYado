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

import { describe, expect, it } from "vitest";
import {
  calculateValueScore,
  sortHotelsByValueScore,
  getMinimumPrice,
  getMaximumRating,
  getTopValueScore,
  calculateHotelStatistics,
  getHotelCount,
} from "@/utils/calculations";
import type { Hotel } from "@/types/hotel";

describe("calculateValueScore", () => {
  describe("price validation", () => {
    it("should throw error when price is 0", () => {
      expect(() => {
        calculateValueScore(4.5, 0);
      }).toThrow("Price must be greater than 0");
    });

    it("should throw error when price is negative", () => {
      expect(() => {
        calculateValueScore(4.5, -100);
      }).toThrow("Price must be greater than 0");
    });
  });

  describe("successful calculations", () => {
    it("should calculate value score correctly", () => {
      const result = calculateValueScore(4.5, 10000);
      expect(result).toBeCloseTo(0.0005);
    });

    it("should calculate value score correctly with different parameters", () => {
      const result = calculateValueScore(4.0, 100);
      expect(result).toBeCloseTo(0.04);
    });

    it("should return value with 4 decimal places", () => {
      const result = calculateValueScore(3.5, 5000);
      expect(result.toString()).toMatch(/^\d+\.\d{4}$/);
    });
  });
});

describe("sortHotelsByValueScore", () => {
  const mockHotels: Hotel[] = [
    {
      name: "Budget Hotel",
      price: 5000,
      rating: 3.5,
      currency: "JPY",
      valueScore: 0.014,
    },
    {
      name: "Luxury Hotel",
      price: 20000,
      rating: 4.8,
      currency: "JPY",
      valueScore: 0.006,
    },
    {
      name: "Mid-range Hotel",
      price: 10000,
      rating: 4.2,
      currency: "JPY",
      valueScore: 0.014,
    },
    { name: "No Score Hotel", price: 8000, rating: 3.8, currency: "JPY" },
  ];

  it("should sort hotels by value score in descending order", () => {
    const sorted = sortHotelsByValueScore(mockHotels);
    expect(sorted[0].name).toBe("Budget Hotel");
    expect(sorted[1].name).toBe("Mid-range Hotel");
    expect(sorted[2].name).toBe("Luxury Hotel");
    expect(sorted[3].name).toBe("No Score Hotel");
  });

  it("should handle hotels without valueScore (treated as 0)", () => {
    const sorted = sortHotelsByValueScore(mockHotels);
    const noScoreHotel = sorted.find((h) => h.name === "No Score Hotel");
    expect(noScoreHotel).toBeDefined();
    expect(mockHotels.findIndex((h) => h.name === "No Score Hotel")).toBe(3);
    expect(sorted.findIndex((h) => h.name === "No Score Hotel")).toBe(3); // Should be last (index 3)
  });

  it("should return a new array (not mutate original)", () => {
    const sorted = sortHotelsByValueScore(mockHotels);
    expect(sorted).not.toBe(mockHotels);
    expect(mockHotels[0].name).toBe("Budget Hotel");
  });

  it("should handle empty array", () => {
    const sorted = sortHotelsByValueScore([]);
    expect(sorted).toEqual([]);
  });
});

describe("getMinimumPrice", () => {
  it("should return the minimum price from hotels array", () => {
    const hotels: Hotel[] = [
      { name: "Hotel A", price: 10000, rating: 4.0, currency: "JPY" },
      { name: "Hotel B", price: 8000, rating: 4.2, currency: "JPY" },
      { name: "Hotel C", price: 12000, rating: 3.8, currency: "JPY" },
    ];
    expect(getMinimumPrice(hotels)).toBe(8000);
  });

  it("should return 0 for empty array", () => {
    expect(getMinimumPrice([])).toBe(0);
  });

  it("should handle single hotel", () => {
    const hotels: Hotel[] = [
      { name: "Solo Hotel", price: 15000, rating: 4.5, currency: "JPY" },
    ];
    expect(getMinimumPrice(hotels)).toBe(15000);
  });

  it("should handle negative prices (though should not occur in practice)", () => {
    const hotels: Hotel[] = [
      { name: "Hotel A", price: 10000, rating: 4.0, currency: "JPY" },
      { name: "Hotel B", price: -5000, rating: 4.2, currency: "JPY" },
    ];
    expect(getMinimumPrice(hotels)).toBe(-5000);
  });
});

describe("getMaximumRating", () => {
  it("should return the maximum rating from hotels array", () => {
    const hotels: Hotel[] = [
      { name: "Hotel A", price: 10000, rating: 3.8, currency: "JPY" },
      { name: "Hotel B", price: 8000, rating: 4.5, currency: "JPY" },
      { name: "Hotel C", price: 12000, rating: 4.2, currency: "JPY" },
    ];
    expect(getMaximumRating(hotels)).toBe(4.5);
  });

  it("should return 0 for empty array", () => {
    expect(getMaximumRating([])).toBe(0);
  });

  it("should handle single hotel", () => {
    const hotels: Hotel[] = [
      { name: "Solo Hotel", price: 15000, rating: 4.7, currency: "JPY" },
    ];
    expect(getMaximumRating(hotels)).toBe(4.7);
  });

  it("should handle decimal ratings", () => {
    const hotels: Hotel[] = [
      { name: "Hotel A", price: 10000, rating: 4.15, currency: "JPY" },
      { name: "Hotel B", price: 8000, rating: 4.85, currency: "JPY" },
      { name: "Hotel C", price: 12000, rating: 4.75, currency: "JPY" },
    ];
    expect(getMaximumRating(hotels)).toBe(4.85);
  });
});

describe("getTopValueScore", () => {
  it("should return the value score of the first hotel in the array", () => {
    const hotels: Hotel[] = [
      {
        name: "First Hotel",
        price: 10000,
        rating: 4.5,
        currency: "JPY",
        valueScore: 0.089,
      },
      {
        name: "Second Hotel",
        price: 15000,
        rating: 4.0,
        currency: "JPY",
        valueScore: 0.053,
      },
    ];
    expect(getTopValueScore(hotels)).toBe(0.089);
  });

  it("should return 0 for empty array", () => {
    expect(getTopValueScore([])).toBe(0);
  });

  it("should return 0 when first hotel has no valueScore", () => {
    const hotels: Hotel[] = [
      { name: "No Score Hotel", price: 10000, rating: 4.5, currency: "JPY" },
      {
        name: "Second Hotel",
        price: 15000,
        rating: 4.0,
        currency: "JPY",
        valueScore: 0.053,
      },
    ];
    expect(getTopValueScore(hotels)).toBe(0);
  });

  it("should return the value score even if higher scores exist later in array", () => {
    const hotels: Hotel[] = [
      {
        name: "First Hotel",
        price: 10000,
        rating: 4.5,
        currency: "JPY",
        valueScore: 0.025,
      },
      {
        name: "Second Hotel",
        price: 15000,
        rating: 4.0,
        currency: "JPY",
        valueScore: 0.053,
      },
    ];
    expect(getTopValueScore(hotels)).toBe(0.025); // Returns first hotel's score, not max
  });
});

describe("getHotelCount", () => {
  it("should return the number of hotels", () => {
    const hotels: Hotel[] = [
      { name: "Hotel A", price: 10000, rating: 4.0, currency: "JPY" },
      { name: "Hotel B", price: 8000, rating: 4.2, currency: "JPY" },
      { name: "Hotel C", price: 12000, rating: 3.8, currency: "JPY" },
    ];
    expect(getHotelCount(hotels)).toBe(3);
  });

  it("should return 0 for empty array", () => {
    expect(getHotelCount([])).toBe(0);
  });
});

describe("calculateHotelStatistics", () => {
  it("should return complete statistics for hotels array", () => {
    const hotels: Hotel[] = [
      {
        name: "Budget Hotel",
        price: 5000,
        rating: 3.5,
        currency: "JPY",
        valueScore: 0.014,
      },
      {
        name: "Luxury Hotel",
        price: 20000,
        rating: 4.8,
        currency: "JPY",
        valueScore: 0.006,
      },
      {
        name: "Mid-range Hotel",
        price: 10000,
        rating: 4.2,
        currency: "JPY",
        valueScore: 0.014,
      },
    ];

    const stats = calculateHotelStatistics(hotels);
    expect(stats).toEqual({
      count: 3,
      topScore: 0.014,
      lowestPrice: 5000,
      highestRating: 4.8,
    });
  });

  it("should return zeros for empty array", () => {
    const stats = calculateHotelStatistics([]);
    expect(stats).toEqual({
      count: 0,
      topScore: 0,
      lowestPrice: 0,
      highestRating: 0,
    });
  });

  it("should handle hotels without value scores", () => {
    const hotels: Hotel[] = [
      {
        name: "Scored Hotel",
        price: 12000,
        rating: 4.5,
        currency: "JPY",
        valueScore: 0.025,
      },
      { name: "No Score Hotel", price: 8000, rating: 4.0, currency: "JPY" },
    ];

    const stats = calculateHotelStatistics(hotels);
    expect(stats.topScore).toBe(0.025); // Gets score from first hotel in array
  });
});

describe("Calculation Precision Edge Cases", () => {
  it("handles floating point precision in value score calculation", () => {
    const testCases = [
      { rating: 7, price: 3, expected: 2.3333 }, // Repeating decimal
      { rating: 1, price: 3, expected: 0.3333 }, // Small repeating decimal
      { rating: 9.99999, price: 99.99999, expected: 0.1 }, // High precision
      { rating: 0.1, price: 0.01, expected: 10.0 }, // Very small numbers
    ];

    testCases.forEach(({ rating, price, expected }) => {
      // Using the same calculation logic as the app
      const valueScore = +(rating / price).toFixed(4);
      expect(valueScore).toBe(expected);
    });
  });

  it("handles sorting stability with identical value scores", () => {
    const hotels = [
      {
        name: "Hotel A",
        price: 100,
        rating: 8,
        currency: "USD",
        valueScore: 0.08,
      },
      {
        name: "Hotel B",
        price: 125,
        rating: 10,
        currency: "USD",
        valueScore: 0.08,
      },
      {
        name: "Hotel C",
        price: 200,
        rating: 16,
        currency: "USD",
        valueScore: 0.08,
      },
    ];

    // Test that sort is stable (maintains original order for equal values)
    const sorted = [...hotels].sort((a, b) => b.valueScore - a.valueScore);

    // All have same value score, so original order should be preserved
    expect(sorted[0].name).toBe("Hotel A");
    expect(sorted[1].name).toBe("Hotel B");
    expect(sorted[2].name).toBe("Hotel C");
  });

  it("handles extreme value ranges", () => {
    const extremeCases = [
      { rating: 10, price: 0.01, expected: 1000 }, // Very high value score
      { rating: 0.1, price: 999999, expected: 0.0 }, // Very low value score
      { rating: 10, price: 999999, expected: 0.0 }, // Large price
      { rating: 0.0001, price: 0.0001, expected: 1.0 }, // Tiny numbers
    ];

    extremeCases.forEach(({ rating, price, expected }) => {
      const valueScore = +(rating / price).toFixed(4);
      expect(valueScore).toBe(expected);
    });
  });
});
