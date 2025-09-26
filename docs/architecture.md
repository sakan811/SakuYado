# Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Core Architecture](#core-architecture)
4. [State Management](#state-management)
5. [Data Flow](#data-flow)
6. [Key Components](#key-components)

## Overview

![Source Architecture Diagram](./mermaid/src-architecture.png)

The SakuYado application is built with a modern tech stack focused on performance, scalability, and maintainability. The architecture follows a modular approach with clear separation of concerns.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── hotels/
│   │   ├── add/           # Hotel entry form
│   │   └── compare/       # Hotel comparison view
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── constants/             # App constants (currencies, etc.)
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Core Architecture

### Frontend Framework

- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling

## State Management

- **HotelContext**: Central state using React Context + useReducer
- **localStorage** persistence for hotel data
- **Currency** preferences stored locally

## Data Flow

1. Hotel data → localStorage → Context initialization
2. Value score calculation: `Rating ÷ Price`
3. Automatic sorting by value score
4. Real-time updates across components

## Key Components

- **Hotel Management**: Add, compare, and rank hotels
- **Multi-currency Support**: Automatic currency conversion
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Structured data and meta tags

## Component Architecture

### UI Component Library

The application features a reusable component library in `src/components/ui/` with the following elements:

**Core Components:**

- **Button**: Interactive buttons with multiple variants (primary, secondary, danger) and sizes
- **Input**: Form input fields with labels, icons, and error state handling
- **Select**: Dropdown selection components with option arrays
- **Card**: Content containers with gradient and highlight variants
- **ErrorMessage**: Error message display with consistent styling
- **LoadingSpinner**: Loading indicators with customizable messages

### Component Relationships

![Component Architecture Diagram](./mermaid/components.png)

**Page-Component Integration:**

- **Home Page**: Uses Button and Link for navigation to feature pages
- **Add Hotel Page**: Comprehensive form using Input, Select, Card, and ErrorMessage components
- **Compare Page**: Data display using Card, LoadingSpinner, and Button components

**State Management Integration:**

- All components are stateless and receive data via props
- HotelContext provides centralized state management across pages
- Components handle user interactions and call context actions

**Utility Integration:**

- Form validation utilities work with Input and Select components
- Formatting utilities ensure consistent data display
- Calculation utilities power value score computations

### Component Design Patterns

**Responsive Design:**

- All components follow mobile-first approach
- Consistent spacing and sizing using Tailwind classes
- Responsive breakpoints for mobile, tablet, and desktop layouts

**Accessibility:**

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly form elements

**Styling Consistency:**

- Pink/rose color scheme throughout
- CSS variables for consistent spacing
- Hover states and transitions
- Gradient backgrounds for visual hierarchy

---

*Future sections will be added as the application grows in complexity.*
