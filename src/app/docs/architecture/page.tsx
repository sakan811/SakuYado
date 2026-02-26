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
import Image from "next/image";

export const metadata: Metadata = {
    title: "SakuYado Docs — Architecture",
    description:
        "Deep dive into SakuYado's component-based architecture, App Router, and state management.",
};

const uiComponents = [
    {
        name: "Button",
        purpose: "Interactive actions with variants (primary, secondary, danger)",
    },
    {
        name: "Input",
        purpose: "Form fields with labels, icons, and error handling",
    },
    {
        name: "Select",
        purpose: "Dropdown selection with accessibility support",
    },
    {
        name: "Card",
        purpose: "Content containers with gradient/highlight variants",
    },
    {
        name: "ErrorMessage",
        purpose: "Consistent error message display",
    },
    {
        name: "LoadingSpinner",
        purpose: "Loading indicators with custom messages",
    },
];

const pages = [
    {
        path: "page.tsx",
        route: "/",
        desc: "Landing page with hero section and navigation CTAs",
    },
    {
        path: "hotels/add/page.tsx",
        route: "/hotels/add",
        desc: "Hotel entry form with rich validation",
    },
    {
        path: "hotels/compare/page.tsx",
        route: "/hotels/compare",
        desc: "Hotel comparison table and value ranking",
    },
];

export default function ArchitecturePage() {
    return (
        <div>
            {/* Page header */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    <span>🏗️</span>
                    <span>Technical Reference</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Architecture Documentation
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                    SakuYado follows a component-based architecture with centralized state
                    management, built on Next.js 15 App Router with full TypeScript
                    support.
                </p>
            </div>

            {/* Overview diagram */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-pink-100">
                    Source Architecture
                </h2>
                <div className="rounded-2xl overflow-hidden border border-pink-100 shadow-sm bg-white p-4">
                    <Image
                        src="/docs/src-architecture.png"
                        alt="Source architecture diagram showing the full project structure"
                        width={900}
                        height={500}
                        className="w-full h-auto rounded-xl"
                    />
                </div>
            </section>

            {/* Tech stack */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-pink-100">
                    Tech Stack
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        {
                            icon: "⚡",
                            name: "Next.js 15",
                            detail: "App Router with Turbopack",
                            color: "bg-pink-50 border-pink-200",
                        },
                        {
                            icon: "⚛️",
                            name: "React 19.2.0",
                            detail: "With TypeScript",
                            color: "bg-pink-50 border-pink-200",
                        },
                        {
                            icon: "🎨",
                            name: "Tailwind CSS v4.1",
                            detail: "Utility-first styling",
                            color: "bg-rose-50 border-rose-200",
                        },
                        {
                            icon: "🗂️",
                            name: "Context + useReducer",
                            detail: "Centralized state management",
                            color: "bg-rose-50 border-rose-200",
                        },
                        {
                            icon: "🧪",
                            name: "Vitest",
                            detail: "Unit tests with V8 coverage",
                            color: "bg-pink-50 border-pink-200",
                        },
                        {
                            icon: "🌲",
                            name: "Cypress",
                            detail: "End-to-end testing",
                            color: "bg-pink-50 border-pink-200",
                        },
                    ].map((tech) => (
                        <div
                            key={tech.name}
                            className={`flex items-center gap-3 p-4 rounded-xl border ${tech.color}`}
                        >
                            <span className="text-xl">{tech.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {tech.name}
                                </p>
                                <p className="text-xs text-gray-500">{tech.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Architecture Pattern */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-pink-100">
                    Core Architecture Pattern
                </h2>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-6 mb-6">
                    <p className="text-sm font-bold text-pink-700 mb-3">
                        Component-Based Architecture with Context API
                    </p>
                    <ol className="space-y-2 list-decimal list-inside">
                        {[
                            "Modular Components — Reusable UI components with clear responsibilities",
                            "Centralized State — HotelContext manages all hotel-related state",
                            "Separation of Concerns — UI, business logic, and data management are distinct",
                            "Type-Safe Development — Full TypeScript integration throughout",
                        ].map((item) => (
                            <li key={item} className="text-sm text-gray-700">
                                {item}
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                    {[
                        {
                            title: "Context API over Redux",
                            desc: "Simpler, built-in solution with predictable state updates",
                            icon: "🔄",
                        },
                        {
                            title: "LocalStorage Persistence",
                            desc: "Hotel data persists automatically across browser sessions",
                            icon: "💾",
                        },
                        {
                            title: "Mobile-First Design",
                            desc: "Optimized for 375px mobile with desktop support at 1280px+",
                            icon: "📱",
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm"
                        >
                            <span className="text-2xl mb-2 block">{card.icon}</span>
                            <p className="font-semibold text-gray-800 text-sm mb-1">
                                {card.title}
                            </p>
                            <p className="text-xs text-gray-500">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* App Router Architecture */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-pink-100">
                    App Router Architecture
                </h2>
                <div className="rounded-2xl overflow-hidden border border-pink-100 shadow-sm bg-white p-4 mb-6">
                    <Image
                        src="/docs/app-architecture.png"
                        alt="App Router architecture diagram"
                        width={900}
                        height={500}
                        className="w-full h-auto rounded-xl"
                    />
                </div>

                {/* Pages table */}
                <h3 className="font-bold text-gray-800 text-base mb-3">
                    Application Pages
                </h3>
                <div className="border border-pink-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-pink-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                                    File
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50 bg-white">
                            {pages.map((page) => (
                                <tr key={page.path} className="hover:bg-pink-50/40">
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono">
                                            {page.path}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-mono">
                                            {page.route}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">
                                        {page.desc}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Component Architecture */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-pink-100">
                    Component Architecture
                </h2>
                <div className="rounded-2xl overflow-hidden border border-pink-100 shadow-sm bg-white p-4 mb-6">
                    <Image
                        src="/docs/components.png"
                        alt="Component architecture diagram"
                        width={900}
                        height={500}
                        className="w-full h-auto rounded-xl"
                    />
                </div>

                <h3 className="font-bold text-gray-800 text-base mb-3">
                    UI Component Library
                </h3>
                <div className="border border-pink-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-pink-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                                    Component
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                                    Purpose
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50 bg-white">
                            {uiComponents.map((comp) => (
                                <tr key={comp.name} className="hover:bg-pink-50/40">
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-lg font-mono font-semibold">
                                            {comp.name}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">
                                        {comp.purpose}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Design patterns */}
                <h3 className="font-bold text-gray-800 text-base mt-6 mb-3">
                    Component Design Patterns
                </h3>
                <div className="space-y-3">
                    {[
                        {
                            label: "Stateless Components",
                            desc: "All UI components receive data via props; business logic handled by context",
                        },
                        {
                            label: "Composition over Inheritance",
                            desc: "Components built for reusability with flexible prop interfaces",
                        },
                        {
                            label: "Accessibility-First",
                            desc: "Semantic HTML, ARIA labels, keyboard navigation, screen reader support",
                        },
                    ].map((pattern) => (
                        <div
                            key={pattern.label}
                            className="flex gap-3 bg-white border border-pink-100 rounded-xl p-4"
                        >
                            <span className="text-pink-400 mt-0.5">●</span>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {pattern.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{pattern.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
