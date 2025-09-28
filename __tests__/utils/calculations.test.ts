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
import { calculateValueScore } from "@/utils/calculations";

describe("calculateValueScore", () => {
  describe("price validation", () => {
    it("should throw error when price is 0", () => {
      expect(() => {
        calculateValueScore(4.5, 0, "JPY");
      }).toThrow("Price must be greater than 0");
    });

    it("should throw error when price is negative", () => {
      expect(() => {
        calculateValueScore(4.5, -100, "JPY");
      }).toThrow("Price must be greater than 0");
    });
  });

  describe("currency validation", () => {
    it("should throw error for unsupported currency", () => {
      expect(() => {
        calculateValueScore(4.5, 100, "INVALID");
      }).toThrow("Unsupported currency: INVALID");
    });

    it("should throw error for empty currency string", () => {
      expect(() => {
        calculateValueScore(4.5, 100, "");
      }).toThrow("Unsupported currency: ");
    });

    it("should throw error for null/undefined currency", () => {
      expect(() => {
        calculateValueScore(4.5, 100, (null as unknown as string));
      }).toThrow("Unsupported currency: null");
    });
  });

  describe("successful calculations", () => {
    it("should calculate value score correctly for JPY", () => {
      const result = calculateValueScore(4.5, 10000, "JPY");
      expect(result).toBeCloseTo(0.0672);
    });

    it("should calculate value score correctly for USD", () => {
      const result = calculateValueScore(4.0, 100, "USD");
      expect(result).toBeCloseTo(0.04);
    });

    it("should return value with 4 decimal places", () => {
      const result = calculateValueScore(3.5, 5000, "JPY");
      expect(result.toString()).toMatch(/^\d+\.\d{4}$/);
    });
  });
});