# Frontend Architecture Overview

The Laural Clothing frontend acts as the client to the centralized Commerce API. It is built as a set of separate functional domains using **Next.js 15, React 19, TypeScript, and Tailwind CSS v4**.

## Three Distinct Applications
While housed in a monorepo structure (using `pnpm workspaces` and `Turborepo`), the frontend is split into three core experiences to prevent code-bloat and isolate dependencies:

1. **Storefront (`apps/storefront`)**
   - Customer-facing E-Commerce
   - Focus: SEO, Performance, Mobile-first
   - Key Routes: Shop, Cart, Checkout, Loyalty, Order Tracking

2. **Admin (`apps/admin`)**
   - Operations management for Super Admins and Branch Admins
   - Focus: Data density, Desktop-first, Complex tables

3. **POS (`apps/pos`)**
   - Cashier interface for physical stores
   - Focus: Desktop/Tablet-first, Keyboard shortcuts, Barcode scanners, Speed

## Technology Stack
- **Routing**: Next.js App Router (using strict Server/Client Component separation)
- **Data Fetching & Caching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Validation**: Zod (Shared with backend)
- **UI Components**: Custom reusable primitives (`components/ui`) utilizing Tailwind CSS v4 and semantic design tokens.
