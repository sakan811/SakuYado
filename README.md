# SakuYado 🌸

<p align="center">
  <img src="public/SakuYado250x250.png" />
</p>

A beautiful web application that helps you find the best value accommodations by calculating a **Review/Price Score** for each hotel you input.

## Features

- **Hotel Value Scoring**: Automatically calculates value scores using three strategies (Balanced, Strict Budget, Quality First).
- **Side-by-side Comparison**: Compare multiple hotels and rank them by their value.
- **Currencies**: Supports entry of 50+ fiat currencies to record prices accurately.
- **Persistent Storage**: Uses your browser's `localStorage` so you don't lose your hotel lists when you leave.
- **Mobile-first Design**: Highly responsive design scaling beautifully from 375px up to desktop resolutions.

## Status

[![Cypress E2E Tests](https://github.com/sakan811/SakuYado/actions/workflows/cypress.yml/badge.svg)](https://github.com/sakan811/SakuYado/actions/workflows/cypress.yml)

[![Web App Test](https://github.com/sakan811/SakuYado/actions/workflows/web-app-test.yml/badge.svg)](https://github.com/sakan811/SakuYado/actions/workflows/web-app-test.yml)

## How to Use

### 🌐 Vercel (Recommended)

Simply visit: **<https://sakuyado.fukudev.org/>**

### 💻 Local Development

1. Setup [pnpm](https://pnpm.io/installation)

2. Clone the repository:

   ```bash
   git clone https://github.com/sakan811/SakuYado.git
   cd SakuYado
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Run the development server:

   ```bash
   pnpm run dev
   ```

5. Open <http://localhost:3000>
