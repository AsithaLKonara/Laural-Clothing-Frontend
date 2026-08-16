export const mockCategories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Dresses",
  "Pants",
  "Accessories",
  "Shorts",
  "Hoodie",
  "Jeans",
];

export const mockCollectionCategories = [
  { id: 1, title: "Dress", imageUrl: "/hero-image/hero-1.jpg", href: "/categories/dress" },
  { id: 2, title: "Hand Bags", imageUrl: "/hero-image/hero-2.jpg", href: "/categories/hand-bags" },
  { id: 3, title: "Pants", imageUrl: "/hero-image/hero-3.jpg", href: "/categories/pants" },
  { id: 4, title: "Shirts", imageUrl: "/hero-image/hero-1.jpg", href: "/categories/shirts" },
  { id: 5, title: "Shorts", imageUrl: "/hero-image/hero-2.jpg", href: "/categories/shorts" },
  { id: 6, title: "Tops", imageUrl: "/hero-image/hero-3.jpg", href: "/categories/tops" },
];

export const mockAdminCategories = [
  { id: "CAT-001", name: "T-Shirts", slug: "t-shirts", parent: "—", products: 48, status: "Active" },
  { id: "CAT-002", name: "Shirts", slug: "shirts", parent: "—", products: 32, status: "Active" },
  { id: "CAT-003", name: "Dresses", slug: "dresses", parent: "—", products: 24, status: "Active" },
  { id: "CAT-004", name: "Pants", slug: "pants", parent: "—", products: 19, status: "Active" },
  { id: "CAT-005", name: "Oversized Tees", slug: "oversized-tees", parent: "T-Shirts", products: 14, status: "Active" },
  { id: "CAT-006", name: "Polo Shirts", slug: "polo-shirts", parent: "Shirts", products: 8, status: "Active" },
  { id: "CAT-007", name: "Maxi Dresses", slug: "maxi-dresses", parent: "Dresses", products: 6, status: "Draft" },
  { id: "CAT-008", name: "Accessories", slug: "accessories", parent: "—", products: 0, status: "Draft" },
];

export const mockProducts = [
  { sku: "LC-TSH-001", id: 1, name: "Black Oversized T-Shirt", category: "T-Shirts", price: "2500", priceFormatted: "Rs. 2,500", stock: 124, status: "Active", image: "/products/default.jpg" },
  { sku: "LC-SHT-042", id: 2, name: "Classic Linen Shirt", category: "Shirts", price: "4900", priceFormatted: "Rs. 4,900", stock: 45, status: "Active", image: "/products/hover.jpg" },
  { sku: "LC-DRS-018", id: 3, name: "Summer Floral Dress", category: "Dresses", price: "6500", priceFormatted: "Rs. 6,500", stock: 0, status: "Out of Stock", image: "/products/default.jpg" },
  { sku: "LC-PNT-092", id: 4, name: "Cargo Pants", category: "Pants", price: "5200", priceFormatted: "Rs. 5,200", stock: 12, status: "Low Stock", image: "/products/hover.jpg" },
  { sku: "LC-TSH-045", id: 5, name: "Ribbed Tank Top", category: "T-Shirts", price: "1800", priceFormatted: "Rs. 1,800", stock: 88, status: "Active", image: "/products/default.jpg" },
  { sku: "LC-JKT-011", id: 6, name: "Denim Jacket", category: "Outerwear", price: "8500", priceFormatted: "Rs. 8,500", stock: 20, status: "Active", image: "/products/hover.jpg" },
  { sku: "LC-DRS-031", id: 7, name: "Pleated Midi Skirt", category: "Dresses", price: "4200", priceFormatted: "Rs. 4,200", stock: 5, status: "Low Stock", image: "/products/default.jpg" },
  { sku: "LC-TSH-002", id: 8, name: "Basic White Tee", category: "T-Shirts", price: "2000", priceFormatted: "Rs. 2,000", stock: 0, status: "Draft", image: "/products/hover.jpg" },
];

export const mockOrders = [
  { id: "LC-10241", customer: "Kasun Perera", branch: "Kandy", total: "Rs.8,500", gateway: "Koko", status: "Paid", orderStatus: "Paid" },
  { id: "LC-10240", customer: "Nethmi", branch: "Colombo", total: "Rs.5,200", gateway: "Mintpay", status: "Paid", orderStatus: "Paid" },
  { id: "LC-10239", customer: "Guest", branch: "Kandy", total: "Rs.3,900", gateway: "COD", status: "pending", orderStatus: "Pending" },
  { id: "LC-10238", customer: "Dilshan", branch: "Gampaha", total: "Rs.7,800", gateway: "OnePay", status: "Paid", orderStatus: "Paid" },
  { id: "LC-10237", customer: "Anu", branch: "Colombo", total: "Rs.9,200", gateway: "Payzy", status: "failed", orderStatus: "Failed" },
];

export const mockCustomers = [
  { id: "CUST-001", name: "Kasun Perera", phone: "0771234567", email: "kasun@example.com", type: "Registered", orders: 12, spent: "Rs.45,000", lastActive: "2 hours ago" },
  { id: "CUST-002", name: "Nethmi Fernando", phone: "0719876543", email: "nethmi@example.com", type: "Registered", orders: 8, spent: "Rs.32,500", lastActive: "1 day ago" },
  { id: "CUST-003", name: "Guest User", phone: "0765551234", email: "-", type: "Guest", orders: 1, spent: "Rs.3,900", lastActive: "Just now" },
  { id: "CUST-004", name: "Dilshan Silva", phone: "0778889999", email: "dilshan@example.com", type: "Registered", orders: 25, spent: "Rs.112,000", lastActive: "3 days ago" },
];
