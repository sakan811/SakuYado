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

import Link from "next/link";
import { Hotel } from "@/types/hotel";
import { useHotel } from "@/contexts/HotelContext";
import { calculateHotelStatistics } from "@/utils/calculations";
import { formatPrice, formatRating } from "@/utils/formatting";
import { generateHotelComparisonSchema } from "@/utils/structured-data";
import { Button, Card, LoadingSpinner } from "@/components";

export default function CompareHotelsPage() {
  const { state, clearAllHotels } = useHotel();
  const { hotels, isLoading } = state;

  // Mobile Card Component
  const HotelCard = ({ hotel, index }: { hotel: Hotel; index: number }) => (
    <Card
      data-testid="hotel-card-mobile"
      variant={index === 0 ? "highlight" : "default"}
      size="sm"
      className={`mb-4 ${index === 0 ? "" : "hover:border-pink-300"}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
            ${index === 0 ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"}
          `}
          >
            {index + 1}
          </div>
          {index === 0 && <span className="text-lg">👑</span>}
        </div>
        <div
          className={`
          px-3 py-1 rounded-full text-xs font-bold
          ${
            index === 0
              ? "bg-pink-200 text-pink-800"
              : "bg-gray-100 text-gray-700"
          }
        `}
          data-testid={`hotel-value-score-${index}`}
        >
          {hotel.valueScore}
        </div>
      </div>

      {/* Hotel Name */}
      <h3
        className="font-bold text-lg sm:text-xl text-pink-800 mb-3"
        data-testid={`hotel-name-${index}`}
      >
        {hotel.name}
        {index === 0 && (
          <span className="block text-sm font-normal text-pink-600 mt-1">
            🌸 Best Value
          </span>
        )}
      </h3>

      {/* Hotel Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-pink-50 p-3 rounded-lg">
          <div className="text-pink-600 font-medium mb-1">💰 Price</div>
          <div
            className="font-bold text-pink-800"
            data-testid={`hotel-price-${index}`}
          >
            {formatPrice(hotel.price, hotel.currency)}
          </div>
        </div>
        <div className="bg-rose-50 p-3 rounded-lg">
          <div className="text-rose-600 font-medium mb-1">⭐ Rating</div>
          <div
            className="font-bold text-rose-800"
            data-testid={`hotel-rating-${index}`}
          >
            {formatRating(hotel.rating)}
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading hotel comparisons..." />;
  }

  const hotelComparisonStructuredData = generateHotelComparisonSchema(hotels);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-4 sm:py-8">
      {/* Structured Data Scripts */}
      {hotels.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(hotelComparisonStructuredData),
          }}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
            🏨
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 mb-2 sm:mb-4">
            Hotel Value Comparison
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-pink-600">
            Discover the best value accommodations
          </p>
        </div>

        {hotels.length === 0 ? (
          /* Empty State */
          <Card
            variant="gradient"
            size="lg"
            className="text-center max-w-2xl mx-auto"
          >
            <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">
              🌸
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-800 mb-3 sm:mb-4">
              No Hotels Added Yet
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-pink-600 mb-6 sm:mb-8">
              Start your journey by adding your first hotel to compare
            </p>
            <Link href="/hotels/add" data-testid="add-first-hotel">
              <Button
                variant="primary"
                size="lg"
                className="text-base sm:text-lg"
              >
                🌸 Add Your First Hotel
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Mobile Cards View (default on mobile) */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {hotels.map((hotel, index) => (
                  <HotelCard key={index} hotel={hotel} index={index} />
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card variant="gradient" size="lg" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-pink-500 to-rose-500">
                      <tr>
                        <th className="py-3 lg:py-4 px-4 lg:px-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                          🏆 Rank
                        </th>
                        <th className="py-3 lg:py-4 px-4 lg:px-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                          🏨 Hotel
                        </th>
                        <th className="py-3 lg:py-4 px-4 lg:px-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                          💰 Price
                        </th>
                        <th className="py-3 lg:py-4 px-4 lg:px-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                          ⭐ Rating
                        </th>
                        <th className="py-3 lg:py-4 px-4 lg:px-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                          🌸 Value Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotels.map((hotel, index) => (
                        <tr
                          key={index}
                          data-testid="hotel-row-desktop"
                          className={`
                            ${
                              index === 0
                                ? "bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 border-l-4 border-pink-400"
                                : index % 2 === 0
                                  ? "bg-white/70"
                                  : "bg-pink-50/50"
                            }
                            hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 transition-all duration-300
                            ${index !== hotels.length - 1 ? "border-b border-pink-200" : ""}
                          `}
                        >
                          <td className="py-3 lg:py-4 px-4 lg:px-6 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-base lg:text-lg font-bold text-pink-700">
                                {index + 1}
                              </span>
                              {index === 0 && (
                                <span className="text-yellow-500 text-lg lg:text-xl">
                                  👑
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 lg:py-4 px-4 lg:px-6 whitespace-nowrap">
                            <div
                              className="font-bold text-pink-800 text-base lg:text-lg"
                              data-testid={`hotel-name-${index}`}
                            >
                              {hotel.name}
                              {index === 0 && (
                                <span className="ml-2 text-pink-500 text-sm font-normal">
                                  🌸 Best Value
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 lg:py-4 px-4 lg:px-6 whitespace-nowrap">
                            <span
                              className="font-semibold text-pink-700 text-base lg:text-lg"
                              data-testid={`hotel-price-${index}`}
                            >
                              {formatPrice(hotel.price, hotel.currency)}
                            </span>
                          </td>
                          <td className="py-3 lg:py-4 px-4 lg:px-6 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span
                                className="font-semibold text-pink-700 text-base lg:text-lg"
                                data-testid={`hotel-rating-${index}`}
                              >
                                {formatRating(hotel.rating)}
                              </span>
                              <span className="text-yellow-500">⭐</span>
                            </div>
                          </td>
                          <td className="py-3 lg:py-4 px-4 lg:px-6 whitespace-nowrap">
                            <span
                              className={`
                              font-bold text-base lg:text-lg px-3 py-1 rounded-full
                              ${
                                index === 0
                                  ? "bg-gradient-to-r from-pink-200 to-rose-200 text-pink-800"
                                  : "bg-pink-100 text-pink-700"
                              }
                            `}
                              data-testid={`hotel-value-score-${index}`}
                            >
                              {hotel.valueScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Value Score Explanation */}
            <Card variant="gradient" size="md" className="mt-6 sm:mt-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-xl sm:text-2xl">🧮</span>
                <h3 className="text-base sm:text-lg font-bold text-pink-800">
                  Value Score Calculation
                </h3>
              </div>
              <p className="text-sm sm:text-base text-pink-700">
                <strong className="text-pink-800">Value Score</strong> = Rating
                ÷ Price
                <span className="block sm:inline sm:ml-2 text-xs sm:text-sm">
                  (higher score = better value for money)
                </span>
              </p>
            </Card>

            {/* Action Buttons - Enhanced Mobile Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <Link href="/hotels/add" data-testid="add-another-hotel">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="text-base sm:text-lg"
                >
                  🌸 Add Another Hotel
                </Button>
              </Link>
              <Button
                variant="danger"
                size="lg"
                fullWidth
                onClick={clearAllHotels}
                className="text-base sm:text-lg"
              >
                🗑️ Clear All Hotels
              </Button>
            </div>

            {/* Statistics Section - Mobile Friendly */}
            <div
              data-testid="statistics"
              className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <div className="bg-white/80 backdrop-blur p-3 sm:p-4 rounded-xl border border-pink-200 text-center">
                <div className="text-lg sm:text-xl font-bold text-pink-800">
                  {calculateHotelStatistics(hotels).count}
                </div>
                <div className="text-xs sm:text-sm text-pink-600">Hotels</div>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 sm:p-4 rounded-xl border border-pink-200 text-center">
                <div className="text-lg sm:text-xl font-bold text-rose-800">
                  {calculateHotelStatistics(hotels).topScore}
                </div>
                <div className="text-xs sm:text-sm text-rose-600">
                  Top Score
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 sm:p-4 rounded-xl border border-pink-200 text-center col-span-2 lg:col-span-1">
                <div className="text-lg sm:text-xl font-bold text-pink-800">
                  {formatPrice(calculateHotelStatistics(hotels).lowestPrice)}
                </div>
                <div className="text-xs sm:text-sm text-pink-600">
                  Lowest Price
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 sm:p-4 rounded-xl border border-pink-200 text-center col-span-2 lg:col-span-1">
                <div className="text-lg sm:text-xl font-bold text-rose-800">
                  {formatRating(calculateHotelStatistics(hotels).highestRating)}
                </div>
                <div className="text-xs sm:text-sm text-rose-600">
                  Highest Rating
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Links */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm sm:text-base text-pink-600 hover:text-pink-800 font-medium transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="text-center mt-8 sm:mt-12 space-x-3 sm:space-x-6">
          <span className="text-2xl sm:text-3xl opacity-60 animate-pulse">
            🌸
          </span>
          <span className="text-3xl sm:text-4xl opacity-80 animate-pulse delay-1000">
            🌸
          </span>
          <span className="text-2xl sm:text-3xl opacity-60 animate-pulse delay-2000">
            🌸
          </span>
        </div>
      </div>
    </div>
  );
}
