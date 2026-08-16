# Laural Clothing - Frontend

This repository contains the user interfaces for the Laural Clothing platform, bringing together the customer storefront, admin dashboards, and branch POS systems. The platform is designed with a high-end, luxury e-commerce aesthetic, prioritizing clean typography, minimalist layouts, and a signature neutral color palette.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Internationalization**: `react-phone-number-input`

## Design System & Theme
- **Theme**: "Quiet Luxury" — stark, elegant, uncluttered.
- **Color Palette**: 
  - Primary UI: Neutral stones (`stone-50` to `stone-950`), absolute blacks and whites.
- **Typography**:
  - Headings & Accents: `Signature` (Custom font)
  - Primary UI & Body: `Poppins` & `Inter`
  - Elements use generous letter-spacing (`tracking-wide`, `tracking-[0.2em]`) and light weights (`font-light`).

## Implemented Architecture

The application is fully modularized across three major domains:

### 1. Storefront (Customer Facing)
- **Core Pages**: Landing page (`/`), Main catalog (`/shop`), Product details (`/product/[slug]`), Collections, Search, and Sale pages.
- **Customer Account**: Profile, order history, address book, reviews, wishlist, and loyalty program (`/account/*`).
- **Checkout Flow**: Split-column checkout, order tracking (`/track-order`), and interactive returns portal (`/returns`).
- **Global Elements**: Edge-to-edge luxury product cards, minimalist slide-out Cart and Wishlist panels, and dynamic Global Search.

### 2. Admin Dashboard (`/admin`)
A comprehensive back-office operations center containing 13 major feature modules:
- **Orders & Fulfillment**: Order management, Returns/RMA approval, and Shipping queues.
- **Catalog & Inventory**: Products, Categories, Collections, and stock transfers.
- **Media & CMS**: 
  - Global `Media Library` with drag-and-drop and cross-platform image assignment.
  - `CMS` dashboard for editing homepage sections, hero slides, and static pages.
- **Marketing & Loyalty**: Campaigns, Coupons, and Customer tier management.
- **System Administration**: 
  - Sophisticated Role-Based Access Control (RBAC) with 57 granular permissions.
  - Roles include: Super Admin, Branch Admin, Cashier, Inventory Manager, Marketing Manager, etc.
- **Reviews**: Moderation and approval workflows.

### 3. Point of Sale (POS) (`/pos`)
A high-speed, unified interface for retail operations:
- **Session Management**: Open/Close shift registers, cash drawer tracking.
- **Sales Modes**: Direct cart building, product scanning, and applying loyalty discounts.
- **Advanced Workflows**: Hold & Resume carts, Returns mode, Exchange mode, and Dispatch mode for fulfilling online orders directly from the branch.

## Getting Started
1. Install dependencies: `npm install`
2. Configure `.env.local` to point to the Backend API.
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
