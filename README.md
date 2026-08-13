# Laural Clothing - Frontend

This repository contains the user interfaces for the Laural Clothing platform, bringing together the customer storefront, admin dashboards, and branch POS systems. The platform is designed with a high-end, luxury e-commerce aesthetic, prioritizing clean typography, micro-interactions, and a signature color palette.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom `stone` theme)
- **Icons**: Lucide React
- **Internationalization/Inputs**: `react-phone-number-input`

## Design System & Theme
- **Color Palette**: 
  - Primary Backgrounds: Soft Stone (`#FAFAF9`), Deep Charcoal (`#1C1917`)
  - Accents: Gold/Bronze (`#C19A5B`)
- **Typography**:
  - Primary UI & Body: `Poppins`
  - Secondary Accents: `Urbanist`
  - Luxury Headers: Built-in Tailwind Sans fallbacks with tight leading.

## Storefront Architecture (Implemented)
The customer-facing application is fully modularized and relies on dynamic routing:

### Core Pages
- **`/`**: Landing page featuring Hero, Collections, Ad Banners, and Testimonials.
- **`/shop`**: Main catalog with fully functional pagination and filtering.
- **`/product/[slug]`**: Dynamic product details page with interactive star ratings, size guides, and image galleries.
- **`/category/[slug]` & `/collection/[slug]`**: Dynamic discovery routes for curated catalog browsing.
- **`/search`**: Global search results page.
- **`/sale`**: Promotional page for discounted inventory.

### Checkout & Utilities
- **`/checkout`**: Dynamic split-column checkout flow with interactive billing toggles and payment selectors.
- **`/checkout/success`**: Order confirmation screen.
- **`/track-order`**: Phone-number based timeline tracker.
- **`/returns`**: Multi-step interactive return request portal.
- **Legal Pages**: `/privacy-policy` & `/terms-conditions`.

### Global Reusable Components
- `GlobalSearchModal`: Interactive search overlay.
- `CartSidePanel` & `WishlistSidePanel`: Off-canvas slide-out drawers.
- `LoyaltyPointsModal`: Interactive popup for claiming loyalty discounts at checkout.
- `Breadcrumbs`, `Toast` notifications, and `EmptyState` fallbacks.

## Upcoming Platforms
1. **Admin Dashboard**: For Super Admins (Global operations) and Branch Admins (Branch-specific operations).
2. **POS**: Optimized Point-of-Sale interface for branch cashiers.

## Getting Started
1. Install dependencies: `npm install`
2. Configure `.env.local` to point to the Backend API.
3. Run development server: `npm run dev`
