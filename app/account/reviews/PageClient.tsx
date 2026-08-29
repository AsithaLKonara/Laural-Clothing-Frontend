"use client";

import { Star, MessageSquare, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useCustomerReviews, usePendingReviews, useCreateReview } from "@/hooks/useReviews";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "past">("pending");
  const [reviewModalData, setReviewModalData] = useState<any | null>(null);
  
  const customerId = "CUST-001"; // Hardcoded for demo purposes
  
  const { data: pastReviews = [], isLoading: isPastLoading } = useCustomerReviews(customerId);
  const { data: pendingReviews = [], isLoading: isPendingLoading } = usePendingReviews(customerId);

  const pendingCount = pendingReviews.length;
  const pastCount = pastReviews.length;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h1 className="font-inria text-3xl text-stone-900 mb-1">My Reviews</h1>
        <p className="font-inter text-sm text-stone-500">Share your thoughts on recent purchases.</p>
      </div>

      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-4 px-4 font-inter font-medium text-sm transition-colors border-b-2 ${
            activeTab === "pending" 
              ? "border-stone-900 text-stone-900" 
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          To Review ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-4 px-4 font-inter font-medium text-sm transition-colors border-b-2 ${
            activeTab === "past" 
              ? "border-stone-900 text-stone-900" 
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          Past Reviews ({pastCount})
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {activeTab === "pending" && (
          isPendingLoading ? (
            <div className="animate-pulse font-inter text-stone-500">Loading pending reviews...</div>
          ) : pendingCount === 0 ? (
            <EmptyState message="You have no pending reviews." />
          ) : (
            pendingReviews.map((item: any) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-stone-200 rounded-xl bg-white">
                <div className="w-24 h-32 relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-stone-100" />
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-inter font-semibold text-stone-900 text-lg mb-1">{item.name}</h3>
                    <p className="font-inter text-sm text-stone-500">Purchased on {item.purchasedDate}</p>
                    <Link href={`/account/orders/${item.orderId}`} className="font-inter text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 mt-1 inline-block">
                      {item.orderId}
                    </Link>
                  </div>
                  <div className="mt-4 sm:mt-0 flex gap-2">
                    <button 
                      onClick={() => setReviewModalData(item)}
                      className="px-4 py-1.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === "past" && (
          isPastLoading ? (
            <div className="animate-pulse font-inter text-stone-500">Loading reviews...</div>
          ) : pastCount === 0 ? (
            <EmptyState message="You haven't submitted any reviews yet." />
          ) : (
            pastReviews.map((review: any) => (
              <div key={review.id} className="flex flex-col gap-4 p-6 border border-stone-200 rounded-xl bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-inter font-semibold text-stone-900 text-lg mb-1">{review.product?.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={star <= review.rating ? "fill-current text-amber-400" : "fill-stone-200 text-stone-200"} size={16} />
                        ))}
                      </div>
                      <span className="font-inter text-xs text-stone-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    review.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {review.status}
                  </span>
                </div>
                <h4 className="font-inter font-medium text-stone-800">{review.title}</h4>
                <p className="font-inter text-sm text-stone-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )
        )}
      </div>

      {reviewModalData && (
        <ReviewModal 
          item={reviewModalData} 
          customerId={customerId}
          onClose={() => setReviewModalData(null)} 
        />
      )}

    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-stone-200 border-dashed rounded-xl bg-stone-50">
      <MessageSquare className="text-stone-300 mb-4" size={48} />
      <h3 className="font-inria text-xl text-stone-900 mb-2">No Reviews</h3>
      <p className="font-inter text-stone-500 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
}

function ReviewModal({ item, customerId, onClose }: { item: any; customerId: string; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    
    setError("");
    try {
      await createReview.mutateAsync({
        productId: item.productId,
        customerId,
        rating,
        title,
        comment
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-poppins font-medium text-lg text-primary">Write a Review</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 flex items-center gap-4 bg-stone-50">
           <div className="w-12 h-16 relative bg-stone-200 rounded overflow-hidden shrink-0">
             {item.image && <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />}
           </div>
           <div>
             <h3 className="font-inter font-semibold text-stone-900 text-sm">{item.name}</h3>
             <p className="font-inter text-xs text-stone-500">Order {item.orderId}</p>
           </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-inter">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-inter font-medium text-sm text-stone-700">Overall Rating *</label>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="transition-transform hover:scale-110 p-1"
                >
                  <Star 
                    size={28} 
                    className={`transition-colors ${
                      star <= (hoverRating || rating) 
                        ? "fill-amber-400 text-amber-400" 
                        : "fill-stone-100 text-stone-200"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter font-medium text-sm text-stone-700">Review Title (Optional)</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary of your review"
              className="w-full h-11 px-4 border border-stone-200 rounded-xl font-inter text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter font-medium text-sm text-stone-700">Review (Optional)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              rows={4}
              className="w-full p-4 border border-stone-200 rounded-xl font-inter text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 h-11 rounded-full font-inter font-medium text-sm text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createReview.isPending}
              className="px-6 h-11 rounded-full font-inter font-medium text-sm text-white bg-primary hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              {createReview.isPending && <Loader2 size={16} className="animate-spin" />}
              Submit Review
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
