import { describe, expect, it } from "vitest";
import {
  formatPrice,
  formatRating,
  formatValueScore,
  formatNumber,
  formatHotelData
} from "@/utils/formatting";

describe("Formatting Utility Functions", () => {
  describe("formatPrice", () => {
    it("should format price with 2 decimal places and currency", () => {
      expect(formatPrice(100)).toBe("100.00");
      expect(formatPrice(100, "USD")).toBe("100.00 USD");
      expect(formatPrice(123.456, "EUR")).toBe("123.46 EUR");
      expect(formatPrice(0.5, "JPY")).toBe("0.50 JPY");
    });

    it("should handle zero and negative prices", () => {
      expect(formatPrice(0)).toBe("0.00");
      expect(formatPrice(0, "USD")).toBe("0.00 USD");
      expect(formatPrice(-50, "USD")).toBe("-50.00 USD");
    });

    it("should add thousands separators", () => {
      expect(formatPrice(1000)).toBe("1,000.00");
      expect(formatPrice(1234567.89, "USD")).toBe("1,234,567.89 USD");
    });
  });

  describe("formatRating", () => {
    it("should format rating with 1 decimal place", () => {
      expect(formatRating(8.5)).toBe("8.5");
      expect(formatRating(8.45)).toBe("8.4");
      expect(formatRating(8.46)).toBe("8.5");
      expect(formatRating(8.44)).toBe("8.4");
      expect(formatRating(9)).toBe("9.0");
    });

    it("should handle zero and negative ratings", () => {
      expect(formatRating(0)).toBe("0.0");
      expect(formatRating(-1.5)).toBe("-1.5");
    });
  });

  describe("formatNumber", () => {
    it("should format number with specified decimal places", () => {
      expect(formatNumber(3.14159, 2)).toBe("3.14");
      expect(formatNumber(3.14159, 3)).toBe("3.142");
      expect(formatNumber(3.14159, 4)).toBe("3.1416");
      expect(formatNumber(100, 2)).toBe("100.00");
      expect(formatNumber(100, 0)).toBe("100");
    });

    it("should use default 2 decimal places when not specified", () => {
      expect(formatNumber(3.14159)).toBe("3.14");
      expect(formatNumber(100)).toBe("100.00");
      expect(formatNumber(0.5)).toBe("0.50");
    });

    it("should handle zero and negative numbers", () => {
      expect(formatNumber(0, 2)).toBe("0.00");
      expect(formatNumber(-3.14159, 2)).toBe("-3.14");
      expect(formatNumber(-0.5, 1)).toBe("-0.5");
    });

    it("should handle edge cases", () => {
      expect(formatNumber(0.999, 0)).toBe("1");
      expect(formatNumber(0.999, 1)).toBe("1.0");
      expect(formatNumber(0.999, 2)).toBe("1.00");
      expect(formatNumber(Number.MAX_SAFE_INTEGER, 2)).toBe("9007199254740991.00");
    });
  });

  describe("formatValueScore", () => {
    it("should format value score with 4 decimal places", () => {
      expect(formatValueScore(0.12345)).toBe("0.1235");
      expect(formatValueScore(1)).toBe("1.0000");
      expect(formatValueScore(0.5)).toBe("0.5000");
      expect(formatValueScore(0.05)).toBe("0.0500");
    });

    it("should handle zero and negative values", () => {
      expect(formatValueScore(0)).toBe("0.0000");
      expect(formatValueScore(-0.12345)).toBe("-0.1235");
    });
  });

  describe("formatHotelData", () => {
    const testCases = [
      {
        name: "basic hotel data",
        input: {
          price: 100,
          rating: 8.5,
          valueScore: 0.085,
          currency: "USD",
        },
        expected: {
          price: "100.00 USD",
          rating: "8.5",
          valueScore: "0.0850",
        },
      },
      {
        name: "hotel without value score",
        input: {
          price: 150,
          rating: 9.2,
          currency: "EUR",
        },
        expected: {
          price: "150.00 EUR",
          rating: "9.2",
          valueScore: "0.0000",
        },
      },
      {
        name: "high precision values",
        input: {
          price: 123.456,
          rating: 8.75,
          valueScore: 0.07089,
          currency: "JPY",
        },
        expected: {
          price: "123.46 JPY",
          rating: "8.8",
          valueScore: "0.0709",
        },
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(`should format ${name} correctly`, () => {
        const result = formatHotelData(input);
        expect(result).toEqual(expected);
      });
    });

    it("should return FormattedHotelData type", () => {
      const input = {
        price: 100,
        rating: 8.5,
        valueScore: 0.085,
        currency: "USD",
      };
      const result = formatHotelData(input);

      expect(result).toHaveProperty("price");
      expect(result).toHaveProperty("rating");
      expect(result).toHaveProperty("valueScore");
      expect(typeof result.price).toBe("string");
      expect(typeof result.rating).toBe("string");
      expect(typeof result.valueScore).toBe("string");
    });
  });
});
