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

import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("manifest", () => {
  it("should return a valid manifest object", () => {
    const result = manifest();

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("should have correct app name and short name", () => {
    const result = manifest();

    expect(result.name).toBe("SakuYado - Hotel Value Analyzer");
    expect(result.short_name).toBe("SakuYado");
  });

  it("should have a descriptive description", () => {
    const result = manifest();

    expect(result.description).toBe(
      "Compare hotels based on review-per-price ratio with SakuYado",
    );
    expect(typeof result.description).toBe("string");
    expect(result.description!.length).toBeGreaterThan(0);
  });

  it("should have correct start URL and display mode", () => {
    const result = manifest();

    expect(result.start_url).toBe("/");
    expect(result.display).toBe("standalone");
  });

  it("should have correct background and theme colors", () => {
    const result = manifest();

    expect(result.background_color).toBe("#ffffff");
    expect(result.theme_color).toBe("#ec4899");
  });

  it("should have icons array with correct structure", () => {
    const result = manifest();

    expect(Array.isArray(result.icons)).toBe(true);
    expect(result.icons).toHaveLength(1);

    const icon = result.icons![0];
    expect(icon.src).toBe("src/app/favicon.ico");
    expect(icon.sizes).toBe("any");
    expect(icon.type).toBe("image/x-icon");
  });

  it("should have all required manifest properties", () => {
    const result = manifest();

    // Check that all required properties are present
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("short_name");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("start_url");
    expect(result).toHaveProperty("display");
    expect(result).toHaveProperty("background_color");
    expect(result).toHaveProperty("theme_color");
    expect(result).toHaveProperty("icons");
  });

  it("should have valid color format for theme and background colors", () => {
    const result = manifest();

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    expect(hexColorRegex.test(result.background_color!)).toBe(true);
    expect(hexColorRegex.test(result.theme_color!)).toBe(true);
  });

  it("should have correct icon properties", () => {
    const result = manifest();
    const icon = result.icons![0];

    expect(icon).toHaveProperty("src");
    expect(icon).toHaveProperty("sizes");
    expect(icon).toHaveProperty("type");
    expect(typeof icon.src).toBe("string");
    expect(typeof icon.sizes).toBe("string");
    expect(typeof icon.type).toBe("string");
  });

  it("should follow PWA manifest best practices", () => {
    const result = manifest();

    // Check PWA best practices
    expect(result.name!.length).toBeLessThanOrEqual(100);
    expect(result.short_name!.length).toBeLessThanOrEqual(12);
    expect(result.start_url).toMatch(/^\//);
    expect(["fullscreen", "standalone", "minimal-ui", "browser"]).toContain(
      result.display,
    );
  });
});
