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

import { Hotel, ValueCalculationMode } from "@/types/hotel";

export function calculateValueScore(
  rating: number,
  price: number,
  mode: ValueCalculationMode = ValueCalculationMode.BALANCED,
): number {
  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  let score: number;
  switch (mode) {
    case ValueCalculationMode.STRICT_BUDGET:
      score = rating / price;
      break;
    case ValueCalculationMode.QUALITY_FIRST:
      // Use natural logarithm, ensuring price is at least 1.1 to avoid log(1) = 0 or negative values
      score = rating / Math.log(Math.max(price, 1.1));
      break;
    case ValueCalculationMode.BALANCED:
    default:
      score = Math.pow(rating, 2) / price;
      break;
  }

  return +score.toFixed(4);
}

export function sortHotelsByValueScore(hotels: Hotel[]): Hotel[] {
  return [...hotels].sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));
}

export function getMinimumPrice(hotels: Hotel[]): number {
  if (hotels.length === 0) return 0;
  return Math.min(...hotels.map((hotel) => hotel.price));
}

export function getMaximumRating(hotels: Hotel[]): number {
  if (hotels.length === 0) return 0;
  return Math.max(...hotels.map((hotel) => hotel.rating));
}

export function getTopValueScore(hotels: Hotel[]): number {
  if (hotels.length === 0) return 0;
  return hotels[0]?.valueScore || 0;
}

export function getHotelCount(hotels: Hotel[]): number {
  return hotels.length;
}

export interface HotelStatistics {
  count: number;
  topScore: number;
  lowestPrice: number;
  highestRating: number;
}

export function calculateHotelStatistics(hotels: Hotel[]): HotelStatistics {
  return {
    count: getHotelCount(hotels),
    topScore: getTopValueScore(hotels),
    lowestPrice: getMinimumPrice(hotels),
    highestRating: getMaximumRating(hotels),
  };
}
