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
} from "@/utils/calculations";
import { Hotel, ValueCalculationMode } from "@/types/hotel";

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

  describe("BALANCED mode (Default)", () => {
    it("should calculate value score using R^2/P", () => {
      const result = calculateValueScore(
        4.0,
        100,
        ValueCalculationMode.BALANCED,
      );
      expect(result).toBeCloseTo(0.16); // 16 / 100
    });

    it("should use BALANCED mode by default", () => {
      const result = calculateValueScore(4.0, 100);
      expect(result).toBeCloseTo(0.16);
    });
  });

  describe("STRICT_BUDGET mode", () => {
    it("should calculate value score using R/P", () => {
      const result = calculateValueScore(
        4.0,
        100,
        ValueCalculationMode.STRICT_BUDGET,
      );
      expect(result).toBeCloseTo(0.04); // 4 / 100
    });
  });

  describe("QUALITY_FIRST mode", () => {
    it("should calculate value score using R/log(P)", () => {
      const price = 100;
      const rating = 4.0;
      const expected = +(rating / Math.log(price)).toFixed(4);
      const result = calculateValueScore(
        rating,
        price,
        ValueCalculationMode.QUALITY_FIRST,
      );
      expect(result).toBe(expected);
    });

    it("should handle prices close to 1 by using a minimum floor", () => {
      const result = calculateValueScore(
        4.0,
        1.05,
        ValueCalculationMode.QUALITY_FIRST,
      );
      // Math.max(1.05, 1.1) = 1.1
      const expected = +(4.0 / Math.log(1.1)).toFixed(4);
      expect(result).toBe(expected);
    });
  });

  describe("precision", () => {
    it("should return value with 4 decimal places", () => {
      const result = calculateValueScore(
        3.5,
        5000,
        ValueCalculationMode.STRICT_BUDGET,
      );
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

  it("should handle hotel without valueScore", () => {
    const hotels: Hotel[] = [
      { name: "No Score", price: 10000, rating: 4.5, currency: "JPY" },
    ];
    expect(getTopValueScore(hotels)).toBe(0);
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
});
