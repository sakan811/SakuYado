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

import React from "react";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105";
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600",
      secondary: "bg-gradient-to-r from-white to-pink-50 text-pink-600 hover:from-pink-50 hover:to-rose-50 border-2 border-pink-200",
      danger: "bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500",
      outline: "bg-transparent border-2 border-pink-200 text-pink-600 hover:bg-pink-50"
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm sm:rounded-lg",
      md: "px-4 py-3 text-base sm:px-6 sm:py-4 sm:text-lg sm:rounded-2xl",
      lg: "px-6 py-4 text-lg sm:px-8 sm:py-5 sm:text-xl sm:rounded-2xl"
    };

    const widthClasses = fullWidth ? "w-full" : "w-auto";

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };