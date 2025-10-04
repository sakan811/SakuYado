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
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("should return a valid sitemap array", () => {
    const result = sitemap();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should have exactly three sitemap entries", () => {
    const result = sitemap();

    expect(result).toHaveLength(3);
  });

  it("should have correct base URL for all entries", () => {
    const result = sitemap();
    const baseUrl = "https://sakuyado.fukudev.org";

    expect(result[0].url).toBe(baseUrl);
    expect(result[1].url).toBe(`${baseUrl}/hotels/add`);
    expect(result[2].url).toBe(`${baseUrl}/hotels/compare`);
  });

  it("should have valid URL format for all entries", () => {
    const result = sitemap();

    result.forEach((entry) => {
      expect(entry.url).toMatch(
        /^https:\/\/sakuyado\.fukudev\.org(\/[a-zA-Z0-9-\/]*)?$/,
      );
      expect(typeof entry.url).toBe("string");
      expect(entry.url.length).toBeGreaterThan(0);
    });
  });

  it("should have lastModified as Date object for all entries", () => {
    const result = sitemap();

    result.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.lastModified!.getTime()).toBeTypeOf("number");
    });
  });

  it("should have valid changeFrequency for all entries", () => {
    const result = sitemap();

    const validFrequencies = [
      "always",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "never",
    ];

    result.forEach((entry) => {
      expect(validFrequencies).toContain(entry.changeFrequency);
      expect(typeof entry.changeFrequency).toBe("string");
    });
  });

  it("should have correct changeFrequency values for each page", () => {
    const result = sitemap();

    expect(result[0].changeFrequency).toBe("weekly"); // Home page
    expect(result[1].changeFrequency).toBe("monthly"); // Add hotel page
    expect(result[2].changeFrequency).toBe("weekly"); // Compare page
  });

  it("should have valid priority values for all entries", () => {
    const result = sitemap();

    result.forEach((entry) => {
      expect(typeof entry.priority).toBe("number");
      expect(entry.priority!).toBeGreaterThanOrEqual(0);
      expect(entry.priority!).toBeLessThanOrEqual(1);
    });
  });

  it("should have correct priority values for each page", () => {
    const result = sitemap();

    expect(result[0].priority).toBe(1); // Home page - highest priority
    expect(result[1].priority).toBe(0.8); // Add hotel page - medium-high priority
    expect(result[2].priority).toBe(0.9); // Compare page - high priority
  });

  it("should have all required sitemap properties for each entry", () => {
    const result = sitemap();

    result.forEach((entry) => {
      expect(entry).toHaveProperty("url");
      expect(entry).toHaveProperty("lastModified");
      expect(entry).toHaveProperty("changeFrequency");
      expect(entry).toHaveProperty("priority");
    });
  });

  it("should have sitemap entries with reasonable priority values", () => {
    const result = sitemap();

    // Check that priorities are reasonable (home page should be highest)
    expect(result[0].priority).toBe(1); // Home page should have highest priority
    expect(result[0].priority).toBeGreaterThan(result[1].priority!);
    expect(result[0].priority).toBeGreaterThan(result[2].priority!);
  });

  it("should have recent lastModified dates", () => {
    const result = sitemap();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    result.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
      const lastModified = entry.lastModified as Date;
      expect(lastModified.getTime()).toBeGreaterThan(oneDayAgo.getTime());
      expect(lastModified.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  it("should follow sitemap best practices", () => {
    const result = sitemap();

    result.forEach((entry) => {
      // URL should be absolute
      expect(entry.url).toMatch(/^https:\/\//);

      // Priority should be a reasonable number
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);

      // Change frequency should be valid
      const validFrequencies = [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ];
      expect(validFrequencies).toContain(entry.changeFrequency);
    });
  });
});
