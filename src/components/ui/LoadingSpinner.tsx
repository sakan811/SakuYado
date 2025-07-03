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

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  const baseClasses = "flex flex-col justify-center items-center h-64 space-y-4";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      <div className="text-4xl sm:text-6xl animate-pulse">🌸</div>
      <div className="text-lg sm:text-xl text-pink-600 font-medium">
        {message}
      </div>
    </div>
  );
};

export { LoadingSpinner };