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

interface CardProps {
  variant?: "default" | "gradient" | "highlight";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = "default",
  size = "md",
  className = "",
  children,
}) => {
  const baseClasses =
    "rounded-xl shadow-lg border-2 transition-all duration-300 sm:rounded-2xl";

  const variantClasses = {
    default: "bg-white border-pink-200 hover:border-pink-300",
    gradient:
      "bg-gradient-to-br from-white via-pink-50 to-rose-50 border-pink-200",
    highlight: "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-400",
  };

  const sizeClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6 md:p-8",
    lg: "p-6 sm:p-8 md:p-12",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return <div className={combinedClasses}>{children}</div>;
};

export { Card };
