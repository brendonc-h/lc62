# La Casita Mexican Restaurant Website

A modern, full-featured website for La Casita Mexican Restaurant in Berthoud, Colorado.

## Features

- Responsive design optimized for all devices
- Online ordering system with Stripe integration
- Interactive menu with categories and item details
- Contact form and location information
- Admin-friendly content management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Stripe Payments
- Headless UI Components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Stripe keys:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
   STRIPE_SECRET_KEY=your_secret_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the site

## Updating Content

Menu items and pricing can be updated in the `src/data/menu.ts` file.
