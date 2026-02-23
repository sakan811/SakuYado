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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/constants/currencies";
import { useHotel } from "@/contexts/HotelContext";
import { validateHotelForm, type ValidationError } from "@/utils/validation";
import { generateAddHotelPageSchema } from "@/utils/structured-data";
import { Button } from "@/components/ui/button";
import {
  Input,
  Select,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  ErrorMessage,
} from "@/components";

export default function AddHotelPage() {
  const router = useRouter();
  const { state, addHotel, setLastUsedCurrency } = useHotel();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    rating: "",
    currency: state.lastUsedCurrency,
  });
  const [errors, setErrors] = useState<ValidationError>({
    name: "",
    price: "",
    rating: "",
    general: "",
  });

  const addHotelPageSchema = generateAddHotelPageSchema();

  // Initialize currency from context when it's available
  useEffect(() => {
    if (!state.isLoading) {
      setFormData((prev) => ({
        ...prev,
        currency: state.lastUsedCurrency,
      }));
    }
  }, [state.isLoading, state.lastUsedCurrency]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If currency is changed, update the context
    if (name === "currency") {
      setLastUsedCurrency(value);
    }

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
  };

  const validateForm = () => {
    const { errors: validationErrors, isValid } = validateHotelForm(formData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const newHotel = {
          name: formData.name,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          currency: formData.currency,
        };

        await addHotel(newHotel);
        router.push("/hotels/compare");
      } catch {
        setErrors((prev) => ({
          ...prev,
          general:
            state.error || "Unable to save hotel data. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-4 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(addHotelPageSchema),
        }}
      />
      {/* Container with responsive max-width */}
      <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* Header Card - responsive spacing */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
            🌸
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 mb-2">
            Add Hotel Information
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-pink-600">
            Share your hotel details to find the best value
          </p>
          <p className="text-xs sm:text-sm text-amber-600 font-medium mt-2">
            ⚠️ Please compare hotels within the same currency
          </p>
        </div>

        {/* Form Card - enhanced responsive design */}
        <Card variant="gradient" size="md" className="shadow-xl sm:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-pink-800">
              🌸 Add New Hotel
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-pink-600">
              Enter hotel details to calculate value score
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
              noValidate
            >
              {/* General Error Message */}
              <ErrorMessage message={errors.general} />

              {/* Hotel Name - responsive input */}
              <Input
                type="text"
                id="name"
                name="name"
                data-testid="hotel-name"
                value={formData.name}
                onChange={handleChange}
                label="Hotel Name"
                icon="🏨"
                placeholder="Enter hotel name"
                error={errors.name}
              />

              {/* Price and Currency - enhanced responsive layout */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm sm:text-base font-bold text-pink-800 mb-2"
                >
                  💰 Price
                </label>

                {/* Mobile: stacked, Tablet+: side-by-side with equal widths */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Price Input - equal width on desktop */}
                  <div className="flex-1 sm:flex-1">
                    <Input
                      type="text"
                      id="price"
                      name="price"
                      data-testid="hotel-price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                    />
                  </div>

                  {/* Currency dropdown - equal width on desktop */}
                  <div className="w-full sm:flex-1">
                    <Select
                      id="currency"
                      name="currency"
                      data-testid="hotel-currency"
                      value={formData.currency}
                      onChange={handleChange}
                      options={CURRENCIES.map((currency) => ({
                        value: currency.code,
                        label: `${currency.code} - ${currency.name}`,
                      }))}
                    />
                  </div>
                </div>

                {errors.price && (
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-500 font-medium">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Rating - responsive input */}
              <Input
                type="text"
                id="rating"
                name="rating"
                data-testid="hotel-rating"
                value={formData.rating}
                onChange={handleChange}
                label="Rating (0-10)"
                icon="⭐"
                placeholder="Enter rating"
                error={errors.rating}
              />

              {/* Submit Button - enhanced responsive */}
              <Button
                type="submit"
                data-testid="add-hotel-button"
                variant="default"
                size="lg"
                className="w-full"
              >
                🌸 Submit & Compare
              </Button>

              {/* Secondary Actions - responsive layout */}
              <div className="space-y-3 sm:space-y-4">
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Link href="/hotels/compare">
                    👀 View Compare Page
                  </Link>
                </Button>

                <Link
                  href="/"
                  className="block w-full text-center text-sm sm:text-base text-pink-600 hover:text-pink-800 font-medium transition-colors duration-300"
                >
                  ← Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Decorative Elements - responsive */}
        <div className="text-center mt-6 sm:mt-8 space-x-2 sm:space-x-4">
          <span className="text-xl sm:text-2xl opacity-60">🌸</span>
          <span className="text-2xl sm:text-3xl opacity-80">🌸</span>
          <span className="text-xl sm:text-2xl opacity-60">🌸</span>
        </div>
      </div>
    </div>
  );
}
