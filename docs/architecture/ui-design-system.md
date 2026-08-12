# User Interface & Design System

## Visual Language
The interface uses a sophisticated, neutral **Stone** palette as its foundation to let the clothing and colorful payment gateways stand out only when necessary.

- **Backgrounds**: `stone-50`
- **Cards/Surfaces**: `white`
- **Borders/Dividers**: `stone-100`, `stone-200`
- **Typography**: `stone-900` (Primary), `stone-600` (Body), `stone-500` (Secondary)

### Semantic Colors
Use semantic colors strictly for states, preventing the dashboard from looking messy:
- **Green**: Success, Paid, Delivered
- **Amber**: Pending, Warning
- **Red**: Failed, Cancelled, Critical
- **Blue**: Informational
- **Purple**: Loyalty, Rewards

## Reusable Component Library
To maintain consistency, rely on a central `components/` directory:
- `DashboardShell`, `Sidebar`, `Header`
- `StatCard`, `ChartCard`, `DataTable`, `FilterBar`
- **Contextual Badges** (Critical): `PaymentBadge`, `PaymentGatewayBadge`, `OrderStatusBadge`, `BranchBadge`

## The Context Rule
Every important business object must expose its operational context visually.
- **Bad**: `LC-10241 — Rs. 8,500 — Paid`
- **Good**: `LC-10241 — Kandy — Online — Rs. 8,500 — Koko · Paid — Processing`
