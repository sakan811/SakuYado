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

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/constants/currencies";
import { useHotel } from "@/contexts/HotelContext";
import { validateHotelForm, type ValidationError } from "@/utils/validation";
import { generateAddHotelPageSchema } from "@/utils/structured-data";
import { Button } from "@/components/ui/Button";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Alert,
  AlertDescription,
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components";

export default function AddHotelPage() {
  const router = useRouter();
  const { state, addHotel, setLastUsedCurrency } = useHotel();
  const [formData, setFormData] = useState(() => {
    let currency = state.lastUsedCurrency;
    try {
      const saved =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("lastUsedCurrency")
          : null;
      if (saved) currency = saved;
    } catch {
      // ignore – localStorage may not be available
    }
    return { name: "", price: "", rating: "", currency };
  });
  const [errors, setErrors] = useState<ValidationError>({
    name: "",
    price: "",
    rating: "",
    general: "",
  });

  const addHotelPageSchema = generateAddHotelPageSchema();

  // Initialize currency from context when it's available

  const [prevContext, setPrevContext] = useState({
    isLoading: state.isLoading,
    currency: state.lastUsedCurrency,
  });

  if (
    state.isLoading !== prevContext.isLoading ||
    state.lastUsedCurrency !== prevContext.currency
  ) {
    setPrevContext({
      isLoading: state.isLoading,
      currency: state.lastUsedCurrency,
    });
    if (!state.isLoading) {
      setFormData((prev) => ({
        ...prev,
        currency: state.lastUsedCurrency,
      }));
      // Sync any context-level error (e.g. failed to load saved data) to the form
      if (state.error && !errors.general) {
        setErrors((prev) => ({ ...prev, general: state.error! }));
      }
    }
  }

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
          general: "Unable to save hotel data. Please try again.",
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

          <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* General Error Message */}
              {errors.general && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertDescription className="text-red-700 font-medium">
                    {errors.general}
                  </AlertDescription>
                </Alert>
              )}

              <FieldSet>
                <FieldGroup className="gap-4 sm:gap-6">
                  {/* Hotel Name */}
                  <Field>
                    <FieldLabel htmlFor="name">
                      <span className="mr-2">🏨</span>
                      Hotel Name
                    </FieldLabel>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      data-testid="hotel-name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter hotel name"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <FieldError className="text-red-500 font-medium text-xs sm:text-sm">
                        {errors.name}
                      </FieldError>
                    )}
                  </Field>

                  {/* Price and Currency */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <Field className="flex-1">
                      <FieldLabel htmlFor="price">
                        <span className="mr-2">💰</span>
                        Price
                      </FieldLabel>
                      <Input
                        type="text"
                        id="price"
                        name="price"
                        data-testid="hotel-price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        aria-invalid={!!errors.price}
                      />
                      {errors.price && (
                        <FieldError className="text-red-500 font-medium text-xs sm:text-sm">
                          {errors.price}
                        </FieldError>
                      )}
                    </Field>

                    <Field className="flex-1">
                      <FieldLabel htmlFor="currency">Currency</FieldLabel>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "currency", value },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      >
                        <SelectTrigger
                          id="currency"
                          data-testid="hotel-currency"
                        >
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  {/* Rating */}
                  <Field>
                    <FieldLabel htmlFor="rating">
                      <span className="mr-2">⭐</span>
                      Rating (0-10)
                    </FieldLabel>
                    <Input
                      type="text"
                      id="rating"
                      name="rating"
                      data-testid="hotel-rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="Enter rating"
                      aria-invalid={!!errors.rating}
                    />
                    {errors.rating && (
                      <FieldError className="text-red-500 font-medium text-xs sm:text-sm">
                        {errors.rating}
                      </FieldError>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>

            <CardFooter className="flex-col gap-3 sm:gap-4 mt-6 sm:mt-8">
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
              <div className="w-full space-y-3 sm:space-y-4">
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Link href="/hotels/compare">👀 View Compare Page</Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-pink-600 hover:text-pink-800 hover:bg-pink-100/50 transition-colors duration-300"
                >
                  <Link href="/">← Back to Home</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
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
