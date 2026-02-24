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

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components";

export default function ResponsiveHomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="max-w-lg mx-auto px-4">
        <Card className="relative bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 text-white rounded-2xl overflow-hidden shadow-xl border-0">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-rose-500/90 z-0"></div>
          <div className="absolute top-2 right-2 text-3xl opacity-20">🌸</div>
          <div className="absolute bottom-2 left-2 text-xl opacity-15">🌸</div>

          <CardHeader className="relative z-10 text-center pt-6 pb-4">
            <div className="mb-2">
              <span className="text-2xl sm:text-3xl md:text-4xl">🌸</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-1 leading-tight">
              Find the Best Value Hotels
              <span className="block text-pink-100 mt-0.5">with SakuYado</span>
            </CardTitle>
            <CardDescription className="text-sm text-pink-50 leading-relaxed">
              Compare hotels based on review-per-price ratio to get the most
              value for your money
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full sm:flex-1 bg-white text-pink-600 hover:bg-pink-50 border-2 border-pink-200"
          >
            <Link href="/hotels/add" data-testid="add-hotel-link">
              🌸 Add a Hotel
            </Link>
          </Button>
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:flex-1 bg-pink-600 text-white hover:bg-pink-700"
          >
            <Link href="/hotels/compare">Compare Hotels</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="text-center space-x-3 sm:space-x-6 opacity-60">
        <span className="text-2xl sm:text-3xl animate-pulse">🌸</span>
        <span className="text-3xl sm:text-4xl animate-pulse delay-1000">
          🌸
        </span>
        <span className="text-2xl sm:text-3xl animate-pulse delay-2000">
          🌸
        </span>
      </div>

      {/* License Footer */}
      <footer className="text-center text-xs sm:text-sm text-pink-400/70 py-4 px-4">
        © 2025-2026 SakuYado •{" "}
        <Link
          href="https://www.gnu.org/licenses/agpl-3.0.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-300 underline underline-offset-2"
        >
          AGPL-3.0
        </Link>
      </footer>
    </div>
  );
}
