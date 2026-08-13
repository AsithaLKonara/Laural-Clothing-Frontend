# User Interface & Design System

## Visual Language
The interface uses a sophisticated, neutral, and luxury **Stone** palette as its foundation to let the clothing and colorful payment gateways stand out only when necessary. 

Recently, the design system was refactored to use robust Tailwind semantic tokens globally, eliminating arbitrary hex values (`bg-[#1C1917]`) and hardcoded typography sizes.

### Semantic Tokens (tailwind.config.ts)
- **primary**: `#1C1917` (Deep Stone/Near Black) - Main brand color, text, active states.
- **primary-hover**: `#292524` - Interactive hover states for primary elements.
- **accent**: `#C19A5B` (Gold/Camel) - Links, highlights, special pricing, and luxury accents.
- **background**: `#FAFAF9` (Off-white/Stone 50) - Main application background.

### Semantic Colors for Context
Use semantic colors strictly for operational states, preventing the dashboard from looking messy:
- **Green**: Success, Paid, Delivered
- **Amber**: Pending, Warning
- **Red**: Failed, Cancelled, Critical
- **Blue**: Informational
- **Purple**: Loyalty, Rewards

## Reusable Component Library
To maintain consistency, rely on the central `components/` and `components/ui/` directories.

### UI Primitives (`components/ui/`)
- `Button`: A highly reusable, `forwardRef`-enabled button component with variants (primary, secondary, outline, ghost) and robust hover/disabled states.
- `Input`: A standardized input field with focus trapping and invalid states.

### Layout & Structural Components
- `PageBanner`: Centralized marketing and page title banners.
- `DashboardShell`, `Sidebar`, `Header`
- `StatCard`, `ChartCard`, `DataTable`, `FilterBar`

### Badges (Critical for UX)
Every important business object must expose its operational context visually using contextual badges:
- `PaymentBadge`, `PaymentGatewayBadge`, `OrderStatusBadge`, `BranchBadge`
- **Bad**: `LC-10241 — Rs. 8,500 — Paid`
- **Good**: `LC-10241 — Kandy — Online — Rs. 8,500 — Koko · Paid — Processing`

## Accessibility (a11y) Rules
- All Modals and Side Panels must implement `role="dialog"` and `aria-modal="true"`.
- Focus trapping and `ESC` key event listeners must be active on all overlays to ensure keyboard navigability.
