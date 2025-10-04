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
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import robots from '../../src/app/robots';

// Mock the MetadataRoute type from Next.js
type MockMetadataRoute = {
  Robots: {
    rules: {
      userAgent: string;
      allow: string;
      disallow: string[];
    };
    sitemap: string;
  };
};

describe('robots', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return correct robots configuration', () => {
    const result = robots() as MockMetadataRoute.Robots;

    expect(result).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
      sitemap: 'https://sakuyado.fukudev.org/sitemap.xml',
    });
  });

  it('should have proper structure for robots rules', () => {
    const result = robots() as MockMetadataRoute.Robots;

    // Test that rules object exists and has correct structure
    expect(result.rules).toBeDefined();
    expect(typeof result.rules.userAgent).toBe('string');
    expect(typeof result.rules.allow).toBe('string');
    expect(Array.isArray(result.rules.disallow)).toBe(true);

    // Test specific values
    expect(result.rules.userAgent).toBe('*');
    expect(result.rules.allow).toBe('/');
    expect(result.rules.disallow).toContain('/private/');
    expect(result.rules.disallow).toContain('/admin/');
    expect(result.rules.disallow).toHaveLength(2);
  });

  it('should generate correct sitemap URL', () => {
    const result = robots() as MockMetadataRoute.Robots;

    expect(result.sitemap).toBeDefined();
    expect(typeof result.sitemap).toBe('string');
    expect(result.sitemap).toBe('https://sakuyado.fukudev.org/sitemap.xml');
    expect(result.sitemap).toMatch(/^https:\/\//);
    expect(result.sitemap).toContain('sitemap.xml');
  });

  it('should return consistent results on multiple calls', () => {
    const result1 = robots() as MockMetadataRoute.Robots;
    const result2 = robots() as MockMetadataRoute.Robots;

    expect(result1).toEqual(result2);
  });

  it('should not be affected by environment variables', () => {
    // Set some environment variables that might affect the function
    process.env.NODE_ENV = 'production';
    process.env.VERCEL_URL = 'example.com';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';

    const result = robots() as MockMetadataRoute.Robots;

    // The function should still return the hardcoded values
    expect(result.sitemap).toBe('https://sakuyado.fukudev.org/sitemap.xml');
    expect(result.rules.userAgent).toBe('*');
    expect(result.rules.allow).toBe('/');
    expect(result.rules.disallow).toEqual(['/private/', '/admin/']);
  });

  it('should contain disallow paths with trailing slashes', () => {
    const result = robots() as MockMetadataRoute.Robots;

    result.rules.disallow.forEach((path) => {
      expect(path).toMatch(/\/$/); // Should end with trailing slash
    });

    expect(result.rules.disallow[0]).toBe('/private/');
    expect(result.rules.disallow[1]).toBe('/admin/');
  });

  it('should use wildcard user agent', () => {
    const result = robots() as MockMetadataRoute.Robots;

    expect(result.rules.userAgent).toBe('*');
    expect(result.rules.userAgent.length).toBeGreaterThan(0);
  });

  it('should have proper allow directive for root', () => {
    const result = robots() as MockMetadataRoute.Robots;

    expect(result.rules.allow).toBe('/');
    expect(result.rules.allow).toMatch(/^\//); // Should start with forward slash
  });

  it('should return object that matches MetadataRoute.Robots interface', () => {
    const result = robots();

    // Test that the result has the expected keys
    expect(result).toHaveProperty('rules');
    expect(result).toHaveProperty('sitemap');

    // Test that rules has the expected structure
    expect(result.rules).toHaveProperty('userAgent');
    expect(result.rules).toHaveProperty('allow');
    expect(result.rules).toHaveProperty('disallow');

    // Test types
    expect(typeof result.rules.userAgent).toBe('string');
    expect(typeof result.rules.allow).toBe('string');
    expect(Array.isArray(result.rules.disallow)).toBe(true);
    expect(typeof result.sitemap).toBe('string');
  });
});