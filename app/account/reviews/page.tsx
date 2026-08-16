"use client";

import { Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const DUMMY_PENDING = [
  {
    id: "P-1",
    name: "Classic Silk Blouse",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800&auto=format&fit=crop",
    purchasedDate: "2026-08-01",
    orderId: "ORD-12345"
  }
];

const DUMMY_PAST = [
  {
    id: "R-1",
    name: "Linen Trousers",
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800&auto=format&fit=crop",
    rating: 5,
    date: "2026-07-15",
    content: "Absolutely love these trousers. The fit is perfect and the material is so breathable. Perfect for the Colombo heat!"
  }
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "past">("pending");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          To Review ({DUMMY_PENDING.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-4 px-4 font-inter font-medium text-sm transition-colors border-b-2 ${
            activeTab === "past" 
              ? "border-stone-900 text-stone-900" 
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          Past Reviews ({DUMMY_PAST.length})
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {activeTab === "pending" && (
          DUMMY_PENDING.length === 0 ? (
            <EmptyState message="You have no pending reviews." />
          ) : (
            DUMMY_PENDING.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-stone-200 rounded-xl bg-white">
                <div className="w-24 h-32 relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-stone-300 hover:text-yellow-400 transition-colors">
                        <Star className="fill-current" size={24} />
                      </button>
                    ))}
                    <button className="ml-4 px-4 py-1.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors">
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === "past" && (
          DUMMY_PAST.length === 0 ? (
            <EmptyState message="You haven't submitted any reviews yet." />
          ) : (
            DUMMY_PAST.map((review) => (
              <div key={review.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-stone-200 rounded-xl bg-white">
                <div className="w-20 h-28 relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                  <Image src={review.image} alt={review.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-inter font-semibold text-stone-900">{review.name}</h3>
                    <span className="font-inter text-xs text-stone-500">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "text-stone-900 fill-stone-900" : "text-stone-200 fill-stone-200"} 
                      />
                    ))}
                  </div>
                  <p className="font-inter text-sm text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100 italic">
                    "{review.content}"
                  </p>
                </div>
              </div>
            ))
          )
        )}
      </div>
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
