# POS (Point of Sale) Business Rules & UI

The POS system is a dedicated sub-application (`apps/pos`) optimized for physical retail environments.

## UX Principles
- **Speed & Efficiency**: The UI must be optimized for touch screens, barcode scanners, and keyboard shortcuts.
- **Hardware Integration**: Include a prominent `⛶ Full Screen` toggle using the Browser Fullscreen API. 
- **Navigation**: Minimal navigation. The focus is entirely on the cart, product grid, and payment flow.

## Core Workflows

### Shift Management
- **Open Shift**: Record opening cash, assign cashier, assign terminal.
- **Close Shift**: Record expected cash vs actual cash, calculate variances, log transactions.

### Cart & Sales
- **Search**: Support searching by Name, SKU, or Barcode.
- **Customer Lookup**: Automatically attach a sale to a customer's loyalty profile via phone number.
- **Payment**: Dedicated payment screen (not a modal) with options for Cash and supported digital gateways.

### Offline & Hardware
The system must gracefully handle temporary disconnects and support printing receipts or emailing them post-sale.
