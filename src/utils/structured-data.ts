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

import { Hotel } from "@/types/hotel";

export function generateAddHotelPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Add Hotel Information - SakuYado",
    description:
      "Add hotel details to compare value and find the best accommodation deals with SakuYado",
    url: "https://saku-yado.vercel.app/hotels/add",
    isPartOf: {
      "@type": "WebSite",
      name: "SakuYado", 
      url: "https://saku-yado.vercel.app",
    },
    mainEntity: {
      "@type": "WebApplication",
      name: "SakuYado Hotel Information Form",
      description:
        "Input hotel name, price, rating and currency for value comparison with SakuYado",
      applicationCategory: "TravelApplication",
      featureList: [
        "Hotel data input",
        "Multi-currency support",
        "Rating validation",
        "Value score calculation",
      ],
    },
    potentialAction: {
      "@type": "UseAction",
      target: "https://saku-yado.vercel.app/hotels/compare",
      name: "Compare Hotels with SakuYado",
    },
  };
}

export function generateHotelComparisonSchema(hotels: Hotel[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hotel Value Comparison",
    description: "Compare hotels by value score (rating/price ratio)",
    numberOfItems: hotels.length,
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LodgingBusiness",
        name: hotel.name,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: hotel.rating,
          bestRating: "10",
          worstRating: "1",
        },
        priceRange: `${hotel.price} ${hotel.currency}`,
        additionalProperty: {
          "@type": "PropertyValue",
          name: "Value Score",
          value: hotel.valueScore,
        },
      },
    })),
  };
}