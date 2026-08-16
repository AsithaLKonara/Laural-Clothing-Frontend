"use client";

import { useState } from "react";
import { Search, Star, Check, X, Flag, MessageSquare, Eye } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const DUMMY_REVIEWS = [
  {
    id: "REV-001",
    customer: "Kasun Perera",
    product: "Black Oversized T-Shirt",
    productSku: "LC-TSH-001-M",
    rating: 5,
    title: "Best quality tee I've ever owned",
    body: "The fabric is super soft and the oversized fit is perfect. Washed it 5 times and it hasn't lost its shape at all. Would 100% buy again in different colors.",
    date: "2026-08-14",
    status: "PENDING",
    verified: true,
    helpful: 12,
  },
  {
    id: "REV-002",
    customer: "Amila Silva",
    product: "Summer Floral Dress",
    productSku: "LC-DRS-018-S",
    rating: 4,
    title: "Beautiful dress but sizing runs small",
    body: "Love the fabric and the print is gorgeous in person. Photos don't do it justice. Only giving 4 stars because I had to size up. Would recommend ordering one size bigger than usual.",
    date: "2026-08-12",
    status: "APPROVED",
    verified: true,
    helpful: 8,
  },
  {
    id: "REV-003",
    customer: "Nuwan Jayasinghe",
    product: "Classic Linen Shirt",
    productSku: "LC-SHT-042-L",
    rating: 2,
    title: "Not as described",
    body: "The color in the picture is way off from what I received. Also the stitching came apart after the first wash. Very disappointed. Would not recommend.",
    date: "2026-08-11",
    status: "PENDING",
    verified: false,
    helpful: 2,
  },
  {
    id: "REV-004",
    customer: "Samadi Wijeratne",
    product: "Cargo Pants",
    productSku: "LC-PNT-092-32",
    rating: 1,
    title: "Check your website before buying!!",
    body: "Visit www.competitor.com for better prices. This brand is a scam. [SPAM DETECTED]",
    date: "2026-08-10",
    status: "REJECTED",
    verified: false,
    helpful: 0,
    flagged: true,
  },
  {
    id: "REV-005",
    customer: "Deshan Mendis",
    product: "Ribbed Tank Top",
    productSku: "LC-TSH-005-S",
    rating: 5,
    title: "Great for the gym!",
    body: "Really comfortable and breathable. Gets a lot of compliments. The quality for the price is unbeatable. Shipping was fast too.",
    date: "2026-08-09",
    status: "APPROVED",
    verified: true,
    helpful: 24,
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:  { bg: "bg-orange-100", text: "text-orange-700", label: "Pending" },
  APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  REJECTED: { bg: "bg-red-100",  text: "text-red-700",  label: "Rejected" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = reviews.filter((r) => {
    const matchesFilter = filter === "ALL" || r.status === filter;
    const matchesSearch =
      !search ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  const approve = (id: string) =>
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r)));

  const reject = (id: string) =>
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r)));

  const bulkApprove = () => {
    setReviews((prev) => prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "APPROVED" } : r)));
    setSelectedIds([]);
  };

  const bulkReject = () => {
    setReviews((prev) => prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "REJECTED" } : r)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedIds(e.target.checked ? displayed.map((r) => r.id) : []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Reviews & Ratings"
        subtitle="Moderate customer reviews before they appear on the storefront."
        actionLabel="Export CSV"
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Review", value: pendingCount, color: "text-orange-600" },
          { label: "Approved", value: reviews.filter((r) => r.status === "APPROVED").length, color: "text-emerald-600" },
          { label: "Rejected / Spam", value: reviews.filter((r) => r.status === "REJECTED").length, color: "text-red-600" },
          { label: "Average Rating", value: "4.2 ★", color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <span className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</span>
            <span className={`font-inter text-3xl font-black ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-stone-200 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, product, or title..."
            className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-900 focus:bg-white transition-colors text-sm font-inter"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-inter text-sm font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                filter === f ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {f === "ALL" ? "All Reviews" : f.charAt(0) + f.slice(1).toLowerCase()}
              {f === "PENDING" && pendingCount > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === displayed.length && displayed.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                  />
                </th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4">Rating</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4">Review</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4">Product</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4">Customer</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4">Status</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayed.map((review) => {
                const st = STATUS_STYLES[review.status];
                const isExpanded = expandedId === review.id;
                return (
                  <tr
                    key={review.id}
                    className={`transition-colors group ${selectedIds.includes(review.id) ? "bg-stone-50" : "hover:bg-stone-50/60"}`}
                  >
                    <td className="py-4 px-6 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(review.id)}
                        onChange={() => toggleSelect(review.id)}
                        className="rounded text-stone-900 focus:ring-stone-900 border-stone-300 mt-1"
                      />
                    </td>
                    <td className="py-4 px-4 align-top">
                      <StarRating rating={review.rating} />
                      <span className="font-inter text-xs text-stone-400 mt-1 block">{review.date}</span>
                    </td>
                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="flex items-start gap-2">
                        {review.flagged && (
                          <Flag size={14} className="text-red-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className="font-inter font-semibold text-sm text-stone-900 line-clamp-1">{review.title}</p>
                          <p className={`font-inter text-xs text-stone-500 mt-1 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                            {review.body}
                          </p>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : review.id)}
                            className="font-inter text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                          >
                            <Eye size={12} />
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="font-inter text-sm font-medium text-stone-900 line-clamp-1">{review.product}</p>
                      <p className="font-inter text-xs text-stone-400 font-mono mt-0.5">{review.productSku}</p>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="font-inter text-sm text-stone-700">{review.customer}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mt-1">
                          <Check size={10} /> Verified Purchase
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                      {review.flagged && (
                        <span className="mt-1.5 block text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          ⚠ Spam Flagged
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => approve(review.id)}
                              title="Approve"
                              className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => reject(review.id)}
                              title="Reject"
                              className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                        <button
                          title="Reply"
                          className="w-8 h-8 flex items-center justify-center bg-stone-50 text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors shadow-sm"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayed.length === 0 && (
          <div className="py-16 text-center text-stone-500 font-inter text-sm">
            No reviews found matching your filters.
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-stone-200 bg-stone-50/50">
          <span className="font-inter text-sm text-stone-500">
            Showing <span className="font-medium text-stone-900">{displayed.length}</span> of{" "}
            <span className="font-medium text-stone-900">{reviews.length}</span> reviews
          </span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-stone-200 text-stone-400 font-inter text-sm rounded-md shadow-sm">
              Previous
            </button>
            <button disabled className="px-3 py-1.5 bg-white border border-stone-200 text-stone-400 font-inter text-sm rounded-md shadow-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-40">
          <span className="font-inter font-medium text-sm">{selectedIds.length} selected</span>
          <div className="w-px h-6 bg-stone-700"></div>
          <button
            onClick={bulkApprove}
            className="font-inter font-semibold text-sm bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-2"
          >
            <Check size={14} /> Approve All
          </button>
          <button
            onClick={bulkReject}
            className="font-inter font-semibold text-sm bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition-colors flex items-center gap-2"
          >
            <X size={14} /> Reject All
          </button>
        </div>
      )}
    </div>
  );
}
