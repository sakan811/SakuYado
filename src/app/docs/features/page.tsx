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

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SakuYado Docs — Features",
    description:
        "Learn about SakuYado's core features: hotel value scoring, multi-currency support, and comparison tools.",
};

export default function FeaturesPage() {
    return (
        <div>
            {/* Page header */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    <span>✨</span>
                    <span>User Guide</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    SakuYado Features 🌸
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                    Everything you can do with SakuYado — from adding hotels to comparing
                    value scores across currencies.
                </p>
            </div>

            {/* Core Functionality */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-pink-100">
                    Core Functionality
                </h2>

                <div className="space-y-6">
                    {/* Hotel Value Calculation */}
                    <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                            <span className="text-xl">🏆</span> Hotel Value Calculation
                        </h3>
                        <ul className="space-y-3">
                            {[
                                {
                                    label: "Review/Price Score",
                                    desc: "Automatically calculates value scores using the formula",
                                    code: "Rating ÷ Price",
                                },
                                {
                                    label: "Multi-Currency Support",
                                    desc: "Handle different currencies with automatic conversion",
                                    code: null,
                                },
                                {
                                    label: "Smart Ranking",
                                    desc: "Hotels are automatically sorted by value score (highest first)",
                                    code: null,
                                },
                                {
                                    label: "Real-time Updates",
                                    desc: "Scores update instantly as you modify hotel data",
                                    code: null,
                                },
                            ].map((item) => (
                                <li key={item.label} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-800 font-semibold">
                                            {item.label}:{" "}
                                        </strong>
                                        {item.desc}
                                        {item.code && (
                                            <code className="ml-1 bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded text-xs font-mono">
                                                {item.code}
                                            </code>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hotel Management */}
                    <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                            <span className="text-xl">🏨</span> Hotel Management
                        </h3>
                        <ul className="space-y-3">
                            {[
                                {
                                    label: "Add Hotels",
                                    desc: "Simple form to input hotel details including name, price, rating, and currency",
                                },
                                {
                                    label: "Data Persistence",
                                    desc: "Hotel data is automatically saved to localStorage",
                                },
                                {
                                    label: "Data Validation",
                                    desc: "Ensures all hotel entries meet quality standards",
                                },
                                {
                                    label: "Bulk Management",
                                    desc: "Add and compare multiple hotels simultaneously",
                                },
                            ].map((item) => (
                                <li key={item.label} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-800 font-semibold">
                                            {item.label}:{" "}
                                        </strong>
                                        {item.desc}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Comparison Features */}
                    <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                            <span className="text-xl">📊</span> Comparison Features
                        </h3>
                        <ul className="space-y-3">
                            {[
                                {
                                    label: "Side-by-Side Comparison",
                                    desc: "View multiple hotels together for easy comparison",
                                },
                                {
                                    label: "Visual Ranking",
                                    desc: "Clear visual hierarchy showing best value options",
                                },
                                {
                                    label: "Detailed Statistics",
                                    desc: "Comprehensive stats about your hotel selections",
                                },
                                {
                                    label: "Component Testing",
                                    desc: "All UI components thoroughly tested with comprehensive test coverage",
                                },
                            ].map((item) => (
                                <li key={item.label} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-800 font-semibold">
                                            {item.label}:{" "}
                                        </strong>
                                        {item.desc}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* User Experience */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-pink-100">
                    User Experience
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        {
                            icon: "📱",
                            title: "Responsive Design",
                            items: [
                                "Mobile-First at 375px breakpoint",
                                "Full desktop experience at 1280px+",
                                "Touch-friendly interactive elements",
                                "WCAG-compliant with ARIA & keyboard nav",
                            ],
                        },
                        {
                            icon: "🎨",
                            title: "Interface Elements",
                            items: [
                                "Minimalist sakura (cherry blossom) theme",
                                "User-friendly input validation & error handling",
                                "Clear feedback during data operations",
                                "Graceful error boundaries",
                            ],
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="bg-white border border-pink-100 rounded-2xl p-5 shadow-sm"
                        >
                            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                <span className="text-lg">{card.icon}</span> {card.title}
                            </h3>
                            <ul className="space-y-2">
                                {card.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 text-pink-400 text-xs">✓</span>
                                        <span className="text-xs text-gray-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
