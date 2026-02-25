"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/types/hotel";
import { formatPrice, formatRating } from "@/utils/formatting";

export const columns: ColumnDef<Hotel>[] = [
  {
    id: "rank",
    header: "🏆 Rank",
    cell: ({ row }) => {
      const index = row.index;
      return (
        <div className="flex items-center space-x-2">
          <span className="text-base lg:text-lg font-bold text-pink-700">
            {index + 1}
          </span>
          {index === 0 && (
            <span className="text-yellow-500 text-lg lg:text-xl">👑</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "🏨 Hotel",
    cell: ({ row }) => {
      const hotel = row.original;
      const index = row.index;

      return (
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
      );
    },
  },
  {
    accessorKey: "price",
    header: "💰 Price",
    cell: ({ row }) => {
      const hotel = row.original;
      const index = row.index;

      return (
        <span
          className="font-semibold text-pink-700 text-base lg:text-lg"
          data-testid={`hotel-price-${index}`}
        >
          {formatPrice(hotel.price, hotel.currency)}
        </span>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "⭐ Rating",
    cell: ({ row }) => {
      const hotel = row.original;
      const index = row.index;

      return (
        <div className="flex items-center space-x-1">
          <span
            className="font-semibold text-pink-700 text-base lg:text-lg"
            data-testid={`hotel-rating-${index}`}
          >
            {formatRating(hotel.rating)}
          </span>
          <span className="text-yellow-500">⭐</span>
        </div>
      );
    },
  },
  {
    accessorKey: "valueScore",
    header: "🌸 Value Score",
    cell: ({ row }) => {
      const hotel = row.original;
      const index = row.index;

      return (
        <span
          className={`font-bold text-base lg:text-lg px-3 py-1 rounded-full ${
            index === 0
              ? "bg-gradient-to-r from-pink-200 to-rose-200 text-pink-800"
              : "bg-pink-100 text-pink-700"
          }`}
          data-testid={`hotel-value-score-${index}`}
        >
          {hotel.valueScore}
        </span>
      );
    },
  },
];
