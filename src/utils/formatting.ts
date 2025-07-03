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

export function formatPrice(price: number, currency?: string): string {
  const formattedPrice = price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${formattedPrice} ${currency}` : formattedPrice;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatValueScore(valueScore: number): string {
  return valueScore.toFixed(4);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export interface FormattedHotelData {
  price: string;
  rating: string;
  valueScore: string;
}

export function formatHotelData(hotel: {
  price: number;
  rating: number;
  valueScore?: number;
  currency: string;
}): FormattedHotelData {
  return {
    price: formatPrice(hotel.price, hotel.currency),
    rating: formatRating(hotel.rating),
    valueScore: formatValueScore(hotel.valueScore || 0),
  };
}
