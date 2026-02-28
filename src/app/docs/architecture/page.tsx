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
import { Mermaid } from "@/components";
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Separator,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "SakuYado Docs — Architecture",
  description:
    "Deep dive into SakuYado's component-based architecture, App Router, and state management.",
};

const uiComponents = [
  {
    name: "Button",
    purpose:
      "Interactive actions with variants (default, secondary, destructive)",
  },
  {
    name: "Input",
    purpose: "Basic text input field with styling and validation states",
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
    name: "Alert",
    purpose: "Alert messages to show feedback and warnings",
  },
  {
    name: "Field",
    purpose: "Form field wrapper with label and error messages",
  },
  {
    name: "Label",
    purpose: "Accessible label element for form controls",
  },
  {
    name: "Separator",
    purpose: "Visual divide between content sections",
  },
  {
    name: "Table",
    purpose: "Data tables for displaying structured information",
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
  {
    path: "docs/page.tsx",
    route: "/docs",
    desc: "Documentation overview and quick links",
  },
  {
    path: "docs/architecture/page.tsx",
    route: "/docs/architecture",
    desc: "Technical documentation covering architecture and components",
  },
  {
    path: "docs/features/page.tsx",
    route: "/docs/features",
    desc: "User guide detailing available features and usage",
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
          management, built on Next.js 16 App Router with full TypeScript
          support.
        </p>
      </div>

      {/* Overview diagram */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Source Architecture
        </h2>
        <Separator className="mb-4 bg-pink-100" />
        <Card className="rounded-2xl overflow-hidden border-pink-100 shadow-sm bg-white p-4">
          <Mermaid
            chart={`flowchart TD
    Root([SakuYado React App]) --> Src[src/ Directory]
    Src --> App[app/ : Next.js App Router]
    Src --> Components[components/ : UI Elements]
    Src --> Constants[constants/ : Static Data]
    Src --> Contexts[contexts/ : Global State]
    Src --> Lib[lib/ : External Utils]
    Src --> Types[types/ : TypeScript Defs]
    Src --> Utils[utils/ : Functions]

    App --> Pages(Pages & Metadata)
    Components --> RootComp(Mermaid Diagram Component)
    Components --> UI(ui/ : Base generic elements)
    Constants --> Currency(Currencies List)
    Contexts --> HotelContext(HotelContext & useReducer)
    Types --> HotelType(Hotel Interface)
    Utils --> Calcs(Scoring, validation & formatting)`}
          />
        </Card>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tech Stack</h2>
        <Separator className="mb-6 bg-pink-100" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              icon: "⚡",
              name: "Next.js 16.1.6",
              detail: "App Router with Turbopack",
              color: "bg-pink-50 border-pink-200",
            },
            {
              icon: "⚛️",
              name: "React 19.2.4",
              detail: "With TypeScript",
              color: "bg-pink-50 border-pink-200",
            },
            {
              icon: "🎨",
              name: "Tailwind CSS v4.2.1",
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
            <Card
              key={tech.name}
              className={`flex flex-row items-center gap-3 p-4 rounded-xl border ${tech.color} shadow-none`}
            >
              <span className="text-xl">{tech.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {tech.name}
                </p>
                <p className="text-xs text-gray-500">{tech.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Architecture Pattern */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Core Architecture Pattern
        </h2>
        <Separator className="mb-4 bg-pink-100" />
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 rounded-2xl p-6 mb-6">
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
        </Card>

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
            <Card
              key={card.title}
              className="bg-white border-pink-100 rounded-xl p-4 shadow-sm"
            >
              <span className="text-2xl mb-2 block">{card.icon}</span>
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {card.title}
              </p>
              <p className="text-xs text-gray-500">{card.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* App Router Architecture */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          App Router Architecture
        </h2>
        <Separator className="mb-4 bg-pink-100" />
        <Card className="rounded-2xl overflow-hidden border-pink-100 shadow-sm bg-white p-4 mb-6">
          <Mermaid
            chart={`flowchart TD
    Root([Root Route: /]) --> Layout[Global Root Layout]
    Layout --> PageHome(Landing Page: /)
    Layout --> PageCompare(Compare Hotels: /hotels/compare)
    Layout --> PageAdd(Add Hotel Form: /hotels/add)
    Layout --> GroupDocs(Documentation Pages)
    
    GroupDocs --> DocsLayout[Docs Navigation Layout]
    DocsLayout --> DocsHome(Docs Overview: /docs)
    DocsLayout --> DocsArch(Architecture: /docs/architecture)
    DocsLayout --> DocsFeat(Features: /docs/features)`}
          />
        </Card>

        {/* Pages table */}
        <h3 className="font-bold text-gray-800 text-base mb-3">
          Application Pages
        </h3>
        <Card className="border-pink-100 rounded-xl overflow-hidden shadow-none">
          <Table>
            <TableHeader className="bg-pink-50">
              <TableRow>
                <TableHead className="px-4 text-pink-700">File</TableHead>
                <TableHead className="px-4 text-pink-700">Route</TableHead>
                <TableHead className="px-4 text-pink-700">
                  Description
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.path} className="hover:bg-pink-50/40">
                  <TableCell className="px-4 py-3">
                    <code className="text-xs bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono">
                      {page.path}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <code className="text-xs bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-mono">
                      {page.route}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-xs">
                    {page.desc}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Component Architecture */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Component Architecture
        </h2>
        <Separator className="mb-4 bg-pink-100" />
        <Card className="rounded-2xl overflow-hidden border-pink-100 shadow-sm bg-white p-4 mb-6">
          <Mermaid
            chart={`flowchart TD
    App(Next.js App) --> ContextProvider{Hotel Context Provider}
    ContextProvider --> AppRoutes(Application Routes)
    AppRoutes --> AddForm[Add Hotel Form view]
    AppRoutes --> CompareTable[Data Table Comparison view]
    AppRoutes --> Layouts[Shared App Layouts]
    
    AddForm --> UIElements(Shared UI Components)
    CompareTable --> UIElements
    Layouts --> UIElements
    
    UIElements --> Forms[Input / Select / Label / Field]
    UIElements --> Display[Card / Table / Alert / Separator]
    UIElements --> Action[Button]
    
    AddForm -- "Triggers dispatch cases" --> ContextProvider
    CompareTable -- "Reads context state" --> ContextProvider`}
          />
        </Card>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          UI Component Library
        </h3>
        <Card className="border-pink-100 rounded-xl overflow-hidden shadow-none">
          <Table>
            <TableHeader className="bg-pink-50">
              <TableRow>
                <TableHead className="px-4 text-pink-700">Component</TableHead>
                <TableHead className="px-4 text-pink-700">Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uiComponents.map((comp) => (
                <TableRow key={comp.name} className="hover:bg-pink-50/40">
                  <TableCell className="px-4 py-3">
                    <code className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-lg font-mono font-semibold">
                      {comp.name}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-xs">
                    {comp.purpose}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Design patterns */}
        <h3 className="font-bold text-gray-800 text-base mt-6 mb-3">
          Component Design Patterns
        </h3>
        <div className="grid gap-3">
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
            <Card
              key={pattern.label}
              className="flex flex-row gap-3 bg-white border-pink-100 rounded-xl p-4 shadow-none"
            >
              <span className="text-pink-400 mt-0.5">●</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {pattern.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{pattern.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
