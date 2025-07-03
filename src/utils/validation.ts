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

export interface ValidationError {
  name: string;
  price: string;
  rating: string;
  general: string;
}

export interface HotelFormData {
  name: string;
  price: string;
  rating: string;
  currency: string;
}

export function validateHotelForm(formData: HotelFormData): {
  errors: ValidationError;
  isValid: boolean;
} {
  const errors: ValidationError = {
    name: "",
    price: "",
    rating: "",
    general: "",
  };
  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = "Hotel name is required";
    isValid = false;
  }

  // Use regex to validate proper number format for price
  const priceRegex = /^-?\d*\.?\d+$/;
  const trimmedPrice = formData.price.trim();

  if (!trimmedPrice || !priceRegex.test(trimmedPrice)) {
    errors.price = "Price must be a positive number";
    isValid = false;
  } else {
    const price = parseFloat(trimmedPrice);
    if (isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number";
      isValid = false;
    }
  }

  // Use regex to validate proper number format for rating
  const ratingRegex = /^-?\d*\.?\d+$/;
  const trimmedRating = formData.rating.trim();

  if (!trimmedRating || !ratingRegex.test(trimmedRating)) {
    errors.rating = "Rating must be between 0 and 10";
    isValid = false;
  } else {
    const rating = parseFloat(trimmedRating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      errors.rating = "Rating must be between 0 and 10";
      isValid = false;
    }
  }

  return { errors, isValid };
}

export function validateHotelName(name: string): string {
  if (!name.trim()) {
    return "Hotel name is required";
  }
  return "";
}

export function validatePrice(price: string): string {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return "Price must be a positive number";
  }
  return "";
}

export function validateRating(rating: string): string {
  const ratingNum = parseFloat(rating);
  if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
    return "Rating must be between 0 and 10";
  }
  return "";
}
