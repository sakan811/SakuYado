import { describe, expect, it } from "vitest";
import { validateHotelName, validatePrice, validateRating } from "@/utils/validation";

describe("Validation Utility Functions", () => {
  describe("validateHotelName", () => {
    it("should return error for empty name", () => {
      expect(validateHotelName("")).toBe("Hotel name is required");
    });

    it("should return error for whitespace-only name", () => {
      expect(validateHotelName("   ")).toBe("Hotel name is required");
    });

    it("should return empty string for valid names", () => {
      expect(validateHotelName("Grand Hotel")).toBe("");
      expect(validateHotelName("A")).toBe("");
      expect(validateHotelName("Hotel with numbers 123")).toBe("");
    });
  });

  describe("validatePrice", () => {
    it("should return error for non-numeric values", () => {
      expect(validatePrice("abc")).toBe("Price must be a positive number");
      expect(validatePrice("")).toBe("Price must be a positive number");
      expect(validatePrice(" ")).toBe("Price must be a positive number");
    });

    it("should return error for zero price", () => {
      expect(validatePrice("0")).toBe("Price must be a positive number");
    });

    it("should return error for negative price", () => {
      expect(validatePrice("-10")).toBe("Price must be a positive number");
    });

    it("should return empty string for valid positive prices", () => {
      expect(validatePrice("1")).toBe("");
      expect(validatePrice("10.50")).toBe("");
      expect(validatePrice("1000")).toBe("");
      expect(validatePrice("0.01")).toBe("");
    });
  });

  describe("validateRating", () => {
    it("should return error for non-numeric values", () => {
      expect(validateRating("abc")).toBe("Rating must be between 0 and 10");
      expect(validateRating("")).toBe("Rating must be between 0 and 10");
      expect(validateRating(" ")).toBe("Rating must be between 0 and 10");
    });

    it("should return error for ratings below 0", () => {
      expect(validateRating("-1")).toBe("Rating must be between 0 and 10");
      expect(validateRating("-0.1")).toBe("Rating must be between 0 and 10");
    });

    it("should return error for ratings above 10", () => {
      expect(validateRating("10.1")).toBe("Rating must be between 0 and 10");
      expect(validateRating("11")).toBe("Rating must be between 0 and 10");
    });

    it("should return empty string for valid ratings within range", () => {
      expect(validateRating("0")).toBe("");
      expect(validateRating("5")).toBe("");
      expect(validateRating("10")).toBe("");
      expect(validateRating("7.5")).toBe("");
      expect(validateRating("3.14")).toBe("");
    });
  });
});