# Chandaamama - E-Grocer Web Storefront

A modern, high-performance, full-featured multi-vendor e-commerce grocery storefront built with **Next.js 14**, **React 18**, **Tailwind CSS**, and **Redux Toolkit**. Designed to provide a lightning-fast shopping experience and seamlessly connect with the eGrocer Customer REST API backend.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites](#prerequisites)
- [Getting Started & How to Run](#getting-started--how-to-run)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Run the Development Server](#3-run-the-development-server)
  - [4. Build for Production](#4-build-for-production)
  - [5. Run Production Build](#5-run-production-build)
- [Environment Variables Reference](#environment-variables-reference)
- [Available Scripts](#available-scripts)
- [Deployment Modes](#deployment-modes)
  - [Mode A: Static Export (Apache / cPanel)](#mode-a-static-export-apache--cpanel)
  - [Mode B: Standalone Node.js Server (Nginx / PM2)](#mode-b-standalone-nodejs-server-nginx--pm2)
- [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Overview

**Chandaamama Storefront** (`egrocer-nextjs`) is the customer-facing web application for an e-grocery and multi-vendor delivery platform. It delivers a fast, responsive user interface across desktop, tablet, and mobile devices with comprehensive grocery shopping capabilities including geolocation delivery detection, dynamic filtering, real-time cart synchronization, multiple payment gateways, and Firebase push notifications.

---

## Key Features

### 🛒 Storefront & Shopping Experience
- **Interactive Homepage**: Dynamic hero banners/sliders, promotional popups, featured category grids, flash sales, and customizable section layouts.
- **Multi-Vendor & Multi-Filter Browsing**: Shop by Category, Brand, Seller/Vendor, or Country of origin.
- **Advanced Product Catalog**: Instant search, category hierarchy, multi-attribute variant selection (weights, sizes, packs), price range slider, and rating filters.
- **Rich Product Details**: High-resolution image zoom (`react-inner-image-zoom`, `react-image-magnify`), full-screen lightbox gallery (`yet-another-react-lightbox`, `react-photoswipe-gallery`), stock availability indicators, customer reviews, and related products.
- **Cart Management**: Guest cart support (local storage) with automatic sync upon login, quantity adjustments, and single-seller order constraints (configurable).
- **Checkout & Fulfillment**: Delivery address selector, new address creation with Google Places autocomplete, delivery time-slot scheduling, and promotional coupon code validation.

### 💳 Payments & Wallets
- **Multiple Payment Gateways**: Built-in support for:
  - Razorpay
  - Stripe
  - Paystack
  - PhonePe
  - Cash on Delivery (COD)
  - Digital Wallet Balance
- **Order Tracking & Invoicing**: Order history, status timeline, live delivery tracking, and PDF invoice downloads.

### 👤 Customer Account Dashboard
- **Profile Management**: Update profile details, avatar, and notification preferences.
- **Saved Addresses**: Manage multiple delivery addresses (Home, Office, Other) with exact map coordinates.
- **Wishlist & Favorites**: Save items for future purchases with one-click add to cart.
- **Wallet & Transactions**: Top-up logs, order debits, refund credits, and detailed transaction histories.
- **Subscription Plans**: View and subscribe to delivery or membership subscription packages.
- **Refer & Earn**: Referral code sharing via social channels (`react-share`).

### 🌐 Localization, Themes & Notifications
- **Multi-Language Support**: Real-time language switching (English, Urdu, and dynamically loaded languages) with localized routing and automated API header injection (`Content-Language`).
- **Dark / Light Mode**: Seamless theme switching using `next-themes` and CSS variables.
- **Push Notifications**: Firebase Cloud Messaging (FCM) web push notification support for order updates and promotional messages, complete with a service worker (`firebase-messaging-sw.js`).
- **Configurable SEO**: Dynamic OpenGraph tags, Twitter cards, JSON-LD structured data schema markup, and automatic `sitemap.xml` generation on build.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (Pages Router) |
| **UI Library** | [React 18](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/), CSS Variables |
| **Component Primitives** | [Radix UI](https://www.radix-ui.com/) (Dialog, Popover, Select, Slider, Dropdown, Toggle) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Persist](https://github.com/rt2zz/redux-persist) |
| **Server State & Caching** | [TanStack React Query v5](https://tanstack.com/query/v5) |
| **HTTP Client** | [Axios](https://axios-http.com/) (with JWT auth & language interceptors) |
| **Carousel & Sliders** | [Swiper 11](https://swiperjs.com/), [Embla Carousel](https://www.embla-carousel.com/) |
| **Icons** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Push Notifications** | [Firebase 11](https://firebase.google.com/) (FCM & Web Auth) |
| **Maps & Places** | [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api) |
| **Process Manager** | [PM2](https://pm2.keymetrics.io/) (via `ecosystem.config.cjs`) |

---

## Project Directory Structure

```text
chandamama.com/
├── public/                     # Static public assets (images, icons, generated sitemaps)
│   ├── firebase-messaging-sw.js# Firebase service worker (generated during build)
│   └── sitemap.xml             # XML sitemap (generated during build)
├── scripts/
│   ├── copy-assets.js          # Copies public & static assets to standalone output
│   └── generator.js            # Generates sitemap.xml & firebase-messaging-sw.js
├── src/
│   ├── api/                    # API endpoints, route handlers, and Axios interceptors
│   │   ├── apiEndpoints.js     # Master list of API URL paths
│   │   ├── apiRoutes.js        # API service call functions
│   │   └── axiosMiddleware.js  # Axios instance with auth token & language headers
│   ├── checkauth/              # HOC for route protection & authorization checks
│   ├── components/             # Reusable UI & feature components
│   │   ├── cart/               # Cart drawer & cart items
│   │   ├── checkoutpage/       # Checkout flow & payment modal
│   │   ├── homepage/           # Homepage sections, sliders, offer banners
│   │   ├── layout/             # Header, Navigation bar, Footer, Layout wrapper
│   │   ├── productdetail/      # Product view, image zoom, reviews
│   │   ├── productslist/       # Product grids, cards, filter bars
│   │   └── profiledashboard/   # User orders, wallet, address manager
│   ├── lib/                    # Shared utilities (classnames, etc.)
│   ├── pages/                  # Next.js Pages Router routes
│   │   ├── _app.js             # Root app wrapper (Redux, QueryClient, ThemeProvider)
│   │   ├── _document.js        # HTML Document template
│   │   ├── index.js            # Homepage route
│   │   ├── products/           # Product catalog routes
│   │   ├── product/[slug].js   # Dynamic product detail page
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── profile/            # User account & orders pages
│   │   └── blogs/              # Blog pages
│   ├── redux/                  # Redux Toolkit store, reducers, and slices
│   │   ├── slices/             # Cart, User, City, Theme, Shop, Language slices
│   │   ├── rootReducer.js      # Combined root reducer
│   │   └── store.js            # Redux store configuration with redux-persist
│   ├── styles/                 # Global styles and Tailwind directives
│   └── utils/                  # Helper functions, translations, Firebase init
├── .env.example                # Sample environment configuration template
├── ecosystem.config.cjs        # PM2 deployment configuration
├── next.config.mjs             # Next.js configuration (images, output mode, exportPathMap)
├── package.json                # Project dependencies and scripts
├── server.js                   # Custom Node.js HTTP server (for .well-known endpoints)
└── tailwind.config.js          # Tailwind CSS theme and animation configuration
```

---

## Prerequisites

Before running the application, ensure you have the following installed on your system:

- **Node.js**: `v18.17.0` or `v20.x LTS` (Node 20+ recommended)
- **Package Manager**: `npm` (v9 or v10)
- **Backend API**: An accessible instance of the eGrocer Customer REST API

---

## Getting Started & How to Run

### 1. Install Dependencies

In your terminal, navigate to the project directory and install the packages:

```bash
npm install
```

> **Note:** If you encounter dependency peer conflicts with older image zoom libraries, use:
> ```bash
> npm install --legacy-peer-deps
> ```

---

### 2. Configure Environment Variables

Create your local `.env` file by copying the provided `.env.example`:

**On Linux / macOS:**
```bash
cp .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

Open `.env` in your editor and update the required values.

> ⚠️ **CRITICAL REQUIREMENT:**
> `NEXT_PUBLIC_API_URL` **must** be set to a valid URL (e.g. `https://api.yourdomain.com`).
> `next.config.mjs` parses this URL with `new URL()` during startup. If this variable is missing or empty, `npm run dev` and `npm run build` will fail with an `Invalid URL` error.

Minimal required configuration for local development:
```dotenv
NEXT_PUBLIC_WEB_NAME=Chandaamama
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-backend-api-domain.com
NEXT_PUBLIC_API_SUBURL=/customer
NEXT_PUBLIC_SEO=false
NEXT_PUBLIC_COUNTRY_DROPDOWN=true
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=in
NEXT_PUBLIC_COUNTRY_DIAL_CODE=91
```

*(See the [Environment Variables Reference](#environment-variables-reference) table below for optional Firebase, Google Maps, and SEO keys.)*

---

### 3. Run the Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Once started, open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

This command executes:
1. `next build`: Compiles and optimizes the React application.
2. `postbuild`:
   - Runs `scripts/generator.js` to create `public/sitemap.xml` and inject Firebase credentials into `public/firebase-messaging-sw.js`.
   - Runs `scripts/copy-assets.js` to sync static assets into the standalone build output folder.

---

### 5. Run Production Build

Depending on your configured build output mode:

#### For Standalone Node Server (`NEXT_PUBLIC_SEO=true`):
```bash
npm run start
```
*Runs the standalone server on `http://0.0.0.0:8001`.*

#### For Static Export (`NEXT_PUBLIC_SEO=false`):
The static HTML, CSS, and JS assets are exported to the `out/` directory and can be served using any web server (e.g., Nginx, Apache, or `npx serve out`).

---

## Environment Variables Reference

| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_WEB_NAME` | Display name of the website | `Chandaamama` |
| `NEXT_PUBLIC_BASE_URL` | Canonical URL of the frontend storefront | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API (**Required**) | `https://api.example.com` |
| `NEXT_PUBLIC_API_SUBURL` | Sub-path for customer-facing endpoints | `/customer` |
| `NEXT_PUBLIC_MAP_API` | Google Maps API key (Places & Geocoding) | `AIzaSy...` |
| `NEXT_PUBLIC_COUNTRY_DROPDOWN`| Enable country code selector in phone input | `true` |
| `NEXT_PUBLIC_DEFAULT_COUNTRY_CODE`| Default country code (ISO 2-letter) | `in` |
| `NEXT_PUBLIC_COUNTRY_DIAL_CODE`| Default telephone country dial code | `91` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-firebase-project` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase Storage Bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| Firebase Cloud Messaging Sender ID | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:1234:web:abcd` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | `G-XXXXXXXX` |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Firebase Web Push VAPID Key | `B...` |
| `NEXT_PUBLIC_DEMO_MODE` | Enable demo mode quick login | `false` |
| `NEXT_PUBLIC_DEMO_LOGIN_NO` | Pre-filled demo mobile phone number | `9876543210` |
| `NEXT_PUBLIC_DEMO_OTP` | Pre-filled demo OTP code | `123456` |
| `NEXT_PUBLIC_SEO` | Build mode: `false` = static `out/`; `true` = standalone Node.js server | `false` |
| `NEXT_PUBLIC_META_TITLE` | Default page meta title for SEO | `Chandaamama Grocery` |
| `NEXT_PUBLIC_META_DESCRIPTION` | Default page meta description | `Best online grocery store` |
| `NEXT_PUBLIC_META_KEYWORDS` | Default page meta keywords | `grocery, fruits, vegetables` |

---

## Available Scripts

In the project root, you can run:

| Command | Action |
|---|---|
| `npm run dev` | Launches the Next.js development server on port `3000` with hot-reloading |
| `npm run build` | Builds the production bundle and runs `postbuild` asset generators |
| `npm run start` | Runs the standalone production Node.js server (`port 8001`) |
| `npm run lint` | Runs Next.js ESLint checks to identify formatting and code quality issues |

---

## Deployment Modes

The application supports two primary production deployment architectures based on the `NEXT_PUBLIC_SEO` variable:

### Mode A: Static Export (Apache / cPanel)
Recommended for standard shared hosting or static hosting buckets.
1. Set in `.env`:
   ```dotenv
   NEXT_PUBLIC_SEO=false
   ```
2. Build the site:
   ```bash
   npm ci
   npm run build
   ```
3. Upload the **contents** of the generated `out/` directory (including `.htaccess`) into your web server's document root (e.g. `public_html`).

### Mode B: Standalone Node.js Server (Nginx / PM2)
Recommended for VPS / dedicated servers where server-side rendering (SSR) and dynamic SEO metadata fetching are desired.
1. Set in `.env`:
   ```dotenv
   NEXT_PUBLIC_SEO=true
   ```
2. Build the site:
   ```bash
   npm ci
   npm run build
   ```
3. Start the server using PM2 with the included configuration:
   ```bash
   pm2 start ecosystem.config.cjs
   ```
4. Set up an Nginx reverse proxy pointing to `http://127.0.0.1:8001`.

*(For complete step-by-step production release instructions, refer to [DEPLOYMENT.md](file:///a:/koober/chandamama.com/DEPLOYMENT.md).)*

---

## Troubleshooting & Common Issues

1. **`TypeError: Invalid URL` on `npm run dev` or `npm run build`**:
   - Cause: `NEXT_PUBLIC_API_URL` is either missing or empty in your `.env` file.
   - Solution: Ensure `.env` exists and contains a valid URL:
     ```dotenv
     NEXT_PUBLIC_API_URL=https://api.yourdomain.com
     ```

2. **Images failing to load**:
   - Cause: Remote image hostnames returned by the API must match the allowed remote patterns in `next.config.mjs`.
   - Solution: Make sure `NEXT_PUBLIC_API_URL` matches the domain serving your media files (`/storage/**` or `/public/storage/**`).

3. **Firebase Push Notifications not registering**:
   - Cause: Missing Firebase credentials or testing on non-HTTPS origins (service workers require HTTPS except on `localhost`).
   - Solution: Fill in all `NEXT_PUBLIC_FIREBASE_*` variables in `.env` and rebuild so that `public/firebase-messaging-sw.js` is regenerated.
