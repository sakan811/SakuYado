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

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Hotel } from "@/types/hotel";
import {
  calculateValueScore,
  sortHotelsByValueScore,
} from "@/utils/calculations";

interface HotelState {
  hotels: Hotel[];
  isLoading: boolean;
  error: string | null;
}

type HotelAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_HOTEL"; payload: Omit<Hotel, "valueScore"> }
  | { type: "CLEAR_HOTELS" }
  | { type: "INITIALIZE_STATE"; payload: { hotels: Hotel[] } };

interface HotelContextType {
  state: HotelState;
  addHotel: (hotel: Omit<Hotel, "valueScore">) => Promise<void>;
  clearAllHotels: () => void;
}

const initialState: HotelState = {
  hotels: [],
  isLoading: true,
  error: null,
};

function hotelReducer(state: HotelState, action: HotelAction): HotelState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_HOTEL": {
      const newHotel: Hotel = {
        ...action.payload,
        valueScore: calculateValueScore(
          action.payload.rating,
          action.payload.price,
        ),
      };
      const updatedHotels = sortHotelsByValueScore([...state.hotels, newHotel]);
      return { ...state, hotels: updatedHotels, error: null };
    }
    case "CLEAR_HOTELS":
      return { ...state, hotels: [], error: null };
    case "INITIALIZE_STATE":
      return {
        ...state,
        hotels: action.payload.hotels,
        isLoading: false,
      };
  }
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(hotelReducer, initialState);

  useEffect(() => {
    const initializeFromStorage = () => {
      try {
        // Check if localStorage is available
        if (typeof localStorage === "undefined" || !localStorage) {
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

        // Filter out invalid hotels
        const validHotels = savedHotels.filter((hotel: unknown) => {
          if (!hotel || typeof hotel !== "object") return false;
          const hotelObj = hotel as Record<string, unknown>;
          return (
            hotelObj &&
            typeof hotelObj === "object" &&
            typeof hotelObj.name === "string" &&
            typeof hotelObj.price === "number" &&
            typeof hotelObj.rating === "number" &&
            hotelObj.name.trim() !== "" &&
            hotelObj.price > 0 &&
            hotelObj.rating >= 0 &&
            hotelObj.rating <= 10
          );
        });

        const processedHotels = sortHotelsByValueScore(
          validHotels.map((hotel: Hotel) => ({
            ...hotel,
            valueScore: calculateValueScore(hotel.rating, hotel.price),
          })),
        );

        dispatch({
          type: "INITIALIZE_STATE",
          payload: { hotels: processedHotels },
        });
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load saved data" });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeFromStorage();
  }, []);

  const addHotel = async (hotel: Omit<Hotel, "valueScore">) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "ADD_HOTEL", payload: hotel });

      // Check if localStorage is available
      if (typeof localStorage === "undefined" || !localStorage) {
        dispatch({
          type: "SET_ERROR",
          payload: "Unable to save hotel data. Storage is not available.",
        });
        throw new Error("localStorage is not available");
      }

      // Read current hotels from localStorage to ensure we have the latest data
      const currentHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      const newHotelData = { ...hotel };
      const updatedHotelsData = [...currentHotels, newHotelData];

      // Save to localStorage without valueScore (computed property)
      localStorage.setItem("hotels", JSON.stringify(updatedHotelsData));
    } catch (error) {
      console.error("Error saving hotel data:", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          "Unable to save hotel data. Please try again or check your browser storage settings.",
      });
      throw error;
    }
  };

  const clearAllHotels = () => {
    try {
      /* v8 ignore start */
      if (typeof localStorage !== "undefined" && localStorage) {
        localStorage.removeItem("hotels");
      }
      /* v8 ignore stop */
      dispatch({ type: "CLEAR_HOTELS" });
    } catch (error) {
      console.error("Error clearing hotel data:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to clear hotel data" });
    }
  };

  return (
    <HotelContext.Provider
      value={{
        state,
        addHotel,
        clearAllHotels,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
}
