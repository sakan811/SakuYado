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
import Link from "next/link";
import { Separator } from "@/components/ui";

export const metadata: Metadata = {
  title: "SakuYado Docs",
  description:
    "Documentation for SakuYado — learn about features, architecture, and component design.",
};

const navItems = [
  {
    label: "Overview",
    href: "/docs",
    icon: "🌸",
  },
  {
    label: "Features",
    href: "/docs/features",
    icon: "✨",
  },
  {
    label: "Architecture",
    href: "/docs/architecture",
    icon: "🏗️",
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-0">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 lg:min-h-screen bg-white/70 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-pink-200 flex-shrink-0">
        <div className="sticky top-0 p-6">
          {/* Docs header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📚</span>
              <span className="font-bold text-pink-700 text-lg">Docs</span>
            </div>
            <p className="text-xs text-pink-400 font-medium tracking-wider uppercase">
              SakuYado Documentation
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Documentation navigation">
            <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-3 px-2">
              Contents
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-700 hover:bg-pink-100 hover:text-pink-800 transition-all duration-200 group"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <Separator className="my-6 bg-pink-100" />

          {/* Back to app */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-6 py-10 lg:px-12 lg:py-14">
          {/* Prose wrapper — scoped styling for MDX content */}
          <article className="prose-docs">{children}</article>
        </div>
      </main>
    </div>
  );
}
