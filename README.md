# Neurogine Product Catalog

A React Native and Expo product catalog for browsing, searching, and viewing product details using the DummyJSON REST API.

## Features

- Product catalog with paginated results
- Product search with a 500 ms debounce
- Pull-to-refresh for the catalog
- Product detail screen with image, price, rating, brand, category, and description
- Loading states for the catalog and product details
- Error states with retry actions
- Empty state for searches with no matching products

## Tech Stack

- React Native 0.86
- Expo SDK 57
- TypeScript with strict compiler settings
- Expo Router for file-based navigation
- DummyJSON REST API

## Architecture

The project is organized into a small set of responsibilities:

### Presentation and UI

Screens in `src/app/` handle screen state, user interaction, list rendering, and navigation. Reusable visual components are in `src/components/`, including `ProductCard`, `ThemedText`, and `ThemedView`.

### Service/API

`src/services/productService.ts` contains the API requests and returns the product data needed by the screens. It also converts non-successful HTTP responses into rejected requests.

### Data and Types

`src/types/product.ts` defines the `Product` data model used by the service and UI.

## API & Data Flow

The API base URL is `https://dummyjson.com`.

- The catalog calls `GET /products?limit=10&skip={skip}` when no search term is entered.
- A search calls `GET /products/search?q={query}&limit=10&skip={skip}`. The query is URL-encoded by the service.
- The catalog screen waits 500 ms after the last search input change before requesting results.
- When the list reaches the end, the screen increases `skip` by 10 and appends the next page to the existing products.
- Pull-to-refresh resets the list position and requests the first page again.
- The detail screen calls `GET /products/{id}` using the route parameter.

The service parses the JSON response and returns typed product data. Screens then store that data in local React state and render it through the catalog list or detail layout.

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx             Root Expo Router layout
│   ├── index.tsx               Catalog screen and catalog state
│   ├── explore.tsx             Explore route included in the app
│   └── product/[id].tsx        Product detail screen
├── components/
│   ├── ProductCard.tsx         Reusable catalog product card
│   ├── themed-text.tsx         Theme-aware text component
│   ├── themed-view.tsx         Theme-aware view component
│   └── ...                     Other shared UI components
├── constants/
│   └── theme.ts                Theme colors, fonts, and spacing values
├── hooks/
│   └── ...                     Color-scheme and theme hooks
├── services/
│   └── productService.ts       Product list and detail API requests
└── types/
	└── product.ts              Product data model
```

`app.json` contains the Expo application configuration, and `package.json` contains the development scripts and dependencies.

## Getting Started

Install Node.js and npm, then install the project dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

From the Expo CLI, the application can be opened in Expo Go by scanning the QR code on a compatible physical device.

## Testing

No automated test suite is included in the project. The main functionality can be verified manually by:

- Loading the catalog and scrolling through additional pages
- Searching for products and confirming the debounced results
- Pulling down to refresh the catalog
- Opening a product and checking its detail information
- Testing loading, empty, error, and retry states

The application was manually tested on a physical iPhone using Expo Go.

## Development History

The project was developed incrementally using Git commits. The recorded milestones include:

1. Initial project setup
2. Product data model
3. Product API service
4. Product detail API service
5. Product detail screen
6. Catalog search and pagination
7. Product catalog UI polish

## Notes

- Product data is loaded from the remote DummyJSON API, so catalog and detail screens require network access.
- The app uses local React state and does not add an external state-management library.
- The project uses TypeScript strict mode and keeps API communication separate from the presentation layer.

## AI Assistance

AI tools were used minimally for guidance, documentation, and UI/UX suggestions during development.

GitHub Copilot was used to assist with UI styling and presentation improvements, as well as image loading and error-handling implementation.

The core application logic, project structure, API integration, pagination, search implementation, and architectural decisions were developed and reviewed by me.

All submitted code has been reviewed and tested by me, and I am able to explain the implementation.
