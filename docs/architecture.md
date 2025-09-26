# App Architecture Overview

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

### State Management

- **HotelContext**: Central state using React Context + useReducer
- **localStorage** persistence for hotel data
- **Currency** preferences stored locally

### Data Flow

1. Hotel data → localStorage → Context initialization
2. Value score calculation: `Rating ÷ Price`
3. Automatic sorting by value score
4. Real-time updates across components

### Key Components

- **Hotel Management**: Add, compare, and rank hotels
- **Multi-currency Support**: Automatic currency conversion
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Structured data and meta tags
