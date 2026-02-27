# SakuYado 🌸

<p align="center">
  <img src="public/SakuYado250x250.png" />
</p>

A beautiful web application that helps you find the best value accommodations by calculating a **Review/Price Score** for each hotel you input.

## What it does

- Add hotel information (name, price, rating)
- Automatically calculates value scores using three strategies (Balanced, Strict Budget, Quality First)
- Ranks hotels by best value
- Compare multiple hotels side-by-side

Higher scores = better value for money! 🌸

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