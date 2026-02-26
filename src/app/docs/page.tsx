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
import type { Metadata } from "next";
import { Card, Separator } from "@/components/ui";

export const metadata: Metadata = {
  title: "SakuYado Docs — Overview",
  description: "Welcome to the SakuYado documentation.",
};

const sections = [
  {
    icon: "✨",
    title: "Features",
    href: "/docs/features",
    description:
      "Explore all features: value scoring, hotel management, comparison tools, and responsive design.",
    badge: "User Guide",
    badgeColor: "bg-pink-100 text-pink-700",
  },
  {
    icon: "🏗️",
    title: "Architecture",
    href: "/docs/architecture",
    description:
      "Deep dive into SakuYado's component-based architecture, App Router setup, state management with Context API, and UI component library.",
    badge: "Technical",
    badgeColor: "bg-rose-100 text-rose-700",
  },
];

export default function DocsIndexPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <span>🌸</span>
          <span>SakuYado Documentation</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
            SakuYado Docs
          </span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          SakuYado is a hotel value comparison app that scores hotels by{" "}
          <code className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono text-sm">
            Rating ÷ Price
          </code>{" "}
          — helping you stretch your travel budget further. These docs cover
          everything from user-facing features to internal architecture.
        </p>
      </div>

      {/* Quick-start formula card */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 rounded-2xl p-6 mb-12 shadow-sm">
        <p className="text-sm font-semibold text-pink-600 uppercase tracking-widest mb-3">
          The Core Formula
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-2xl font-bold text-gray-800">
            Value Score =
          </span>
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-white border border-pink-300 text-pink-700 px-4 py-1.5 rounded-xl shadow-sm">
              Rating
            </span>
            <span className="text-gray-500">÷</span>
            <span className="bg-white border border-rose-300 text-rose-700 px-4 py-1.5 rounded-xl shadow-sm">
              Price
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Higher score = better value. Hotels are automatically ranked by this
          score.
        </p>
      </Card>

      {/* Section cards */}
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Browse Documentation
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block h-full"
          >
            <Card className="bg-white border-pink-100 group-hover:border-pink-300 rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5 h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {section.icon}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${section.badgeColor}`}
                >
                  {section.badge}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-pink-700 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {section.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-pink-500 text-sm font-medium">
                Read more
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tech stack pills */}
      <div className="mt-12 pt-8">
        <Separator className="mb-8 bg-pink-100" />
        <p className="text-sm font-semibold text-gray-500 mb-4">Built with</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS v4",
            "Vitest",
            "Cypress",
          ].map((tech) => (
            <span
              key={tech}
              className="bg-white border border-pink-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
