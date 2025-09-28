import { describe, expect, it } from "vitest";
import { formatValueScore, formatHotelData } from "@/utils/formatting";

describe("Formatting Utility Functions", () => {
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
          currency: "USD"
        },
        expected: {
          price: "100.00 USD",
          rating: "8.5",
          valueScore: "0.0850"
        }
      },
      {
        name: "hotel without value score",
        input: {
          price: 150,
          rating: 9.2,
          currency: "EUR"
        },
        expected: {
          price: "150.00 EUR",
          rating: "9.2",
          valueScore: "0.0000"
        }
      },
      {
        name: "high precision values",
        input: {
          price: 123.456,
          rating: 8.75,
          valueScore: 0.07089,
          currency: "JPY"
        },
        expected: {
          price: "123.46 JPY",
          rating: "8.8",
          valueScore: "0.0709"
        }
      }
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
        currency: "USD"
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